const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');

router.get('/financial-report', ReportController.getReport);

module.exports = router;
