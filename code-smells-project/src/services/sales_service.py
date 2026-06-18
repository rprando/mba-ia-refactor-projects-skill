def calcular_desconto(faturamento):
    if faturamento > 10000:
        return faturamento * 0.1
    elif faturamento > 5000:
        return faturamento * 0.05
    elif faturamento > 1000:
        return faturamento * 0.02
    return 0

def gerar_relatorio_vendas(pedidos_model):
    stats = pedidos_model.get_stats()
    faturamento = stats["faturamento"]
    desconto = calcular_desconto(faturamento)
    
    return {
        "total_pedidos": stats["total"],
        "faturamento_bruto": round(faturamento, 2),
        "desconto_aplicavel": round(desconto, 2),
        "faturamento_liquido": round(faturamento - desconto, 2),
        "pedidos_pendentes": stats["pendentes"],
        "pedidos_aprovados": stats["aprovados"],
        "pedidos_cancelados": stats["cancelados"],
        "ticket_medio": round(faturamento / stats["total"], 2) if stats["total"] > 0 else 0
    }
