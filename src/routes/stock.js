const express = require('express');
const router = express.Router();

const { handleFetchNewRequest, handleFetchAllRequest } = require('../controllers/stock');

router.get('/fetch-new', handleFetchNewRequest);
router.get('/fetch-all', handleFetchAllRequest);

module.exports = router;