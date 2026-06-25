from flask import Blueprint
from src.controllers import order_controller

order_bp = Blueprint("order_bp", __name__)

order_bp.route("/pedidos", methods=["POST"])(order_controller.criar_pedido)
order_bp.route("/pedidos", methods=["GET"])(order_controller.listar_todos_pedidos)
order_bp.route("/pedidos/usuario/<int:usuario_id>", methods=["GET"])(order_controller.listar_pedidos_usuario)
order_bp.route("/pedidos/<int:pedido_id>/status", methods=["PUT"])(order_controller.atualizar_status_pedido)
order_bp.route("/relatorios/vendas", methods=["GET"])(order_controller.relatorio_vendas)
