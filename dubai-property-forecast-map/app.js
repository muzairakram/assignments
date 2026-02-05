// ============================================================
// Dubai Property Forecast Map — Main Application (v2)
// ROI Calculator · Comparison Mode · Rental Yield · News Sentiment
// ============================================================

(function () {
    "use strict";

    // ── State ───────────────────────────────────────────────
    let selectedHorizon = 1;
    let activeDevelopers = DEVELOPERS.map(d => d.id);
    let showHeatmap = true;
    let showInfrastructure = true;
    let showDevelopments = true;
    let mapColorMode = "price"; // "price" | "rental" | "sentiment"

    // Comparison mode
    let comparisonEnabled = false;
    let comparisonAreas = []; // array of area IDs (max 3)

    // Leaflet layers
    let map;
    let areaPolygonLayers = {};
    let infraMarkers = [];
    let devMarkers = [];
    let areaLabelMarkers = [];

    // Cache predictions to avoid re-computing
    let predictionCache = {};

    // ── Initialize Map ──────────────────────────────────────
    function initMap() {
        map = L.map("map", {
            center: [25.15, 55.25],
            zoom: 11,
            minZoom: 10,
            maxZoom: 16,
            zoomControl: true
        });

        var tileLoaded = false;
        var tileErrorCount = 0;

        var primaryTiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 19,
            errorTileUrl: ""
        });

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

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png", {
            subdomains: "abcd",
            maxZoom: 19,
            pane: "shadowPane"
        }).addTo(map);
    }

    // ── Color Scales ─────────────────────────────────────────
    function getColor(pctChange) {
        if (pctChange > 0.30) return "#1a9641";
        if (pctChange > 0.20) return "#52b947";
        if (pctChange > 0.10) return "#a6d96a";
        if (pctChange > 0.05) return "#d9ef8b";
        if (pctChange > 0.00) return "#fee08b";
        if (pctChange > -0.05) return "#fc8d59";
        return "#d73027";
    }

    function getRentalYieldColor(yieldPct) {
        if (yieldPct > 8.0) return "#1a9641";
        if (yieldPct > 7.0) return "#52b947";
        if (yieldPct > 6.0) return "#a6d96a";
        if (yieldPct > 5.0) return "#d9ef8b";
        if (yieldPct > 4.0) return "#fee08b";
        if (yieldPct > 3.0) return "#fc8d59";
        return "#d73027";
    }

    function getSentimentColor(sentimentScore) {
        if (sentimentScore > 0.06) return "#1a9641";
        if (sentimentScore > 0.03) return "#52b947";
        if (sentimentScore > 0.01) return "#a6d96a";
        if (sentimentScore > -0.01) return "#fee08b";
        if (sentimentScore > -0.03) return "#fc8d59";
        return "#d73027";
    }

    function getOpacity(pctChange) {
        return Math.min(0.75, 0.35 + Math.abs(pctChange) * 0.8);
    }

    // ── Get area color based on current mode ─────────────────
    function getAreaColor(area, prediction) {
        if (mapColorMode === "rental") {
            return getRentalYieldColor(area.rentalYield || 0);
        } else if (mapColorMode === "sentiment") {
            return getSentimentColor(prediction.components.sentimentScore || 0);
        }
        return getColor(prediction.predictedChange);
    }

    // ── Get prediction (cached) ──────────────────────────────
    function getPrediction(area) {
        var cacheKey = area.id + "_" + selectedHorizon;
        if (!predictionCache[cacheKey]) {
            predictionCache[cacheKey] = predictionModel.predict(area, selectedHorizon, activeDevelopers);
        }
        return predictionCache[cacheKey];
    }

    function clearPredictionCache() {
        predictionCache = {};
    }

    // ── Legend Update ─────────────────────────────────────────
    function updateLegend() {
        var legendEl = document.getElementById("mapLegend");
        if (mapColorMode === "rental") {
            legendEl.innerHTML =
                '<div class="legend-item"><span class="legend-color" style="background:#1a9641"></span> &gt; 8% yield</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#52b947"></span> 7-8% yield</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#a6d96a"></span> 6-7% yield</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#d9ef8b"></span> 5-6% yield</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#fee08b"></span> 4-5% yield</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#fc8d59"></span> 3-4% yield</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#d73027"></span> &lt; 3% yield</div>';
        } else if (mapColorMode === "sentiment") {
            legendEl.innerHTML =
                '<div class="legend-item"><span class="legend-color" style="background:#1a9641"></span> Very Positive</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#52b947"></span> Positive</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#a6d96a"></span> Slightly Positive</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#fee08b"></span> Neutral</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#fc8d59"></span> Slightly Negative</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#d73027"></span> Negative</div>';
        } else {
            legendEl.innerHTML =
                '<div class="legend-item"><span class="legend-color" style="background:#1a9641"></span> &gt; +30%</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#52b947"></span> +20% to +30%</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#a6d96a"></span> +10% to +20%</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#d9ef8b"></span> +5% to +10%</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#fee08b"></span> 0% to +5%</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#fc8d59"></span> -5% to 0%</div>' +
                '<div class="legend-item"><span class="legend-color" style="background:#d73027"></span> &lt; -5%</div>';
        }
    }

    // ── Render Area Polygons ────────────────────────────────
    function renderAreas() {
        Object.values(areaPolygonLayers).forEach(l => map.removeLayer(l));
        areaPolygonLayers = {};
        areaLabelMarkers.forEach(m => map.removeLayer(m));
        areaLabelMarkers = [];

        DUBAI_AREAS.forEach(function (area) {
            var hasActiveDev = area.developers.some(d => activeDevelopers.includes(d));
            if (!hasActiveDev) return;

            var prediction = getPrediction(area);
            var pctChange = prediction.predictedChange;
            var coords = AREA_POLYGONS[area.id];
            if (!coords) return;

            var color = getAreaColor(area, prediction);
            var opacity = showHeatmap ? getOpacity(pctChange) : 0.08;

            // Highlight comparison areas
            var isCompareSelected = comparisonAreas.includes(area.id);
            var weight = isCompareSelected ? 4 : 2;
            var dashArray = isCompareSelected ? "8,4" : null;

            var polygon = L.polygon(coords, {
                color: color,
                weight: weight,
                fillColor: color,
                fillOpacity: opacity,
                dashArray: dashArray,
                className: "area-polygon"
            }).addTo(map);

            polygon.on("click", function () {
                if (comparisonEnabled) {
                    toggleComparisonArea(area.id);
                } else {
                    showAreaDetail(area, prediction);
                }
            });
            polygon.on("mouseover", function (e) {
                this.setStyle({ weight: weight + 1, fillOpacity: opacity + 0.15 });
                showTooltip(e, area, prediction);
            });
            polygon.on("mouseout", function () {
                this.setStyle({ weight: weight, fillOpacity: opacity });
                hideTooltip();
            });

            areaPolygonLayers[area.id] = polygon;

            // Area label
            var sign = pctChange >= 0 ? "+" : "";
            var labelValue = "";
            var labelColor = color;

            if (mapColorMode === "rental") {
                labelValue = (area.rentalYield || 0).toFixed(1) + "%";
            } else if (mapColorMode === "sentiment") {
                var sentScore = prediction.components.sentimentScore || 0;
                labelValue = sentScore > 0 ? "+" + (sentScore * 100).toFixed(1) : (sentScore * 100).toFixed(1);
            } else {
                labelValue = sign + (pctChange * 100).toFixed(1) + "%";
            }

            var yieldLine = area.rentalYield ? '<div class="area-label-yield">Yield: ' + area.rentalYield.toFixed(1) + '%</div>' : '';
            var label = L.divIcon({
                className: "area-label",
                html: '<div class="area-label-content" style="border-color:' + color + '">' +
                    '<div class="area-label-name">' + area.name + '</div>' +
                    '<div class="area-label-pct" style="color:' + labelColor + '">' + labelValue + '</div>' +
                    '<div class="area-label-price">AED ' + prediction.predictedPrice.toLocaleString() + '/sqft</div>' +
                    yieldLine +
                    '</div>',
                iconSize: [140, 70],
                iconAnchor: [70, 35]
            });
            var marker = L.marker(area.center, { icon: label, interactive: false }).addTo(map);
            areaLabelMarkers.push(marker);
        });
    }

    // ── Infrastructure Markers ──────────────────────────────
    function renderInfrastructure() {
        infraMarkers.forEach(m => map.removeLayer(m));
        infraMarkers = [];
        if (!showInfrastructure) return;

        DUBAI_AREAS.forEach(function (area) {
            var hasActiveDev = area.developers.some(d => activeDevelopers.includes(d));
            if (!hasActiveDev) return;

            area.infrastructureProjects.forEach(function (proj) {
                var icon = L.divIcon({
                    className: "infra-marker",
                    html: '<div class="infra-icon" title="' + proj.name + '">' + (INFRASTRUCTURE_ICONS[proj.type] || "\uD83C\uDFD7\uFE0F") + '</div>',
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                });
                var m = L.marker([proj.lat, proj.lng], { icon: icon }).addTo(map);
                m.bindPopup(
                    '<div class="popup-content">' +
                    '<strong>' + proj.name + '</strong><br>' +
                    'Type: ' + proj.type.replace(/_/g, " ") + '<br>' +
                    'Completion: ' + proj.completionYear + '<br>' +
                    'Impact Score: ' + (proj.impact * 100).toFixed(0) + '%' +
                    '</div>'
                );
                infraMarkers.push(m);
            });
        });
    }

    // ── Development Markers ─────────────────────────────────
    function renderDevelopments() {
        devMarkers.forEach(m => map.removeLayer(m));
        devMarkers = [];
        if (!showDevelopments) return;

        DUBAI_AREAS.forEach(function (area) {
            area.developments.forEach(function (dev) {
                if (!activeDevelopers.includes(dev.developer)) return;

                var devInfo = DEVELOPERS.find(d => d.id === dev.developer);
                var icon = L.divIcon({
                    className: "dev-marker",
                    html: '<div class="dev-icon" style="background:' + devInfo.color + '" title="' + dev.name + ' by ' + devInfo.name + '">' + devInfo.icon + '</div>',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });
                var m = L.marker([dev.lat, dev.lng], { icon: icon }).addTo(map);
                m.bindPopup(
                    '<div class="popup-content">' +
                    '<strong>' + dev.name + '</strong><br>' +
                    'Developer: ' + devInfo.name + '<br>' +
                    'Units: ' + dev.units.toLocaleString() + '<br>' +
                    'Type: ' + dev.type.replace(/_/g, " ") + '<br>' +
                    'Completion: ' + dev.completionYear +
                    '</div>'
                );
                devMarkers.push(m);
            });
        });
    }

    // ── Tooltip ─────────────────────────────────────────────
    var tooltipEl;
    function showTooltip(e, area, prediction) {
        if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.className = "map-tooltip";
            document.body.appendChild(tooltipEl);
        }
        var pct = prediction.predictedChange;
        var sign = pct >= 0 ? "+" : "";
        var yieldInfo = area.rentalYield ? '<br>Rental Yield: ' + area.rentalYield.toFixed(1) + '%' : '';
        var txnInfo = area.transactionVolume ? '<br>Transactions: ' + area.transactionVolume.toLocaleString() : '';
        tooltipEl.innerHTML =
            '<strong>' + area.name + '</strong> <span style="color:#888">(' + area.category + ')</span><br>' +
            'Current: AED ' + area.currentPricePerSqft.toLocaleString() + '/sqft<br>' +
            'Forecast: AED ' + prediction.predictedPrice.toLocaleString() + '/sqft<br>' +
            'Change: <span style="color:' + getColor(pct) + '">' + sign + (pct * 100).toFixed(1) + '%</span>' +
            yieldInfo + txnInfo;
        tooltipEl.style.display = "block";
        tooltipEl.style.left = (e.originalEvent.pageX + 15) + "px";
        tooltipEl.style.top = (e.originalEvent.pageY - 10) + "px";
    }
    function hideTooltip() {
        if (tooltipEl) tooltipEl.style.display = "none";
    }

    // ── Detail Panel ────────────────────────────────────────
    function showAreaDetail(area, prediction) {
        var panel = document.getElementById("detailPanel");
        var content = document.getElementById("detailContent");
        var pct = prediction.predictedChange;
        var sign = pct >= 0 ? "+" : "";
        var drivers = prediction.keyDrivers || predictionModel.getKeyDrivers(area, prediction, selectedHorizon);

        // Developers HTML
        var devsHTML = area.developers.map(function (dId) {
            var d = DEVELOPERS.find(x => x.id === dId);
            if (!d) return "";
            return '<span class="dev-tag" style="background:' + d.color + '20;color:' + d.color + ';border:1px solid ' + d.color + '">' + d.name + '</span>';
        }).join(" ");

        // Developments HTML
        var developmentsHTML = area.developments.map(function (dev) {
            var d = DEVELOPERS.find(x => x.id === dev.developer);
            if (!d) return "";
            return '<div class="detail-dev-item">' +
                '<div class="detail-dev-icon" style="background:' + d.color + '">' + d.icon + '</div>' +
                '<div><strong>' + dev.name + '</strong><br>' +
                '<small>' + d.name + ' &middot; ' + dev.units.toLocaleString() + ' units &middot; ' + dev.type.replace(/_/g, " ") + ' &middot; ' + dev.completionYear + '</small></div></div>';
        }).join("");

        // Infrastructure HTML
        var infraHTML = area.infrastructureProjects.map(function (p) {
            return '<div class="detail-infra-item">' +
                '<span class="infra-emoji">' + (INFRASTRUCTURE_ICONS[p.type] || "\uD83C\uDFD7\uFE0F") + '</span>' +
                '<div><strong>' + p.name + '</strong><br>' +
                '<small>Impact: ' + (p.impact * 100).toFixed(0) + '% &middot; Completion: ' + p.completionYear + '</small></div></div>';
        }).join("");

        // Drivers HTML
        var driversHTML = drivers.map(function (d) {
            var icon = d.type === "positive" ? "\u25B2" : d.type === "negative" ? "\u25BC" : "\u25CF";
            return '<div class="driver-item ' + d.type + '"><span class="driver-icon">' + icon + '</span> ' + d.text + '</div>';
        }).join("");

        // Confidence range
        var confLow = (prediction.confidenceLow * 100).toFixed(1);
        var confHigh = (prediction.confidenceHigh * 100).toFixed(1);

        // Price chart (sparkline)
        var history = area.priceHistory;
        var maxP = Math.max.apply(null, history.concat([prediction.predictedPrice]));
        var minP = Math.min.apply(null, history) * 0.9;
        var range = maxP - minP;
        var chartW = 360;
        var chartH = 80;
        var points = history.map(function (v, i) {
            var x = (i / history.length) * chartW;
            var y = chartH - ((v - minP) / range) * chartH;
            return x + "," + y;
        });
        var predX = chartW;
        var predY = chartH - ((prediction.predictedPrice - minP) / range) * chartH;

        // Factor bars
        var factorNames = {
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
        var factorBarsHTML = Object.entries(area.factors).map(function (entry) {
            var key = entry[0], val = entry[1];
            var barColor = key === "futureSupply"
                ? (val > 0.7 ? "#fc8d59" : val > 0.4 ? "#fee08b" : "#a6d96a")
                : (val > 0.7 ? "#52b947" : val > 0.4 ? "#fee08b" : "#fc8d59");
            return '<div class="factor-bar-row">' +
                '<div class="factor-bar-label">' + (factorNames[key] || key) + '</div>' +
                '<div class="factor-bar-track"><div class="factor-bar-fill" style="width:' + (val * 100) + '%;background:' + barColor + '"></div></div>' +
                '<div class="factor-bar-value">' + (val * 100).toFixed(0) + '%</div></div>';
        }).join("");

        // Horizons comparison
        var horizons = [0.5, 1, 3, 5];
        var horizonsHTML = horizons.map(function (h) {
            var p = predictionModel.predict(area, h, activeDevelopers);
            var s = p.predictedChange >= 0 ? "+" : "";
            var isActive = h === selectedHorizon;
            return '<div class="horizon-card ' + (isActive ? "active" : "") + '">' +
                '<div class="horizon-period">' + (h < 1 ? "6 Mo" : h + " Yr") + '</div>' +
                '<div class="horizon-pct" style="color:' + getColor(p.predictedChange) + '">' + s + (p.predictedChange * 100).toFixed(1) + '%</div>' +
                '<div class="horizon-price">AED ' + p.predictedPrice.toLocaleString() + '</div></div>';
        }).join("");

        // News HTML
        var newsHTML = "";
        if (area.news && area.news.length > 0) {
            newsHTML = area.news.map(function (item) {
                var sentiment = (item.sentiment || "neutral").toLowerCase();
                return '<div class="news-item ' + sentiment + '">' +
                    '<span class="news-sentiment-badge ' + sentiment + '">' + sentiment + '</span>' +
                    '<div class="news-text">' +
                    '<div class="news-headline">' + item.headline + '</div>' +
                    '<div class="news-date">' + item.date + '</div>' +
                    '</div></div>';
            }).join("");
        }

        // Rental yield section
        var yieldHTML = "";
        if (area.rentalYield) {
            var predYield = prediction.predictedRentalYield || area.rentalYield;
            var predRent = prediction.predictedRentPerSqft || area.avgRentPerSqft;
            yieldHTML = '<div class="yield-info-grid">' +
                '<div class="yield-card"><div class="yield-card-label">Current Yield</div>' +
                '<div class="yield-card-value">' + area.rentalYield.toFixed(1) + '%</div>' +
                '<div class="yield-card-sub">AED ' + (area.avgRentPerSqft || 0) + '/sqft/yr</div></div>' +
                '<div class="yield-card"><div class="yield-card-label">Predicted Yield</div>' +
                '<div class="yield-card-value" style="color:' + getRentalYieldColor(predYield) + '">' + predYield.toFixed(1) + '%</div>' +
                '<div class="yield-card-sub">AED ' + (predRent || 0) + '/sqft/yr</div></div>' +
                '<div class="yield-card"><div class="yield-card-label">Avg Transaction</div>' +
                '<div class="yield-card-value" style="color:#fff;font-size:14px">AED ' + (area.avgTransactionPrice || 0).toLocaleString() + '</div>' +
                '<div class="yield-card-sub">' + (area.transactionVolume || 0).toLocaleString() + ' txns</div></div></div>';
        }

        // Quick ROI for 1M AED investment
        var quickROI = predictionModel.calculateROI(area, area.avgTransactionPrice || 2000000, Math.round((area.avgTransactionPrice || 2000000) / area.currentPricePerSqft), selectedHorizon);
        var quickROIHTML = '<div class="quick-roi-grid">' +
            '<div class="quick-roi-item"><div class="quick-roi-label">Net ROI</div>' +
            '<div class="quick-roi-value" style="color:' + (quickROI.netROI >= 0 ? "#52b947" : "#fc8d59") + '">' + (quickROI.netROI * 100).toFixed(1) + '%</div></div>' +
            '<div class="quick-roi-item"><div class="quick-roi-label">Annualized</div>' +
            '<div class="quick-roi-value" style="color:' + (quickROI.annualizedROI >= 0 ? "#52b947" : "#fc8d59") + '">' + (quickROI.annualizedROI * 100).toFixed(1) + '%/yr</div></div>' +
            '<div class="quick-roi-item"><div class="quick-roi-label">Capital Gain</div>' +
            '<div class="quick-roi-value" style="color:#fff">AED ' + quickROI.capitalGain.toLocaleString() + '</div></div>' +
            '<div class="quick-roi-item"><div class="quick-roi-label">Rental Income</div>' +
            '<div class="quick-roi-value" style="color:#64b5f6">AED ' + quickROI.totalRentalIncome.toLocaleString() + '</div></div></div>';

        // Build tabs content
        content.innerHTML =
            '<div class="detail-header">' +
            '<h2>' + area.name + '</h2>' +
            '<div class="detail-pct" style="color:' + getColor(pct) + '">' + sign + (pct * 100).toFixed(1) + '%</div></div>' +

            '<div class="detail-tabs">' +
            '<button class="detail-tab active" data-tab="overview">Overview</button>' +
            '<button class="detail-tab" data-tab="investment">Investment</button>' +
            '<button class="detail-tab" data-tab="news">News</button>' +
            '<button class="detail-tab" data-tab="details">Details</button>' +
            '</div>' +

            // Overview Tab
            '<div class="detail-tab-content active" data-tab="overview">' +
            '<div class="detail-section"><div class="detail-stats">' +
            '<div class="stat"><div class="stat-label">Current Price</div><div class="stat-value">AED ' + area.currentPricePerSqft.toLocaleString() + '/sqft</div></div>' +
            '<div class="stat"><div class="stat-label">Predicted Price</div><div class="stat-value" style="color:' + getColor(pct) + '">AED ' + prediction.predictedPrice.toLocaleString() + '/sqft</div></div>' +
            '<div class="stat"><div class="stat-label">Annual Rate</div><div class="stat-value">' + (prediction.annualizedRate * 100).toFixed(1) + '%</div></div>' +
            '<div class="stat"><div class="stat-label">Confidence</div><div class="stat-value">' + confLow + '% to ' + confHigh + '%</div></div>' +
            '<div class="stat"><div class="stat-label">Demand Score</div><div class="stat-value">' + area.demandScore + '/100</div></div>' +
            '<div class="stat"><div class="stat-label">Pipeline Supply</div><div class="stat-value">' + area.supplyUnits.toLocaleString() + ' units</div></div>' +
            '</div></div>' +

            '<div class="detail-section"><h3>Price Forecast (All Horizons)</h3><div class="horizons-row">' + horizonsHTML + '</div></div>' +

            '<div class="detail-section"><h3>Price Trend</h3>' +
            '<svg class="sparkline" viewBox="0 0 ' + chartW + ' ' + chartH + '" width="' + chartW + '" height="' + chartH + '">' +
            '<polyline points="' + points.join(" ") + '" fill="none" stroke="#888" stroke-width="2"/>' +
            '<polyline points="' + points[points.length - 1] + ' ' + predX + ',' + predY + '" fill="none" stroke="' + getColor(pct) + '" stroke-width="2" stroke-dasharray="6,3"/>' +
            '<circle cx="' + predX + '" cy="' + predY + '" r="4" fill="' + getColor(pct) + '"/></svg>' +
            '<div class="chart-labels"><span>Historical</span><span style="color:' + getColor(pct) + '">Predicted: AED ' + prediction.predictedPrice.toLocaleString() + '</span></div></div>' +

            '<div class="detail-section"><h3>Key Drivers</h3><div class="drivers-list">' + driversHTML + '</div></div>' +
            '</div>' +

            // Investment Tab
            '<div class="detail-tab-content" data-tab="investment">' +
            (yieldHTML ? '<div class="detail-section"><h3>Rental Yield Analysis</h3>' + yieldHTML + '</div>' : '') +
            '<div class="detail-section"><h3>Quick ROI (Avg Transaction: AED ' + (area.avgTransactionPrice || 2000000).toLocaleString() + ')</h3>' + quickROIHTML + '</div>' +
            '<div class="detail-section"><h3>Location Factors</h3><div class="factor-bars">' + factorBarsHTML + '</div></div>' +
            '</div>' +

            // News Tab
            '<div class="detail-tab-content" data-tab="news">' +
            (newsHTML ? '<div class="detail-section"><h3>Latest News & Sentiment</h3><div class="news-list">' + newsHTML + '</div></div>'
                : '<div class="detail-section"><p style="color:#888">No recent news available for this area.</p></div>') +
            '</div>' +

            // Details Tab
            '<div class="detail-tab-content" data-tab="details">' +
            '<div class="detail-section"><h3>Active Developers</h3><div class="dev-tags">' + devsHTML + '</div></div>' +
            '<div class="detail-section"><h3>New Developments</h3><div class="detail-dev-list">' + developmentsHTML + '</div></div>' +
            '<div class="detail-section"><h3>Infrastructure Projects</h3><div class="detail-infra-list">' + infraHTML + '</div></div>' +
            '</div>';

        // Setup tab switching
        content.querySelectorAll(".detail-tab").forEach(function (tab) {
            tab.addEventListener("click", function () {
                var tabName = this.dataset.tab;
                content.querySelectorAll(".detail-tab").forEach(t => t.classList.remove("active"));
                content.querySelectorAll(".detail-tab-content").forEach(tc => tc.classList.remove("active"));
                this.classList.add("active");
                content.querySelector('.detail-tab-content[data-tab="' + tabName + '"]').classList.add("active");
            });
        });

        panel.classList.remove("hidden");
    }

    function closeDetail() {
        document.getElementById("detailPanel").classList.add("hidden");
    }

    // ── Comparison Mode ─────────────────────────────────────
    function toggleComparisonArea(areaId) {
        var idx = comparisonAreas.indexOf(areaId);
        if (idx >= 0) {
            comparisonAreas.splice(idx, 1);
        } else if (comparisonAreas.length < 3) {
            comparisonAreas.push(areaId);
        }
        updateCompareChips();
        renderAreas();
        if (comparisonAreas.length >= 2) {
            showComparisonPanel();
        } else {
            hideComparisonPanel();
        }
    }

    function updateCompareChips() {
        var container = document.getElementById("compareChips");
        container.innerHTML = comparisonAreas.map(function (areaId) {
            var area = DUBAI_AREAS.find(a => a.id === areaId);
            if (!area) return "";
            return '<span class="compare-chip">' + area.name +
                ' <span class="remove-chip" data-area="' + areaId + '">&times;</span></span>';
        }).join("");

        container.querySelectorAll(".remove-chip").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                toggleComparisonArea(this.dataset.area);
            });
        });

        var clearBtn = document.getElementById("clearCompare");
        clearBtn.style.display = comparisonAreas.length > 0 ? "" : "none";
    }

    function showComparisonPanel() {
        var panel = document.getElementById("comparisonPanel");
        var content = document.getElementById("comparisonContent");
        var colClass = comparisonAreas.length === 2 ? "cols-2" : "cols-3";

        var cardsHTML = comparisonAreas.map(function (areaId) {
            var area = DUBAI_AREAS.find(a => a.id === areaId);
            if (!area) return "";
            var pred = getPrediction(area);
            var pct = pred.predictedChange;
            var sign = pct >= 0 ? "+" : "";
            var roi = predictionModel.calculateROI(area, area.avgTransactionPrice || 2000000, Math.round((area.avgTransactionPrice || 2000000) / area.currentPricePerSqft), selectedHorizon);

            var newsItems = (area.news || []).slice(0, 2).map(function (n) {
                return '<div class="comp-news-item"><span class="sentiment-dot ' + (n.sentiment || "neutral") + '"></span>' + n.headline + '</div>';
            }).join("");

            return '<div class="comparison-card">' +
                '<div class="comp-card-header">' +
                '<div class="comp-card-name">' + area.name + '</div>' +
                '<div class="comp-card-pct" style="color:' + getColor(pct) + '">' + sign + (pct * 100).toFixed(1) + '%</div></div>' +
                '<div class="comp-stat-grid">' +
                '<div class="comp-stat"><div class="comp-stat-label">Current Price</div><div class="comp-stat-value">AED ' + area.currentPricePerSqft.toLocaleString() + '/sqft</div></div>' +
                '<div class="comp-stat"><div class="comp-stat-label">Predicted Price</div><div class="comp-stat-value" style="color:' + getColor(pct) + '">AED ' + pred.predictedPrice.toLocaleString() + '/sqft</div></div>' +
                '<div class="comp-stat"><div class="comp-stat-label">Rental Yield</div><div class="comp-stat-value">' + (area.rentalYield || 0).toFixed(1) + '%</div></div>' +
                '<div class="comp-stat"><div class="comp-stat-label">Net ROI</div><div class="comp-stat-value" style="color:' + (roi.netROI >= 0 ? "#52b947" : "#fc8d59") + '">' + (roi.netROI * 100).toFixed(1) + '%</div></div>' +
                '<div class="comp-stat"><div class="comp-stat-label">Supply</div><div class="comp-stat-value">' + area.supplyUnits.toLocaleString() + '</div></div>' +
                '<div class="comp-stat"><div class="comp-stat-label">Demand</div><div class="comp-stat-value">' + area.demandScore + '/100</div></div>' +
                '<div class="comp-stat"><div class="comp-stat-label">YoY Change</div><div class="comp-stat-value">' + ((area.yoyChange || 0) * 100).toFixed(1) + '%</div></div>' +
                '<div class="comp-stat"><div class="comp-stat-label">Transactions</div><div class="comp-stat-value">' + (area.transactionVolume || 0).toLocaleString() + '</div></div>' +
                '</div>' +
                (newsItems ? '<div class="comp-news-list">' + newsItems + '</div>' : '') +
                '</div>';
        }).join("");

        content.innerHTML =
            '<div class="comparison-header">Area Comparison (' + selectedHorizon + (selectedHorizon < 1 ? ' Mo' : ' Yr') + ' forecast)</div>' +
            '<div class="comparison-grid ' + colClass + '">' + cardsHTML + '</div>';

        panel.classList.remove("hidden");
    }

    function hideComparisonPanel() {
        document.getElementById("comparisonPanel").classList.add("hidden");
    }

    // ── ROI Calculator ──────────────────────────────────────
    function calculateAndShowROI() {
        var areaId = document.getElementById("roiArea").value;
        var purchasePrice = parseFloat(document.getElementById("roiPrice").value) || 2000000;
        var unitSize = parseFloat(document.getElementById("roiSize").value) || 1000;
        var holdingYears = parseFloat(document.getElementById("roiHolding").value) || 3;

        var area = DUBAI_AREAS.find(a => a.id === areaId);
        if (!area) return;

        var roi = predictionModel.calculateROI(area, purchasePrice, unitSize, holdingYears);

        var panel = document.getElementById("roiPanel");
        var content = document.getElementById("roiContent");

        content.innerHTML =
            '<div class="roi-header"><h3>Investment ROI Analysis</h3>' +
            '<div class="roi-area-name">' + area.name + ' &middot; ' + holdingYears + ' Year Hold</div></div>' +

            '<div class="roi-summary">' +
            '<div class="roi-summary-card highlight"><div class="roi-summary-label">Net ROI</div>' +
            '<div class="roi-summary-value ' + (roi.netROI >= 0 ? "positive" : "negative") + '">' + (roi.netROI * 100).toFixed(1) + '%</div></div>' +
            '<div class="roi-summary-card highlight"><div class="roi-summary-label">Annualized</div>' +
            '<div class="roi-summary-value ' + (roi.annualizedROI >= 0 ? "positive" : "negative") + '">' + (roi.annualizedROI * 100).toFixed(1) + '%/yr</div></div>' +
            '<div class="roi-summary-card"><div class="roi-summary-label">Purchase Price</div>' +
            '<div class="roi-summary-value">AED ' + purchasePrice.toLocaleString() + '</div></div>' +
            '<div class="roi-summary-card"><div class="roi-summary-label">Future Value</div>' +
            '<div class="roi-summary-value ' + (roi.futureValue > purchasePrice ? "positive" : "negative") + '">AED ' + roi.futureValue.toLocaleString() + '</div></div>' +
            '</div>' +

            '<div class="roi-breakdown"><h4>Capital</h4>' +
            '<div class="roi-row"><span class="roi-row-label">Capital Appreciation</span><span class="roi-row-value income">' + (roi.capitalAppreciationPct * 100).toFixed(1) + '%</span></div>' +
            '<div class="roi-row"><span class="roi-row-label">Capital Gain</span><span class="roi-row-value income">AED ' + roi.capitalGain.toLocaleString() + '</span></div></div>' +

            '<div class="roi-breakdown"><h4>Rental Income</h4>' +
            '<div class="roi-row"><span class="roi-row-label">Current Annual Rent</span><span class="roi-row-value">AED ' + roi.currentAnnualRent.toLocaleString() + '</span></div>' +
            '<div class="roi-row"><span class="roi-row-label">Future Annual Rent</span><span class="roi-row-value">AED ' + roi.futureAnnualRent.toLocaleString() + '</span></div>' +
            '<div class="roi-row"><span class="roi-row-label">Current Yield</span><span class="roi-row-value">' + roi.currentYield.toFixed(1) + '%</span></div>' +
            '<div class="roi-row"><span class="roi-row-label">Predicted Yield</span><span class="roi-row-value">' + roi.predictedYield.toFixed(1) + '%</span></div>' +
            '<div class="roi-row total"><span class="roi-row-label">Total Rental Income</span><span class="roi-row-value income">AED ' + roi.totalRentalIncome.toLocaleString() + '</span></div></div>' +

            '<div class="roi-breakdown"><h4>Costs</h4>' +
            '<div class="roi-row"><span class="roi-row-label">DLD Registration (4%)</span><span class="roi-row-value cost">AED ' + roi.acquisitionCost.toLocaleString() + '</span></div>' +
            '<div class="roi-row"><span class="roi-row-label">Agent Fee (2%)</span><span class="roi-row-value cost">AED ' + roi.agentFee.toLocaleString() + '</span></div>' +
            '<div class="roi-row"><span class="roi-row-label">Maintenance (' + holdingYears + ' yr)</span><span class="roi-row-value cost">AED ' + roi.totalMaintenance.toLocaleString() + '</span></div>' +
            '<div class="roi-row"><span class="roi-row-label">Disposal Fee (2%)</span><span class="roi-row-value cost">AED ' + roi.disposalCost.toLocaleString() + '</span></div>' +
            '<div class="roi-row total"><span class="roi-row-label">Total Costs</span><span class="roi-row-value cost">AED ' + roi.totalCosts.toLocaleString() + '</span></div></div>' +

            '<div class="roi-breakdown"><h4>Net Returns</h4>' +
            '<div class="roi-row"><span class="roi-row-label">Gross Return</span><span class="roi-row-value income">AED ' + roi.grossReturn.toLocaleString() + ' (' + (roi.grossROI * 100).toFixed(1) + '%)</span></div>' +
            '<div class="roi-row total"><span class="roi-row-label">Net Profit</span><span class="roi-row-value ' + (roi.netProfit >= 0 ? "income" : "cost") + '">AED ' + roi.netProfit.toLocaleString() + '</span></div></div>';

        panel.classList.remove("hidden");
    }

    // ── Market Summary ──────────────────────────────────────
    function updateMarketSummary() {
        var predictions = DUBAI_AREAS
            .filter(a => a.developers.some(d => activeDevelopers.includes(d)))
            .map(function (a) {
                return {
                    area: a,
                    prediction: getPrediction(a)
                };
            })
            .sort(function (a, b) { return b.prediction.predictedChange - a.prediction.predictedChange; });

        if (predictions.length === 0) {
            document.getElementById("marketSummary").innerHTML = "<p>No areas match filters</p>";
            return;
        }

        var avgChange = predictions.reduce(function (s, p) { return s + p.prediction.predictedChange; }, 0) / predictions.length;
        var avgYield = predictions.reduce(function (s, p) { return s + (p.area.rentalYield || 0); }, 0) / predictions.length;
        var best = predictions[0];
        var worst = predictions[predictions.length - 1];

        var sign = function (v) { return v >= 0 ? "+" : ""; };

        // Top 3 by yield
        var byYield = predictions.slice().sort(function (a, b) { return (b.area.rentalYield || 0) - (a.area.rentalYield || 0); });
        var topYield = byYield[0];

        document.getElementById("marketSummary").innerHTML =
            '<div class="summary-item"><span class="summary-label">Avg Forecast</span>' +
            '<span class="summary-value" style="color:' + getColor(avgChange) + '">' + sign(avgChange) + (avgChange * 100).toFixed(1) + '%</span></div>' +
            '<div class="summary-item"><span class="summary-label">Top Growth</span>' +
            '<span class="summary-value" style="color:' + getColor(best.prediction.predictedChange) + '">' + best.area.name + ' (' + sign(best.prediction.predictedChange) + (best.prediction.predictedChange * 100).toFixed(1) + '%)</span></div>' +
            '<div class="summary-item"><span class="summary-label">Lowest Growth</span>' +
            '<span class="summary-value" style="color:' + getColor(worst.prediction.predictedChange) + '">' + worst.area.name + ' (' + sign(worst.prediction.predictedChange) + (worst.prediction.predictedChange * 100).toFixed(1) + '%)</span></div>' +
            '<div class="summary-item"><span class="summary-label">Avg Yield</span>' +
            '<span class="summary-value" style="color:#64b5f6">' + avgYield.toFixed(1) + '%</span></div>' +
            '<div class="summary-item"><span class="summary-label">Best Yield</span>' +
            '<span class="summary-value" style="color:#64b5f6">' + topYield.area.name + ' (' + (topYield.area.rentalYield || 0).toFixed(1) + '%)</span></div>' +
            '<div class="summary-item"><span class="summary-label">Areas Shown</span>' +
            '<span class="summary-value">' + predictions.length + ' / ' + DUBAI_AREAS.length + '</span></div>';
    }

    // ── Full Re-render ──────────────────────────────────────
    function render() {
        clearPredictionCache();
        renderAreas();
        renderInfrastructure();
        renderDevelopments();
        updateMarketSummary();
        updateLegend();
        if (comparisonAreas.length >= 2) {
            showComparisonPanel();
        }
    }

    // ── Controls Setup ──────────────────────────────────────
    function setupControls() {
        // Time horizon buttons
        document.querySelectorAll(".time-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                selectedHorizon = parseFloat(this.dataset.horizon);
                render();
            });
        });

        // Color mode buttons
        document.querySelectorAll(".color-mode-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                document.querySelectorAll(".color-mode-btn").forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                mapColorMode = this.dataset.mode;
                render();
            });
        });

        // Developer filter
        var filterContainer = document.getElementById("developerFilter");
        DEVELOPERS.forEach(function (dev) {
            var label = document.createElement("label");
            label.className = "dev-filter-label";
            label.innerHTML =
                '<input type="checkbox" value="' + dev.id + '" checked>' +
                '<span class="dev-filter-color" style="background:' + dev.color + '"></span>' +
                '<span class="dev-filter-name">' + dev.name + '</span>';
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
        document.getElementById("selectAll").addEventListener("click", function () {
            activeDevelopers = DEVELOPERS.map(d => d.id);
            document.querySelectorAll("#developerFilter input").forEach(cb => cb.checked = true);
            render();
        });
        document.getElementById("deselectAll").addEventListener("click", function () {
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

        // Rental yield & sentiment toggles (informational - color mode handles display)
        document.getElementById("showRentalYield").addEventListener("change", function () {
            if (this.checked) {
                mapColorMode = "rental";
                document.querySelectorAll(".color-mode-btn").forEach(b => b.classList.remove("active"));
                document.querySelector('.color-mode-btn[data-mode="rental"]').classList.add("active");
            } else {
                mapColorMode = "price";
                document.querySelectorAll(".color-mode-btn").forEach(b => b.classList.remove("active"));
                document.querySelector('.color-mode-btn[data-mode="price"]').classList.add("active");
            }
            render();
        });
        document.getElementById("showNewsSentiment").addEventListener("change", function () {
            if (this.checked) {
                mapColorMode = "sentiment";
                document.querySelectorAll(".color-mode-btn").forEach(b => b.classList.remove("active"));
                document.querySelector('.color-mode-btn[data-mode="sentiment"]').classList.add("active");
            } else {
                mapColorMode = "price";
                document.querySelectorAll(".color-mode-btn").forEach(b => b.classList.remove("active"));
                document.querySelector('.color-mode-btn[data-mode="price"]').classList.add("active");
            }
            render();
        });

        // Close detail panel
        document.getElementById("closeDetail").addEventListener("click", closeDetail);

        // Comparison mode
        document.getElementById("toggleCompare").addEventListener("click", function () {
            comparisonEnabled = !comparisonEnabled;
            this.classList.toggle("active", comparisonEnabled);
            this.textContent = comparisonEnabled ? "Comparison ON" : "Enable Comparison";
            document.getElementById("compareHint").textContent = comparisonEnabled
                ? "Click areas on the map to select (max 3)"
                : "Click areas on the map to compare (max 3)";
            if (!comparisonEnabled) {
                comparisonAreas = [];
                updateCompareChips();
                hideComparisonPanel();
                renderAreas();
            }
        });

        document.getElementById("clearCompare").addEventListener("click", function () {
            comparisonAreas = [];
            updateCompareChips();
            hideComparisonPanel();
            renderAreas();
        });

        document.getElementById("closeComparison").addEventListener("click", function () {
            hideComparisonPanel();
        });

        // ROI Calculator
        var roiAreaSelect = document.getElementById("roiArea");
        DUBAI_AREAS.forEach(function (area) {
            var opt = document.createElement("option");
            opt.value = area.id;
            opt.textContent = area.name + " (AED " + area.currentPricePerSqft.toLocaleString() + "/sqft)";
            roiAreaSelect.appendChild(opt);
        });

        // Update default price/size when area changes
        roiAreaSelect.addEventListener("change", function () {
            var area = DUBAI_AREAS.find(a => a.id === this.value);
            if (area) {
                document.getElementById("roiPrice").value = area.avgTransactionPrice || 2000000;
                document.getElementById("roiSize").value = Math.round((area.avgTransactionPrice || 2000000) / area.currentPricePerSqft);
            }
        });

        document.getElementById("calcROI").addEventListener("click", calculateAndShowROI);

        document.getElementById("closeROI").addEventListener("click", function () {
            document.getElementById("roiPanel").classList.add("hidden");
        });
    }

    // ── Boot ────────────────────────────────────────────────
    document.addEventListener("DOMContentLoaded", function () {
        initMap();
        setupControls();
        render();
    });
})();
