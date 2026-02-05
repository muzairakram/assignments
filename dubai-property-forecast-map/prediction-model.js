// ============================================================
// Dubai Property Forecast Map — Enhanced ML Prediction Model
// ============================================================
// Gradient-boosted regression simulation trained on Dubai real-
// estate features.  Incorporates: momentum analysis, news
// sentiment scoring, Metro Blue Line uplift, supply-demand
// dynamics, market-cycle moderation, rental-yield forecasting,
// infrastructure uplift, and developer premium calculations.
// ============================================================

class PropertyPredictionModel {
    constructor() {
        // ── Feature weights (simulating learned weights) ────────
        this.featureWeights = {
            airportProximity:  0.08,
            metroAccess:       0.12,
            roadNetwork:       0.10,
            retailAmenities:   0.09,
            schoolsHealthcare: 0.07,
            greenSpaces:       0.05,
            beachProximity:    0.08,
            employmentHub:     0.14,
            touristAttraction: 0.06,
            futureSupply:     -0.10
        };

        // ── Developer quality premiums ──────────────────────────
        this.developerPremiums = {
            emaar:      0.08,
            damac:      0.04,
            nakheel:    0.06,
            meraas:     0.07,
            sobha:      0.06,
            azizi:      0.02,
            danube:     0.01,
            omniyat:    0.09,
            ellington:  0.05,
            binghatti:  0.02
        };

        // ── 2026 market outlook ─────────────────────────────────
        // 2025 saw ~20% average growth; 2026 outlook is 5-8%
        // moderating cycle.  Base sits in the middle of guidance.
        this.baseMarketGrowth   = 0.065;          // 6.5% central case
        this.marketCyclePosition = 0.72;           // mid-to-late upswing
        this.moderationFactor    = 0.35;           // how fast momentum fades

        // ── Category-level growth caps / floors ─────────────────
        this.categoryGrowthBands = {
            ultra_luxury: { floor: 0.03, cap: 0.12 },
            luxury:       { floor: 0.03, cap: 0.10 },
            premium:      { floor: 0.02, cap: 0.10 },
            mid:          { floor: 0.01, cap: 0.09 },
            affordable:   { floor: 0.00, cap: 0.10 },
            budget:       { floor: 0.00, cap: 0.08 },
            emerging:     { floor:-0.02, cap: 0.15 }
        };

        // ── News sentiment weights ──────────────────────────────
        this.sentimentScores = {
            positive: 1.0,
            mixed:    0.0,
            neutral:  0.0,
            negative: -1.0
        };

        // ── Metro Blue Line areas (identified by infra data) ────
        this.metroBlueLineAreas = [
            "creek_harbour", "dso", "international_city",
            "jaddaf", "mirdif", "academic_city",
            "festival_city", "ras_al_khor", "al_rashidiya",
            "al_warqa"
        ];

        // ── Supply-pressure thresholds ──────────────────────────
        this.supplyPressureThresholds = {
            critical: 20000,   // 20k+ units = severe downward pressure
            high:     10000,
            moderate:  5000,
            low:       2000
        };
    }

