#!/usr/bin/env python3
"""
Dubai Property Transaction Scraper — Bayut.com
===============================================

Scrapes property sale and rental transaction data from Bayut.com's
property market analysis pages and exports to JSON and CSV.

Installation
------------
    pip install requests beautifulsoup4 lxml playwright

    # Only needed if requests+BS4 gets blocked:
    playwright install chromium

Usage
-----
    # Scrape first 5 pages of both sale and rental transactions (default)
    python scraper.py

    # Scrape specific number of pages
    python scraper.py --pages 10

    # Scrape only sale transactions
    python scraper.py --type sale --pages 3

    # Scrape only rental transactions
    python scraper.py --type rent --pages 3

    # Specify output directory
    python scraper.py --output ./data

    # Use Playwright (headless browser) instead of requests
    python scraper.py --browser

    # Combine options
    python scraper.py --type sale --pages 20 --output ./scraped --browser

Output
------
    Files are saved to the current directory (or --output path):
      - bayut_sale_transactions.json
      - bayut_sale_transactions.csv
      - bayut_rent_transactions.json
      - bayut_rent_transactions.csv
      - bayut_all_transactions.json   (combined)
      - bayut_all_transactions.csv    (combined)
"""

import argparse
import csv
import json
import logging
import os
import random
import sys
import time
from datetime import datetime
from typing import Optional
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BASE_URL = "https://www.bayut.com"

SALE_URL = "/property-market-analysis/transactions/sale/property/"
RENT_URL = "/property-market-analysis/transactions/rent/property/"

# Rotating user-agent pool to reduce chance of being blocked
USER_AGENTS = [
    (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) "
        "AppleWebKit/605.1.15 (KHTML, like Gecko) "
        "Version/17.4 Safari/605.1.15"
    ),
    (
        "Mozilla/5.0 (X11; Linux x86_64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) "
        "Gecko/20100101 Firefox/125.0"
    ),
    (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:125.0) "
        "Gecko/20100101 Firefox/125.0"
    ),
]

DEFAULT_HEADERS = {
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;"
        "q=0.9,image/avif,image/webp,*/*;q=0.8"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Cache-Control": "max-age=0",
}

# Rate-limiting: seconds to wait between requests (randomised in this range)
DELAY_MIN = 2.0
DELAY_MAX = 3.5

# Retry settings
MAX_RETRIES = 3
RETRY_BACKOFF = 5  # seconds — multiplied by attempt number

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("bayut_scraper")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _random_ua() -> str:
    """Return a random User-Agent string."""
    return random.choice(USER_AGENTS)


def _build_page_url(base_path: str, page: int) -> str:
    """Build the full URL for a given page number.

    Bayut uses a query-parameter style for pagination:
        /property-market-analysis/transactions/sale/property/?page=2
    Page 1 has no parameter.
    """
    if page <= 1:
        return f"{BASE_URL}{base_path}"
    return f"{BASE_URL}{base_path}?page={page}"


def _rate_limit() -> None:
    """Sleep for a randomised delay to be polite to the server."""
    delay = random.uniform(DELAY_MIN, DELAY_MAX)
    log.debug("Sleeping %.1f s ...", delay)
    time.sleep(delay)


# ---------------------------------------------------------------------------
# Fetching — requests + BeautifulSoup (primary)
# ---------------------------------------------------------------------------


def fetch_page_requests(url: str, session: requests.Session) -> Optional[str]:
    """Fetch a page using requests. Returns HTML string or None on failure."""
    headers = {**DEFAULT_HEADERS, "User-Agent": _random_ua()}
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = session.get(url, headers=headers, timeout=30)
            if resp.status_code == 200:
                return resp.text
            if resp.status_code == 404:
                log.warning("Page not found (404): %s", url)
                return None
            if resp.status_code in (429, 503):
                wait = RETRY_BACKOFF * attempt
                log.warning(
                    "Rate-limited (%d) on %s — retrying in %ds (attempt %d/%d)",
                    resp.status_code,
                    url,
                    wait,
                    attempt,
                    MAX_RETRIES,
                )
                time.sleep(wait)
                continue
            log.warning(
                "HTTP %d for %s (attempt %d/%d)",
                resp.status_code,
                url,
                attempt,
                MAX_RETRIES,
            )
        except requests.RequestException as exc:
            wait = RETRY_BACKOFF * attempt
            log.warning(
                "Request error for %s: %s — retrying in %ds (attempt %d/%d)",
                url,
                exc,
                wait,
                attempt,
                MAX_RETRIES,
            )
            time.sleep(wait)
    return None


