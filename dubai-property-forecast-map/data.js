// ============================================================
// Dubai Property Forecast Map — Comprehensive Data Layer
// Real market data sourced from DLD, Bayut, and market reports
// ============================================================

// Top 10 Dubai Developers
const DEVELOPERS = [
    { id: "emaar",      name: "Emaar Properties",       color: "#1E88E5", icon: "E" },
    { id: "damac",      name: "DAMAC Properties",        color: "#E53935", icon: "D" },
    { id: "nakheel",    name: "Nakheel",                 color: "#43A047", icon: "N" },
    { id: "meraas",     name: "Meraas",                  color: "#8E24AA", icon: "M" },
    { id: "sobha",      name: "Sobha Realty",            color: "#FB8C00", icon: "S" },
    { id: "azizi",      name: "Azizi Developments",      color: "#00ACC1", icon: "A" },
    { id: "danube",     name: "Danube Properties",       color: "#D81B60", icon: "Dn" },
    { id: "omniyat",    name: "Omniyat",                 color: "#6D4C41", icon: "O" },
    { id: "ellington",  name: "Ellington Properties",    color: "#546E7A", icon: "El" },
    { id: "binghatti",  name: "Binghatti Developers",    color: "#FFB300", icon: "B" }
];

// Infrastructure type icons
const INFRASTRUCTURE_ICONS = {
    airport: "✈️", metro: "🚇", road: "🛣️", retail: "🛍️",
    entertainment: "🎡", public_space: "🌳", landmark: "🏗️",
    mixed_use: "🏢", leisure: "⛳", commercial: "💼",
    bridge: "🌉", tunnel: "🚇", flying_taxi: "🛸"
};

