export function calculateImpliedProbability(price) {
    return price > 0 ? 100 / (price + 100) : -price / (-price + 100);
}

export function calculateExpectedValuePercent(probability, payout, amountBet) {
    const probabilityOfLosing = 1 - probability;
    const expectedValue = (probability * payout) - (probabilityOfLosing * amountBet);
    return (expectedValue / amountBet) * 100; // Convert to percentage
}