# ---------------------------------------------------------------------------
# Fetching — Playwright fallback (headless browser)
# ---------------------------------------------------------------------------


def fetch_page_playwright(url: str) -> Optional[str]:
    """Fetch a page with Playwright (headless Chromium).

    This is used as a fallback when requests-based fetching is blocked by
    Cloudflare or similar bot-detection.
    """
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        log.error(
            "Playwright is not installed. "
            "Install it with:  pip install playwright && playwright install chromium"
        )
        return None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            with sync_playwright() as pw:
                browser = pw.chromium.launch(headless=True)
                context = browser.new_context(
                    user_agent=_random_ua(),
                    viewport={"width": 1920, "height": 1080},
                    locale="en-US",
                )
                page = context.new_page()
                page.goto(url, wait_until="networkidle", timeout=60_000)
                html = page.content()
                browser.close()
                return html
        except Exception as exc:
            wait = RETRY_BACKOFF * attempt
            log.warning(
                "Playwright error for %s: %s — retrying in %ds (attempt %d/%d)",
                url,
                exc,
                wait,
                attempt,
                MAX_RETRIES,
            )
            time.sleep(wait)
    return None


# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------


def _clean_text(text: Optional[str]) -> str:
    """Strip and normalise whitespace in a string."""
    if text is None:
        return ""
    return " ".join(text.split()).strip()


def parse_transaction_table(html: str, transaction_type: str) -> list[dict]:
    """Parse the HTML of a Bayut transactions page and return a list of dicts.

    Bayut renders transaction data in a tabular format.  The exact DOM
    structure may change over time, so we try multiple strategies:

        1. Look for a <table> element with transaction rows.
        2. Fall back to repeated card/div structures.
        3. Extract from embedded JSON/LD or __NEXT_DATA__ if available.

    Each returned dict has the keys:
        area, date, price, size_sqft, price_per_sqft, property_type,
        location, transaction_type
    """
    soup = BeautifulSoup(html, "lxml")
    records: list[dict] = []

    # ------------------------------------------------------------------
    # Strategy 1: __NEXT_DATA__ JSON (Next.js server-rendered payload)
    # ------------------------------------------------------------------
    next_data_tag = soup.find("script", id="__NEXT_DATA__")
    if next_data_tag and next_data_tag.string:
        try:
            payload = json.loads(next_data_tag.string)
            records = _extract_from_next_data(payload, transaction_type)
            if records:
                log.info(
                    "  -> Extracted %d records from __NEXT_DATA__", len(records)
                )
                return records
        except (json.JSONDecodeError, KeyError, TypeError) as exc:
            log.debug("__NEXT_DATA__ parse failed: %s", exc)

    # ------------------------------------------------------------------
    # Strategy 2: HTML <table> rows
    # ------------------------------------------------------------------
    tables = soup.find_all("table")
    for table in tables:
        rows = table.find_all("tr")
        if len(rows) < 2:
            continue
        # Determine header mapping
        headers_raw = [_clean_text(th.get_text()) for th in rows[0].find_all(["th", "td"])]
        col_map = _map_columns(headers_raw)
        if not col_map:
            continue
        for row in rows[1:]:
            cells = [_clean_text(td.get_text()) for td in row.find_all("td")]
            record = _row_to_record(cells, col_map, transaction_type)
            if record:
                records.append(record)
        if records:
            log.info("  -> Extracted %d records from <table>", len(records))
            return records

    # ------------------------------------------------------------------
    # Strategy 3: Repeated div/card structures
    # ------------------------------------------------------------------
    # Look for commonly used attribute patterns on Bayut
    card_selectors = [
        {"attrs": {"role": "row"}},
        {"class_": lambda c: c and "transaction" in " ".join(c).lower()},
        {"attrs": {"data-testid": lambda v: v and "transaction" in v.lower()}},
    ]
    for selector in card_selectors:
        try:
            cards = soup.find_all("div", **selector)
        except Exception:
            cards = []
        for card in cards:
            record = _card_to_record(card, transaction_type)
            if record:
                records.append(record)
        if records:
            log.info("  -> Extracted %d records from div cards", len(records))
            return records

    # ------------------------------------------------------------------
    # Strategy 4: Generic row-like aria/grid elements
    # ------------------------------------------------------------------
    grid = soup.find(attrs={"role": "grid"}) or soup.find(attrs={"role": "table"})
    if grid:
        rows = grid.find_all(attrs={"role": "row"})
        for row in rows:
            cells_els = row.find_all(attrs={"role": "cell"}) or row.find_all(
                attrs={"role": "gridcell"}
            )
            cells = [_clean_text(c.get_text()) for c in cells_els]
            if len(cells) >= 3:
                record = _cells_heuristic(cells, transaction_type)
                if record:
                    records.append(record)
        if records:
            log.info("  -> Extracted %d records from ARIA grid", len(records))
            return records

    # ------------------------------------------------------------------
    # Strategy 5: Brute-force — scan all text blocks for price patterns
    # ------------------------------------------------------------------
    records = _brute_force_extract(soup, transaction_type)
    if records:
        log.info("  -> Extracted %d records via brute-force scan", len(records))
    else:
        log.warning("  -> No records could be extracted from this page")
    return records


