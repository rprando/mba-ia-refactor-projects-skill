const express = require('express');
const router = express.Router();
const CheckoutController = require('../controllers/CheckoutController');

router.post('/', CheckoutController.process);

module.exports = router;
