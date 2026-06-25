# ARCHITECTURE AUDIT REPORT

**Project:** code-smells-project
**Stack:**   Python + Flask
**Files:**   4 analyzed

## Summary
CRITICAL: 2 | HIGH: 2 | MEDIUM: 2 | LOW: 2

## Findings

### [CRITICAL] Hardcoded Credentials
**File:** app.py:7
**Description:** `SECRET_KEY` definida diretamente no código (`app.config["SECRET_KEY"] = "minha-chave-super-secreta-123"`).
**Impact:** Risco grave de segurança e exposição de segredos da aplicação.
**Recommendation:** Mover para variáveis de ambiente via `os.getenv`.

### [CRITICAL] SQL Injection Vulnerability
**File:** models.py:28, 48, 58, 68, 110, 127, 140
**Description:** Uso de concatenação de strings para montar queries SQL brutas.
**Impact:** Permite execução de injeção de código malicioso no banco de dados.
**Recommendation:** Utilizar parametrização de queries (Prepared Statements).

### [HIGH] Fat Controllers
**File:** controllers.py:1-293
**Description:** Controllers altamente inflados contendo lógica de negócio, validação e envio de notificações acoplados.
**Impact:** Dificuldade extrema de manutenção, testes unitários e violação do SRP.
**Recommendation:** Mover lógica de negócio para a camada de Services e isolar controllers.

### [HIGH] Business Logic in Models
**File:** models.py:235
**Description:** Função `relatorio_vendas` realizando consultas SQL e calculando regras de desconto em faturamentos.
**Impact:** Mistura indevida da regra de negócio com a persistência de dados.
**Recommendation:** Mover os cálculos de desconto para uma camada de serviço dedicada.

### [MEDIUM] Information Leakage
**File:** controllers.py:289
**Description:** Endpoint `health_check` retornando informações sensíveis como a `SECRET_KEY` e o path do banco.
**Impact:** Expõe chaves internas, facilitando a exploração de vetores de ataque.
**Recommendation:** Remover dados confidenciais do retorno de health check.

### [MEDIUM] Query N+1
**File:** models.py:188, 220
**Description:** Execução de consultas adicionais ao banco dentro de um loop de iteração de pedidos para buscar itens de cada pedido.
**Impact:** Degradação acentuada de performance com o aumento do volume de transações.
**Recommendation:** Utilizar queries únicas com `JOIN` ou buscar dados em lote.

### [LOW] Magic Numbers / Hardcoded Config
**File:** app.py:88
**Description:** Porta `5000` e host `0.0.0.0` fixados na chamada de `app.run`.
**Impact:** Dificulta a orquestração e o deploy em múltiplos ambientes (dev/staging/prod).
**Recommendation:** Ler porta e host de variáveis de ambiente no módulo de configuração.

### [LOW] Deprecated API Usage (Implicit Pattern)
**File:** database.py:10
**Description:** Estrutura legada de controle manual da thread de conexão sem gerenciamento adequado do ciclo de vida da request.
**Impact:** Possibilidade de lock ou falhas de concorrência no Flask em produção.
**Recommendation:** Utilizar o hook `teardown_appcontext` para fechar a conexão de forma segura.

---

**Total:** 8 findings

## Fase 3 - Validação de Refatoração
**Status:** 🟢 PASSED | 0 Débitos Pendentes
**Comentário:** Na Fase 3, a codebase foi totalmente refatorada para a pasta `src/`, com estrutura MVC limpa, isolamento de segredos, rotas (Blueprints) isoladas e queries parametrizadas. A aplicação inicializa sem erros e os endpoints originais funcionam perfeitamente.