def _extract_from_next_data(payload: dict, txn_type: str) -> list[dict]:
    """Walk a __NEXT_DATA__ JSON blob and pull out transaction records."""
    records: list[dict] = []

    # Recursively find lists that look like transaction data
    def _walk(obj):
        if isinstance(obj, list):
            for item in obj:
                _walk(item)
        elif isinstance(obj, dict):
            # Heuristic: if the dict has keys that resemble a transaction
            keys_lower = {k.lower() for k in obj}
            has_price = any(
                k in keys_lower
                for k in ("price", "amount", "transactionamount", "value", "salesprice")
            )
            has_area = any(
                k in keys_lower
                for k in ("area", "areaname", "location", "community", "neighbourhood")
            )
            if has_price and has_area:
                record = _dict_to_record(obj, txn_type)
                if record:
                    records.append(record)
            else:
                for v in obj.values():
                    _walk(v)

    props = payload.get("props", {})
    _walk(props)
    return records


def _dict_to_record(d: dict, txn_type: str) -> Optional[dict]:
    """Convert a raw dict (from JSON) into a normalised transaction record."""
    # Build a case-insensitive lookup
    ci = {k.lower(): v for k, v in d.items()}

    area = (
        ci.get("areaname")
        or ci.get("area")
        or ci.get("community")
        or ci.get("neighbourhood")
        or ci.get("location")
        or ""
    )
    date = (
        ci.get("date")
        or ci.get("transactiondate")
        or ci.get("instancedate")
        or ci.get("registrationdate")
        or ""
    )
    price = (
        ci.get("price")
        or ci.get("amount")
        or ci.get("transactionamount")
        or ci.get("salesprice")
        or ci.get("value")
        or ""
    )
    size = (
        ci.get("size")
        or ci.get("area_sqft")
        or ci.get("sizesqft")
        or ci.get("propertysizesqft")
        or ci.get("builtuparea")
        or ""
    )
    price_per_sqft = ci.get("pricepersqft") or ci.get("priceperft") or ""
    prop_type = (
        ci.get("propertytype")
        or ci.get("type")
        or ci.get("propertysubtype")
        or ci.get("property_type")
        or ""
    )
    location = (
        ci.get("location")
        or ci.get("address")
        or ci.get("fulladdress")
        or area
    )

    area = str(area).strip()
    if not area:
        return None

    return {
        "area": area,
        "date": str(date).strip(),
        "price": str(price).strip(),
        "size_sqft": str(size).strip(),
        "price_per_sqft": str(price_per_sqft).strip(),
        "property_type": str(prop_type).strip(),
        "location": str(location).strip(),
        "transaction_type": txn_type,
    }


