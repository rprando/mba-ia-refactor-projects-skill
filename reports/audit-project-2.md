# ARCHITECTURE AUDIT REPORT

**Project:** ecommerce-api-legacy
**Stack:**   Node.js + Express
**Files:**   3 analyzed

## Summary
CRITICAL: 2 | HIGH: 2 | MEDIUM: 2 | LOW: 2

## Findings

### [CRITICAL] God Class / God Object
**File:** src/AppManager.js:1-150
**Description:** `AppManager` gerencia conexão com banco, rotas, regras de negócio e integrações de pagamento.
**Impact:** Impossível de escalar, testar e manter. Violação severa dos princípios SOLID.
**Recommendation:** Quebrar em camadas de Model, Controller, Service e Routes.

### [CRITICAL] Hardcoded Credentials
**File:** src/utils.js:2-6
**Description:** Senhas de banco de dados e chaves do gateway de pagamento expostas em um objeto literal no arquivo de utilitários.
**Impact:** Exposição crítica de segredos em controle de versão.
**Recommendation:** Utilizar `dotenv` e gerenciar via `process.env`.

### [HIGH] Callback Hell / Concurrency Complexity
**File:** src/AppManager.js:40, 100
**Description:** Funções assíncronas aninhadas em 4+ níveis de callbacks no fluxo de checkout.
**Impact:** Código suscetível a exceções não tratadas e difícil legibilidade.
**Recommendation:** Refatorar todo o fluxo assíncrono para `async/await` e Promises.

### [HIGH] Data Integrity Violation (Orphan Data)
**File:** src/AppManager.js:145
**Description:** Deleção de usuário não limpa registros dependentes em tabelas filhas (inscrições e pagamentos).
**Impact:** Acúmulo de lixo na base de dados e quebra de integridade referencial.
**Recommendation:** Implementar deleção em cascata na camada de Serviço.

### [MEDIUM] Weak Cryptography
**File:** src/utils.js:16
**Description:** Função `badCrypto` utiliza algoritmo inseguro e manual de ofuscação de senhas.
**Impact:** Senhas de usuários altamente suscetíveis a quebras imediatas.
**Recommendation:** Migrar para algoritmos de hashing consolidados como `bcryptjs`.

### [MEDIUM] Direct Response Pollution
**File:** src/AppManager.js:75
**Description:** Exceções do banco de dados repassadas inteiramente no corpo da resposta HTTP em caso de erro.
**Impact:** Expõe o esquema e estrutura interna do banco para o usuário final.
**Recommendation:** Centralizar tratamento de erros e retornar mensagens customizadas genéricas.

### [LOW] Hardcoded Server Port
**File:** src/AppManager.js:148
**Description:** Porta do Express configurada estaticamente no código.
**Impact:** Falta de flexibilidade na subida de ambientes isolados.
**Recommendation:** Obter porta de `process.env.PORT`.

### [LOW] Deprecated Buffer Usage
**File:** src/utils.js:12
**Description:** Inicialização legada de Buffers (`new Buffer(...)`).
**Impact:** Alerta de depreciação na execução do Node.js e riscos potenciais de alocação de memória.
**Recommendation:** Utilizar `Buffer.from(...)` ou `Buffer.alloc(...)`.

---

**Total:** 8 findings

## Fase 3 - Validação de Refatoração
**Status:** 🟢 PASSED | 0 Débitos Pendentes
**Comentário:** Na Fase 3, a aplicação foi inteiramente migrada para a estrutura limpa em `src/`, dividindo a God Class em Controllers, Models e Services, além da modernização completa para `async/await` e proteção de credenciais.
