const { STOCK } = require('../models/stock');
const { INITIAL_BOT_BALANCE } = require('../config');
// Stock Schema
// - availableBalance
// - stocksOwned
// - stockSymbol
// - stockPrice
// - isNewStock (true/false)
// - tradeAction (buy/sell/observe)
// - tradeDate: new Date(stockData.from)
// - timeStamps

async function handleFetchNewRequest(req, res) {
    try {
        const newStocks = await STOCK.find({ isNewStock: true }).exec();
        await STOCK.updateMany({ isNewStock: true }, { $set: { isNewStock: false } });
        if(newStocks.length > 0){
            // ge the balance and price of last stock from newStocks
            const lastStock = newStocks[newStocks.length - 1];
            const lastestBalance = lastStock.availableBalance;
            const latestStockOwned = lastStock.stocksOwned;
            stockData = {
                noChange: false,
                stocks : newStocks.map(stock => ({
                    price: stock.stockPrice,
                    action: stock.tradeAction,
                    date: stock.tradeDate,
                })),
                balance: lastestBalance,
                stockOwned: latestStockOwned
            }
            res.status(200).json(stockData);
        }   
        else{
            res.status(200).json({noChange: true});
        }

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching new stocks.' });
    }
}

async function handleFetchAllRequest(req, res) {
    try {
        const stocks = await STOCK.find({}).sort({ tradeDate: 1 }).exec();
        await STOCK.updateMany({ isNewStock: true }, { $set: { isNewStock: false } });
        if(stocks.length > 10){
            // Get the last 10 stocks
            stocks = stocks.slice(stocks.length - 10);
        }
        const availableBalance = stocks.length > 0 ? stocks[stocks.length - 1].availableBalance : INITIAL_BOT_BALANCE;
        const stocksOwned = stocks.length > 0 ? stocks[stocks.length - 1].stocksOwned : 0;
        const stockData = {
            price: stocks.map(stock => stock.stockPrice),
            date: stocks.map(stock => stock.tradeDate),
            action: stocks.map(stock => stock.tradeAction),
            balance: availableBalance,
            stockOwned: stocksOwned
        };
        res.status(200).json(stockData);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching all stocks.' });
    }
}

async function processTransaction(stockData) {
    try {
        const { currentBalance, stocksOwned } = await fetchAvailableBalanceAndStocksHeld();
        let newStock = {
            stockSymbol: stockData.symbol,
            stockPrice: stockData.price,
            tradeAction: 'observe', // Default to observe
            tradeDate: new Date(stockData.from), // Convert 'from' to Date
            isNewStock: true,
            availableBalance: currentBalance,
            stocksOwned: stocksOwned
        };

        if (stockData.prediction === 'buy' && currentBalance >= stockData.price) {
            newStock.tradeAction = 'buy';
            newStock.availableBalance = currentBalance - stockData.price;
            newStock.stocksOwned = stocksOwned + 1;
        } else if (stockData.prediction === 'sell' && stocksOwned > 0) {
            newStock.tradeAction = 'sell';
            newStock.availableBalance = currentBalance + stockData.price;
            newStock.stocksOwned = stocksOwned - 1;
        }
        console.log(`Transaction: ${newStock.tradeAction} at $${newStock.stockPrice} | Balance: $${newStock.availableBalance} | Stocks: ${newStock.stocksOwned}`);
        await STOCK.create(newStock);
    } catch (error) {
        console.error('Error processing Transaction:', error.message);
    }
}

async function fetchAvailableBalanceAndStocksHeld(){
    const latestStock = await STOCK.findOne().sort({ tradeDate: -1 }).exec();
    if (latestStock) {
        return {
            currentBalance: latestStock.availableBalance,
            stocksOwned: latestStock.stocksOwned
        };
    } else {
        return {
            currentBalance: INITIAL_BOT_BALANCE,
            stocksOwned: 0
        };
    }
}

module.exports = {
    handleFetchNewRequest, handleFetchAllRequest, processTransaction, fetchAvailableBalanceAndStocksHeld
}