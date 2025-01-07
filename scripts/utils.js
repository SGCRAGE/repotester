export function calculateImpliedProbability(price) {
    return price > 0 ? 100 / (price + 100) : -price / (-price + 100);
}

export function calculateExpectedValue(price, impliedProbability, stake = 100) {
    const payout = price > 0 ? (price / 100) + 1 : (100 / -price) + 1;
    const fairWinProbability = impliedProbability;
    const fairLossProbability = 1 - impliedProbability;
    const profitIfWin = payout * stake - stake;
    const expectedValue = (fairWinProbability * profitIfWin) - (fairLossProbability * stake);
    const expectedValuePercentage = expectedValue * 100; // Convert to percentage

    // Handle small floating-point values
    const threshold = 1e-10;
    return Math.abs(expectedValuePercentage) < threshold ? '0.00' : expectedValuePercentage.toFixed(2);
}