def _map_columns(headers: list[str]) -> Optional[dict[str, int]]:
    """Map normalised header names to column indices.

    Returns a dict like {"area": 0, "price": 2, ...} or None if we
    cannot confidently identify enough columns.
    """
    mapping: dict[str, int] = {}
    for idx, h in enumerate(headers):
        h_lower = h.lower()
        if any(kw in h_lower for kw in ("area", "community", "neighbourhood", "location")):
            mapping.setdefault("area", idx)
        elif any(kw in h_lower for kw in ("date", "registration")):
            mapping.setdefault("date", idx)
        elif "per" in h_lower and ("sqft" in h_lower or "sq ft" in h_lower or "ft" in h_lower):
            mapping.setdefault("price_per_sqft", idx)
        elif any(kw in h_lower for kw in ("price", "amount", "value")):
            mapping.setdefault("price", idx)
        elif any(kw in h_lower for kw in ("size", "sqft", "sq ft", "built")):
            mapping.setdefault("size_sqft", idx)
        elif any(kw in h_lower for kw in ("type", "property type")):
            mapping.setdefault("property_type", idx)

    # Need at least area + one of price/size to be useful
    if "area" in mapping and ("price" in mapping or "size_sqft" in mapping):
        return mapping
    return None


def _row_to_record(
    cells: list[str], col_map: dict[str, int], txn_type: str
) -> Optional[dict]:
    """Convert a table row (list of cell strings) to a record dict."""
    if not cells:
        return None

    def _get(key: str) -> str:
        idx = col_map.get(key)
        if idx is not None and idx < len(cells):
            return cells[idx]
        return ""

    area = _get("area")
    if not area:
        return None

    return {
        "area": area,
        "date": _get("date"),
        "price": _get("price"),
        "size_sqft": _get("size_sqft"),
        "price_per_sqft": _get("price_per_sqft"),
        "property_type": _get("property_type"),
        "location": _get("area"),  # fallback
        "transaction_type": txn_type,
    }


def _card_to_record(card, txn_type: str) -> Optional[dict]:
    """Extract a record from a card-like div element."""
    text = _clean_text(card.get_text(separator=" | "))
    if not text or len(text) < 10:
        return None

    parts = [p.strip() for p in text.split("|") if p.strip()]
    if len(parts) < 2:
        return None

    return _cells_heuristic(parts, txn_type)


def _cells_heuristic(parts: list[str], txn_type: str) -> Optional[dict]:
    """Use heuristics to assign cell values to record fields."""
    import re

    record = {
        "area": "",
        "date": "",
        "price": "",
        "size_sqft": "",
        "price_per_sqft": "",
        "property_type": "",
        "location": "",
        "transaction_type": txn_type,
    }

    price_re = re.compile(r"[\d,]+(?:\.\d+)?")
    date_re = re.compile(r"\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}")
    sqft_re = re.compile(r"[\d,]+(?:\.\d+)?\s*(?:sq\.?\s*ft|sqft)", re.IGNORECASE)
    type_keywords = {
        "apartment", "villa", "townhouse", "penthouse", "studio",
        "office", "retail", "land", "warehouse", "flat", "duplex",
    }

    for part in parts:
        part_lower = part.lower().strip()
        if not part_lower:
            continue

        if date_re.search(part):
            record["date"] = record["date"] or part.strip()
        elif sqft_re.search(part):
            if not record["size_sqft"]:
                record["size_sqft"] = part.strip()
        elif any(kw in part_lower for kw in type_keywords):
            record["property_type"] = record["property_type"] or part.strip()
        elif "aed" in part_lower or "price" in part_lower:
            if "per" in part_lower or "/sq" in part_lower:
                record["price_per_sqft"] = record["price_per_sqft"] or part.strip()
            else:
                record["price"] = record["price"] or part.strip()
        elif price_re.search(part) and len(part) < 30:
            # Likely a numeric value — try to guess what it is
            if not record["price"]:
                record["price"] = part.strip()
            elif not record["size_sqft"]:
                record["size_sqft"] = part.strip()
            elif not record["price_per_sqft"]:
                record["price_per_sqft"] = part.strip()
        else:
            # Text-only field — likely area or location
            if not record["area"]:
                record["area"] = part.strip()
            elif not record["location"]:
                record["location"] = part.strip()

    if not record["area"]:
        return None

    if not record["location"]:
        record["location"] = record["area"]

    return record


