// ============================================================
// Dubai Property Forecast Map — Main Application
// ============================================================

(function () {
    "use strict";

    // ── State ───────────────────────────────────────────────
    let selectedHorizon = 1;               // years
    let activeDevelopers = DEVELOPERS.map(d => d.id);
    let showHeatmap = true;
    let showInfrastructure = true;
    let showDevelopments = true;

    // Leaflet layers
    let map;
    let areaPolygonLayers = {};
    let infraMarkers = [];
    let devMarkers = [];
    let areaLabelMarkers = [];

    // ── Initialize Map ──────────────────────────────────────
    function initMap() {
        map = L.map("map", {
            center: [25.15, 55.25],
            zoom: 11,
            minZoom: 10,
            maxZoom: 16,
            zoomControl: true
        });

        // Try multiple tile providers with fallback
        var tileLoaded = false;
        var tileErrorCount = 0;

        // Primary: CartoDB Dark Matter
        var primaryTiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 19,
            errorTileUrl: ""
        });

        // Fallback: OpenStreetMap standard
        var fallbackTiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
            errorTileUrl: ""
        });

        primaryTiles.on("tileerror", function () {
            tileErrorCount++;
            if (tileErrorCount > 3 && !tileLoaded) {
                map.removeLayer(primaryTiles);
                fallbackTiles.addTo(map);
            }
        });
        primaryTiles.on("tileload", function () { tileLoaded = true; });

        primaryTiles.addTo(map);

        // Labels overlay (CartoDB)
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png", {
            subdomains: "abcd",
            maxZoom: 19,
            pane: "shadowPane"
        }).addTo(map);
    }

    // ── Color Scale ─────────────────────────────────────────
    function getColor(pctChange) {
        if (pctChange > 0.30) return "#1a9641";
        if (pctChange > 0.20) return "#52b947";
        if (pctChange > 0.10) return "#a6d96a";
        if (pctChange > 0.05) return "#d9ef8b";
        if (pctChange > 0.00) return "#fee08b";
        if (pctChange > -0.05) return "#fc8d59";
        return "#d73027";
    }

    function getOpacity(pctChange) {
        return Math.min(0.75, 0.35 + Math.abs(pctChange) * 0.8);
    }

    // ── Render Area Polygons ────────────────────────────────
    function renderAreas() {
        // Clear existing
        Object.values(areaPolygonLayers).forEach(l => map.removeLayer(l));
        areaPolygonLayers = {};
        areaLabelMarkers.forEach(m => map.removeLayer(m));
        areaLabelMarkers = [];

        DUBAI_AREAS.forEach(area => {
            // Check if area has any active developer
            const hasActiveDev = area.developers.some(d => activeDevelopers.includes(d));
            if (!hasActiveDev) return;

            const prediction = predictionModel.predict(area, selectedHorizon, activeDevelopers);
            const pctChange = prediction.predictedChange;
            const coords = AREA_POLYGONS[area.id];
            if (!coords) return;

            const color = getColor(pctChange);
            const opacity = showHeatmap ? getOpacity(pctChange) : 0.08;

            const polygon = L.polygon(coords, {
                color: color,
                weight: 2,
                fillColor: color,
                fillOpacity: opacity,
                className: "area-polygon"
            }).addTo(map);

            polygon.on("click", () => showAreaDetail(area, prediction));
            polygon.on("mouseover", function (e) {
                this.setStyle({ weight: 3, fillOpacity: opacity + 0.15 });
                showTooltip(e, area, prediction);
            });
            polygon.on("mouseout", function () {
                this.setStyle({ weight: 2, fillOpacity: opacity });
                hideTooltip();
            });

            areaPolygonLayers[area.id] = polygon;

            // Area label
            const sign = pctChange >= 0 ? "+" : "";
            const label = L.divIcon({
                className: "area-label",
                html: `<div class="area-label-content" style="border-color:${color}">
                    <div class="area-label-name">${area.name}</div>
                    <div class="area-label-pct" style="color:${color}">${sign}${(pctChange * 100).toFixed(1)}%</div>
                    <div class="area-label-price">AED ${prediction.predictedPrice.toLocaleString()}/sqft</div>
                </div>`,
                iconSize: [140, 60],
                iconAnchor: [70, 30]
            });
            const marker = L.marker(area.center, { icon: label, interactive: false }).addTo(map);
            areaLabelMarkers.push(marker);
        });
    }

    // ── Infrastructure Markers ──────────────────────────────
    function renderInfrastructure() {
        infraMarkers.forEach(m => map.removeLayer(m));
        infraMarkers = [];
        if (!showInfrastructure) return;

        DUBAI_AREAS.forEach(area => {
            const hasActiveDev = area.developers.some(d => activeDevelopers.includes(d));
            if (!hasActiveDev) return;

            area.infrastructureProjects.forEach(proj => {
                const icon = L.divIcon({
                    className: "infra-marker",
                    html: `<div class="infra-icon" title="${proj.name}">${INFRASTRUCTURE_ICONS[proj.type] || "🏗️"}</div>`,
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                });
                const m = L.marker([proj.lat, proj.lng], { icon }).addTo(map);
                m.bindPopup(`
                    <div class="popup-content">
                        <strong>${proj.name}</strong><br>
                        Type: ${proj.type.replace(/_/g, " ")}<br>
                        Completion: ${proj.completionYear}<br>
                        Impact Score: ${(proj.impact * 100).toFixed(0)}%
                    </div>
                `);
                infraMarkers.push(m);
            });
        });
    }

    // ── Development Markers ─────────────────────────────────
    function renderDevelopments() {
        devMarkers.forEach(m => map.removeLayer(m));
        devMarkers = [];
        if (!showDevelopments) return;

        DUBAI_AREAS.forEach(area => {
            area.developments.forEach(dev => {
                if (!activeDevelopers.includes(dev.developer)) return;

                const devInfo = DEVELOPERS.find(d => d.id === dev.developer);
                const icon = L.divIcon({
                    className: "dev-marker",
                    html: `<div class="dev-icon" style="background:${devInfo.color}" title="${dev.name} by ${devInfo.name}">${devInfo.icon}</div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });
                const m = L.marker([dev.lat, dev.lng], { icon }).addTo(map);
                m.bindPopup(`
                    <div class="popup-content">
                        <strong>${dev.name}</strong><br>
                        Developer: ${devInfo.name}<br>
                        Units: ${dev.units.toLocaleString()}<br>
                        Type: ${dev.type.replace(/_/g, " ")}<br>
                        Completion: ${dev.completionYear}
                    </div>
                `);
                devMarkers.push(m);
            });
        });
    }

    // ── Tooltip ─────────────────────────────────────────────
    let tooltipEl;
    function showTooltip(e, area, prediction) {
        if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.className = "map-tooltip";
            document.body.appendChild(tooltipEl);
        }
        const pct = prediction.predictedChange;
        const sign = pct >= 0 ? "+" : "";
        tooltipEl.innerHTML = `
            <strong>${area.name}</strong><br>
            Current: AED ${area.currentPricePerSqft.toLocaleString()}/sqft<br>
            Forecast: AED ${prediction.predictedPrice.toLocaleString()}/sqft<br>
            Change: <span style="color:${getColor(pct)}">${sign}${(pct * 100).toFixed(1)}%</span>
        `;
        tooltipEl.style.display = "block";
        tooltipEl.style.left = (e.originalEvent.pageX + 15) + "px";
        tooltipEl.style.top = (e.originalEvent.pageY - 10) + "px";
    }
    function hideTooltip() {
        if (tooltipEl) tooltipEl.style.display = "none";
    }

    // ── Detail Panel ────────────────────────────────────────
    function showAreaDetail(area, prediction) {
        const panel = document.getElementById("detailPanel");
        const content = document.getElementById("detailContent");
        const pct = prediction.predictedChange;
        const sign = pct >= 0 ? "+" : "";
        const drivers = predictionModel.getKeyDrivers(area, prediction, selectedHorizon);

        // Build developers HTML
        const devsHTML = area.developers.map(dId => {
            const d = DEVELOPERS.find(x => x.id === dId);
            return `<span class="dev-tag" style="background:${d.color}20;color:${d.color};border:1px solid ${d.color}">${d.name}</span>`;
        }).join(" ");

        // Build developments HTML
        const developmentsHTML = area.developments.map(dev => {
            const d = DEVELOPERS.find(x => x.id === dev.developer);
            return `
                <div class="detail-dev-item">
                    <div class="detail-dev-icon" style="background:${d.color}">${d.icon}</div>
                    <div>
                        <strong>${dev.name}</strong><br>
                        <small>${d.name} · ${dev.units.toLocaleString()} units · ${dev.type.replace(/_/g, " ")} · ${dev.completionYear}</small>
                    </div>
                </div>
            `;
        }).join("");

        // Build infrastructure HTML
        const infraHTML = area.infrastructureProjects.map(p => `
            <div class="detail-infra-item">
                <span class="infra-emoji">${INFRASTRUCTURE_ICONS[p.type] || "🏗️"}</span>
                <div>
                    <strong>${p.name}</strong><br>
                    <small>Impact: ${(p.impact * 100).toFixed(0)}% · Completion: ${p.completionYear}</small>
                </div>
            </div>
        `).join("");

        // Drivers HTML
        const driversHTML = drivers.map(d => {
            const icon = d.type === "positive" ? "▲" : d.type === "negative" ? "▼" : "●";
            const cls = d.type;
            return `<div class="driver-item ${cls}"><span class="driver-icon">${icon}</span> ${d.text}</div>`;
        }).join("");

        // Confidence range
        const confLow  = (prediction.confidenceLow * 100).toFixed(1);
        const confHigh = (prediction.confidenceHigh * 100).toFixed(1);

        // Price chart (sparkline)
        const history = area.priceHistory;
        const maxP = Math.max(...history, prediction.predictedPrice);
        const minP = Math.min(...history) * 0.9;
        const range = maxP - minP;
        const chartW = 300;
        const chartH = 80;
        const points = history.map((v, i) => {
            const x = (i / (history.length)) * chartW;
            const y = chartH - ((v - minP) / range) * chartH;
            return `${x},${y}`;
        });
        // Add predicted point
        const predX = chartW;
        const predY = chartH - ((prediction.predictedPrice - minP) / range) * chartH;
        const svgLine = points.join(" ") + ` ${predX},${predY}`;

        // Build factor bars
        const factorNames = {
            airportProximity: "Airport Proximity",
            metroAccess: "Metro Access",
            roadNetwork: "Road Network",
            retailAmenities: "Retail & Amenities",
            schoolsHealthcare: "Schools & Healthcare",
            greenSpaces: "Green Spaces",
            beachProximity: "Beach Proximity",
            employmentHub: "Employment Hub",
            touristAttraction: "Tourist Attraction",
            futureSupply: "Future Supply (Risk)"
        };
        const factorBarsHTML = Object.entries(area.factors).map(([key, val]) => {
            const barColor = key === "futureSupply"
                ? (val > 0.7 ? "#fc8d59" : val > 0.4 ? "#fee08b" : "#a6d96a")
                : (val > 0.7 ? "#52b947" : val > 0.4 ? "#fee08b" : "#fc8d59");
            return `
                <div class="factor-bar-row">
                    <div class="factor-bar-label">${factorNames[key] || key}</div>
                    <div class="factor-bar-track">
                        <div class="factor-bar-fill" style="width:${val * 100}%;background:${barColor}"></div>
                    </div>
                    <div class="factor-bar-value">${(val * 100).toFixed(0)}%</div>
                </div>
            `;
        }).join("");

        // Build the horizons comparison
        const horizons = [0.5, 1, 3, 5];
        const horizonsHTML = horizons.map(h => {
            const p = predictionModel.predict(area, h, activeDevelopers);
            const s = p.predictedChange >= 0 ? "+" : "";
            const isActive = h === selectedHorizon;
            return `
                <div class="horizon-card ${isActive ? 'active' : ''}">
                    <div class="horizon-period">${h < 1 ? '6 Mo' : h + ' Yr'}</div>
                    <div class="horizon-pct" style="color:${getColor(p.predictedChange)}">${s}${(p.predictedChange * 100).toFixed(1)}%</div>
                    <div class="horizon-price">AED ${p.predictedPrice.toLocaleString()}</div>
                </div>
            `;
        }).join("");

        content.innerHTML = `
            <div class="detail-header">
                <h2>${area.name}</h2>
                <div class="detail-pct" style="color:${getColor(pct)}">${sign}${(pct * 100).toFixed(1)}%</div>
            </div>

            <div class="detail-section">
                <div class="detail-stats">
                    <div class="stat">
                        <div class="stat-label">Current Price</div>
                        <div class="stat-value">AED ${area.currentPricePerSqft.toLocaleString()}/sqft</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Predicted Price</div>
                        <div class="stat-value" style="color:${getColor(pct)}">AED ${prediction.predictedPrice.toLocaleString()}/sqft</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Annual Rate</div>
                        <div class="stat-value">${(prediction.annualizedRate * 100).toFixed(1)}%</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Confidence</div>
                        <div class="stat-value">${confLow}% to ${confHigh}%</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Demand Score</div>
                        <div class="stat-value">${area.demandScore}/100</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Pipeline Supply</div>
                        <div class="stat-value">${area.supplyUnits.toLocaleString()} units</div>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <h3>Price Forecast (All Horizons)</h3>
                <div class="horizons-row">${horizonsHTML}</div>
            </div>

            <div class="detail-section">
                <h3>Price Trend</h3>
                <svg class="sparkline" viewBox="0 0 ${chartW} ${chartH}" width="${chartW}" height="${chartH}">
                    <polyline points="${points.join(" ")}" fill="none" stroke="#888" stroke-width="2"/>
                    <polyline points="${points[points.length - 1]} ${predX},${predY}" fill="none" stroke="${getColor(pct)}" stroke-width="2" stroke-dasharray="6,3"/>
                    <circle cx="${predX}" cy="${predY}" r="4" fill="${getColor(pct)}"/>
                </svg>
                <div class="chart-labels">
                    <span>Historical</span>
                    <span style="color:${getColor(pct)}">Predicted: AED ${prediction.predictedPrice.toLocaleString()}</span>
                </div>
            </div>

            <div class="detail-section">
                <h3>Key Drivers</h3>
                <div class="drivers-list">${driversHTML}</div>
            </div>

            <div class="detail-section">
                <h3>Location Factors</h3>
                <div class="factor-bars">${factorBarsHTML}</div>
            </div>

            <div class="detail-section">
                <h3>Active Developers</h3>
                <div class="dev-tags">${devsHTML}</div>
            </div>

            <div class="detail-section">
                <h3>New Developments</h3>
                <div class="detail-dev-list">${developmentsHTML}</div>
            </div>

            <div class="detail-section">
                <h3>Infrastructure Projects</h3>
                <div class="detail-infra-list">${infraHTML}</div>
            </div>
        `;

        panel.classList.remove("hidden");
    }

    function closeDetail() {
        document.getElementById("detailPanel").classList.add("hidden");
    }

    // ── Market Summary ──────────────────────────────────────
    function updateMarketSummary() {
        const predictions = DUBAI_AREAS
            .filter(a => a.developers.some(d => activeDevelopers.includes(d)))
            .map(a => ({
                area: a,
                prediction: predictionModel.predict(a, selectedHorizon, activeDevelopers)
            }))
            .sort((a, b) => b.prediction.predictedChange - a.prediction.predictedChange);

        if (predictions.length === 0) {
            document.getElementById("marketSummary").innerHTML = "<p>No areas match filters</p>";
            return;
        }

        const avgChange = predictions.reduce((s, p) => s + p.prediction.predictedChange, 0) / predictions.length;
        const best = predictions[0];
        const worst = predictions[predictions.length - 1];

        const sign = (v) => v >= 0 ? "+" : "";

        document.getElementById("marketSummary").innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Avg Forecast</span>
                <span class="summary-value" style="color:${getColor(avgChange)}">${sign(avgChange)}${(avgChange * 100).toFixed(1)}%</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Top Area</span>
                <span class="summary-value" style="color:${getColor(best.prediction.predictedChange)}">${best.area.name} (${sign(best.prediction.predictedChange)}${(best.prediction.predictedChange * 100).toFixed(1)}%)</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Lowest Area</span>
                <span class="summary-value" style="color:${getColor(worst.prediction.predictedChange)}">${worst.area.name} (${sign(worst.prediction.predictedChange)}${(worst.prediction.predictedChange * 100).toFixed(1)}%)</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Areas Shown</span>
                <span class="summary-value">${predictions.length} / ${DUBAI_AREAS.length}</span>
            </div>
        `;
    }

    // ── Full Re-render ──────────────────────────────────────
    function render() {
        renderAreas();
        renderInfrastructure();
        renderDevelopments();
        updateMarketSummary();
    }

    // ── Controls Setup ──────────────────────────────────────
    function setupControls() {
        // Time horizon buttons
        document.querySelectorAll(".time-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                selectedHorizon = parseFloat(this.dataset.horizon);
                render();
            });
        });

        // Developer filter
        const filterContainer = document.getElementById("developerFilter");
        DEVELOPERS.forEach(dev => {
            const label = document.createElement("label");
            label.className = "dev-filter-label";
            label.innerHTML = `
                <input type="checkbox" value="${dev.id}" checked>
                <span class="dev-filter-color" style="background:${dev.color}"></span>
                <span class="dev-filter-name">${dev.name}</span>
            `;
            label.querySelector("input").addEventListener("change", function () {
                if (this.checked) {
                    activeDevelopers.push(dev.id);
                } else {
                    activeDevelopers = activeDevelopers.filter(d => d !== dev.id);
                }
                render();
            });
            filterContainer.appendChild(label);
        });

        // Select / Deselect all
        document.getElementById("selectAll").addEventListener("click", () => {
            activeDevelopers = DEVELOPERS.map(d => d.id);
            document.querySelectorAll("#developerFilter input").forEach(cb => cb.checked = true);
            render();
        });
        document.getElementById("deselectAll").addEventListener("click", () => {
            activeDevelopers = [];
            document.querySelectorAll("#developerFilter input").forEach(cb => cb.checked = false);
            render();
        });

        // Layer toggles
        document.getElementById("showHeatmap").addEventListener("change", function () {
            showHeatmap = this.checked;
            render();
        });
        document.getElementById("showInfrastructure").addEventListener("change", function () {
            showInfrastructure = this.checked;
            render();
        });
        document.getElementById("showDevelopments").addEventListener("change", function () {
            showDevelopments = this.checked;
            render();
        });

        // Close detail panel
        document.getElementById("closeDetail").addEventListener("click", closeDetail);
    }

    // ── Boot ────────────────────────────────────────────────
    document.addEventListener("DOMContentLoaded", function () {
        initMap();
        setupControls();
        render();
    });
})();
