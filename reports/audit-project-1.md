# ARCHITECTURE AUDIT REPORT

**Project:** code-smells-project
**Stack:**   Python + Flask
**Files:**   4 analyzed

## Summary
CRITICAL: 3 | HIGH: 2 | MEDIUM: 2 | LOW: 1

## Findings

### [CRITICAL] Hardcoded Credentials
**File:** app.py:8
**Description:** `SECRET_KEY` definida diretamente no código.
**Impact:** Risco de segurança e exposição de segredos.
**Recommendation:** Mover para variáveis de ambiente.

### [CRITICAL] SQL Injection Vulnerability
**File:** models.py:27, 44, 76, 103, 117, 142, 237
**Description:** Uso de concatenação de strings para montar queries SQL.
**Impact:** Permite execução de código malicioso no banco de dados.
**Recommendation:** Utilizar parametrização (Prepared Statements).

### [CRITICAL] Arbitrary SQL Execution
**File:** app.py:46
**Description:** Endpoint `/admin/query` permite execução de SQL arbitrário do cliente.
**Impact:** Backdoor que permite controle total do banco de dados.
**Recommendation:** Remover o endpoint ou restringir drasticamente.

### [HIGH] Fat Controllers
**File:** controllers.py:1-200
**Description:** Controllers contêm lógica de validação, regras de negócio e efeitos colaterais.
**Impact:** Difícil de testar e manter; viola o SRP.
**Recommendation:** Mover lógica de negócio para Services e validações para middlewares ou helpers.

### [HIGH] Business Logic in Models
**File:** models.py:186
**Description:** Função `relatorio_vendas` calcula descontos e métricas de negócio.
**Impact:** Acoplamento da regra de negócio com a persistência.
**Recommendation:** Mover lógica de cálculo para uma camada de serviço.

### [MEDIUM] Information Leakage
**File:** controllers.py:270
**Description:** Endpoint `health_check` retorna segredos como a `SECRET_KEY`.
**Impact:** Facilita ataques ao expor chaves internas.
**Recommendation:** Remover dados sensíveis da resposta de saúde.

### [MEDIUM] Query N+1
**File:** models.py:133, 161
**Description:** Consultas SQL executadas dentro de loops para buscar itens de pedidos.
**Impact:** Problemas de performance com aumento do volume de dados.
**Recommendation:** Utilizar `JOIN` ou carregar itens em lote.

### [LOW] Magic Numbers / Hardcoded Config
**File:** app.py:72
**Description:** Porta e host do servidor hardcoded no `app.run`.
**Impact:** Dificulta deploy em ambientes diferentes.
**Recommendation:** Ler porta e host de variáveis de ambiente.

---

**Total:** 8 findings
