export function calculateImpliedProbability(price) {
    return price > 0 ? 100 / (price + 100) : -price / (-price + 100);
}

export function calculateExpectedValue(price, fairOdds, stake = 100) {
    const payout = price > 0 ? (price / 100) + 1 : (100 / -price) + 1;
    const fairWinProbability = calculateImpliedProbability(fairOdds);
    const fairLossProbability = 1 - fairWinProbability;
    const profitIfWin = payout * stake - stake;
    const expectedValue = (fairWinProbability * profitIfWin) - (fairLossProbability * stake);

    // Handle small floating-point values
    const threshold = 1e-10;
    return Math.abs(expectedValue) < threshold ? '0.00%' : (expectedValue / stake * 100).toFixed(2) + '%';
}

export function calculateNoVigFairOdds(outcomes) {
    const totalImpliedProbability = outcomes.reduce((sum, outcome) => sum + calculateImpliedProbability(outcome.price), 0);
    return outcomes.map(outcome => {
        const impliedProbability = calculateImpliedProbability(outcome.price);
        const fairProbability = impliedProbability / totalImpliedProbability;
        const fairOdds = fairProbability > 0.5 ? -(100 / fairProbability - 100) : (100 / (1 - fairProbability) - 100);
        return {
            ...outcome,
            fairOdds: fairOdds > 0 ? `+${fairOdds.toFixed(2)}` : fairOdds.toFixed(2)
        };
    });
}
