export function calculateImpliedProbability(price) {
    return price > 0 ? 100 / (price + 100) : -price / (-price + 100);
}

export function calculateExpectedValue(price, impliedProbability, stake = 100) {
    const payout = price > 0 ? (price / 100) + 1 : (100 / -price) + 1;
    const fairWinProbability = impliedProbability;
    const fairLossProbability = 1 - impliedProbability;
    const profitIfWin = payout * stake - stake;
    const expectedValue = (fairWinProbability * profitIfWin) - (fairLossProbability * stake);

    // Handle small floating-point values
    const threshold = 1e-10;
    return Math.abs(expectedValue) < threshold ? '0.00' : expectedValue.toFixed(2);
}

export function calculateNoVigFairOdds(outcomes) {
    const totalImpliedProbability = outcomes.reduce((sum, outcome) => sum + calculateImpliedProbability(outcome.price), 0);
    return outcomes.map(outcome => {
        const impliedProbability = calculateImpliedProbability(outcome.price);
        const fairProbability = impliedProbability / totalImpliedProbability;
        const fairOdds = fairProbability > 0.5 ? -(100 / fairProbability - 100) : (100 / (1 - fairProbability) - 100);
        return {
            ...outcome,
            fairOdds: fairOdds.toFixed(2)
        };
    });
}
