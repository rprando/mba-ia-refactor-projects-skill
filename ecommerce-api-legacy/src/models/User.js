class User {
    constructor(db) {
        this.db = db;
    }

    async findByEmail(email) {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    async create(name, email, pass) {
        return new Promise((resolve, reject) => {
            this.db.run("INSERT INTO users (name, email, pass) VALUES (?, ?, ?)", [name, email, pass], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    }
    
    async delete(id) {
        return new Promise((resolve, reject) => {
            // Aqui poderíamos adicionar lógica de limpeza de órfãos
            this.db.run("DELETE FROM users WHERE id = ?", [id], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = User;
