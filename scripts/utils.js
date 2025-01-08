export function calculateImpliedProbability(price) {
    return price > 0 ? 100 / (price + 100) : -price / (-price + 100);
}