def _brute_force_extract(soup: BeautifulSoup, txn_type: str) -> list[dict]:
    """Last-resort extraction by scanning visible text blocks."""
    import re

    records: list[dict] = []
    # Find all text nodes that contain "AED" — strong signal for a price
    aed_pattern = re.compile(r"AED\s*[\d,]+", re.IGNORECASE)
    elements = soup.find_all(string=aed_pattern)

    for el in elements:
        parent = el.find_parent(["div", "tr", "li", "section", "article"])
        if parent is None:
            continue
        text = _clean_text(parent.get_text(separator=" | "))
        parts = [p.strip() for p in text.split("|") if p.strip()]
        record = _cells_heuristic(parts, txn_type)
        if record and record["area"]:
            records.append(record)

    # Deduplicate based on all fields
    seen = set()
    unique: list[dict] = []
    for r in records:
        key = tuple(sorted(r.items()))
        if key not in seen:
            seen.add(key)
            unique.append(r)
    return unique


# ---------------------------------------------------------------------------
# Pagination detection
# ---------------------------------------------------------------------------


def has_next_page(html: str, current_page: int) -> bool:
    """Return True if the page HTML contains a link to the next page."""
    soup = BeautifulSoup(html, "lxml")

    # Check for a "Next" link/button
    for tag in soup.find_all("a", href=True):
        text = _clean_text(tag.get_text()).lower()
        if text in ("next", "next page", ">", ">>"):
            return True
        # Check href for page=N+1
        href = tag["href"]
        if f"page={current_page + 1}" in href:
            return True

    # Check for a pagination element containing page N+1
    for tag in soup.find_all(["a", "button", "li"]):
        text = _clean_text(tag.get_text())
        if text == str(current_page + 1):
            return True

    return False


# ---------------------------------------------------------------------------
# Orchestration
# ---------------------------------------------------------------------------


def scrape_transactions(
    txn_type: str,
    max_pages: int,
    use_browser: bool = False,
) -> list[dict]:
    """Scrape transaction data for a given type ('sale' or 'rent').

    Parameters
    ----------
    txn_type : str
        Either ``"sale"`` or ``"rent"``.
    max_pages : int
        Maximum number of pages to scrape.
    use_browser : bool
        If True, use Playwright instead of requests.

    Returns
    -------
    list[dict]
        Collected transaction records.
    """
    base_path = SALE_URL if txn_type == "sale" else RENT_URL
    label = "SALE" if txn_type == "sale" else "RENTAL"
    all_records: list[dict] = []

    session = requests.Session()

    log.info("=" * 60)
    log.info("Starting %s transaction scrape (max %d pages)", label, max_pages)
    log.info("=" * 60)

    for page_num in range(1, max_pages + 1):
        url = _build_page_url(base_path, page_num)
        log.info("[%s] Fetching page %d / %d  ->  %s", label, page_num, max_pages, url)

        if use_browser:
            html = fetch_page_playwright(url)
        else:
            html = fetch_page_requests(url, session)

        if html is None:
            log.warning(
                "[%s] Failed to fetch page %d — stopping pagination.", label, page_num
            )
            break

        records = parse_transaction_table(html, txn_type)
        all_records.extend(records)
        log.info(
            "[%s] Page %d: %d records (total so far: %d)",
            label,
            page_num,
            len(records),
            len(all_records),
        )

        # If zero records, the page might be empty / beyond available data
        if not records:
            log.info("[%s] Empty page — stopping pagination.", label)
            break

        # Check if there is a next page
        if page_num < max_pages and not has_next_page(html, page_num):
            log.info("[%s] No next-page link found — stopping.", label)
            break

        # Rate limit before next request
        if page_num < max_pages:
            _rate_limit()

    session.close()
    log.info("[%s] Scraping complete. Total records: %d", label, len(all_records))
    return all_records


# ---------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------

FIELD_NAMES = [
    "area",
    "date",
    "price",
    "size_sqft",
    "price_per_sqft",
    "property_type",
    "location",
    "transaction_type",
]


