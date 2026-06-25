const UserService = require('../services/UserService');

class UserController {
    static async list(req, res) {
        try {
            const users = await UserService.listUsers();
            res.json({ dados: users, sucesso: true });
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro interno ao listar usuários");
        }
    }

    static async get(req, res) {
        try {
            let id = req.params.id;
            const user = await UserService.getUserById(id);
            if (!user) return res.status(404).json({ erro: "Usuário não encontrado", sucesso: false });
            res.json({ dados: user, sucesso: true });
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro interno ao buscar usuário");
        }
    }

    static async delete(req, res) {
        try {
            let id = req.params.id;
            const msg = await UserService.deleteUser(id);
            res.send(msg);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro interno ao deletar usuário");
        }
    }
}

module.exports = UserController;
