const UserService = require('../services/UserService');

class UserController {
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