    // ================================================================
    //  Main prediction method
    // ================================================================
    predict(area, horizonYears, activeDevelopers) {
        if (typeof activeDevelopers === "undefined") activeDevelopers = null;

        // ── Component calculations ──────────────────────────────
        const momentum          = this._calculateMomentum(area);
        const locationScore     = this._calculateLocationScore(area);
        const infraUplift       = this._calculateInfrastructureUplift(area, horizonYears);
        const supplyPressure    = this._calculateSupplyPressure(area, horizonYears);
        const developerEffect   = this._calculateDeveloperEffect(area, activeDevelopers);
        const marketCycle       = this._calculateMarketCycleEffect(horizonYears);
        const sentimentScore    = this._calculateNewsSentiment(area);
        const metroBlueBoost    = this._calculateMetroBlueLineBoost(area, horizonYears);
        const yoySignal         = this._calculateYoYSignal(area);
        const volumeSignal      = this._calculateVolumeSignal(area);
        const categoryBand      = this.categoryGrowthBands[area.category] ||
                                  this.categoryGrowthBands.mid;
        const demandMultiplier  = area.demandScore / 100;

        // ── Composite annual growth rate ────────────────────────
        let annualGrowth =
            this.baseMarketGrowth * marketCycle +
            momentum          * 0.22 +
            yoySignal         * 0.15 +
            locationScore     * 0.12 +
            infraUplift       +
            supplyPressure    +
            developerEffect   * 0.05 +
            sentimentScore    * 0.04 +
            metroBlueBoost    +
            volumeSignal      * 0.03;

        // Apply demand multiplier
        annualGrowth *= (0.5 + demandMultiplier * 0.5);

        // Diminishing returns for longer horizons (market mean-reverts)
        const diminishingFactor = 1 - (horizonYears - 1) * 0.05;
        annualGrowth *= Math.max(0.75, diminishingFactor);

        // Clamp to category growth band
        annualGrowth = Math.max(categoryBand.floor,
                       Math.min(categoryBand.cap, annualGrowth));

        // ── Compound over the horizon ───────────────────────────
        const totalChange = Math.pow(1 + annualGrowth, horizonYears) - 1;

        // ── Confidence interval ─────────────────────────────────
        const baseUncertainty = area.category === "emerging" ? 0.06 : 0.03;
        const supplyUncertainty = area.supplyUnits > this.supplyPressureThresholds.high
            ? 0.015 : 0;
        const uncertainty = baseUncertainty + horizonYears * 0.022 + supplyUncertainty;
        const confidenceLow  = totalChange - uncertainty;
        const confidenceHigh = totalChange + uncertainty;

        // ── Price prediction ────────────────────────────────────
        const predictedPrice = Math.round(
            area.currentPricePerSqft * (1 + totalChange)
        );

        // ── Rental yield prediction ─────────────────────────────
        const rentalResult = this._predictRentalYield(area, horizonYears, annualGrowth);

        // ── Capital appreciation & total ROI ────────────────────
        const capitalAppreciation = totalChange;
        const cumulativeYield     = rentalResult.predictedRentalYield * horizonYears / 100;
        const totalROI            = capitalAppreciation + cumulativeYield;

        // ── Assemble components ─────────────────────────────────
        const components = {
            momentum,
            locationScore,
            infraUplift,
            supplyPressure,
            developerEffect,
            marketCycle,
            demandMultiplier,
            sentimentScore,
            metroBlueBoost,
            yoySignal,
            volumeSignal
        };

        // ── Key drivers (eagerly computed) ──────────────────────
        const keyDrivers = this.getKeyDrivers(area, { components }, horizonYears);

        return {
            predictedChange:       totalChange,
            annualizedRate:        annualGrowth,
            confidenceLow,
            confidenceHigh,
            predictedPrice,
            predictedRentalYield:  rentalResult.predictedRentalYield,
            predictedRentPerSqft:  rentalResult.predictedRentPerSqft,
            capitalAppreciation,
            totalROI,
            components,
            keyDrivers
        };
    }

    // ================================================================
    //  Momentum: weighted trend from priceHistory
    // ================================================================
    _calculateMomentum(area) {
        const history = area.priceHistory;
        if (!history || history.length < 3) return 0;

        // Filter out zero values (emerging areas with no early history)
        const valid = history.filter(v => v > 0);
        if (valid.length < 3) return 0;

        const recentRates = [];
        for (let i = 1; i < valid.length; i++) {
            recentRates.push((valid[i] - valid[i - 1]) / valid[i - 1]);
        }

        // Exponentially-weighted average (more recent = more weight)
        let weightedSum = 0;
        let weightTotal = 0;
        for (let i = 0; i < recentRates.length; i++) {
            const weight = Math.pow(1.5, i);
            weightedSum += recentRates[i] * weight;
            weightTotal += weight;
        }

        // Acceleration factor
        if (recentRates.length >= 4) {
            const recentAvg = (recentRates[recentRates.length - 1] +
                               recentRates[recentRates.length - 2]) / 2;
            const olderAvg  = (recentRates[0] + recentRates[1]) / 2;
            const acceleration = recentAvg - olderAvg;
            return (weightedSum / weightTotal) + acceleration * 0.25;
        }

        return weightedSum / weightTotal;
    }

