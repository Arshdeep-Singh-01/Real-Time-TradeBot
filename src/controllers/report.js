const fs = require('fs');
const path = require('path');
const { STOCK } = require('../models/stock');

// Function to handle the report generation request
async function handleGenerateReport(req , res, num) {
    const numTransactions = num;
    if (!numTransactions || numTransactions <= 0) {
        return res.status(400).json({ error: 'Invalid number of transactions' });
    }

    try {
        // Fetch stock data from the database
        const stocks = await STOCK.find({})
            .sort({ tradeDate: -1 })
            .limit(numTransactions);

        // Create report object
        const report = {
            transactions: stocks.map(stock => ({
                stockPrice: stock.stockPrice,
                tradeAction: stock.tradeAction,
                tradeDate: stock.tradeDate,
                availableBalance: stock.availableBalance,
                stocksOwned: stock.stocksOwned
            }))
        };

        // return csv report
        res.setHeader('Content-Disposition', `attachment; filename=report-${Date.now()}.csv`);
        res.setHeader('Content-Type', 'text/csv');
        const header = 'Stock Price,Trade Action,Trade Date,Available Balance,Stocks Owned';
        const csv = [
            header,
            ...stocks.map(stock => `${stock.stockPrice},${stock.tradeAction},${stock.tradeDate},${stock.availableBalance},${stock.stocksOwned}`)
        ].join('\n');
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error, error in report generation' });
    }
}

module.exports = { handleGenerateReport };
