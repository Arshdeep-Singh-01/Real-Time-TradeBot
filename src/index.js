const express = require('express');
const path = require('path');
const { startFetchingStockDataAndAnalyse } = require('./services/fetchLiveData');
const { STOCK_SYMBOL } = require('./config');
const connect = require('./services/connectToDB');

require('dotenv').config(); // Load environment variables

const app = express();
const port = 3000;

// Import routers;
const staticRouter = require('./routes/static');
const botRouter = require('./routes/stock');
const reportRouter = require('./routes/report');

// Connect to DB
const url = process.env.MONGODB_URL;
connect(url);

app.set('view engine', 'ejs');
app.set('views', path.resolve('./src/views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    if (req.url != '/favicon.ico') {
        console.log(`Incoming request: ${req.method}  ${req.url}`);
    }
    next();
});

// Start fetching stock data and make decisions
startFetchingStockDataAndAnalyse(STOCK_SYMBOL);

// Routes
app.use('/report', reportRouter);
app.use('/stock', botRouter);
app.use('/', staticRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});