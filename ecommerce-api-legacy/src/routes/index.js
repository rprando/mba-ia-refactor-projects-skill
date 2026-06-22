const express = require('express');
const router = express.Router();

const checkoutRoutes = require('./checkout');
const reportRoutes = require('./report');
const userRoutes = require('./user');

router.use('/checkout', checkoutRoutes);
router.use('/admin', reportRoutes); // using /admin because report is /admin/financial-report
router.use('/users', userRoutes);

module.exports = router;