    // ================================================================
    //  YoY change signal — direct market data input
    // ================================================================
    _calculateYoYSignal(area) {
        const yoy = area.yoyChange || 0;

        // 2025 saw ~20% average; 2026 moderates to 5-8%.
        // Areas with very high 2025 YoY are more likely to mean-revert.
        if (yoy > 0.20) {
            // Strong overperformers get a reduced forward signal
            return yoy * 0.25;
        } else if (yoy > 0.10) {
            return yoy * 0.40;
        } else {
            // Stable/slow growers carry signal more faithfully
            return yoy * 0.55;
        }
    }

    // ================================================================
    //  Volume signal — high transaction volume = liquid & demanded
    // ================================================================
    _calculateVolumeSignal(area) {
        const vol = area.transactionVolume || 0;

        if (vol > 8000) return 0.04;       // very high liquidity
        if (vol > 5000) return 0.025;
        if (vol > 3000) return 0.015;
        if (vol > 1500) return 0.005;
        return 0;
    }

    // ================================================================
    //  Location desirability score from area factors
    // ================================================================
    _calculateLocationScore(area) {
        let score = 0;
        if (!area.factors) return 0;
        for (const [factor, value] of Object.entries(area.factors)) {
            score += value * (this.featureWeights[factor] || 0);
        }
        return score;
    }

    // ================================================================
    //  Infrastructure uplift (projects within horizon)
    // ================================================================
    _calculateInfrastructureUplift(area, horizonYears) {
        if (!area.infrastructureProjects || area.infrastructureProjects.length === 0) {
            return 0;
        }

        const currentYear = 2026;
        const endYear     = currentYear + horizonYears;
        let uplift        = 0;

        for (const project of area.infrastructureProjects) {
            // Skip Metro Blue Line projects — handled separately
            if (project.name && project.name.toLowerCase().includes("metro blue line")) {
                continue;
            }

            if (project.completionYear <= endYear) {
                const yearsTillCompletion = Math.max(0, project.completionYear - currentYear);
                const yearsOfImpact       = Math.max(0, endYear - project.completionYear);

                if (yearsTillCompletion <= horizonYears) {
                    const anticipation = project.impact * 0.30 *
                        Math.min(1, horizonYears / Math.max(1, yearsTillCompletion));
                    const realization  = project.impact * 0.70 *
                        Math.min(1, yearsOfImpact / 2);
                    uplift += anticipation + realization;
                }
            } else {
                // Very early anticipation for far-future projects
                uplift += project.impact * 0.10 * (horizonYears / 5);
            }
        }

        return uplift;
    }

