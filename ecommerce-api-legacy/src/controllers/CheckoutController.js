const CheckoutService = require('../services/CheckoutService');
const Database = require('../models/Database');

class CheckoutController {
    static async process(req, res) {
        try {
            let u = req.body.usr;
            let e = req.body.eml;
            let p = req.body.pwd;
            let cid = req.body.c_id;
            let cc = req.body.card;

            if (!u || !e || !cid || !cc) return res.status(400).send("Bad Request");

            const course = await Database.get("SELECT * FROM courses WHERE id = ? AND active = 1", [cid]);
            if (!course) return res.status(404).send("Curso não encontrado");

            const userData = { usr: u, eml: e, pwd: p };
            const result = await CheckoutService.processCheckout(userData, course, cc);

            res.status(200).json(result);
        } catch (err) {
            if (err.message === "Pagamento recusado") {
                return res.status(400).send("Pagamento recusado");
            }
            console.error(err);
            res.status(500).send("Erro interno ao processar checkout");
        }
    }
}

module.exports = CheckoutController;
