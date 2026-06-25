from flask import Blueprint
from src.controllers import user_controller

user_bp = Blueprint("user_bp", __name__)

user_bp.route("/usuarios", methods=["GET"])(user_controller.listar_usuarios)
user_bp.route("/usuarios/<int:id>", methods=["GET"])(user_controller.buscar_usuario)
user_bp.route("/usuarios", methods=["POST"])(user_controller.criar_usuario)
user_bp.route("/login", methods=["POST"])(user_controller.login)