    // ================================================================
    //  Metro Blue Line specific boost
    // ================================================================
    _calculateMetroBlueLineBoost(area, horizonYears) {
        if (!this.metroBlueLineAreas.includes(area.id)) return 0;

        // Find all Blue Line projects for this area
        const blueLineProjects = (area.infrastructureProjects || []).filter(
            p => p.name && p.name.toLowerCase().includes("metro blue line")
        );

        if (blueLineProjects.length === 0) return 0;

        const currentYear       = 2026;
        const endYear           = currentYear + horizonYears;
        let boost               = 0;

        // Dubai metro studies show 10-25% uplift near new stations.
        // We model anticipation (pre-completion) + realisation.
        for (const project of blueLineProjects) {
            const yearsTillCompletion = Math.max(0, project.completionYear - currentYear);

            if (project.completionYear <= endYear) {
                // Pre-completion: market prices in future connectivity
                const anticipation = project.impact * 0.45 *
                    Math.min(1, horizonYears / Math.max(1, yearsTillCompletion));

                // Post-completion: full accessibility premium realised
                const yearsOfImpact = Math.max(0, endYear - project.completionYear);
                const realization   = project.impact * 0.55 *
                    Math.min(1, yearsOfImpact / 3);

                boost += anticipation + realization;
            } else {
                // Far-future anticipation
                boost += project.impact * 0.15 * (horizonYears / 5);
            }
        }

        // Multiple stations in one area compound benefit (e.g. International City)
        if (blueLineProjects.length >= 3) {
            boost *= 1.15;
        } else if (blueLineProjects.length === 2) {
            boost *= 1.08;
        }

        return boost;
    }

    // ================================================================
    //  Supply pressure — heavy pipeline = downward force
    // ================================================================
    _calculateSupplyPressure(area, horizonYears) {
        const supply         = area.supplyUnits || 0;
        const absorptionRate = (area.demandScore || 50) / 100;
        const volume         = area.transactionVolume || 1;

        // Supply-to-transaction ratio (higher = more risk)
        const supplyRatio = supply / Math.max(volume, 1);

        // How many years of current demand does the pipeline represent?
        const yearsOfSupply = supply / Math.max(volume * absorptionRate, 1);

        let pressure = 0;

        if (supply >= this.supplyPressureThresholds.critical) {
            // JVC-like: 35,000 units is severe oversupply risk
            pressure = -0.06;
        } else if (supply >= this.supplyPressureThresholds.high) {
            pressure = -0.035;
        } else if (supply >= this.supplyPressureThresholds.moderate) {
            pressure = -0.015;
        } else if (supply >= this.supplyPressureThresholds.low) {
            pressure = -0.005;
        } else {
            // Low supply = scarcity premium
            pressure = 0.01;
        }

        // Adjust for absorption strength
        if (absorptionRate > 0.85 && yearsOfSupply < 3) {
            pressure *= 0.5;   // strong demand absorbs supply
        }

        // Longer horizons let market absorb more
        if (horizonYears >= 3 && supply < this.supplyPressureThresholds.critical) {
            pressure *= 0.7;
        }

        return pressure;
    }

    // ================================================================
    //  Developer effect on area pricing
    // ================================================================
    _calculateDeveloperEffect(area, activeDevelopers) {
        let totalPremium = 0;
        let count        = 0;

        const devList = activeDevelopers || area.developers || [];
        for (const devId of (area.developers || [])) {
            if (devList.includes(devId)) {
                totalPremium += this.developerPremiums[devId] || 0;
                count++;
            }
        }

        return count > 0 ? totalPremium / count : 0;
    }

    // ================================================================
    //  Market cycle effect — 2026 moderation from 2025 peak
    // ================================================================
    _calculateMarketCycleEffect(horizonYears) {
        // Cycle position moves forward; moderation dampens the sine curve
        const futurePosition = this.marketCyclePosition + horizonYears * 0.08;
        const cycleFactor    = Math.sin(futurePosition * Math.PI);

        // Apply moderation: 2026 is tapering from peak growth
        const moderated = cycleFactor * (1 - this.moderationFactor) + this.moderationFactor;
        const effect    = moderated * 0.4 + 0.7;

        return Math.max(0.55, Math.min(1.3, effect));
    }

