const express = require('express');
const router = express.Router();

const { handleGenerateReport } = require('../controllers/report');

router.get('/', (req, res) => {
    const { num } = req.query; // Retrieve num from query parameters
    handleGenerateReport(req, res, num); // Pass num to the handler
});


module.exports = router;