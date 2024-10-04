let stockHistory = [146.588, 139.785, 138.34, 137.53, 138.367, 137.22]; // Store stock price history for the single symbol
const SHORT_TERM_PERIOD = 3; // Short-term moving average period
const LONG_TERM_PERIOD = 5; // Long-term moving average period

// Function to calculate moving average
const calculateMovingAverage = (prices, period) => {
    if (prices.length < period) return null;
    const sum = prices.slice(-period).reduce((acc, price) => acc + price, 0);
    return sum / period;
};

// Analyze stock data and return a prediction: buy, sell, observe
const analyzeStock = (data) => {
    const currentPrice = (data.high + data.low) / 2; // Use average of high and low prices
    let prediction = 'observe'; // Default to observing

    // Add current price to stock history
    stockHistory.push(currentPrice);

    // Calculate short-term and long-term moving averages
    const shortTermMA = calculateMovingAverage(stockHistory, SHORT_TERM_PERIOD);
    const longTermMA = calculateMovingAverage(stockHistory, LONG_TERM_PERIOD);

    // Momentum thresholds: buy if price drops by 2%, sell if price rises by 3%
    const initialPrice = stockHistory[0];
    const dropThreshold = initialPrice * 0.98; // 2% drop
    const riseThreshold = initialPrice * 1.03; // 3% rise

    // Moving average crossover + momentum strategy
    if (shortTermMA && longTermMA) {
        // Buy condition: short-term MA crosses above long-term MA or price drops by 2%
        if (shortTermMA > longTermMA && currentPrice <= dropThreshold) {
            prediction = 'buy';
        }

        // Sell condition: short-term MA crosses below long-term MA or price rises by 3%
        else if (shortTermMA < longTermMA && currentPrice >= riseThreshold) {
            prediction = 'sell';
        }
    }
    console.log(`Prediction: ${prediction}, Current Price: ${currentPrice}`);
    return prediction; // Return the prediction (buy, sell, or observe)
};

module.exports = { analyzeStock };