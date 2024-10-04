const express = require('express');
const router = express.Router();

const { handleGetHome } = require('../controllers/static');

router.get('/', handleGetHome);

module.exports = router;