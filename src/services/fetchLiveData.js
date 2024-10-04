// Importing necessary libraries
const axios = require('axios');

const { analyzeStock } = require('./bot');
const { formatDate, incrementDate } = require('../utils/dateUtils');
const { processTransaction } = require('../controllers/stock');

// Polygon.io API endpoint and API key from the .env file
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

date = 1664942400000;

// Function to fetch stock data
const fetchStockData = async (ticker) => {
    try {
        formattedDate = formatDate(date);
        POLYGON_URL = `https://api.polygon.io/v1/open-close/${ticker}/${formattedDate}?adjusted=true&apiKey=${POLYGON_API_KEY}`;
        const response = await axios.get(POLYGON_URL);
        date = incrementDate(date);
        return response.data;
    } catch (error) {
        console.error('Error fetching stock data:', error.message);
        return null;
    }
};

// Function to process stock data (replace this with your desired function)
const processStockData = async (data) => {
    if (data) {
        const prediction = analyzeStock(data);
        result = {
            "symbol": data.symbol,
            "price": (data.low + data.high) / 2,
            "from": data.from,
            "prediction": prediction
        }
        return result;

    } else {
        result = {
            "symbol": "N/A",
            "price": "N/A",
            "from": "N/A",
            "prediction": "N/A"
        }
        return result;
    }
};

async function fetchDataAndProcess(ticker) {
    const stockData = await fetchStockData(ticker);
    return await processStockData(stockData);
}

const startFetchingStockDataAndAnalyse = (ticker) => {
    setInterval(async () => {
        console.log(`Fetching stock data for ${ticker}...`);
        const result = await fetchDataAndProcess(ticker);
        if ((result != null) & (result.symbol != "N/A")) {
            await processTransaction(result);
        }
    }, 21000); // Fetch data every minute (1000 ms = 1 second) 
    // using 21 seconds to avoid rate limiting
};

module.exports = { startFetchingStockDataAndAnalyse };
