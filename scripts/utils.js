export function calculateImpliedProbability(price) {
    return price > 0 ? 100 / (price + 100) : -price / (-price + 100);
}

export function calculateExpectedValue(price, fairOdds) {
    const impliedProbability = calculateImpliedProbability(price);
    const decimalOdds = price > 0 ? (price / 100) + 1 : (100 / -price) + 1;
    const expectedValue = (impliedProbability * decimalOdds) - 1;

    // Handle small floating-point values
    const threshold = 1e-10;
    return Math.abs(expectedValue) < threshold ? '0.00%' : (expectedValue * 100).toFixed(2) + '%';
}

export function calculateNoVigFairOdds(outcomes) {
    const totalImpliedProbability = outcomes.reduce((sum, outcome) => sum + calculateImpliedProbability(outcome.price), 0);
    return outcomes.map(outcome => {
        const impliedProbability = calculateImpliedProbability(outcome.price);
        const fairProbability = impliedProbability / totalImpliedProbability;
        const decimalFairOdds = 1 / fairProbability;
        const fairOdds = decimalFairOdds < 2.0 ? -100 / (decimalFairOdds - 1) : (decimalFairOdds - 1) * 100;
        return {
            ...outcome,
            fairOdds: fairOdds > 0 ? `+${fairOdds.toFixed(2)}` : fairOdds.toFixed(2)
        };
    });
}
