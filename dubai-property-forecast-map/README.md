# Dubai Property Forecast Map

AI-powered interactive map showing predicted property price changes across Dubai areas over different time horizons (6 months, 1 year, 3 years, 5 years).

## How to Run

Simply open `index.html` in any modern browser:

```bash
# Option 1: Direct open
open dubai-property-forecast-map/index.html

# Option 2: Local server (if you prefer)
cd dubai-property-forecast-map
python3 -m http.server 8000
# Then visit http://localhost:8000
```

> **Note:** An internet connection is required on first load to fetch Leaflet.js and the map tiles from CartoDB.

## Features

### Interactive Map
- Color-coded area polygons showing predicted price changes
- Click any area to see detailed analysis
- Hover for quick price summary tooltip

### Prediction Model
- Simulated ML gradient-boosted regression model
- Factors: price momentum, infrastructure uplift, supply/demand dynamics, developer quality premiums, market cycle positioning
- Confidence intervals for each prediction
- Annualized growth rates

### Filters & Controls
- **Time Horizon:** 6 months, 1 year, 3 years, 5 years
- **Developer Filter:** Top 10 Dubai developers with select/deselect all
- **Map Layers:** Toggle heatmap overlay, infrastructure markers, development markers

### Top 10 Developers Tracked
1. Emaar Properties
2. DAMAC Properties
3. Nakheel
4. Meraas
5. Sobha Realty
6. Azizi Developments
7. Danube Properties
8. Omniyat
9. Ellington Properties
10. Binghatti Developers

### 16 Dubai Areas Covered
Downtown Dubai, Dubai Marina, Palm Jumeirah, Business Bay, Dubai Hills Estate, Dubai Creek Harbour, Dubai South, JVC, Meydan/MBR City, JBR, JLT, Arjan/Dubailand, Deira Islands, Al Furjan, Dubai Silicon Oasis, Al Jaddaf Waterfront

### Key Prediction Factors
- Airport proximity & expansion plans
- Metro/road network development
- Retail & amenity infrastructure
- Schools & healthcare facilities
- Beach proximity
- Employment hub density
- Tourist attractions
- Future supply pipeline (risk factor)

## Tech Stack
- **Map:** Leaflet.js with CartoDB Dark Matter tiles
- **Prediction Engine:** Custom JS model simulating gradient-boosted regression
- **UI:** Vanilla HTML/CSS/JS (no build step required)
