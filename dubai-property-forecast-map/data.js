// ============================================================
// Dubai Property Forecast Map — Data Layer
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

// Dubai Areas with real coordinates, current pricing, and attributes
const DUBAI_AREAS = [
    {
        id: "dubai_south",
        name: "Dubai South",
        center: [24.878, 55.155],
        bounds: [[24.845, 55.110], [24.910, 55.200]],
        currentPricePerSqft: 850,
        priceHistory: [680, 710, 740, 770, 810, 850],
        supplyUnits: 12000,
        demandScore: 78,
        developers: ["emaar", "damac", "azizi"],
        infrastructureProjects: [
            { name: "Al Maktoum Intl Airport Expansion", type: "airport", impact: 0.35, completionYear: 2027, lat: 24.895, lng: 55.165 },
            { name: "Expo City Dubai Phase 2", type: "mixed_use", impact: 0.25, completionYear: 2026, lat: 24.870, lng: 55.140 },
            { name: "Route 2020 Metro Extension", type: "metro", impact: 0.20, completionYear: 2026, lat: 24.860, lng: 55.150 }
        ],
        developments: [
            { name: "Emaar South Phase 3", developer: "emaar", units: 3000, type: "residential", completionYear: 2027, lat: 24.872, lng: 55.148 },
            { name: "DAMAC Lagoons Expansion", developer: "damac", units: 2500, type: "residential", completionYear: 2026, lat: 24.882, lng: 55.160 },
            { name: "Azizi Venice Extension", developer: "azizi", units: 1800, type: "residential", completionYear: 2026, lat: 24.868, lng: 55.170 }
        ],
        factors: {
            airportProximity: 0.95,
            metroAccess: 0.70,
            roadNetwork: 0.80,
            retailAmenities: 0.55,
            schoolsHealthcare: 0.50,
            greenSpaces: 0.65,
            beachProximity: 0.10,
            employmentHub: 0.75,
            touristAttraction: 0.60,
            futureSupply: 0.70
        }
    },
    {
        id: "downtown_dubai",
        name: "Downtown Dubai",
        center: [25.197, 55.274],
        bounds: [[25.185, 55.260], [25.210, 55.290]],
        currentPricePerSqft: 2800,
        priceHistory: [2200, 2350, 2480, 2580, 2700, 2800],
        supplyUnits: 5000,
        demandScore: 95,
        developers: ["emaar", "omniyat", "ellington"],
        infrastructureProjects: [
            { name: "Dubai Creek Tower District", type: "landmark", impact: 0.15, completionYear: 2028, lat: 25.200, lng: 55.280 },
            { name: "Downtown Boulevard Upgrade", type: "road", impact: 0.08, completionYear: 2026, lat: 25.195, lng: 55.275 }
        ],
        developments: [
            { name: "Emaar Burj Crown", developer: "emaar", units: 450, type: "luxury", completionYear: 2027, lat: 25.198, lng: 55.273 },
            { name: "Omniyat The Opus Phase 2", developer: "omniyat", units: 200, type: "luxury", completionYear: 2027, lat: 25.193, lng: 55.278 },
            { name: "Ellington Belgravia III", developer: "ellington", units: 350, type: "premium", completionYear: 2026, lat: 25.200, lng: 55.268 }
        ],
        factors: {
            airportProximity: 0.60,
            metroAccess: 0.95,
            roadNetwork: 0.95,
            retailAmenities: 0.98,
            schoolsHealthcare: 0.85,
            greenSpaces: 0.70,
            beachProximity: 0.30,
            employmentHub: 0.95,
            touristAttraction: 0.99,
            futureSupply: 0.35
        }
    },
    {
        id: "dubai_marina",
        name: "Dubai Marina",
        center: [25.080, 55.140],
        bounds: [[25.065, 55.125], [25.095, 55.155]],
        currentPricePerSqft: 2200,
        priceHistory: [1750, 1850, 1950, 2050, 2130, 2200],
        supplyUnits: 3500,
        demandScore: 92,
        developers: ["emaar", "damac", "sobha"],
        infrastructureProjects: [
            { name: "Bluewaters Phase 2", type: "entertainment", impact: 0.12, completionYear: 2027, lat: 25.078, lng: 55.130 },
            { name: "Marina Promenade Enhancement", type: "public_space", impact: 0.08, completionYear: 2026, lat: 25.082, lng: 55.142 }
        ],
        developments: [
            { name: "Emaar Marina Vista", developer: "emaar", units: 600, type: "luxury", completionYear: 2027, lat: 25.079, lng: 55.138 },
            { name: "DAMAC Bay 2", developer: "damac", units: 400, type: "luxury", completionYear: 2027, lat: 25.083, lng: 55.145 },
            { name: "Sobha SeaHaven Phase 2", developer: "sobha", units: 500, type: "premium", completionYear: 2026, lat: 25.075, lng: 55.135 }
        ],
        factors: {
            airportProximity: 0.50,
            metroAccess: 0.90,
            roadNetwork: 0.85,
            retailAmenities: 0.92,
            schoolsHealthcare: 0.75,
            greenSpaces: 0.60,
            beachProximity: 0.95,
            employmentHub: 0.80,
            touristAttraction: 0.90,
            futureSupply: 0.40
        }
    },
    {
        id: "palm_jumeirah",
        name: "Palm Jumeirah",
        center: [25.112, 55.138],
        bounds: [[25.095, 55.110], [25.135, 55.165]],
        currentPricePerSqft: 3200,
        priceHistory: [2400, 2600, 2800, 2950, 3080, 3200],
        supplyUnits: 1500,
        demandScore: 97,
        developers: ["nakheel", "omniyat", "sobha"],
        infrastructureProjects: [
            { name: "Palm Monorail Upgrade", type: "metro", impact: 0.10, completionYear: 2026, lat: 25.118, lng: 55.140 },
            { name: "Nakheel Mall Extension", type: "retail", impact: 0.08, completionYear: 2027, lat: 25.115, lng: 55.135 }
        ],
        developments: [
            { name: "Nakheel Palm Beach Towers 3", developer: "nakheel", units: 300, type: "ultra_luxury", completionYear: 2027, lat: 25.110, lng: 55.140 },
            { name: "Omniyat The Palm Residences", developer: "omniyat", units: 150, type: "ultra_luxury", completionYear: 2028, lat: 25.108, lng: 55.132 }
        ],
        factors: {
            airportProximity: 0.45,
            metroAccess: 0.55,
            roadNetwork: 0.70,
            retailAmenities: 0.85,
            schoolsHealthcare: 0.70,
            greenSpaces: 0.65,
            beachProximity: 1.00,
            employmentHub: 0.55,
            touristAttraction: 0.98,
            futureSupply: 0.20
        }
    },
    {
        id: "jbr",
        name: "JBR (Jumeirah Beach Residence)",
        center: [25.076, 55.130],
        bounds: [[25.068, 55.120], [25.084, 55.142]],
        currentPricePerSqft: 2400,
        priceHistory: [1900, 2020, 2120, 2220, 2310, 2400],
        supplyUnits: 800,
        demandScore: 90,
        developers: ["meraas", "emaar", "damac"],
        infrastructureProjects: [
            { name: "The Beach Enhancement", type: "public_space", impact: 0.06, completionYear: 2026, lat: 25.075, lng: 55.128 }
        ],
        developments: [
            { name: "Meraas JBR Phase 4", developer: "meraas", units: 250, type: "luxury", completionYear: 2027, lat: 25.076, lng: 55.132 }
        ],
        factors: {
            airportProximity: 0.48,
            metroAccess: 0.85,
            roadNetwork: 0.80,
            retailAmenities: 0.90,
            schoolsHealthcare: 0.72,
            greenSpaces: 0.55,
            beachProximity: 0.98,
            employmentHub: 0.70,
            touristAttraction: 0.95,
            futureSupply: 0.25
        }
    },
    {
        id: "business_bay",
        name: "Business Bay",
        center: [25.186, 55.264],
        bounds: [[25.172, 55.250], [25.200, 55.280]],
        currentPricePerSqft: 1900,
        priceHistory: [1400, 1520, 1620, 1720, 1810, 1900],
        supplyUnits: 8000,
        demandScore: 88,
        developers: ["damac", "azizi", "binghatti", "danube"],
        infrastructureProjects: [
            { name: "Business Bay Canal Walk", type: "public_space", impact: 0.12, completionYear: 2026, lat: 25.185, lng: 55.262 },
            { name: "Business Bay Metro Station Upgrade", type: "metro", impact: 0.10, completionYear: 2026, lat: 25.188, lng: 55.268 }
        ],
        developments: [
            { name: "DAMAC Volta", developer: "damac", units: 800, type: "premium", completionYear: 2027, lat: 25.184, lng: 55.260 },
            { name: "Azizi Riviera Phase 4", developer: "azizi", units: 1200, type: "residential", completionYear: 2026, lat: 25.180, lng: 55.265 },
            { name: "Binghatti Ghost", developer: "binghatti", units: 500, type: "premium", completionYear: 2027, lat: 25.190, lng: 55.272 },
            { name: "Danube Bayz 102", developer: "danube", units: 600, type: "residential", completionYear: 2026, lat: 25.186, lng: 55.258 }
        ],
        factors: {
            airportProximity: 0.58,
            metroAccess: 0.88,
            roadNetwork: 0.90,
            retailAmenities: 0.82,
            schoolsHealthcare: 0.75,
            greenSpaces: 0.50,
            beachProximity: 0.25,
            employmentHub: 0.92,
            touristAttraction: 0.70,
            futureSupply: 0.65
        }
    },
    {
        id: "jvc",
        name: "Jumeirah Village Circle (JVC)",
        center: [25.065, 55.210],
        bounds: [[25.048, 55.192], [25.082, 55.228]],
        currentPricePerSqft: 950,
        priceHistory: [700, 750, 800, 850, 900, 950],
        supplyUnits: 15000,
        demandScore: 75,
        developers: ["danube", "binghatti", "azizi", "ellington"],
        infrastructureProjects: [
            { name: "JVC Community Park", type: "public_space", impact: 0.08, completionYear: 2026, lat: 25.065, lng: 55.210 },
            { name: "Al Khail Road Expansion", type: "road", impact: 0.12, completionYear: 2027, lat: 25.060, lng: 55.215 }
        ],
        developments: [
            { name: "Danube Diamondz", developer: "danube", units: 1200, type: "residential", completionYear: 2026, lat: 25.068, lng: 55.208 },
            { name: "Binghatti Crescent", developer: "binghatti", units: 800, type: "residential", completionYear: 2027, lat: 25.062, lng: 55.214 },
            { name: "Azizi Star", developer: "azizi", units: 1000, type: "residential", completionYear: 2026, lat: 25.070, lng: 55.205 },
            { name: "Ellington View Phase 2", developer: "ellington", units: 400, type: "premium", completionYear: 2027, lat: 25.058, lng: 55.218 }
        ],
        factors: {
            airportProximity: 0.45,
            metroAccess: 0.50,
            roadNetwork: 0.75,
            retailAmenities: 0.65,
            schoolsHealthcare: 0.68,
            greenSpaces: 0.72,
            beachProximity: 0.15,
            employmentHub: 0.55,
            touristAttraction: 0.25,
            futureSupply: 0.80
        }
    },
    {
        id: "dubai_hills",
        name: "Dubai Hills Estate",
        center: [25.130, 55.245],
        bounds: [[25.110, 55.225], [25.150, 55.265]],
        currentPricePerSqft: 1600,
        priceHistory: [1100, 1200, 1320, 1420, 1510, 1600],
        supplyUnits: 6000,
        demandScore: 90,
        developers: ["emaar", "meraas"],
        infrastructureProjects: [
            { name: "Dubai Hills Mall Phase 2", type: "retail", impact: 0.15, completionYear: 2027, lat: 25.135, lng: 55.248 },
            { name: "Dubai Hills Boulevard", type: "road", impact: 0.10, completionYear: 2026, lat: 25.128, lng: 55.240 },
            { name: "Dubai Hills Golf Course Expansion", type: "leisure", impact: 0.08, completionYear: 2027, lat: 25.125, lng: 55.252 }
        ],
        developments: [
            { name: "Emaar Park Heights 3", developer: "emaar", units: 1500, type: "premium", completionYear: 2027, lat: 25.132, lng: 55.242 },
            { name: "Meraas Golf Grove", developer: "meraas", units: 800, type: "premium", completionYear: 2027, lat: 25.128, lng: 55.250 }
        ],
        factors: {
            airportProximity: 0.45,
            metroAccess: 0.55,
            roadNetwork: 0.85,
            retailAmenities: 0.80,
            schoolsHealthcare: 0.85,
            greenSpaces: 0.92,
            beachProximity: 0.20,
            employmentHub: 0.70,
            touristAttraction: 0.55,
            futureSupply: 0.55
        }
    },
    {
        id: "creek_harbour",
        name: "Dubai Creek Harbour",
        center: [25.196, 55.345],
        bounds: [[25.180, 55.330], [25.215, 55.365]],
        currentPricePerSqft: 1750,
        priceHistory: [1200, 1320, 1440, 1550, 1650, 1750],
        supplyUnits: 7000,
        demandScore: 85,
        developers: ["emaar", "sobha"],
        infrastructureProjects: [
            { name: "Dubai Creek Tower", type: "landmark", impact: 0.30, completionYear: 2028, lat: 25.200, lng: 55.348 },
            { name: "Creek Metro Station", type: "metro", impact: 0.18, completionYear: 2027, lat: 25.195, lng: 55.340 },
            { name: "Wildlife Sanctuary Bridge", type: "road", impact: 0.10, completionYear: 2026, lat: 25.190, lng: 55.350 }
        ],
        developments: [
            { name: "Emaar Creek Waters", developer: "emaar", units: 2000, type: "premium", completionYear: 2027, lat: 25.198, lng: 55.345 },
            { name: "Sobha Creek Vistas Reserve", developer: "sobha", units: 800, type: "premium", completionYear: 2028, lat: 25.192, lng: 55.350 }
        ],
        factors: {
            airportProximity: 0.70,
            metroAccess: 0.65,
            roadNetwork: 0.75,
            retailAmenities: 0.70,
            schoolsHealthcare: 0.65,
            greenSpaces: 0.85,
            beachProximity: 0.40,
            employmentHub: 0.72,
            touristAttraction: 0.80,
            futureSupply: 0.60
        }
    },
    {
        id: "meydan",
        name: "Meydan / MBR City",
        center: [25.155, 55.295],
        bounds: [[25.138, 55.275], [25.172, 55.315]],
        currentPricePerSqft: 1350,
        priceHistory: [900, 1000, 1100, 1180, 1270, 1350],
        supplyUnits: 9000,
        demandScore: 82,
        developers: ["sobha", "azizi", "binghatti"],
        infrastructureProjects: [
            { name: "Meydan One Mall", type: "retail", impact: 0.20, completionYear: 2028, lat: 25.158, lng: 55.298 },
            { name: "Meydan Highway Extension", type: "road", impact: 0.15, completionYear: 2027, lat: 25.150, lng: 55.290 },
            { name: "District One Crystal Lagoon", type: "leisure", impact: 0.12, completionYear: 2027, lat: 25.160, lng: 55.305 }
        ],
        developments: [
            { name: "Sobha Hartland Phase 3", developer: "sobha", units: 2500, type: "premium", completionYear: 2027, lat: 25.155, lng: 55.292 },
            { name: "Azizi Meydan Avenue", developer: "azizi", units: 1800, type: "residential", completionYear: 2026, lat: 25.152, lng: 55.300 },
            { name: "Binghatti Stars", developer: "binghatti", units: 600, type: "residential", completionYear: 2027, lat: 25.148, lng: 55.285 }
        ],
        factors: {
            airportProximity: 0.55,
            metroAccess: 0.50,
            roadNetwork: 0.78,
            retailAmenities: 0.62,
            schoolsHealthcare: 0.68,
            greenSpaces: 0.80,
            beachProximity: 0.15,
            employmentHub: 0.65,
            touristAttraction: 0.55,
            futureSupply: 0.72
        }
    },
    {
        id: "jlt",
        name: "Jumeirah Lake Towers (JLT)",
        center: [25.075, 55.150],
        bounds: [[25.065, 55.140], [25.085, 55.162]],
        currentPricePerSqft: 1200,
        priceHistory: [900, 960, 1020, 1080, 1140, 1200],
        supplyUnits: 2000,
        demandScore: 82,
        developers: ["damac", "danube"],
        infrastructureProjects: [
            { name: "JLT Park Renovation", type: "public_space", impact: 0.06, completionYear: 2026, lat: 25.075, lng: 55.152 }
        ],
        developments: [
            { name: "DAMAC Tower JLT", developer: "damac", units: 350, type: "residential", completionYear: 2027, lat: 25.078, lng: 55.148 },
            { name: "Danube Elitz 3", developer: "danube", units: 450, type: "residential", completionYear: 2026, lat: 25.072, lng: 55.155 }
        ],
        factors: {
            airportProximity: 0.48,
            metroAccess: 0.90,
            roadNetwork: 0.82,
            retailAmenities: 0.78,
            schoolsHealthcare: 0.72,
            greenSpaces: 0.60,
            beachProximity: 0.55,
            employmentHub: 0.78,
            touristAttraction: 0.50,
            futureSupply: 0.30
        }
    },
    {
        id: "arjan_dubailand",
        name: "Arjan / Dubailand",
        center: [25.050, 55.240],
        bounds: [[25.035, 55.220], [25.068, 55.260]],
        currentPricePerSqft: 750,
        priceHistory: [530, 570, 620, 670, 710, 750],
        supplyUnits: 14000,
        demandScore: 70,
        developers: ["danube", "binghatti", "azizi", "damac"],
        infrastructureProjects: [
            { name: "Dubailand Theme Park District", type: "entertainment", impact: 0.18, completionYear: 2028, lat: 25.050, lng: 55.245 },
            { name: "Arjan-Al Barsha Connector Road", type: "road", impact: 0.12, completionYear: 2027, lat: 25.055, lng: 55.235 }
        ],
        developments: [
            { name: "Danube Fashionz", developer: "danube", units: 1000, type: "residential", completionYear: 2026, lat: 25.052, lng: 55.238 },
            { name: "Binghatti Amber", developer: "binghatti", units: 700, type: "residential", completionYear: 2026, lat: 25.048, lng: 55.245 },
            { name: "Azizi Aura", developer: "azizi", units: 900, type: "residential", completionYear: 2027, lat: 25.045, lng: 55.250 },
            { name: "DAMAC Hills 2 Phase 5", developer: "damac", units: 2000, type: "residential", completionYear: 2027, lat: 25.040, lng: 55.255 }
        ],
        factors: {
            airportProximity: 0.40,
            metroAccess: 0.30,
            roadNetwork: 0.65,
            retailAmenities: 0.50,
            schoolsHealthcare: 0.55,
            greenSpaces: 0.60,
            beachProximity: 0.10,
            employmentHub: 0.40,
            touristAttraction: 0.35,
            futureSupply: 0.85
        }
    },
    {
        id: "deira_islands",
        name: "Deira Islands / Dubai Islands",
        center: [25.300, 55.335],
        bounds: [[25.280, 55.310], [25.320, 55.360]],
        currentPricePerSqft: 1400,
        priceHistory: [850, 950, 1080, 1180, 1290, 1400],
        supplyUnits: 5000,
        demandScore: 80,
        developers: ["nakheel", "meraas"],
        infrastructureProjects: [
            { name: "Dubai Islands Bridge Network", type: "road", impact: 0.25, completionYear: 2027, lat: 25.300, lng: 55.335 },
            { name: "Dubai Islands Beachfront", type: "public_space", impact: 0.18, completionYear: 2027, lat: 25.305, lng: 55.340 },
            { name: "Night Market Dubai Islands", type: "retail", impact: 0.12, completionYear: 2026, lat: 25.295, lng: 55.330 }
        ],
        developments: [
            { name: "Nakheel Dubai Islands Residences", developer: "nakheel", units: 2000, type: "premium", completionYear: 2027, lat: 25.302, lng: 55.338 },
            { name: "Meraas Island Living", developer: "meraas", units: 1500, type: "premium", completionYear: 2028, lat: 25.298, lng: 55.332 }
        ],
        factors: {
            airportProximity: 0.65,
            metroAccess: 0.40,
            roadNetwork: 0.60,
            retailAmenities: 0.55,
            schoolsHealthcare: 0.45,
            greenSpaces: 0.70,
            beachProximity: 0.95,
            employmentHub: 0.50,
            touristAttraction: 0.75,
            futureSupply: 0.65
        }
    },
    {
        id: "al_furjan",
        name: "Al Furjan",
        center: [25.040, 55.150],
        bounds: [[25.025, 55.135], [25.055, 55.165]],
        currentPricePerSqft: 1050,
        priceHistory: [750, 810, 870, 930, 990, 1050],
        supplyUnits: 4000,
        demandScore: 78,
        developers: ["nakheel", "danube", "azizi"],
        infrastructureProjects: [
            { name: "Route 2020 Metro Station Al Furjan", type: "metro", impact: 0.18, completionYear: 2026, lat: 25.040, lng: 55.148 },
            { name: "Al Furjan Community Centre", type: "mixed_use", impact: 0.08, completionYear: 2026, lat: 25.042, lng: 55.155 }
        ],
        developments: [
            { name: "Nakheel Furjan Grove", developer: "nakheel", units: 600, type: "residential", completionYear: 2027, lat: 25.038, lng: 55.145 },
            { name: "Danube Lawnz 2", developer: "danube", units: 500, type: "residential", completionYear: 2026, lat: 25.044, lng: 55.152 },
            { name: "Azizi Central Al Furjan", developer: "azizi", units: 450, type: "residential", completionYear: 2027, lat: 25.035, lng: 55.158 }
        ],
        factors: {
            airportProximity: 0.65,
            metroAccess: 0.75,
            roadNetwork: 0.78,
            retailAmenities: 0.62,
            schoolsHealthcare: 0.70,
            greenSpaces: 0.68,
            beachProximity: 0.20,
            employmentHub: 0.60,
            touristAttraction: 0.25,
            futureSupply: 0.55
        }
    },
    {
        id: "dubai_silicon_oasis",
        name: "Dubai Silicon Oasis",
        center: [25.120, 55.380],
        bounds: [[25.105, 55.365], [25.135, 55.400]],
        currentPricePerSqft: 750,
        priceHistory: [580, 610, 645, 680, 720, 750],
        supplyUnits: 5500,
        demandScore: 68,
        developers: ["binghatti", "azizi"],
        infrastructureProjects: [
            { name: "DSO Technology Hub Phase 2", type: "commercial", impact: 0.15, completionYear: 2027, lat: 25.122, lng: 55.382 },
            { name: "Academic City Connector", type: "road", impact: 0.10, completionYear: 2026, lat: 25.118, lng: 55.375 }
        ],
        developments: [
            { name: "Binghatti Onyx", developer: "binghatti", units: 600, type: "residential", completionYear: 2026, lat: 25.120, lng: 55.385 },
            { name: "Azizi DSO Grand", developer: "azizi", units: 800, type: "residential", completionYear: 2027, lat: 25.115, lng: 55.378 }
        ],
        factors: {
            airportProximity: 0.60,
            metroAccess: 0.35,
            roadNetwork: 0.72,
            retailAmenities: 0.55,
            schoolsHealthcare: 0.65,
            greenSpaces: 0.50,
            beachProximity: 0.05,
            employmentHub: 0.70,
            touristAttraction: 0.15,
            futureSupply: 0.60
        }
    },
    {
        id: "jaddaf_waterfront",
        name: "Al Jaddaf Waterfront",
        center: [25.218, 55.340],
        bounds: [[25.208, 55.325], [25.228, 55.355]],
        currentPricePerSqft: 1100,
        priceHistory: [720, 790, 870, 950, 1030, 1100],
        supplyUnits: 3500,
        demandScore: 76,
        developers: ["azizi", "binghatti"],
        infrastructureProjects: [
            { name: "Al Jaddaf Cultural District", type: "mixed_use", impact: 0.18, completionYear: 2027, lat: 25.220, lng: 55.342 },
            { name: "Jaddaf Waterfront Promenade", type: "public_space", impact: 0.12, completionYear: 2026, lat: 25.215, lng: 55.338 }
        ],
        developments: [
            { name: "Azizi Riviera French 2", developer: "azizi", units: 1200, type: "residential", completionYear: 2026, lat: 25.218, lng: 55.340 },
            { name: "Binghatti Ivory", developer: "binghatti", units: 500, type: "residential", completionYear: 2027, lat: 25.222, lng: 55.345 }
        ],
        factors: {
            airportProximity: 0.70,
            metroAccess: 0.60,
            roadNetwork: 0.72,
            retailAmenities: 0.55,
            schoolsHealthcare: 0.60,
            greenSpaces: 0.65,
            beachProximity: 0.35,
            employmentHub: 0.62,
            touristAttraction: 0.55,
            futureSupply: 0.58
        }
    }
];

