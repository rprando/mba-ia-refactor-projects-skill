const bcrypt = require('bcrypt');
const Database = require('../models/Database');
const { config, logAndCache } = require('../utils');

class CheckoutService {
    static async processCheckout(userData, courseData, card) {
        let user = await Database.get("SELECT id FROM users WHERE email = ?", [userData.eml]);

        let userId;
        if (!user) {
            const hash = await bcrypt.hash(userData.pwd || "123456", 10);
            const result = await Database.run("INSERT INTO users (name, email, pass) VALUES (?, ?, ?)", [userData.usr, userData.eml, hash]);
            userId = result.lastID;
        } else {
            userId = user.id;
        }

        console.log(`Processando cartão ${card} na chave ${config.paymentGatewayKey}`);
        let status = card.startsWith("4") ? "PAID" : "DENIED";

        if (status === "DENIED") {
            throw new Error("Pagamento recusado");
        }

        const enrollmentResult = await Database.run("INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)", [userId, courseData.id]);
        const enrId = enrollmentResult.lastID;

        await Database.run("INSERT INTO payments (enrollment_id, amount, status) VALUES (?, ?, ?)", [enrId, courseData.price, status]);

        await Database.run("INSERT INTO audit_logs (action, created_at) VALUES (?, datetime('now'))", [`Checkout curso ${courseData.id} por ${userId}`]);

        logAndCache(`last_checkout_${userId}`, courseData.title);

        return { msg: "Sucesso", enrollment_id: enrId };
    }
}

module.exports = CheckoutService;
