const mongoose = require('mongoose');
const { INITIAL_DUMMY_DB_ENTRY } = require('../config');
const { STOCK } = require('../models/stock');

async function connect(url) {
    return mongoose.connect(url).then(() => {
        console.log('Connected to MongoDB');
        mongoose.connection.db.dropDatabase();
        const stock = new STOCK(INITIAL_DUMMY_DB_ENTRY);
        stock.save();
    }).catch((err) => {
        console.error('Error while connecting to DB: ', err);
    });
}   

module.exports = connect;