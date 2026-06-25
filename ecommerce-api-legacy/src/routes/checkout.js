const express = require('express');
const router = express.Router();
const CheckoutController = require('../controllers/CheckoutController');

// Endpoint GET amigável para quem acessar pelo navegador
router.get('/', (req, res) => {
    res.json({
        mensagem: "Serviço de Checkout Ativo (Frankenstein LMS)",
        instrucoes: "Para realizar um checkout, envie uma requisição POST para esta mesma URL (/api/checkout) com o body em JSON.",
        exemplo_payload: {
            usr: "Guilherme",
            eml: "gui@fullcycle.com.br",
            pwd: "senhaforte",
            c_id: 2,
            card: "4111222233334444"
        },
        cursos_disponiveis: [
            { id: 1, title: "Clean Architecture", price: 997.00 },
            { id: 2, title: "Docker", price: 497.00 }
        ],
        status: "online"
    });
});

// Endpoint POST para processamento real de pagamentos
router.post('/', CheckoutController.process);

module.exports = router;