def save_json(records: list[dict], filepath: str) -> None:
    """Save records to a JSON file."""
    with open(filepath, "w", encoding="utf-8") as fh:
        json.dump(records, fh, indent=2, ensure_ascii=False)
    log.info("Saved %d records to %s", len(records), filepath)


def save_csv(records: list[dict], filepath: str) -> None:
    """Save records to a CSV file."""
    with open(filepath, "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=FIELD_NAMES, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(records)
    log.info("Saved %d records to %s", len(records), filepath)


def export_results(
    sale_records: list[dict],
    rent_records: list[dict],
    output_dir: str,
) -> None:
    """Write all result files to *output_dir*."""
    os.makedirs(output_dir, exist_ok=True)

    if sale_records:
        save_json(sale_records, os.path.join(output_dir, "bayut_sale_transactions.json"))
        save_csv(sale_records, os.path.join(output_dir, "bayut_sale_transactions.csv"))

    if rent_records:
        save_json(rent_records, os.path.join(output_dir, "bayut_rent_transactions.json"))
        save_csv(rent_records, os.path.join(output_dir, "bayut_rent_transactions.csv"))

    combined = sale_records + rent_records
    if combined:
        save_json(combined, os.path.join(output_dir, "bayut_all_transactions.json"))
        save_csv(combined, os.path.join(output_dir, "bayut_all_transactions.csv"))


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def build_parser() -> argparse.ArgumentParser:
    """Build the argument parser."""
    parser = argparse.ArgumentParser(
        description=(
            "Scrape Dubai property transaction data from Bayut.com "
            "and export to JSON/CSV."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python scraper.py --pages 5\n"
            "  python scraper.py --type sale --pages 10\n"
            "  python scraper.py --type rent --pages 3 --output ./data\n"
            "  python scraper.py --browser --pages 5\n"
        ),
    )
    parser.add_argument(
        "--type",
        choices=["sale", "rent", "both"],
        default="both",
        help="Transaction type to scrape (default: both)",
    )
    parser.add_argument(
        "--pages",
        type=int,
        default=5,
        help="Maximum number of pages to scrape per transaction type (default: 5)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=".",
        help="Directory to save output files (default: current directory)",
    )
    parser.add_argument(
        "--browser",
        action="store_true",
        help="Use Playwright headless browser instead of requests (slower but avoids blocks)",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable debug-level logging",
    )
    return parser


def main() -> None:
    """Entry point for the CLI."""
    parser = build_parser()
    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    start_time = time.time()
    log.info("Bayut.com Property Transaction Scraper")
    log.info("  Transaction type : %s", args.type)
    log.info("  Max pages        : %d", args.pages)
    log.info("  Output directory  : %s", os.path.abspath(args.output))
    log.info("  Fetch method      : %s", "Playwright" if args.browser else "requests")

    sale_records: list[dict] = []
    rent_records: list[dict] = []

    if args.type in ("sale", "both"):
        sale_records = scrape_transactions("sale", args.pages, use_browser=args.browser)

        # If requests returned nothing and we did not use browser, hint at fallback
        if not sale_records and not args.browser:
            log.warning(
                "No sale records scraped with requests. "
                "The site may be blocking automated access. "
                "Try re-running with --browser to use Playwright."
            )

    if args.type in ("rent", "both"):
        rent_records = scrape_transactions("rent", args.pages, use_browser=args.browser)

        if not rent_records and not args.browser:
            log.warning(
                "No rental records scraped with requests. "
                "Try re-running with --browser to use Playwright."
            )

    # Export
    export_results(sale_records, rent_records, args.output)

    elapsed = time.time() - start_time
    total = len(sale_records) + len(rent_records)
    log.info("-" * 60)
    log.info("Done. %d total records scraped in %.1f seconds.", total, elapsed)
    log.info("-" * 60)

    if total == 0:
        log.warning(
            "No data was collected. This may indicate that Bayut.com has changed "
            "its page structure or is blocking requests. Suggestions:\n"
            "  1. Re-run with --browser flag to use a headless browser.\n"
            "  2. Check the URL manually in a web browser to confirm data exists.\n"
            "  3. The scraper's parsing logic may need updating for new page layouts."
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
