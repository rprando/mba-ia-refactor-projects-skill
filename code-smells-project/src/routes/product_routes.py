from flask import Blueprint
from src.controllers import product_controller

product_bp = Blueprint("product_bp", __name__, url_prefix="/produtos")

product_bp.route("", methods=["GET"])(product_controller.listar_produtos)
product_bp.route("/busca", methods=["GET"])(product_controller.buscar_produtos)
product_bp.route("/<int:id>", methods=["GET"])(product_controller.buscar_produto)
product_bp.route("", methods=["POST"])(product_controller.criar_produto)
product_bp.route("/<int:id>", methods=["PUT"])(product_controller.atualizar_produto)
product_bp.route("/<int:id>", methods=["DELETE"])(product_controller.deletar_produto)
