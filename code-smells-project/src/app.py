from flask import Flask, jsonify
from flask_cors import CORS
from .config.settings import Config
from .database import close_db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    # Registro de Blueprints (simplificado para o exemplo)
    from .routes.product_routes import product_bp
    from .routes.user_routes import user_bp
    from .routes.order_routes import order_bp
    
    app.register_blueprint(product_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(order_bp)

    @app.route("/")
    def index():
        return jsonify({"mensagem": "API da Loja Refatorada", "status": "online"})

    app.teardown_appcontext(close_db)
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
