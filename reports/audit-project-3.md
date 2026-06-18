# ARCHITECTURE AUDIT REPORT

**Project:** task-manager-api
**Stack:**   Python + Flask
**Files:**   10 analyzed

## Summary
CRITICAL: 1 | HIGH: 1 | MEDIUM: 2 | LOW: 1

## Findings

### [CRITICAL] Hardcoded Credentials
**File:** app.py:13
**Description:** `SECRET_KEY` exposta no arquivo principal.
**Impact:** Comprometimento da segurança da aplicação.
**Recommendation:** Usar `os.getenv`.

### [HIGH] Fat Routes / Business Logic in Routes
**File:** routes/task_routes.py:15, 60
**Description:** Lógica de cálculo de tarefas atrasadas (overdue) e validações extensas dentro das funções de rota.
**Impact:** Dificulta a reutilização da lógica em outros lugares (ex: relatórios) e torna os testes unitários complexos.
**Recommendation:** Mover lógica de "overdue" para o Model ou para um Service.

### [MEDIUM] Query N+1
**File:** routes/task_routes.py:25-45
**Description:** Busca individual de `User` e `Category` dentro de um loop de listagem de tarefas.
**Impact:** Lentidão na listagem de tarefas conforme o número de registros cresce.
**Recommendation:** Utilizar `joinedload` do SQLAlchemy para trazer os dados em uma única consulta.

### [MEDIUM] Duplicated Logic
**File:** routes/task_routes.py:15, 60 (Repetido)
**Description:** A mesma lógica de verificação de `due_date` e `status` está presente em múltiplas rotas.
**Impact:** Risco de inconsistência se a regra de negócio mudar e for atualizada em apenas um lugar.
**Recommendation:** Centralizar a lógica em um único método ou propriedade do model.

### [LOW] Inconsistent Serialization
**File:** routes/task_routes.py:12
**Description:** Uso misto de `to_dict()` e construção manual de dicionários.
**Impact:** Dificulta a manutenção e padronização das respostas da API.
**Recommendation:** Padronizar o uso de `to_dict()` ou usar uma biblioteca de serialização (Marshmallow).

---

**Total:** 5 findings
