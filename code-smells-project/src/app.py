import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, jsonify, request
from flask_cors import CORS
from src.config.settings import Config
from src.database import close_db, init_db, get_db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    init_db(app)

    from src.routes.product_routes import product_bp
    from src.routes.user_routes import user_bp
    from src.routes.order_routes import order_bp
    
    app.register_blueprint(product_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(order_bp)

    @app.route("/")
    def index():
        return jsonify({
            "mensagem": "API da Loja Refatorada",
            "status": "online",
            "versao": "1.0.0",
            "endpoints": {
                "produtos": "/produtos",
                "usuarios": "/usuarios",
                "pedidos": "/pedidos",
                "login": "/login",
                "relatorios": "/relatorios/vendas",
                "health": "/health"
            }
        })

    @app.route("/health", methods=["GET"])
    def health_check():
        try:
            db = get_db()
            cursor = db.cursor()
            cursor.execute("SELECT 1")
            cursor.execute("SELECT COUNT(*) FROM produtos")
            produtos = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM usuarios")
            usuarios = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM pedidos")
            pedidos = cursor.fetchone()[0]

            return jsonify({
                "status": "ok",
                "database": "connected",
                "counts": {
                    "produtos": produtos,
                    "usuarios": usuarios,
                    "pedidos": pedidos
                },
                "versao": "1.0.0",
                "ambiente": "producao",
                "db_path": Config.DB_PATH,
                "debug": Config.DEBUG,
                "secret_key": Config.SECRET_KEY
            }), 200
        except Exception as e:
            return jsonify({"status": "erro", "detalhes": str(e)}), 500

    @app.route("/admin/reset-db", methods=["POST"])
    def reset_database():
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM itens_pedido")
        cursor.execute("DELETE FROM pedidos")
        cursor.execute("DELETE FROM produtos")
        cursor.execute("DELETE FROM usuarios")
        db.commit()
        print("!!! BANCO DE DADOS RESETADO !!!")
        return jsonify({"mensagem": "Banco de dados resetado", "sucesso": True}), 200

    @app.route("/admin/query", methods=["POST"])
    def executar_query():
        dados = request.get_json()
        query = dados.get("sql", "")
        if not query:
            return jsonify({"erro": "Query não informada"}), 400

        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute(query)
            if query.strip().upper().startswith("SELECT"):
                rows = cursor.fetchall()
                result = [dict(row) for row in rows]
                return jsonify({"dados": result, "sucesso": True}), 200
            else:
                db.commit()
                return jsonify({"mensagem": "Query executada", "sucesso": True}), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    app.teardown_appcontext(close_db)
    
    return app

if __name__ == "__main__":
    app = create_app()
    print("=" * 50)
    print("SERVIDOR INICIADO (REFATORADO)")
    print(f"Rodando em http://{Config.HOST}:{Config.PORT}")
    print("=" * 50)
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