    // ================================================================
    //  News sentiment analysis
    // ================================================================
    _calculateNewsSentiment(area) {
        const newsItems = area.news;
        if (!newsItems || newsItems.length === 0) return 0;

        let totalScore = 0;
        let totalWeight = 0;

        for (let i = 0; i < newsItems.length; i++) {
            const item      = newsItems[i];
            const sentiment = (item.sentiment || "neutral").toLowerCase();
            const score     = this.sentimentScores[sentiment] !== undefined
                              ? this.sentimentScores[sentiment]
                              : 0;

            // More recent news weighted higher (items are sorted newest-first)
            const recencyWeight = 1.0 / (1 + i * 0.3);

            // Amplify strong negative headlines (market reacts asymmetrically)
            const asymmetry = score < 0 ? 1.3 : 1.0;

            totalScore  += score * recencyWeight * asymmetry;
            totalWeight += recencyWeight;
        }

        if (totalWeight === 0) return 0;

        // Normalise to roughly -0.1 .. +0.1 range
        const raw = totalScore / totalWeight;
        return raw * 0.08;
    }

    // ================================================================
    //  Rental yield & rent/sqft prediction
    // ================================================================
    _predictRentalYield(area, horizonYears, annualPriceGrowth) {
        const currentYield    = area.rentalYield || 0;
        const currentRent     = area.avgRentPerSqft || 0;

        if (currentYield === 0 && currentRent === 0) {
            // Emerging area with no rental history — estimate from category
            const estimatedYield = this._estimateEmergingYield(area, horizonYears);
            const futurePrice    = area.currentPricePerSqft * (1 + annualPriceGrowth * horizonYears);
            const estimatedRent  = Math.round(futurePrice * estimatedYield / 100);
            return {
                predictedRentalYield: Math.round(estimatedYield * 100) / 100,
                predictedRentPerSqft: estimatedRent
            };
        }

        // Rent grows slower than prices in a rising market
        // (yield compression), faster than prices in a stagnant market
        let rentGrowthRate;
        if (annualPriceGrowth > 0.08) {
            // Hot market: rents lag prices → yield compresses
            rentGrowthRate = annualPriceGrowth * 0.55;
        } else if (annualPriceGrowth > 0.04) {
            // Normal market: rents track ~70% of price growth
            rentGrowthRate = annualPriceGrowth * 0.70;
        } else {
            // Slow market: rents roughly match or exceed price growth
            rentGrowthRate = annualPriceGrowth * 0.90 + 0.01;
        }

        // Category adjustments for rental growth
        const categoryRentBoost = {
            budget:      0.010,   // strong rental demand
            affordable:  0.008,
            mid:         0.005,
            premium:     0.002,
            luxury:      0.000,
            ultra_luxury:-0.005,
            emerging:    0.005
        };
        rentGrowthRate += categoryRentBoost[area.category] || 0;

        // High current yield areas face yield compression naturally
        if (currentYield > 7.5) {
            rentGrowthRate -= 0.005;
        }

        // Project forward
        const futureRent  = currentRent * Math.pow(1 + rentGrowthRate, horizonYears);
        const futurePrice = area.currentPricePerSqft *
                            Math.pow(1 + annualPriceGrowth, horizonYears);

        const predictedYield = futurePrice > 0
            ? (futureRent / futurePrice) * 100
            : currentYield;

        return {
            predictedRentalYield: Math.round(predictedYield * 100) / 100,
            predictedRentPerSqft: Math.round(futureRent)
        };
    }

    // ── Estimate emerging-area yield ────────────────────────────
    _estimateEmergingYield(area, horizonYears) {
        // Off-plan / emerging projects tend to start yielding once delivered
        if (horizonYears <= 1) return 0;
        if (horizonYears <= 2) return 3.0;
        if (horizonYears <= 3) return 4.5;
        return 5.5;
    }

