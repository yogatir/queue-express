const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, getDashboardData);

module.exports = router;