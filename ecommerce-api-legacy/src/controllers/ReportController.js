const ReportService = require('../services/ReportService');

class ReportController {
    static async getReport(req, res) {
        try {
            const report = await ReportService.generateFinancialReport();
            res.json(report);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro interno ao gerar relatório");
        }
    }
}

module.exports = ReportController;