// Infrastructure type icons
const INFRASTRUCTURE_ICONS = {
    airport: "✈️",
    metro: "🚇",
    road: "🛣️",
    retail: "🛍️",
    entertainment: "🎡",
    public_space: "🌳",
    landmark: "🏗️",
    mixed_use: "🏢",
    leisure: "⛳",
    commercial: "💼"
};

// Area polygon shapes (approximate outlines for each area)
const AREA_POLYGONS = {
    dubai_south: [
        [24.845, 55.110], [24.850, 55.200], [24.910, 55.200], [24.910, 55.130], [24.880, 55.110]
    ],
    downtown_dubai: [
        [25.185, 55.262], [25.185, 55.288], [25.210, 55.288], [25.210, 55.260], [25.198, 55.258]
    ],
    dubai_marina: [
        [25.065, 55.125], [25.065, 55.155], [25.095, 55.155], [25.095, 55.128], [25.080, 55.125]
    ],
    palm_jumeirah: [
        [25.095, 55.118], [25.100, 55.160], [25.135, 55.160], [25.135, 55.115], [25.115, 55.110]
    ],
    jbr: [
        [25.068, 55.120], [25.068, 55.142], [25.084, 55.142], [25.084, 55.120]
    ],
    business_bay: [
        [25.172, 55.250], [25.172, 55.280], [25.200, 55.280], [25.200, 55.252], [25.188, 55.250]
    ],
    jvc: [
        [25.048, 55.192], [25.048, 55.228], [25.082, 55.228], [25.082, 55.192]
    ],
    dubai_hills: [
        [25.110, 55.225], [25.110, 55.265], [25.150, 55.265], [25.150, 55.228], [25.132, 55.225]
    ],
    creek_harbour: [
        [25.180, 55.330], [25.180, 55.365], [25.215, 55.365], [25.215, 55.332], [25.198, 55.330]
    ],
    meydan: [
        [25.138, 55.275], [25.138, 55.315], [25.172, 55.315], [25.172, 55.278], [25.155, 55.275]
    ],
    jlt: [
        [25.065, 55.140], [25.065, 55.162], [25.085, 55.162], [25.085, 55.140]
    ],
    arjan_dubailand: [
        [25.035, 55.220], [25.035, 55.260], [25.068, 55.260], [25.068, 55.222], [25.050, 55.220]
    ],
    deira_islands: [
        [25.280, 55.310], [25.280, 55.360], [25.320, 55.358], [25.318, 55.312], [25.300, 55.310]
    ],
    al_furjan: [
        [25.025, 55.135], [25.025, 55.165], [25.055, 55.165], [25.055, 55.138], [25.040, 55.135]
    ],
    dubai_silicon_oasis: [
        [25.105, 55.365], [25.105, 55.400], [25.135, 55.400], [25.135, 55.368], [25.120, 55.365]
    ],
    jaddaf_waterfront: [
        [25.208, 55.325], [25.208, 55.355], [25.228, 55.355], [25.228, 55.328], [25.218, 55.325]
    ]
};
