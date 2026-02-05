// ============================================================
// Dubai Property Forecast Map — ML Prediction Model
// ============================================================
// This model simulates a gradient-boosted regression model trained
// on Dubai real-estate features. It uses weighted factor scoring,
// momentum analysis, supply-demand dynamics, infrastructure uplift,
// and developer premium calculations to produce price forecasts.
// ============================================================

class PropertyPredictionModel {
    constructor() {
        // Feature weights (simulating learned weights from ML training)
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
            futureSupply:     -0.10  // negative: more supply = downward pressure
        };

        // Developer quality premiums (based on track record, brand, quality)
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

        // Base market growth assumptions (annual %)
        this.baseMarketGrowth = 0.05; // 5% base growth
        this.marketCyclePosition = 0.65; // 0-1, where we are in the cycle (0.65 = mid-upswing)
    }

    /**
     * Main prediction method
     * Returns predicted price change % for a given area and time horizon
     */
    predict(area, horizonYears, activeDevelopers = null) {
        const momentum        = this._calculateMomentum(area);
        const locationScore   = this._calculateLocationScore(area);
        const infraUplift     = this._calculateInfrastructureUplift(area, horizonYears);
        const supplyPressure  = this._calculateSupplyPressure(area, horizonYears);
        const developerEffect = this._calculateDeveloperEffect(area, activeDevelopers);
        const marketCycle     = this._calculateMarketCycleEffect(horizonYears);
        const demandMultiplier = area.demandScore / 100;

        // Composite annual growth rate
        let annualGrowth =
            this.baseMarketGrowth * marketCycle +
            momentum * 0.30 +
            locationScore * 0.15 +
            infraUplift +
            supplyPressure +
            developerEffect * 0.05;

        // Apply demand multiplier
        annualGrowth *= (0.5 + demandMultiplier * 0.5);

        // Diminishing returns for longer horizons
        const diminishingFactor = 1 - (horizonYears - 1) * 0.04;
        annualGrowth *= Math.max(0.80, diminishingFactor);

        // Compound over the horizon
        const totalChange = Math.pow(1 + annualGrowth, horizonYears) - 1;

        // Calculate confidence interval
        const uncertainty = 0.03 + horizonYears * 0.025;
        const confidenceLow  = totalChange - uncertainty;
        const confidenceHigh = totalChange + uncertainty;

        return {
            predictedChange: totalChange,
            annualizedRate: annualGrowth,
            confidenceLow,
            confidenceHigh,
            components: {
                momentum,
                locationScore,
                infraUplift,
                supplyPressure,
                developerEffect,
                marketCycle,
                demandMultiplier
            },
            predictedPrice: Math.round(area.currentPricePerSqft * (1 + totalChange))
        };
    }

    /**
     * Price momentum from historical data (trend analysis)
     */
    _calculateMomentum(area) {
        const history = area.priceHistory;
        if (history.length < 3) return 0;

        // Calculate recent growth rates
        const recentRates = [];
        for (let i = 1; i < history.length; i++) {
            recentRates.push((history[i] - history[i - 1]) / history[i - 1]);
        }

        // Weighted average (more recent = more weight)
        let weightedSum = 0;
        let weightTotal = 0;
        for (let i = 0; i < recentRates.length; i++) {
            const weight = i + 1;
            weightedSum += recentRates[i] * weight;
            weightTotal += weight;
        }

        // Acceleration factor
        const recentAvg = (recentRates[recentRates.length - 1] + recentRates[recentRates.length - 2]) / 2;
        const olderAvg  = (recentRates[0] + recentRates[1]) / 2;
        const acceleration = recentAvg - olderAvg;

        return (weightedSum / weightTotal) + acceleration * 0.3;
    }

    /**
     * Location desirability score from area factors
     */
    _calculateLocationScore(area) {
        let score = 0;
        for (const [factor, value] of Object.entries(area.factors)) {
            score += value * (this.featureWeights[factor] || 0);
        }
        return score;
    }

    /**
     * Infrastructure uplift calculation
     */
    _calculateInfrastructureUplift(area, horizonYears) {
        const currentYear = 2026;
        const endYear = currentYear + horizonYears;
        let uplift = 0;

        for (const project of area.infrastructureProjects) {
            if (project.completionYear <= endYear) {
                // Full impact if completed, partial if still building
                const yearsTillCompletion = Math.max(0, project.completionYear - currentYear);
                const yearsOfImpact = Math.max(0, endYear - project.completionYear);

                if (yearsTillCompletion <= horizonYears) {
                    // Pre-completion anticipation (30% of impact)
                    const anticipation = project.impact * 0.30 * Math.min(1, horizonYears / Math.max(1, yearsTillCompletion));
                    // Post-completion realization (70% of impact, spread over years)
                    const realization = project.impact * 0.70 * Math.min(1, yearsOfImpact / 2);
                    uplift += anticipation + realization;
                }
            } else {
                // Very early anticipation for far-future projects
                uplift += project.impact * 0.10 * (horizonYears / 5);
            }
        }

        return uplift;
    }

    /**
     * Supply pressure (oversupply = negative, undersupply = positive)
     */
    _calculateSupplyPressure(area, horizonYears) {
        const absorptionRate = area.demandScore / 100;
        const supplyRatio = area.supplyUnits / 10000; // normalize
        const annualAbsorption = supplyRatio * absorptionRate;

        // How much excess supply remains
        const remainingExcess = Math.max(0, supplyRatio - annualAbsorption * horizonYears);

        return -remainingExcess * 0.08;
    }

    /**
     * Developer effect on area pricing
     */
    _calculateDeveloperEffect(area, activeDevelopers) {
        let totalPremium = 0;
        let count = 0;

        const devList = activeDevelopers || area.developers;
        for (const devId of area.developers) {
            if (devList.includes(devId)) {
                totalPremium += this.developerPremiums[devId] || 0;
                count++;
            }
        }

        return count > 0 ? totalPremium / count : 0;
    }

    /**
     * Market cycle effect (where we are in boom/bust)
     */
    _calculateMarketCycleEffect(horizonYears) {
        // Simulate cycle position moving forward
        const futurePosition = this.marketCyclePosition + horizonYears * 0.08;
        const cycleEffect = Math.sin(futurePosition * Math.PI) * 0.4 + 0.8;
        return Math.max(0.5, Math.min(1.5, cycleEffect));
    }

    /**
     * Generate key drivers text for a prediction
     */
    getKeyDrivers(area, prediction, horizonYears) {
        const drivers = [];
        const c = prediction.components;

        // Sort factors by impact
        const factorImpacts = [];
        for (const [factor, value] of Object.entries(area.factors)) {
            const weight = this.featureWeights[factor] || 0;
            factorImpacts.push({ factor, impact: value * weight, value });
        }
        factorImpacts.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

        // Top positive drivers
        if (c.momentum > 0.03) {
            drivers.push({ type: "positive", text: `Strong price momentum (+${(c.momentum * 100).toFixed(1)}% trend)` });
        }
        if (c.infraUplift > 0.03) {
            const projects = area.infrastructureProjects
                .filter(p => p.completionYear <= 2026 + horizonYears)
                .map(p => p.name);
            drivers.push({ type: "positive", text: `Infrastructure boost: ${projects.slice(0, 2).join(", ")}` });
        }
        if (factorImpacts[0] && factorImpacts[0].value > 0.8) {
            drivers.push({ type: "positive", text: `High ${factorImpacts[0].factor.replace(/([A-Z])/g, ' $1').toLowerCase()} score (${(factorImpacts[0].value * 100).toFixed(0)}%)` });
        }
        if (c.demandMultiplier > 0.85) {
            drivers.push({ type: "positive", text: `Very high demand (${area.demandScore}/100)` });
        }

        // Risks
        if (c.supplyPressure < -0.03) {
            drivers.push({ type: "negative", text: `High new supply (${area.supplyUnits.toLocaleString()} units)` });
        }
        if (area.factors.futureSupply > 0.70) {
            drivers.push({ type: "negative", text: "Significant pipeline supply risk" });
        }
        if (c.momentum < 0.02) {
            drivers.push({ type: "neutral", text: "Moderate price momentum" });
        }

        return drivers;
    }
}

// Singleton instance
const predictionModel = new PropertyPredictionModel();