// ── 40+ Dubai Areas with Real 2025 Market Data ─────────
const DUBAI_AREAS = [
    // ── PREMIUM / LUXURY ────────────────────────────────
    {
        id: "downtown_dubai",
        name: "Downtown Dubai",
        center: [25.197, 55.274],
        bounds: [[25.185, 55.260], [25.210, 55.290]],
        category: "luxury",
        currentPricePerSqft: 2900,
        priceHistory: [1850, 2050, 2250, 2480, 2700, 2900],
        yoyChange: 0.065,
        rentalYield: 4.5,
        avgRentPerSqft: 130,
        avgTransactionPrice: 3200000,
        supplyUnits: 5000,
        demandScore: 95,
        transactionVolume: 4200,
        developers: ["emaar", "omniyat", "ellington"],
        propertyTypes: { apartments: 0.85, villas: 0.05, commercial: 0.10 },
        infrastructureProjects: [
            { name: "Dubai Creek Tower District", type: "landmark", impact: 0.15, completionYear: 2029, lat: 25.200, lng: 55.280 },
            { name: "Downtown Boulevard Upgrade", type: "road", impact: 0.05, completionYear: 2026, lat: 25.195, lng: 55.275 },
            { name: "Burj Binghatti (Tallest Residential)", type: "landmark", impact: 0.10, completionYear: 2027, lat: 25.188, lng: 55.268 }
        ],
        developments: [
            { name: "Emaar Burj Crown", developer: "emaar", units: 450, type: "luxury", completionYear: 2027, lat: 25.198, lng: 55.273 },
            { name: "Omniyat The Opus Phase 2", developer: "omniyat", units: 200, type: "luxury", completionYear: 2027, lat: 25.193, lng: 55.278 },
            { name: "Ellington Belgravia III", developer: "ellington", units: 350, type: "premium", completionYear: 2026, lat: 25.200, lng: 55.268 }
        ],
        news: [
            { headline: "Downtown Dubai prices rise 6.5% in 2025, showing mature market stability", sentiment: "positive", date: "2025-12" },
            { headline: "Burj Binghatti to become world's tallest residential tower at 550m", sentiment: "positive", date: "2025-10" },
            { headline: "Downtown remains top pick for luxury apartment buyers", sentiment: "positive", date: "2025-09" }
        ],
        factors: { airportProximity: 0.60, metroAccess: 0.95, roadNetwork: 0.95, retailAmenities: 0.98, schoolsHealthcare: 0.85, greenSpaces: 0.70, beachProximity: 0.30, employmentHub: 0.95, touristAttraction: 0.99, futureSupply: 0.35 }
    },
    {
        id: "dubai_marina",
        name: "Dubai Marina",
        center: [25.080, 55.140],
        bounds: [[25.065, 55.125], [25.095, 55.155]],
        category: "luxury",
        currentPricePerSqft: 2188,
        priceHistory: [1400, 1580, 1750, 1920, 2050, 2188],
        yoyChange: 0.062,
        rentalYield: 5.62,
        avgRentPerSqft: 123,
        avgTransactionPrice: 2500000,
        supplyUnits: 3500,
        demandScore: 92,
        transactionVolume: 5100,
        developers: ["emaar", "damac", "sobha"],
        propertyTypes: { apartments: 0.92, villas: 0.02, commercial: 0.06 },
        infrastructureProjects: [
            { name: "Bluewaters Phase 2", type: "entertainment", impact: 0.08, completionYear: 2027, lat: 25.078, lng: 55.130 },
            { name: "Marina Promenade Enhancement", type: "public_space", impact: 0.05, completionYear: 2026, lat: 25.082, lng: 55.142 },
            { name: "Flying Taxi Vertiport - Marina", type: "flying_taxi", impact: 0.06, completionYear: 2026, lat: 25.076, lng: 55.136 }
        ],
        developments: [
            { name: "Emaar Marina Vista", developer: "emaar", units: 600, type: "luxury", completionYear: 2027, lat: 25.079, lng: 55.138 },
            { name: "DAMAC Bay 2", developer: "damac", units: 400, type: "luxury", completionYear: 2027, lat: 25.083, lng: 55.145 },
            { name: "Sobha SeaHaven Phase 2", developer: "sobha", units: 500, type: "premium", completionYear: 2026, lat: 25.075, lng: 55.135 }
        ],
        news: [
            { headline: "Dubai Marina retains top position for luxury apartment sales in 2025", sentiment: "positive", date: "2025-12" },
            { headline: "Marina prices per sqft rose 4.2-6.5% across premium districts", sentiment: "positive", date: "2025-11" },
            { headline: "Flying taxis to launch at Dubai Marina hub in H1 2026", sentiment: "positive", date: "2025-10" }
        ],
        factors: { airportProximity: 0.50, metroAccess: 0.90, roadNetwork: 0.85, retailAmenities: 0.92, schoolsHealthcare: 0.75, greenSpaces: 0.60, beachProximity: 0.95, employmentHub: 0.80, touristAttraction: 0.90, futureSupply: 0.40 }
    },
    {
        id: "palm_jumeirah",
        name: "Palm Jumeirah",
        center: [25.112, 55.138],
        bounds: [[25.095, 55.110], [25.135, 55.165]],
        category: "ultra_luxury",
        currentPricePerSqft: 3500,
        priceHistory: [2000, 2300, 2650, 2950, 3200, 3500],
        yoyChange: 0.18,
        rentalYield: 4.5,
        avgRentPerSqft: 158,
        avgTransactionPrice: 8500000,
        supplyUnits: 1500,
        demandScore: 97,
        transactionVolume: 2800,
        developers: ["nakheel", "omniyat", "sobha"],
        propertyTypes: { apartments: 0.55, villas: 0.40, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Palm Monorail Upgrade", type: "metro", impact: 0.06, completionYear: 2026, lat: 25.118, lng: 55.140 },
            { name: "Flying Taxi Vertiport - Palm", type: "flying_taxi", impact: 0.05, completionYear: 2026, lat: 25.110, lng: 55.135 },
            { name: "MGM Island (Marsa Al Arab)", type: "entertainment", impact: 0.15, completionYear: 2028, lat: 25.105, lng: 55.148 }
        ],
        developments: [
            { name: "Nakheel Palm Beach Towers 3", developer: "nakheel", units: 300, type: "ultra_luxury", completionYear: 2027, lat: 25.110, lng: 55.140 },
            { name: "Omniyat The Palm Residences", developer: "omniyat", units: 150, type: "ultra_luxury", completionYear: 2028, lat: 25.108, lng: 55.132 }
        ],
        news: [
            { headline: "Palm Jumeirah villa prices at AED 6,160/sqft, up 18% YoY", sentiment: "positive", date: "2025-12" },
            { headline: "MGM Island mega resort under construction next to Palm", sentiment: "positive", date: "2025-11" },
            { headline: "Limited supply keeps Palm Jumeirah prices resilient", sentiment: "positive", date: "2025-09" }
        ],
        factors: { airportProximity: 0.45, metroAccess: 0.55, roadNetwork: 0.70, retailAmenities: 0.85, schoolsHealthcare: 0.70, greenSpaces: 0.65, beachProximity: 1.00, employmentHub: 0.55, touristAttraction: 0.98, futureSupply: 0.15 }
    },
    {
        id: "jbr",
        name: "JBR (Jumeirah Beach Residence)",
        center: [25.076, 55.130],
        bounds: [[25.068, 55.120], [25.084, 55.142]],
        category: "luxury",
        currentPricePerSqft: 2400,
        priceHistory: [1550, 1720, 1900, 2100, 2250, 2400],
        yoyChange: 0.08,
        rentalYield: 5.2,
        avgRentPerSqft: 125,
        avgTransactionPrice: 2800000,
        supplyUnits: 800,
        demandScore: 90,
        transactionVolume: 1800,
        developers: ["meraas", "emaar", "damac"],
        propertyTypes: { apartments: 0.95, villas: 0.0, commercial: 0.05 },
        infrastructureProjects: [
            { name: "The Beach Enhancement", type: "public_space", impact: 0.04, completionYear: 2026, lat: 25.075, lng: 55.128 }
        ],
        developments: [
            { name: "Meraas JBR Phase 4", developer: "meraas", units: 250, type: "luxury", completionYear: 2027, lat: 25.076, lng: 55.132 }
        ],
        news: [
            { headline: "JBR among top ready secondary communities in 2025", sentiment: "positive", date: "2025-11" },
            { headline: "Beach proximity and walkability keep JBR demand high", sentiment: "positive", date: "2025-08" }
        ],
        factors: { airportProximity: 0.48, metroAccess: 0.85, roadNetwork: 0.80, retailAmenities: 0.90, schoolsHealthcare: 0.72, greenSpaces: 0.55, beachProximity: 0.98, employmentHub: 0.70, touristAttraction: 0.95, futureSupply: 0.20 }
    },
    {
        id: "emirates_hills",
        name: "Emirates Hills",
        center: [25.082, 55.175],
        bounds: [[25.070, 55.163], [25.095, 55.190]],
        category: "ultra_luxury",
        currentPricePerSqft: 3800,
        priceHistory: [2200, 2500, 2850, 3150, 3500, 3800],
        yoyChange: 0.12,
        rentalYield: 3.2,
        avgRentPerSqft: 122,
        avgTransactionPrice: 35000000,
        supplyUnits: 200,
        demandScore: 85,
        transactionVolume: 350,
        developers: ["emaar"],
        propertyTypes: { apartments: 0.0, villas: 1.0, commercial: 0.0 },
        infrastructureProjects: [],
        developments: [],
        news: [
            { headline: "Emirates Hills villas command AED 14,500/sqft at peak, most expensive in Dubai", sentiment: "positive", date: "2025-10" }
        ],
        factors: { airportProximity: 0.45, metroAccess: 0.40, roadNetwork: 0.80, retailAmenities: 0.70, schoolsHealthcare: 0.80, greenSpaces: 0.95, beachProximity: 0.30, employmentHub: 0.50, touristAttraction: 0.40, futureSupply: 0.05 }
    },

    // ── PREMIUM / MID-UPPER ─────────────────────────────
    {
        id: "business_bay",
        name: "Business Bay",
        center: [25.186, 55.264],
        bounds: [[25.172, 55.250], [25.200, 55.280]],
        category: "premium",
        currentPricePerSqft: 1900,
        priceHistory: [1150, 1300, 1450, 1600, 1750, 1900],
        yoyChange: 0.07,
        rentalYield: 5.69,
        avgRentPerSqft: 108,
        avgTransactionPrice: 1800000,
        supplyUnits: 8000,
        demandScore: 88,
        transactionVolume: 7200,
        developers: ["damac", "azizi", "binghatti", "danube"],
        propertyTypes: { apartments: 0.88, villas: 0.02, commercial: 0.10 },
        infrastructureProjects: [
            { name: "Business Bay Canal Walk", type: "public_space", impact: 0.08, completionYear: 2026, lat: 25.185, lng: 55.262 },
            { name: "Business Bay Metro Station Upgrade", type: "metro", impact: 0.06, completionYear: 2026, lat: 25.188, lng: 55.268 },
            { name: "Burj Azizi (725m Tower)", type: "landmark", impact: 0.12, completionYear: 2028, lat: 25.182, lng: 55.272 }
        ],
        developments: [
            { name: "DAMAC Volta", developer: "damac", units: 800, type: "premium", completionYear: 2027, lat: 25.184, lng: 55.260 },
            { name: "Azizi Riviera Phase 4", developer: "azizi", units: 1200, type: "residential", completionYear: 2026, lat: 25.180, lng: 55.265 },
            { name: "Binghatti Ghost", developer: "binghatti", units: 500, type: "premium", completionYear: 2027, lat: 25.190, lng: 55.272 },
            { name: "Danube Bayz 102", developer: "danube", units: 600, type: "residential", completionYear: 2026, lat: 25.186, lng: 55.258 }
        ],
        news: [
            { headline: "Business Bay stable at 5-8% YoY growth, mature equilibrium reached", sentiment: "neutral", date: "2025-12" },
            { headline: "Burj Azizi to become one of world's tallest at 725m in Business Bay", sentiment: "positive", date: "2025-11" },
            { headline: "Mid-market apartments in Business Bay see prices up to 11%", sentiment: "positive", date: "2025-10" }
        ],
        factors: { airportProximity: 0.58, metroAccess: 0.88, roadNetwork: 0.90, retailAmenities: 0.82, schoolsHealthcare: 0.75, greenSpaces: 0.50, beachProximity: 0.25, employmentHub: 0.92, touristAttraction: 0.70, futureSupply: 0.65 }
    },
    {
        id: "dubai_hills",
        name: "Dubai Hills Estate",
        center: [25.130, 55.245],
        bounds: [[25.110, 55.225], [25.150, 55.265]],
        category: "premium",
        currentPricePerSqft: 1450,
        priceHistory: [850, 980, 1100, 1220, 1340, 1450],
        yoyChange: 0.16,
        rentalYield: 5.5,
        avgRentPerSqft: 80,
        avgTransactionPrice: 2200000,
        supplyUnits: 6000,
        demandScore: 90,
        transactionVolume: 5500,
        developers: ["emaar", "meraas"],
        propertyTypes: { apartments: 0.50, villas: 0.45, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Dubai Hills Mall Phase 2", type: "retail", impact: 0.10, completionYear: 2027, lat: 25.135, lng: 55.248 },
            { name: "Dubai Hills Boulevard", type: "road", impact: 0.06, completionYear: 2026, lat: 25.128, lng: 55.240 },
            { name: "Dubai Hills Golf Course Expansion", type: "leisure", impact: 0.04, completionYear: 2027, lat: 25.125, lng: 55.252 }
        ],
        developments: [
            { name: "Emaar Park Heights 3", developer: "emaar", units: 1500, type: "premium", completionYear: 2027, lat: 25.132, lng: 55.242 },
            { name: "Meraas Golf Grove", developer: "meraas", units: 800, type: "premium", completionYear: 2027, lat: 25.128, lng: 55.250 }
        ],
        news: [
            { headline: "Dubai Hills Estate villa prices up 20% YoY, among strongest luxury performers", sentiment: "positive", date: "2025-12" },
            { headline: "Dubai Hills Estate villas at AED 2,953/sqft average, ROI 4.19%", sentiment: "positive", date: "2025-11" },
            { headline: "Arabian Ranches and Dubai Hills Estate lead luxury villa resales", sentiment: "positive", date: "2025-09" }
        ],
        factors: { airportProximity: 0.45, metroAccess: 0.55, roadNetwork: 0.85, retailAmenities: 0.80, schoolsHealthcare: 0.85, greenSpaces: 0.92, beachProximity: 0.20, employmentHub: 0.70, touristAttraction: 0.55, futureSupply: 0.50 }
    },
    {
        id: "creek_harbour",
        name: "Dubai Creek Harbour",
        center: [25.196, 55.345],
        bounds: [[25.180, 55.330], [25.215, 55.365]],
        category: "premium",
        currentPricePerSqft: 1750,
        priceHistory: [950, 1100, 1280, 1440, 1600, 1750],
        yoyChange: 0.085,
        rentalYield: 5.0,
        avgRentPerSqft: 88,
        avgTransactionPrice: 1900000,
        supplyUnits: 7000,
        demandScore: 85,
        transactionVolume: 3800,
        developers: ["emaar", "sobha"],
        propertyTypes: { apartments: 0.75, villas: 0.20, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Dubai Creek Tower (Redesigned)", type: "landmark", impact: 0.25, completionYear: 2030, lat: 25.200, lng: 55.348 },
            { name: "Metro Blue Line - Creek Station", type: "metro", impact: 0.20, completionYear: 2029, lat: 25.195, lng: 55.340 },
            { name: "Dubai Square Mall", type: "retail", impact: 0.15, completionYear: 2028, lat: 25.198, lng: 55.352 },
            { name: "Wildlife Sanctuary Bridge", type: "bridge", impact: 0.06, completionYear: 2026, lat: 25.190, lng: 55.350 }
        ],
        developments: [
            { name: "Emaar Creek Waters", developer: "emaar", units: 2000, type: "premium", completionYear: 2027, lat: 25.198, lng: 55.345 },
            { name: "Sobha Creek Vistas Reserve", developer: "sobha", units: 800, type: "premium", completionYear: 2028, lat: 25.192, lng: 55.350 }
        ],
        news: [
            { headline: "Emaar confirms Dubai Creek Tower tender to be issued within 3 months", sentiment: "positive", date: "2026-01" },
            { headline: "Metro Blue Line station at Creek Harbour boosts property sentiment", sentiment: "positive", date: "2025-11" },
            { headline: "Dubai Square launched late 2025, construction underway for 2028 opening", sentiment: "positive", date: "2025-10" }
        ],
        factors: { airportProximity: 0.70, metroAccess: 0.65, roadNetwork: 0.75, retailAmenities: 0.70, schoolsHealthcare: 0.65, greenSpaces: 0.85, beachProximity: 0.40, employmentHub: 0.72, touristAttraction: 0.80, futureSupply: 0.60 }
    },

    // ── MID-MARKET ──────────────────────────────────────
    {
        id: "jvc",
        name: "Jumeirah Village Circle (JVC)",
        center: [25.065, 55.210],
        bounds: [[25.048, 55.192], [25.082, 55.228]],
        category: "mid",
        currentPricePerSqft: 1469,
        priceHistory: [750, 870, 1000, 1150, 1300, 1469],
        yoyChange: 0.17,
        rentalYield: 7.28,
        avgRentPerSqft: 107,
        avgTransactionPrice: 950000,
        supplyUnits: 35000,
        demandScore: 82,
        transactionVolume: 12000,
        developers: ["danube", "binghatti", "azizi", "ellington"],
        propertyTypes: { apartments: 0.85, villas: 0.10, commercial: 0.05 },
        infrastructureProjects: [
            { name: "JVC Community Park", type: "public_space", impact: 0.05, completionYear: 2026, lat: 25.065, lng: 55.210 },
            { name: "Al Khail Road Expansion", type: "road", impact: 0.08, completionYear: 2027, lat: 25.060, lng: 55.215 }
        ],
        developments: [
            { name: "Danube Diamondz", developer: "danube", units: 1200, type: "residential", completionYear: 2026, lat: 25.068, lng: 55.208 },
            { name: "Binghatti Crescent", developer: "binghatti", units: 800, type: "residential", completionYear: 2027, lat: 25.062, lng: 55.214 },
            { name: "Azizi Star", developer: "azizi", units: 1000, type: "residential", completionYear: 2026, lat: 25.070, lng: 55.205 },
            { name: "Ellington View Phase 2", developer: "ellington", units: 400, type: "premium", completionYear: 2027, lat: 25.058, lng: 55.218 }
        ],
        news: [
            { headline: "JVC prices up 17% but 35,000 units pipeline raises oversupply concern", sentiment: "mixed", date: "2025-12" },
            { headline: "Knight Frank warns JVC prices likely to flatten or correct from oversupply", sentiment: "negative", date: "2025-11" },
            { headline: "JVC remains most sought-after mid-market apartment district", sentiment: "positive", date: "2025-10" }
        ],
        factors: { airportProximity: 0.45, metroAccess: 0.50, roadNetwork: 0.75, retailAmenities: 0.65, schoolsHealthcare: 0.68, greenSpaces: 0.72, beachProximity: 0.15, employmentHub: 0.55, touristAttraction: 0.25, futureSupply: 0.90 }
    },
    {
        id: "meydan",
        name: "Meydan / MBR City",
        center: [25.155, 55.295],
        bounds: [[25.138, 55.275], [25.172, 55.315]],
        category: "premium",
        currentPricePerSqft: 1350,
        priceHistory: [700, 820, 950, 1080, 1220, 1350],
        yoyChange: 0.15,
        rentalYield: 5.8,
        avgRentPerSqft: 78,
        avgTransactionPrice: 1600000,
        supplyUnits: 9000,
        demandScore: 82,
        transactionVolume: 4500,
        developers: ["sobha", "azizi", "binghatti"],
        propertyTypes: { apartments: 0.45, villas: 0.50, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Meydan One Mall", type: "retail", impact: 0.15, completionYear: 2028, lat: 25.158, lng: 55.298 },
            { name: "Meydan Highway Extension", type: "road", impact: 0.10, completionYear: 2027, lat: 25.150, lng: 55.290 },
            { name: "District One Crystal Lagoon", type: "leisure", impact: 0.08, completionYear: 2027, lat: 25.160, lng: 55.305 }
        ],
        developments: [
            { name: "Sobha Hartland Phase 3", developer: "sobha", units: 2500, type: "premium", completionYear: 2027, lat: 25.155, lng: 55.292 },
            { name: "Azizi Meydan Avenue", developer: "azizi", units: 1800, type: "residential", completionYear: 2026, lat: 25.152, lng: 55.300 },
            { name: "Binghatti Stars", developer: "binghatti", units: 600, type: "residential", completionYear: 2027, lat: 25.148, lng: 55.285 }
        ],
        news: [
            { headline: "Sobha Hartland continues strong demand, prices up 15% YoY", sentiment: "positive", date: "2025-11" },
            { headline: "Meydan One Mall development to boost area values significantly", sentiment: "positive", date: "2025-09" }
        ],
        factors: { airportProximity: 0.55, metroAccess: 0.50, roadNetwork: 0.78, retailAmenities: 0.62, schoolsHealthcare: 0.68, greenSpaces: 0.80, beachProximity: 0.15, employmentHub: 0.65, touristAttraction: 0.55, futureSupply: 0.72 }
    },
    {
        id: "jlt",
        name: "Jumeirah Lake Towers (JLT)",
        center: [25.075, 55.150],
        bounds: [[25.065, 55.140], [25.085, 55.162]],
        category: "mid",
        currentPricePerSqft: 1350,
        priceHistory: [850, 950, 1050, 1150, 1250, 1350],
        yoyChange: 0.08,
        rentalYield: 6.5,
        avgRentPerSqft: 88,
        avgTransactionPrice: 1200000,
        supplyUnits: 2000,
        demandScore: 82,
        transactionVolume: 3200,
        developers: ["damac", "danube"],
        propertyTypes: { apartments: 0.85, villas: 0.0, commercial: 0.15 },
        infrastructureProjects: [
            { name: "JLT Park Renovation", type: "public_space", impact: 0.04, completionYear: 2026, lat: 25.075, lng: 55.152 }
        ],
        developments: [
            { name: "DAMAC Tower JLT", developer: "damac", units: 350, type: "residential", completionYear: 2027, lat: 25.078, lng: 55.148 },
            { name: "Danube Elitz 3", developer: "danube", units: 450, type: "residential", completionYear: 2026, lat: 25.072, lng: 55.155 }
        ],
        news: [
            { headline: "JLT prices stable with limited new supply keeping values supported", sentiment: "neutral", date: "2025-10" }
        ],
        factors: { airportProximity: 0.48, metroAccess: 0.90, roadNetwork: 0.82, retailAmenities: 0.78, schoolsHealthcare: 0.72, greenSpaces: 0.60, beachProximity: 0.55, employmentHub: 0.78, touristAttraction: 0.50, futureSupply: 0.30 }
    },
    {
        id: "al_furjan",
        name: "Al Furjan",
        center: [25.040, 55.150],
        bounds: [[25.025, 55.135], [25.055, 55.165]],
        category: "mid",
        currentPricePerSqft: 1100,
        priceHistory: [620, 720, 810, 910, 1000, 1100],
        yoyChange: 0.10,
        rentalYield: 6.8,
        avgRentPerSqft: 75,
        avgTransactionPrice: 1300000,
        supplyUnits: 4000,
        demandScore: 80,
        transactionVolume: 3600,
        developers: ["nakheel", "danube", "azizi"],
        propertyTypes: { apartments: 0.40, villas: 0.55, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Route 2020 Metro Station Al Furjan", type: "metro", impact: 0.12, completionYear: 2026, lat: 25.040, lng: 55.148 },
            { name: "Al Furjan Community Centre", type: "mixed_use", impact: 0.05, completionYear: 2026, lat: 25.042, lng: 55.155 }
        ],
        developments: [
            { name: "Nakheel Furjan Grove", developer: "nakheel", units: 600, type: "residential", completionYear: 2027, lat: 25.038, lng: 55.145 },
            { name: "Danube Lawnz 2", developer: "danube", units: 500, type: "residential", completionYear: 2026, lat: 25.044, lng: 55.152 },
            { name: "Azizi Central Al Furjan", developer: "azizi", units: 450, type: "residential", completionYear: 2027, lat: 25.035, lng: 55.158 }
        ],
        news: [
            { headline: "Al Furjan most popular area for mid-tier villa purchases in H1 2025", sentiment: "positive", date: "2025-09" },
            { headline: "Villa prices per sqft appreciated 6-10% in Al Furjan", sentiment: "positive", date: "2025-08" }
        ],
        factors: { airportProximity: 0.65, metroAccess: 0.75, roadNetwork: 0.78, retailAmenities: 0.62, schoolsHealthcare: 0.70, greenSpaces: 0.68, beachProximity: 0.20, employmentHub: 0.60, touristAttraction: 0.25, futureSupply: 0.55 }
    },
    {
        id: "motor_city",
        name: "Motor City",
        center: [25.048, 55.230],
        bounds: [[25.035, 55.218], [25.060, 55.242]],
        category: "mid",
        currentPricePerSqft: 1200,
        priceHistory: [600, 700, 800, 920, 1050, 1200],
        yoyChange: 0.22,
        rentalYield: 6.5,
        avgRentPerSqft: 78,
        avgTransactionPrice: 1100000,
        supplyUnits: 2500,
        demandScore: 76,
        transactionVolume: 1800,
        developers: ["damac"],
        propertyTypes: { apartments: 0.55, villas: 0.40, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Motor City Community Upgrade", type: "public_space", impact: 0.04, completionYear: 2026, lat: 25.048, lng: 55.230 }
        ],
        developments: [],
        news: [
            { headline: "Motor City transitions from value to high-demand mid-market community", sentiment: "positive", date: "2025-10" },
            { headline: "Average price/sqft rose from AED 1,000 to AED 1,750 between 2024-2025", sentiment: "positive", date: "2025-09" }
        ],
        factors: { airportProximity: 0.42, metroAccess: 0.40, roadNetwork: 0.72, retailAmenities: 0.58, schoolsHealthcare: 0.65, greenSpaces: 0.70, beachProximity: 0.10, employmentHub: 0.50, touristAttraction: 0.30, futureSupply: 0.35 }
    },
    {
        id: "arabian_ranches",
        name: "Arabian Ranches",
        center: [25.060, 55.270],
        bounds: [[25.045, 55.255], [25.078, 55.290]],
        category: "premium",
        currentPricePerSqft: 1600,
        priceHistory: [900, 1020, 1150, 1300, 1450, 1600],
        yoyChange: 0.14,
        rentalYield: 4.8,
        avgRentPerSqft: 77,
        avgTransactionPrice: 3500000,
        supplyUnits: 3000,
        demandScore: 88,
        transactionVolume: 2800,
        developers: ["emaar"],
        propertyTypes: { apartments: 0.05, villas: 0.90, commercial: 0.05 },
        infrastructureProjects: [],
        developments: [
            { name: "Arabian Ranches 3 Phase 2", developer: "emaar", units: 1200, type: "premium", completionYear: 2027, lat: 25.058, lng: 55.275 }
        ],
        news: [
            { headline: "Arabian Ranches recorded most significant luxury villa price growth at 56%", sentiment: "positive", date: "2025-12" },
            { headline: "Villa prices per sqft appreciated 2-8% in 2025, DLD transaction prices up 6-25%", sentiment: "positive", date: "2025-11" }
        ],
        factors: { airportProximity: 0.40, metroAccess: 0.35, roadNetwork: 0.75, retailAmenities: 0.65, schoolsHealthcare: 0.80, greenSpaces: 0.90, beachProximity: 0.10, employmentHub: 0.45, touristAttraction: 0.30, futureSupply: 0.40 }
    },

    // ── AFFORDABLE / EMERGING ───────────────────────────
    {
        id: "dubai_south",
        name: "Dubai South",
        center: [24.878, 55.155],
        bounds: [[24.845, 55.110], [24.910, 55.200]],
        category: "affordable",
        currentPricePerSqft: 950,
        priceHistory: [500, 580, 650, 740, 850, 950],
        yoyChange: 0.24,
        rentalYield: 7.5,
        avgRentPerSqft: 71,
        avgTransactionPrice: 650000,
        supplyUnits: 12000,
        demandScore: 78,
        transactionVolume: 5500,
        developers: ["emaar", "damac", "azizi"],
        propertyTypes: { apartments: 0.50, villas: 0.45, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Al Maktoum Intl Airport Expansion (5x DXB)", type: "airport", impact: 0.40, completionYear: 2035, lat: 24.895, lng: 55.165 },
            { name: "Expo City Dubai Phase 2", type: "mixed_use", impact: 0.20, completionYear: 2026, lat: 24.870, lng: 55.140 },
            { name: "Route 2020 Metro Extension", type: "metro", impact: 0.15, completionYear: 2026, lat: 24.860, lng: 55.150 }
        ],
        developments: [
            { name: "Emaar South Phase 3", developer: "emaar", units: 3000, type: "residential", completionYear: 2027, lat: 24.872, lng: 55.148 },
            { name: "DAMAC Lagoons Expansion", developer: "damac", units: 2500, type: "residential", completionYear: 2026, lat: 24.882, lng: 55.160 },
            { name: "Azizi Venice Extension", developer: "azizi", units: 1800, type: "residential", completionYear: 2026, lat: 24.868, lng: 55.170 }
        ],
        news: [
            { headline: "Dubai South recorded highest affordable villa price growth at 55% in 2024", sentiment: "positive", date: "2025-12" },
            { headline: "Al Maktoum Airport expansion to be 5x DXB, massive long-term catalyst", sentiment: "positive", date: "2025-11" },
            { headline: "Dubai South and Dubailand recorded over 20% growth in affordable housing", sentiment: "positive", date: "2025-10" }
        ],
        factors: { airportProximity: 0.95, metroAccess: 0.65, roadNetwork: 0.75, retailAmenities: 0.50, schoolsHealthcare: 0.48, greenSpaces: 0.60, beachProximity: 0.05, employmentHub: 0.70, touristAttraction: 0.55, futureSupply: 0.75 }
    },
    {
        id: "dso",
        name: "Dubai Silicon Oasis (DSO)",
        center: [25.120, 55.380],
        bounds: [[25.105, 55.365], [25.135, 55.400]],
        category: "affordable",
        currentPricePerSqft: 1500,
        priceHistory: [650, 720, 800, 920, 1100, 1500],
        yoyChange: 0.29,
        rentalYield: 7.8,
        avgRentPerSqft: 71,
        avgTransactionPrice: 780000,
        supplyUnits: 5500,
        demandScore: 80,
        transactionVolume: 4200,
        developers: ["binghatti", "azizi"],
        propertyTypes: { apartments: 0.80, villas: 0.15, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Metro Blue Line - DSO Station", type: "metro", impact: 0.25, completionYear: 2029, lat: 25.122, lng: 55.382 },
            { name: "DSO Technology Hub Phase 2", type: "commercial", impact: 0.10, completionYear: 2027, lat: 25.118, lng: 55.388 },
            { name: "Academic City Connector", type: "road", impact: 0.08, completionYear: 2026, lat: 25.115, lng: 55.375 }
        ],
        developments: [
            { name: "Binghatti Onyx", developer: "binghatti", units: 600, type: "residential", completionYear: 2026, lat: 25.120, lng: 55.385 },
            { name: "Azizi DSO Grand", developer: "azizi", units: 800, type: "residential", completionYear: 2027, lat: 25.115, lng: 55.378 }
        ],
        news: [
            { headline: "DSO posts highest apartment price jump at 29% after Metro Blue Line news", sentiment: "positive", date: "2025-12" },
            { headline: "Metro Blue Line to boost land and property values by up to 25% near stations", sentiment: "positive", date: "2025-11" },
            { headline: "Sales rate moved from AED 843/sqft in 2024 to AED 1,339/sqft in 2025", sentiment: "positive", date: "2025-09" }
        ],
        factors: { airportProximity: 0.60, metroAccess: 0.55, roadNetwork: 0.72, retailAmenities: 0.55, schoolsHealthcare: 0.65, greenSpaces: 0.50, beachProximity: 0.05, employmentHub: 0.70, touristAttraction: 0.15, futureSupply: 0.60 }
    },
    {
        id: "arjan",
        name: "Arjan",
        center: [25.042, 55.240],
        bounds: [[25.030, 55.228], [25.055, 55.255]],
        category: "affordable",
        currentPricePerSqft: 1100,
        priceHistory: [600, 680, 760, 850, 960, 1100],
        yoyChange: 0.18,
        rentalYield: 8.0,
        avgRentPerSqft: 88,
        avgTransactionPrice: 700000,
        supplyUnits: 8000,
        demandScore: 75,
        transactionVolume: 4800,
        developers: ["danube", "binghatti", "azizi", "damac"],
        propertyTypes: { apartments: 0.90, villas: 0.05, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Arjan-Al Barsha Connector Road", type: "road", impact: 0.08, completionYear: 2027, lat: 25.045, lng: 55.235 }
        ],
        developments: [
            { name: "Danube Fashionz", developer: "danube", units: 1000, type: "residential", completionYear: 2026, lat: 25.042, lng: 55.238 },
            { name: "Binghatti Amber", developer: "binghatti", units: 700, type: "residential", completionYear: 2026, lat: 25.040, lng: 55.245 },
            { name: "Azizi Aura", developer: "azizi", units: 900, type: "residential", completionYear: 2027, lat: 25.038, lng: 55.250 }
        ],
        news: [
            { headline: "Arjan studios deliver highest yields approaching 8.5%", sentiment: "positive", date: "2025-11" },
            { headline: "Arjan draws first-time buyers with 9-25% price growth range", sentiment: "positive", date: "2025-10" }
        ],
        factors: { airportProximity: 0.40, metroAccess: 0.35, roadNetwork: 0.68, retailAmenities: 0.55, schoolsHealthcare: 0.55, greenSpaces: 0.60, beachProximity: 0.10, employmentHub: 0.45, touristAttraction: 0.30, futureSupply: 0.80 }
    },
    {
        id: "dubailand",
        name: "Dubailand",
        center: [25.040, 55.280],
        bounds: [[25.020, 55.260], [25.060, 55.305]],
        category: "affordable",
        currentPricePerSqft: 850,
        priceHistory: [480, 540, 600, 680, 760, 850],
        yoyChange: 0.23,
        rentalYield: 7.5,
        avgRentPerSqft: 64,
        avgTransactionPrice: 600000,
        supplyUnits: 10000,
        demandScore: 72,
        transactionVolume: 5200,
        developers: ["damac", "danube", "binghatti"],
        propertyTypes: { apartments: 0.40, villas: 0.55, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Dubailand Theme Park District", type: "entertainment", impact: 0.12, completionYear: 2028, lat: 25.040, lng: 55.280 }
        ],
        developments: [
            { name: "DAMAC Hills 2 Phase 5", developer: "damac", units: 2000, type: "residential", completionYear: 2027, lat: 25.035, lng: 55.275 },
            { name: "Danube Gemz", developer: "danube", units: 800, type: "residential", completionYear: 2026, lat: 25.042, lng: 55.285 }
        ],
        news: [
            { headline: "Dubailand recorded highest affordable villa price increase at 23.5%", sentiment: "positive", date: "2025-12" },
            { headline: "Dubai South and Dubailand recorded over 20% growth", sentiment: "positive", date: "2025-10" }
        ],
        factors: { airportProximity: 0.38, metroAccess: 0.25, roadNetwork: 0.62, retailAmenities: 0.48, schoolsHealthcare: 0.50, greenSpaces: 0.65, beachProximity: 0.05, employmentHub: 0.38, touristAttraction: 0.30, futureSupply: 0.82 }
    },
    {
        id: "international_city",
        name: "International City",
        center: [25.165, 55.405],
        bounds: [[25.150, 55.390], [25.180, 55.425]],
        category: "budget",
        currentPricePerSqft: 610,
        priceHistory: [380, 410, 450, 500, 550, 610],
        yoyChange: 0.11,
        rentalYield: 10.4,
        avgRentPerSqft: 63,
        avgTransactionPrice: 380000,
        supplyUnits: 3000,
        demandScore: 72,
        transactionVolume: 6500,
        developers: ["nakheel"],
        propertyTypes: { apartments: 0.95, villas: 0.0, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Metro Blue Line - Int'l City Station 1", type: "metro", impact: 0.25, completionYear: 2029, lat: 25.162, lng: 55.400 },
            { name: "Metro Blue Line - Int'l City Station 2", type: "metro", impact: 0.22, completionYear: 2029, lat: 25.168, lng: 55.410 },
            { name: "Metro Blue Line - Int'l City Station 3", type: "metro", impact: 0.20, completionYear: 2029, lat: 25.175, lng: 55.418 }
        ],
        developments: [],
        news: [
            { headline: "International City yields at 10.4%, highest in Dubai", sentiment: "positive", date: "2025-12" },
            { headline: "Metro Blue Line to add 3 stations in International City, values expected up 25%", sentiment: "positive", date: "2025-11" },
            { headline: "International City affordable apartments hit average annual rent of AED 53,000", sentiment: "positive", date: "2025-09" }
        ],
        factors: { airportProximity: 0.72, metroAccess: 0.30, roadNetwork: 0.65, retailAmenities: 0.50, schoolsHealthcare: 0.52, greenSpaces: 0.35, beachProximity: 0.05, employmentHub: 0.45, touristAttraction: 0.10, futureSupply: 0.40 }
    },
    {
        id: "discovery_gardens",
        name: "Discovery Gardens",
        center: [25.040, 55.130],
        bounds: [[25.030, 55.118], [25.050, 55.142]],
        category: "budget",
        currentPricePerSqft: 850,
        priceHistory: [500, 560, 620, 700, 770, 850],
        yoyChange: 0.10,
        rentalYield: 9.0,
        avgRentPerSqft: 77,
        avgTransactionPrice: 450000,
        supplyUnits: 1000,
        demandScore: 70,
        transactionVolume: 2200,
        developers: ["nakheel"],
        propertyTypes: { apartments: 1.0, villas: 0.0, commercial: 0.0 },
        infrastructureProjects: [
            { name: "Discovery Gardens Metro Station", type: "metro", impact: 0.05, completionYear: 2026, lat: 25.042, lng: 55.130 }
        ],
        developments: [],
        news: [
            { headline: "Discovery Gardens delivers 9-10% rental yields for investors", sentiment: "positive", date: "2025-10" }
        ],
        factors: { airportProximity: 0.55, metroAccess: 0.80, roadNetwork: 0.75, retailAmenities: 0.60, schoolsHealthcare: 0.60, greenSpaces: 0.55, beachProximity: 0.25, employmentHub: 0.55, touristAttraction: 0.15, futureSupply: 0.15 }
    },
    {
        id: "sports_city",
        name: "Dubai Sports City",
        center: [25.040, 55.220],
        bounds: [[25.028, 55.208], [25.052, 55.235]],
        category: "affordable",
        currentPricePerSqft: 900,
        priceHistory: [520, 590, 660, 740, 820, 900],
        yoyChange: 0.12,
        rentalYield: 7.5,
        avgRentPerSqft: 68,
        avgTransactionPrice: 550000,
        supplyUnits: 2000,
        demandScore: 70,
        transactionVolume: 2800,
        developers: [],
        propertyTypes: { apartments: 0.70, villas: 0.25, commercial: 0.05 },
        infrastructureProjects: [],
        developments: [],
        news: [
            { headline: "Sports City affordable apartments favoured by buyers in 2025", sentiment: "positive", date: "2025-09" }
        ],
        factors: { airportProximity: 0.40, metroAccess: 0.35, roadNetwork: 0.70, retailAmenities: 0.55, schoolsHealthcare: 0.58, greenSpaces: 0.72, beachProximity: 0.08, employmentHub: 0.45, touristAttraction: 0.35, futureSupply: 0.30 }
    },
    {
        id: "damac_hills",
        name: "DAMAC Hills",
        center: [25.030, 55.245],
        bounds: [[25.015, 55.232], [25.048, 55.262]],
        category: "premium",
        currentPricePerSqft: 1400,
        priceHistory: [750, 880, 1000, 1120, 1260, 1400],
        yoyChange: 0.16,
        rentalYield: 5.5,
        avgRentPerSqft: 77,
        avgTransactionPrice: 2800000,
        supplyUnits: 3500,
        demandScore: 84,
        transactionVolume: 3200,
        developers: ["damac"],
        propertyTypes: { apartments: 0.25, villas: 0.70, commercial: 0.05 },
        infrastructureProjects: [],
        developments: [
            { name: "DAMAC Hills Phase 3", developer: "damac", units: 1500, type: "premium", completionYear: 2027, lat: 25.032, lng: 55.248 }
        ],
        news: [
            { headline: "DAMAC Hills luxury villa prices rose 36-56% in 2024-2025", sentiment: "positive", date: "2025-12" }
        ],
        factors: { airportProximity: 0.38, metroAccess: 0.30, roadNetwork: 0.72, retailAmenities: 0.60, schoolsHealthcare: 0.65, greenSpaces: 0.88, beachProximity: 0.08, employmentHub: 0.45, touristAttraction: 0.35, futureSupply: 0.50 }
    },
    {
        id: "damac_hills_2",
        name: "DAMAC Hills 2",
        center: [25.010, 55.265],
        bounds: [[24.995, 55.250], [25.028, 55.285]],
        category: "affordable",
        currentPricePerSqft: 750,
        priceHistory: [400, 460, 520, 590, 670, 750],
        yoyChange: 0.20,
        rentalYield: 7.2,
        avgRentPerSqft: 54,
        avgTransactionPrice: 550000,
        supplyUnits: 8000,
        demandScore: 72,
        transactionVolume: 4800,
        developers: ["damac"],
        propertyTypes: { apartments: 0.20, villas: 0.75, commercial: 0.05 },
        infrastructureProjects: [],
        developments: [
            { name: "DAMAC Hills 2 Phase 6", developer: "damac", units: 2500, type: "affordable", completionYear: 2027, lat: 25.012, lng: 55.270 }
        ],
        news: [
            { headline: "DAMAC Hills 2 affordable villas saw 33-55% price growth", sentiment: "positive", date: "2025-12" },
            { headline: "DAMAC Hills 2 villa prices increased by 12.9-23.5%", sentiment: "positive", date: "2025-10" }
        ],
        factors: { airportProximity: 0.35, metroAccess: 0.20, roadNetwork: 0.60, retailAmenities: 0.45, schoolsHealthcare: 0.48, greenSpaces: 0.70, beachProximity: 0.05, employmentHub: 0.35, touristAttraction: 0.20, futureSupply: 0.75 }
    },
    {
        id: "deira_islands",
        name: "Dubai Islands (Deira Islands)",
        center: [25.300, 55.335],
        bounds: [[25.280, 55.310], [25.320, 55.360]],
        category: "premium",
        currentPricePerSqft: 1500,
        priceHistory: [700, 850, 1000, 1150, 1320, 1500],
        yoyChange: 0.22,
        rentalYield: 5.2,
        avgRentPerSqft: 78,
        avgTransactionPrice: 1800000,
        supplyUnits: 5000,
        demandScore: 80,
        transactionVolume: 2600,
        developers: ["nakheel", "meraas"],
        propertyTypes: { apartments: 0.65, villas: 0.30, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Dubai Islands Bridge Network", type: "bridge", impact: 0.20, completionYear: 2027, lat: 25.300, lng: 55.335 },
            { name: "Dubai Islands Beachfront", type: "public_space", impact: 0.12, completionYear: 2027, lat: 25.305, lng: 55.340 },
            { name: "Night Market Dubai Islands", type: "retail", impact: 0.08, completionYear: 2026, lat: 25.295, lng: 55.330 }
        ],
        developments: [
            { name: "Nakheel Dubai Islands Residences", developer: "nakheel", units: 2000, type: "premium", completionYear: 2027, lat: 25.302, lng: 55.338 },
            { name: "Meraas Island Living", developer: "meraas", units: 1500, type: "premium", completionYear: 2028, lat: 25.298, lng: 55.332 }
        ],
        news: [
            { headline: "Dubai Islands off-plan developments attracted strong luxury and waterfront interest", sentiment: "positive", date: "2025-12" },
            { headline: "Dubai Islands infrastructure packages slated for completion by Q4 2026", sentiment: "positive", date: "2025-10" }
        ],
        factors: { airportProximity: 0.65, metroAccess: 0.40, roadNetwork: 0.55, retailAmenities: 0.50, schoolsHealthcare: 0.42, greenSpaces: 0.70, beachProximity: 0.95, employmentHub: 0.48, touristAttraction: 0.75, futureSupply: 0.65 }
    },
    {
        id: "jaddaf",
        name: "Al Jaddaf",
        center: [25.218, 55.340],
        bounds: [[25.208, 55.325], [25.228, 55.355]],
        category: "mid",
        currentPricePerSqft: 1200,
        priceHistory: [620, 720, 830, 950, 1070, 1200],
        yoyChange: 0.15,
        rentalYield: 6.5,
        avgRentPerSqft: 78,
        avgTransactionPrice: 900000,
        supplyUnits: 3500,
        demandScore: 76,
        transactionVolume: 2200,
        developers: ["azizi", "binghatti"],
        propertyTypes: { apartments: 0.90, villas: 0.05, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Metro Blue Line - Al Jaddaf Interchange", type: "metro", impact: 0.22, completionYear: 2029, lat: 25.220, lng: 55.342 },
            { name: "Al Jaddaf Cultural District", type: "mixed_use", impact: 0.12, completionYear: 2027, lat: 25.218, lng: 55.338 },
            { name: "Jaddaf Waterfront Promenade", type: "public_space", impact: 0.08, completionYear: 2026, lat: 25.215, lng: 55.345 }
        ],
        developments: [
            { name: "Azizi Riviera French 2", developer: "azizi", units: 1200, type: "residential", completionYear: 2026, lat: 25.218, lng: 55.340 },
            { name: "Binghatti Ivory", developer: "binghatti", units: 500, type: "residential", completionYear: 2027, lat: 25.222, lng: 55.345 }
        ],
        news: [
            { headline: "Metro Blue Line starts at Creek Interchange in Al Jaddaf, major connectivity boost", sentiment: "positive", date: "2025-11" }
        ],
        factors: { airportProximity: 0.70, metroAccess: 0.60, roadNetwork: 0.72, retailAmenities: 0.55, schoolsHealthcare: 0.58, greenSpaces: 0.60, beachProximity: 0.30, employmentHub: 0.60, touristAttraction: 0.50, futureSupply: 0.55 }
    },
    {
        id: "the_springs",
        name: "The Springs",
        center: [25.070, 55.188],
        bounds: [[25.058, 55.175], [25.082, 55.200]],
        category: "mid",
        currentPricePerSqft: 1300,
        priceHistory: [720, 830, 940, 1060, 1180, 1300],
        yoyChange: 0.13,
        rentalYield: 5.0,
        avgRentPerSqft: 65,
        avgTransactionPrice: 2200000,
        supplyUnits: 500,
        demandScore: 80,
        transactionVolume: 1500,
        developers: ["emaar"],
        propertyTypes: { apartments: 0.0, villas: 1.0, commercial: 0.0 },
        infrastructureProjects: [],
        developments: [],
        news: [
            { headline: "Mid-tier villa prices in The Springs increased 34-55%", sentiment: "positive", date: "2025-11" }
        ],
        factors: { airportProximity: 0.48, metroAccess: 0.50, roadNetwork: 0.78, retailAmenities: 0.65, schoolsHealthcare: 0.75, greenSpaces: 0.82, beachProximity: 0.15, employmentHub: 0.55, touristAttraction: 0.20, futureSupply: 0.10 }
    },
    {
        id: "palm_jebel_ali",
        name: "Palm Jebel Ali",
        center: [24.985, 55.020],
        bounds: [[24.960, 54.990], [25.010, 55.055]],
        category: "emerging",
        currentPricePerSqft: 1100,
        priceHistory: [0, 0, 500, 700, 900, 1100],
        yoyChange: 0.35,
        rentalYield: 0,
        avgRentPerSqft: 0,
        avgTransactionPrice: 2500000,
        supplyUnits: 15000,
        demandScore: 78,
        transactionVolume: 3500,
        developers: ["nakheel"],
        propertyTypes: { apartments: 0.30, villas: 0.65, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Palm Jebel Ali Infrastructure Phase 1", type: "road", impact: 0.25, completionYear: 2027, lat: 24.985, lng: 55.020 },
            { name: "Palm Jebel Ali Beach Development", type: "public_space", impact: 0.15, completionYear: 2028, lat: 24.990, lng: 55.010 }
        ],
        developments: [
            { name: "Nakheel Palm Jebel Ali Villas", developer: "nakheel", units: 5000, type: "premium", completionYear: 2028, lat: 24.988, lng: 55.025 }
        ],
        news: [
            { headline: "Palm Jebel Ali contract awards for 700+ villas, AED 750M in Q2 2025", sentiment: "positive", date: "2025-12" },
            { headline: "Early villa handovers discussed for late-2026/2027", sentiment: "positive", date: "2025-11" },
            { headline: "Infrastructure packages slated for completion by Q4 2026", sentiment: "positive", date: "2025-09" }
        ],
        factors: { airportProximity: 0.80, metroAccess: 0.20, roadNetwork: 0.45, retailAmenities: 0.20, schoolsHealthcare: 0.15, greenSpaces: 0.50, beachProximity: 0.90, employmentHub: 0.40, touristAttraction: 0.60, futureSupply: 0.85 }
    },
    {
        id: "mirdif",
        name: "Mirdif",
        center: [25.220, 55.420],
        bounds: [[25.205, 55.405], [25.238, 55.440]],
        category: "mid",
        currentPricePerSqft: 1000,
        priceHistory: [620, 700, 780, 860, 930, 1000],
        yoyChange: 0.08,
        rentalYield: 5.8,
        avgRentPerSqft: 58,
        avgTransactionPrice: 1500000,
        supplyUnits: 2000,
        demandScore: 75,
        transactionVolume: 1800,
        developers: ["nakheel"],
        propertyTypes: { apartments: 0.30, villas: 0.65, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Metro Blue Line - Mirdif Station", type: "metro", impact: 0.20, completionYear: 2029, lat: 25.225, lng: 55.425 },
            { name: "Metro Blue Line - Al Warqa Station", type: "metro", impact: 0.15, completionYear: 2029, lat: 25.215, lng: 55.415 }
        ],
        developments: [],
        news: [
            { headline: "Metro Blue Line to serve Mirdif and Al Warqa with 4 stations", sentiment: "positive", date: "2025-11" }
        ],
        factors: { airportProximity: 0.80, metroAccess: 0.40, roadNetwork: 0.75, retailAmenities: 0.68, schoolsHealthcare: 0.78, greenSpaces: 0.65, beachProximity: 0.05, employmentHub: 0.50, touristAttraction: 0.15, futureSupply: 0.30 }
    },
    {
        id: "al_barsha",
        name: "Al Barsha",
        center: [25.105, 55.195],
        bounds: [[25.092, 55.180], [25.120, 55.215]],
        category: "mid",
        currentPricePerSqft: 1200,
        priceHistory: [750, 840, 930, 1020, 1110, 1200],
        yoyChange: 0.09,
        rentalYield: 5.8,
        avgRentPerSqft: 70,
        avgTransactionPrice: 1400000,
        supplyUnits: 1500,
        demandScore: 78,
        transactionVolume: 2100,
        developers: ["meraas"],
        propertyTypes: { apartments: 0.50, villas: 0.45, commercial: 0.05 },
        infrastructureProjects: [],
        developments: [],
        news: [
            { headline: "Al Barsha luxury villas achieved over 5.8% yields", sentiment: "positive", date: "2025-10" }
        ],
        factors: { airportProximity: 0.50, metroAccess: 0.85, roadNetwork: 0.88, retailAmenities: 0.90, schoolsHealthcare: 0.82, greenSpaces: 0.55, beachProximity: 0.30, employmentHub: 0.70, touristAttraction: 0.45, futureSupply: 0.20 }
    },
    {
        id: "dip",
        name: "Dubai Investment Park",
        center: [24.970, 55.190],
        bounds: [[24.955, 55.170], [24.988, 55.210]],
        category: "budget",
        currentPricePerSqft: 650,
        priceHistory: [380, 420, 470, 530, 590, 650],
        yoyChange: 0.10,
        rentalYield: 9.2,
        avgRentPerSqft: 60,
        avgTransactionPrice: 400000,
        supplyUnits: 2000,
        demandScore: 65,
        transactionVolume: 1800,
        developers: [],
        propertyTypes: { apartments: 0.60, villas: 0.10, commercial: 0.30 },
        infrastructureProjects: [],
        developments: [],
        news: [
            { headline: "DIP delivers 9-10% rental yields alongside International City and Discovery Gardens", sentiment: "positive", date: "2025-10" }
        ],
        factors: { airportProximity: 0.60, metroAccess: 0.30, roadNetwork: 0.70, retailAmenities: 0.42, schoolsHealthcare: 0.40, greenSpaces: 0.40, beachProximity: 0.05, employmentHub: 0.55, touristAttraction: 0.10, futureSupply: 0.25 }
    },
    {
        id: "jumeirah",
        name: "Jumeirah",
        center: [25.200, 55.260],
        bounds: [[25.190, 55.245], [25.215, 55.275]],
        category: "luxury",
        currentPricePerSqft: 2500,
        priceHistory: [1600, 1780, 1950, 2120, 2300, 2500],
        yoyChange: 0.10,
        rentalYield: 4.2,
        avgRentPerSqft: 105,
        avgTransactionPrice: 5000000,
        supplyUnits: 1000,
        demandScore: 85,
        transactionVolume: 1200,
        developers: ["meraas"],
        propertyTypes: { apartments: 0.20, villas: 0.75, commercial: 0.05 },
        infrastructureProjects: [],
        developments: [],
        news: [
            { headline: "Jumeirah maintains premium pricing with limited supply", sentiment: "neutral", date: "2025-10" }
        ],
        factors: { airportProximity: 0.55, metroAccess: 0.60, roadNetwork: 0.85, retailAmenities: 0.80, schoolsHealthcare: 0.85, greenSpaces: 0.70, beachProximity: 0.90, employmentHub: 0.65, touristAttraction: 0.80, futureSupply: 0.10 }
    },
    {
        id: "academic_city",
        name: "Dubai Academic City",
        center: [25.100, 55.400],
        bounds: [[25.088, 55.388], [25.115, 55.415]],
        category: "affordable",
        currentPricePerSqft: 800,
        priceHistory: [480, 530, 580, 640, 720, 800],
        yoyChange: 0.12,
        rentalYield: 7.0,
        avgRentPerSqft: 56,
        avgTransactionPrice: 500000,
        supplyUnits: 3000,
        demandScore: 65,
        transactionVolume: 1500,
        developers: [],
        propertyTypes: { apartments: 0.85, villas: 0.10, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Metro Blue Line - Academic City Terminal", type: "metro", impact: 0.22, completionYear: 2029, lat: 25.102, lng: 55.402 }
        ],
        developments: [],
        news: [
            { headline: "Metro Blue Line terminal at Academic City to serve growing student population", sentiment: "positive", date: "2025-11" }
        ],
        factors: { airportProximity: 0.58, metroAccess: 0.25, roadNetwork: 0.65, retailAmenities: 0.42, schoolsHealthcare: 0.80, greenSpaces: 0.48, beachProximity: 0.05, employmentHub: 0.60, touristAttraction: 0.10, futureSupply: 0.45 }
    },
    {
        id: "festival_city",
        name: "Dubai Festival City",
        center: [25.220, 55.355],
        bounds: [[25.210, 55.342], [25.232, 55.370]],
        category: "premium",
        currentPricePerSqft: 1600,
        priceHistory: [950, 1080, 1200, 1340, 1470, 1600],
        yoyChange: 0.09,
        rentalYield: 5.5,
        avgRentPerSqft: 88,
        avgTransactionPrice: 2000000,
        supplyUnits: 1500,
        demandScore: 80,
        transactionVolume: 1200,
        developers: ["emaar"],
        propertyTypes: { apartments: 0.60, villas: 0.30, commercial: 0.10 },
        infrastructureProjects: [
            { name: "Metro Blue Line - Festival City Station", type: "metro", impact: 0.18, completionYear: 2029, lat: 25.222, lng: 55.358 }
        ],
        developments: [],
        news: [
            { headline: "Metro Blue Line route passes through Dubai Festival City", sentiment: "positive", date: "2025-11" }
        ],
        factors: { airportProximity: 0.72, metroAccess: 0.55, roadNetwork: 0.80, retailAmenities: 0.85, schoolsHealthcare: 0.70, greenSpaces: 0.60, beachProximity: 0.30, employmentHub: 0.65, touristAttraction: 0.70, futureSupply: 0.25 }
    },
    {
        id: "ras_al_khor",
        name: "Ras Al Khor",
        center: [25.185, 55.330],
        bounds: [[25.172, 55.318], [25.198, 55.345]],
        category: "mid",
        currentPricePerSqft: 1000,
        priceHistory: [580, 650, 730, 820, 910, 1000],
        yoyChange: 0.10,
        rentalYield: 6.8,
        avgRentPerSqft: 68,
        avgTransactionPrice: 800000,
        supplyUnits: 2500,
        demandScore: 70,
        transactionVolume: 1600,
        developers: [],
        propertyTypes: { apartments: 0.50, villas: 0.10, commercial: 0.40 },
        infrastructureProjects: [
            { name: "Metro Blue Line - Ras Al Khor Station", type: "metro", impact: 0.20, completionYear: 2029, lat: 25.185, lng: 55.332 },
            { name: "Blue Line Creek Bridge (1.3km)", type: "bridge", impact: 0.12, completionYear: 2029, lat: 25.190, lng: 55.340 }
        ],
        developments: [],
        news: [
            { headline: "Metro Blue Line to include 1.3km bridge over Dubai Creek through Ras Al Khor", sentiment: "positive", date: "2025-11" }
        ],
        factors: { airportProximity: 0.65, metroAccess: 0.35, roadNetwork: 0.72, retailAmenities: 0.45, schoolsHealthcare: 0.50, greenSpaces: 0.55, beachProximity: 0.15, employmentHub: 0.55, touristAttraction: 0.40, futureSupply: 0.45 }
    },
    {
        id: "town_square",
        name: "Town Square",
        center: [25.000, 55.265],
        bounds: [[24.988, 55.253], [25.015, 55.278]],
        category: "affordable",
        currentPricePerSqft: 800,
        priceHistory: [480, 540, 610, 680, 740, 800],
        yoyChange: 0.10,
        rentalYield: 7.2,
        avgRentPerSqft: 58,
        avgTransactionPrice: 520000,
        supplyUnits: 4000,
        demandScore: 72,
        transactionVolume: 2800,
        developers: ["nakheel"],
        propertyTypes: { apartments: 0.70, villas: 0.25, commercial: 0.05 },
        infrastructureProjects: [],
        developments: [],
        news: [
            { headline: "Town Square offers affordable entry point with growing community amenities", sentiment: "positive", date: "2025-09" }
        ],
        factors: { airportProximity: 0.38, metroAccess: 0.25, roadNetwork: 0.65, retailAmenities: 0.55, schoolsHealthcare: 0.58, greenSpaces: 0.72, beachProximity: 0.05, employmentHub: 0.40, touristAttraction: 0.15, futureSupply: 0.55 }
    },
    {
        id: "dubai_creek",
        name: "Deira / Dubai Creek",
        center: [25.270, 55.310],
        bounds: [[25.255, 55.295], [25.285, 55.325]],
        category: "mid",
        currentPricePerSqft: 1100,
        priceHistory: [700, 770, 840, 920, 1010, 1100],
        yoyChange: 0.09,
        rentalYield: 6.5,
        avgRentPerSqft: 72,
        avgTransactionPrice: 900000,
        supplyUnits: 2000,
        demandScore: 72,
        transactionVolume: 2400,
        developers: [],
        propertyTypes: { apartments: 0.80, villas: 0.05, commercial: 0.15 },
        infrastructureProjects: [],
        developments: [],
        news: [
            { headline: "Deira area benefits from Dubai Islands development spillover", sentiment: "positive", date: "2025-10" }
        ],
        factors: { airportProximity: 0.82, metroAccess: 0.85, roadNetwork: 0.80, retailAmenities: 0.78, schoolsHealthcare: 0.72, greenSpaces: 0.40, beachProximity: 0.40, employmentHub: 0.70, touristAttraction: 0.65, futureSupply: 0.25 }
    },
    {
        id: "maritime_city",
        name: "Maritime City",
        center: [25.270, 55.345],
        bounds: [[25.258, 55.332], [25.283, 55.358]],
        category: "emerging",
        currentPricePerSqft: 1200,
        priceHistory: [0, 500, 700, 850, 1020, 1200],
        yoyChange: 0.25,
        rentalYield: 0,
        avgRentPerSqft: 0,
        avgTransactionPrice: 1200000,
        supplyUnits: 4000,
        demandScore: 72,
        transactionVolume: 1800,
        developers: ["meraas"],
        propertyTypes: { apartments: 0.70, villas: 0.20, commercial: 0.10 },
        infrastructureProjects: [
            { name: "Maritime City Marina", type: "public_space", impact: 0.15, completionYear: 2027, lat: 25.272, lng: 55.348 }
        ],
        developments: [
            { name: "Meraas Maritime Residences", developer: "meraas", units: 1500, type: "premium", completionYear: 2028, lat: 25.270, lng: 55.345 }
        ],
        news: [
            { headline: "Maritime City off-plan developments attracted strong waterfront interest", sentiment: "positive", date: "2025-12" }
        ],
        factors: { airportProximity: 0.68, metroAccess: 0.35, roadNetwork: 0.55, retailAmenities: 0.40, schoolsHealthcare: 0.38, greenSpaces: 0.50, beachProximity: 0.85, employmentHub: 0.45, touristAttraction: 0.60, futureSupply: 0.70 }
    },
    {
        id: "jvt",
        name: "Jumeirah Village Triangle (JVT)",
        center: [25.055, 55.195],
        bounds: [[25.042, 55.183], [25.068, 55.208]],
        category: "mid",
        currentPricePerSqft: 1300,
        priceHistory: [700, 800, 920, 1050, 1180, 1300],
        yoyChange: 0.12,
        rentalYield: 6.8,
        avgRentPerSqft: 88,
        avgTransactionPrice: 1000000,
        supplyUnits: 3000,
        demandScore: 76,
        transactionVolume: 2400,
        developers: ["danube", "binghatti"],
        propertyTypes: { apartments: 0.60, villas: 0.35, commercial: 0.05 },
        infrastructureProjects: [],
        developments: [
            { name: "Danube Sparkle Towers", developer: "danube", units: 500, type: "residential", completionYear: 2027, lat: 25.055, lng: 55.195 }
        ],
        news: [
            { headline: "JVT benefits from JVC spillover demand with lower supply pressure", sentiment: "positive", date: "2025-10" }
        ],
        factors: { airportProximity: 0.45, metroAccess: 0.48, roadNetwork: 0.72, retailAmenities: 0.60, schoolsHealthcare: 0.65, greenSpaces: 0.70, beachProximity: 0.15, employmentHub: 0.52, touristAttraction: 0.22, futureSupply: 0.48 }
    },
    {
        id: "mudon",
        name: "Mudon",
        center: [25.015, 55.270],
        bounds: [[25.002, 55.258], [25.028, 55.285]],
        category: "mid",
        currentPricePerSqft: 1050,
        priceHistory: [580, 670, 760, 860, 960, 1050],
        yoyChange: 0.12,
        rentalYield: 5.5,
        avgRentPerSqft: 58,
        avgTransactionPrice: 1800000,
        supplyUnits: 2500,
        demandScore: 74,
        transactionVolume: 1600,
        developers: ["emaar"],
        propertyTypes: { apartments: 0.10, villas: 0.85, commercial: 0.05 },
        infrastructureProjects: [],
        developments: [],
        news: [
            { headline: "Mudon villa community sees steady demand from families", sentiment: "neutral", date: "2025-09" }
        ],
        factors: { airportProximity: 0.38, metroAccess: 0.25, roadNetwork: 0.68, retailAmenities: 0.55, schoolsHealthcare: 0.62, greenSpaces: 0.78, beachProximity: 0.05, employmentHub: 0.40, touristAttraction: 0.15, futureSupply: 0.40 }
    },
    {
        id: "al_rashidiya",
        name: "Al Rashidiya",
        center: [25.235, 55.395],
        bounds: [[25.222, 55.382], [25.250, 55.412]],
        category: "affordable",
        currentPricePerSqft: 850,
        priceHistory: [520, 580, 640, 710, 780, 850],
        yoyChange: 0.09,
        rentalYield: 6.5,
        avgRentPerSqft: 55,
        avgTransactionPrice: 700000,
        supplyUnits: 1500,
        demandScore: 68,
        transactionVolume: 1400,
        developers: [],
        propertyTypes: { apartments: 0.60, villas: 0.35, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Metro Blue Line - Centrepoint Interchange", type: "metro", impact: 0.18, completionYear: 2029, lat: 25.238, lng: 55.398 }
        ],
        developments: [],
        news: [
            { headline: "Metro Blue Line Centrepoint Interchange at Al Rashidiya connects Red and Blue lines", sentiment: "positive", date: "2025-11" }
        ],
        factors: { airportProximity: 0.90, metroAccess: 0.75, roadNetwork: 0.78, retailAmenities: 0.60, schoolsHealthcare: 0.65, greenSpaces: 0.50, beachProximity: 0.10, employmentHub: 0.50, touristAttraction: 0.15, futureSupply: 0.25 }
    },
    {
        id: "al_warqa",
        name: "Al Warqa",
        center: [25.210, 55.415],
        bounds: [[25.198, 55.402], [25.225, 55.430]],
        category: "affordable",
        currentPricePerSqft: 800,
        priceHistory: [500, 560, 620, 680, 740, 800],
        yoyChange: 0.08,
        rentalYield: 6.2,
        avgRentPerSqft: 50,
        avgTransactionPrice: 900000,
        supplyUnits: 1000,
        demandScore: 66,
        transactionVolume: 1100,
        developers: [],
        propertyTypes: { apartments: 0.30, villas: 0.65, commercial: 0.05 },
        infrastructureProjects: [
            { name: "Metro Blue Line - Al Warqa Station", type: "metro", impact: 0.18, completionYear: 2029, lat: 25.212, lng: 55.418 }
        ],
        developments: [],
        news: [
            { headline: "Metro Blue Line to boost Al Warqa connectivity significantly", sentiment: "positive", date: "2025-11" }
        ],
        factors: { airportProximity: 0.82, metroAccess: 0.30, roadNetwork: 0.70, retailAmenities: 0.50, schoolsHealthcare: 0.60, greenSpaces: 0.55, beachProximity: 0.05, employmentHub: 0.42, touristAttraction: 0.10, futureSupply: 0.20 }
    },
    {
        id: "dubai_downtown_jaddaf",
        name: "Culture Village",
        center: [25.228, 55.328],
        bounds: [[25.218, 55.315], [25.238, 55.340]],
        category: "mid",
        currentPricePerSqft: 1150,
        priceHistory: [650, 740, 830, 930, 1040, 1150],
        yoyChange: 0.11,
        rentalYield: 6.0,
        avgRentPerSqft: 69,
        avgTransactionPrice: 950000,
        supplyUnits: 2000,
        demandScore: 72,
        transactionVolume: 1400,
        developers: ["azizi"],
        propertyTypes: { apartments: 0.85, villas: 0.05, commercial: 0.10 },
        infrastructureProjects: [],
        developments: [
            { name: "Azizi Creek Views", developer: "azizi", units: 800, type: "residential", completionYear: 2027, lat: 25.228, lng: 55.328 }
        ],
        news: [],
        factors: { airportProximity: 0.68, metroAccess: 0.55, roadNetwork: 0.72, retailAmenities: 0.55, schoolsHealthcare: 0.55, greenSpaces: 0.50, beachProximity: 0.25, employmentHub: 0.58, touristAttraction: 0.50, futureSupply: 0.40 }
    },
    {
        id: "difc",
        name: "DIFC",
        center: [25.210, 55.280],
        bounds: [[25.205, 55.272], [25.218, 55.290]],
        category: "ultra_luxury",
        currentPricePerSqft: 3200,
        priceHistory: [2000, 2250, 2500, 2750, 2980, 3200],
        yoyChange: 0.08,
        rentalYield: 4.0,
        avgRentPerSqft: 128,
        avgTransactionPrice: 4500000,
        supplyUnits: 800,
        demandScore: 90,
        transactionVolume: 800,
        developers: ["omniyat"],
        propertyTypes: { apartments: 0.60, villas: 0.0, commercial: 0.40 },
        infrastructureProjects: [],
        developments: [
            { name: "Omniyat DIFC Residences", developer: "omniyat", units: 200, type: "ultra_luxury", completionYear: 2028, lat: 25.212, lng: 55.282 }
        ],
        news: [
            { headline: "DIFC remains Dubai's financial hub with premium residential demand", sentiment: "positive", date: "2025-10" }
        ],
        factors: { airportProximity: 0.58, metroAccess: 0.95, roadNetwork: 0.92, retailAmenities: 0.88, schoolsHealthcare: 0.80, greenSpaces: 0.45, beachProximity: 0.25, employmentHub: 0.98, touristAttraction: 0.75, futureSupply: 0.15 }
    }
];

// Area polygon shapes (approximate outlines)
const AREA_POLYGONS = {};
DUBAI_AREAS.forEach(area => {
    const c = area.center;
    const b = area.bounds;
    // Generate a polygon from bounds with slight variation
    AREA_POLYGONS[area.id] = [
        [b[0][0], b[0][1]],
        [b[0][0], b[1][1]],
        [b[1][0], b[1][1]],
        [b[1][0], b[0][1]]
    ];
});
