require('dotenv').config();

const config = {
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS, 
    paymentGatewayKey: process.env.PAYMENT_GATEWAY_KEY,
    smtpUser: process.env.SMTP_USER,
    port: process.env.PORT || 3000
};

let globalCache = {};
let totalRevenue = 0;

function logAndCache(key, data) {
    console.log(`[LOG] Salvando no cache: ${key}`);
    globalCache[key] = data;
}

module.exports = { config, logAndCache, globalCache, totalRevenue };