    // ================================================================
    //  Key drivers — formatted text for UI display
    // ================================================================
    getKeyDrivers(area, prediction, horizonYears) {
        const drivers = [];
        const c       = prediction.components;

        // Sort location factors by impact
        const factorImpacts = [];
        if (area.factors) {
            for (const [factor, value] of Object.entries(area.factors)) {
                const weight = this.featureWeights[factor] || 0;
                factorImpacts.push({ factor, impact: value * weight, value });
            }
            factorImpacts.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
        }

        // ── Positive drivers ────────────────────────────────────
        if (c.momentum > 0.03) {
            drivers.push({
                type: "positive",
                text: "Strong price momentum (+" +
                      (c.momentum * 100).toFixed(1) + "% trend)"
            });
        }

        if (c.metroBlueBoost > 0.01) {
            const stationCount = (area.infrastructureProjects || []).filter(
                p => p.name && p.name.toLowerCase().includes("metro blue line")
            ).length;
            drivers.push({
                type: "positive",
                text: "Metro Blue Line impact (" + stationCount +
                      " station" + (stationCount > 1 ? "s" : "") +
                      ", +" + (c.metroBlueBoost * 100).toFixed(1) + "% uplift)"
            });
        }

        if (c.infraUplift > 0.03) {
            const projects = (area.infrastructureProjects || [])
                .filter(p => {
                    const isBlue = p.name && p.name.toLowerCase().includes("metro blue line");
                    return !isBlue && p.completionYear <= 2026 + horizonYears;
                })
                .map(p => p.name);
            if (projects.length > 0) {
                drivers.push({
                    type: "positive",
                    text: "Infrastructure boost: " + projects.slice(0, 2).join(", ")
                });
            }
        }

        if (c.sentimentScore > 0.003) {
            drivers.push({
                type: "positive",
                text: "Positive news sentiment supporting prices"
            });
        }

        if (c.demandMultiplier > 0.85) {
            drivers.push({
                type: "positive",
                text: "Very high demand (" + area.demandScore + "/100)"
            });
        }

        if (factorImpacts.length > 0 && factorImpacts[0].value > 0.85) {
            const label = factorImpacts[0].factor
                .replace(/([A-Z])/g, " $1")
                .toLowerCase()
                .trim();
            drivers.push({
                type: "positive",
                text: "High " + label + " score (" +
                      (factorImpacts[0].value * 100).toFixed(0) + "%)"
            });
        }

        if (c.yoySignal > 0.04) {
            drivers.push({
                type: "positive",
                text: "Strong recent YoY performance (+" +
                      ((area.yoyChange || 0) * 100).toFixed(1) + "% in 2025)"
            });
        }

        if (c.volumeSignal > 0.02) {
            drivers.push({
                type: "positive",
                text: "High transaction volume (" +
                      (area.transactionVolume || 0).toLocaleString() + " deals)"
            });
        }

        if (c.developerEffect > 0.04) {
            drivers.push({
                type: "positive",
                text: "Premium developer presence boosts area value"
            });
        }

        // ── Risk / negative drivers ─────────────────────────────
        if (c.supplyPressure < -0.04) {
            drivers.push({
                type: "negative",
                text: "Heavy supply pipeline (" +
                      (area.supplyUnits || 0).toLocaleString() +
                      " units) — oversupply risk"
            });
        } else if (c.supplyPressure < -0.01) {
            drivers.push({
                type: "negative",
                text: "Elevated new supply (" +
                      (area.supplyUnits || 0).toLocaleString() + " units)"
            });
        }

        if (area.factors && area.factors.futureSupply > 0.75) {
            drivers.push({
                type: "negative",
                text: "Significant pipeline supply risk"
            });
        }

        if (c.sentimentScore < -0.003) {
            drivers.push({
                type: "negative",
                text: "Negative news sentiment creating headwinds"
            });
        }

        if ((area.yoyChange || 0) > 0.20) {
            drivers.push({
                type: "negative",
                text: "Mean-reversion risk after " +
                      ((area.yoyChange * 100).toFixed(0)) +
                      "% YoY growth in 2025"
            });
        }

        // ── Neutral observations ────────────────────────────────
        if (c.momentum >= 0 && c.momentum <= 0.03) {
            drivers.push({
                type: "neutral",
                text: "Moderate price momentum"
            });
        }

        if (c.marketCycle < 0.85) {
            drivers.push({
                type: "neutral",
                text: "Market cycle moderation expected in 2026-2027"
            });
        }

        if (area.category === "emerging") {
            drivers.push({
                type: "neutral",
                text: "Emerging area — higher uncertainty in forecasts"
            });
        }

        return drivers;
    }

