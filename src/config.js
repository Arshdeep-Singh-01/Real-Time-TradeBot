STOCK_SYMBOL = 'AAPL';
INITIAL_BOT_BALANCE = 10000;
INITIAL_DUMMY_DB_ENTRY = {
    stockSymbol: STOCK_SYMBOL,
    stockPrice: 150,
    tradeAction: 'observe',
    availableBalance: INITIAL_BOT_BALANCE,
    stocksOwned: 0,
    isNewStock: true,
    tradeDate: new Date('2022-09-30')
};

module.exports = {
    STOCK_SYMBOL,
    INITIAL_BOT_BALANCE,
    INITIAL_DUMMY_DB_ENTRY
}