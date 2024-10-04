const mongoose = require('mongoose');

// Stock Schema
// - availableBalance
// - stocksOwned
// - stockSymbol
// - stockPrice
// - isNewStock (true/false)
// - tradeAction (buy/sell/observe)
// - tradeDate: new Date(stockData.from)
// - timeStamps

const stockSchema = new mongoose.Schema({
    stockSymbol: {
        type: String,
        required: true
    },
    stockPrice: {
        type: Number,
        required: true
    },
    tradeAction: {
        type: String,
        required: true
    },
    isNewStock: {
        type: Boolean,
        default: true
    },
    tradeDate:{
        type: Date,
        default: Date.now
    },
    availableBalance: {
        type: Number,
        required: true
    },
    stocksOwned: {
        type: Number,
        required: true,
        default: 0
    }
},
{
    timestamps: true
})

// result = {
//     "symbol": data.symbol,
//     "price": (data.low + data.high) / 2,
//     "from": data.from,
//     "prediction": prediction
// }

const STOCK = mongoose.model('Stock', stockSchema);

module.exports = {
    STOCK
}