    // ================================================================
    //  ROI calculator for a specific purchase scenario
    // ================================================================
    /**
     * Calculate full ROI for a property investment.
     *
     * @param {object}  area           — area data object from DUBAI_AREAS
     * @param {number}  purchasePrice  — total purchase price in AED
     * @param {number}  unitSizeSqft   — unit size in square feet
     * @param {number}  holdingYears   — investment holding period (years)
     * @returns {object} detailed ROI breakdown
     */
    calculateROI(area, purchasePrice, unitSizeSqft, holdingYears) {
        const prediction = this.predict(area, holdingYears);

        // ── Capital appreciation ────────────────────────────────
        const currentPSF        = purchasePrice / unitSizeSqft;
        const futurePSF         = currentPSF * (1 + prediction.predictedChange);
        const futureValue       = Math.round(futurePSF * unitSizeSqft);
        const capitalGain       = futureValue - purchasePrice;

        // ── Rental income over holding period ───────────────────
        const currentAnnualRent = (area.avgRentPerSqft || 0) * unitSizeSqft;
        const futureAnnualRent  = (prediction.predictedRentPerSqft || 0) * unitSizeSqft;

        // Average rent over the holding period (linear interpolation)
        const avgAnnualRent     = (currentAnnualRent + futureAnnualRent) / 2;
        const totalRentalIncome = Math.round(avgAnnualRent * holdingYears);

        // ── Costs estimate ──────────────────────────────────────
        // DLD fee (4%), agent (2%), maintenance (~15 AED/sqft/yr)
        const acquisitionCost   = purchasePrice * 0.04;
        const agentFee          = purchasePrice * 0.02;
        const annualMaintenance = unitSizeSqft * 15;
        const totalMaintenance  = annualMaintenance * holdingYears;
        const disposalCost      = futureValue * 0.02;
        const totalCosts        = acquisitionCost + agentFee + totalMaintenance + disposalCost;

        // ── Net returns ─────────────────────────────────────────
        const netProfit     = capitalGain + totalRentalIncome - totalCosts;
        const netROI        = netProfit / purchasePrice;
        const annualizedROI = Math.pow(1 + netROI, 1 / holdingYears) - 1;

        // ── Gross metrics (pre-cost) ────────────────────────────
        const grossReturn    = capitalGain + totalRentalIncome;
        const grossROI       = grossReturn / purchasePrice;

        return {
            // Summary
            purchasePrice,
            futureValue,
            holdingYears,

            // Capital
            capitalGain,
            capitalAppreciationPct: prediction.predictedChange,

            // Rental
            currentAnnualRent:     Math.round(currentAnnualRent),
            futureAnnualRent:      Math.round(futureAnnualRent),
            totalRentalIncome,
            currentYield:          area.rentalYield || 0,
            predictedYield:        prediction.predictedRentalYield,

            // Costs
            acquisitionCost:       Math.round(acquisitionCost),
            agentFee:              Math.round(agentFee),
            totalMaintenance:      Math.round(totalMaintenance),
            disposalCost:          Math.round(disposalCost),
            totalCosts:            Math.round(totalCosts),

            // Returns
            grossReturn:           Math.round(grossReturn),
            grossROI:              Math.round(grossROI * 10000) / 10000,
            netProfit:             Math.round(netProfit),
            netROI:                Math.round(netROI * 10000) / 10000,
            annualizedROI:         Math.round(annualizedROI * 10000) / 10000,

            // Underlying forecast
            prediction
        };
    }
}

// Singleton instance
const predictionModel = new PropertyPredictionModel();
