const Database = require('../models/Database');

class UserService {
    static async listUsers() {
        return await Database.all("SELECT id, name, email FROM users");
    }

    static async getUserById(id) {
        const user = await Database.get("SELECT id, name, email FROM users WHERE id = ?", [id]);
        if (!user) return null;
        const enrollments = await Database.all("SELECT course_id FROM enrollments WHERE user_id = ?", [id]);
        user.enrollments = enrollments;
        return user;
    }

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
