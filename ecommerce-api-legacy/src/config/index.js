require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    dbPath: process.env.DB_PATH || ':memory:',
    paymentGatewayKey: process.env.PAYMENT_GATEWAY_KEY || "pk_test_default",
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS
};
