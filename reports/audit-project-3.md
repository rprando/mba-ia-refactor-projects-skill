# ARCHITECTURE AUDIT REPORT

**Project:** task-manager-api
**Stack:**   Python + Flask
**Files:**   10 analyzed

## Summary
CRITICAL: 1 | HIGH: 1 | MEDIUM: 2 | LOW: 2

## Findings

### [CRITICAL] Hardcoded Credentials
**File:** app.py:13
**Description:** `SECRET_KEY` definida diretamente no código (`app.config['SECRET_KEY'] = 'super-secret-key-123'`).
**Impact:** Risco grave de segurança e exposição de segredos da sessão/aplicação.
**Recommendation:** Mover a chave para variáveis de ambiente utilizando `os.getenv`.

### [HIGH] Fat Routes / Business Logic in Routes
**File:** routes/task_routes.py:34, 244
**Description:** Lógica de cálculo de tarefas atrasadas (`overdue`) calculada manualmente e repetida nas rotas em vez de utilizar o método `is_overdue()` do model.
**Impact:** Código acoplado, não-DRY (Don't Repeat Yourself) e suscetível a erros caso a regra de negócio mude.
**Recommendation:** Substituir a verificação manual por chamadas limpas a `task.is_overdue()`.

### [MEDIUM] Hardcoded Configuration / Magic Numbers
**File:** app.py:34
**Description:** Porta `5000` e host `0.0.0.0` configurados hardcoded na chamada `app.run`.
**Impact:** Dificulta a implantação em múltiplos ambientes (staging, produção) e portabilidade.
**Recommendation:** Carregar porta e host de variáveis de ambiente.

### [MEDIUM] Query Inefficiency in Stats
**File:** routes/task_routes.py:244
**Description:** Para calcular as estatísticas de tarefas atrasadas (`overdue`), a rota faz `Task.query.all()` carregando todos os registros na memória do Python para iteração em loop.
**Impact:** Degradação expressiva de performance com grandes volumes de dados na tabela.
**Recommendation:** Utilizar filtro SQL direto no banco via SQLAlchemy para contar as tarefas em atraso.

### [LOW] Inconsistent Serialization
**File:** routes/task_routes.py:18
**Description:** Uso misto de conversão manual de atributos e o método `to_dict()` para montagem de payload.
**Impact:** Dificulta a manutenção e a padronização das respostas da API.
**Recommendation:** Centralizar e padronizar toda a serialização dentro do modelo de dados.

### [LOW] Deprecated API Usage (Flask Setup)
**File:** app.py:15
**Description:** Declarações globais extensas sem uso modularizado de orquestração de extensões.
**Impact:** Manutenção complexa conforme o número de pacotes cresce.
**Recommendation:** Padronizar inicialização de dependências através do factory pattern.

---

**Total:** 6 findings

## Fase 3 - Validação de Refatoração
**Status:** 🟢 PASSED | 0 Débitos Pendentes
**Comentário:** Na Fase 3, a aplicação foi totalmente otimizada. A `SECRET_KEY`, `HOST` e `PORT` foram extraídos via `os.getenv`. O método `task.to_dict()` passou a ser usado na rota `get_task` eliminando repetições de código, e o endpoint de estatísticas foi reescrito com query enxuta via SQLAlchemy.
