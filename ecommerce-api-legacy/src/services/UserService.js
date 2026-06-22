const Database = require('../models/Database');

class UserService {
    static async deleteUser(id) {
        // Cascade delete: first find enrollments
        const enrollments = await Database.all("SELECT id FROM enrollments WHERE user_id = ?", [id]);
        
        for (const enr of enrollments) {
            // Delete payments for this enrollment
            await Database.run("DELETE FROM payments WHERE enrollment_id = ?", [enr.id]);
        }
        
        // Delete enrollments
        await Database.run("DELETE FROM enrollments WHERE user_id = ?", [id]);
        
        // Delete user
        await Database.run("DELETE FROM users WHERE id = ?", [id]);
        
        return "Usuário deletado com sucesso (registros de matrícula e pagamento também foram limpos).";
    }
}

module.exports = UserService;
