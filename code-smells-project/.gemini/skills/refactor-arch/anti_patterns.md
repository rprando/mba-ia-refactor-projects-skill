# Catálogo de Anti-patterns

## [CRITICAL] Hardcoded Credentials
- **Sinal:** Strings como `SECRET_KEY`, `PASSWORD`, `API_KEY` definidas diretamente no código.
- **Impacto:** Exposição de segredos em controle de versão.
- **Recomendação:** Mover para variáveis de ambiente ou arquivo de configuração `.env`.

## [CRITICAL] SQL Injection / String Concatenation in Queries
- **Sinal:** Uso de `+` ou f-strings para montar queries SQL (ex: `"SELECT * FROM users WHERE id = " + id`).
- **Impacto:** Permite execução de código malicioso no banco de dados.
- **Recomendação:** Utilizar parametrização (Prepared Statements) ou ORM.

## [CRITICAL] Arbitrary Code/Query Execution
- **Sinal:** Endpoints que aceitam SQL ou código diretamente do cliente (ex: `eval()`, `exec()`, ou `/admin/query`).
- **Impacto:** Controle total do servidor pelo atacante.
- **Recomendação:** Remover endpoints ou restringir a comandos pré-definidos e autenticados.

## [HIGH] God Class / God Object
- **Sinal:** Uma única classe ou arquivo com mais de 500 linhas que gerencia múltiplas responsabilidades (banco, rotas, lógica).
- **Impacto:** Difícil manutenção, teste e evolução.
- **Recomendação:** Decompor em classes menores seguindo SRP (Single Responsibility Principle).

## [HIGH] Fat Controller / Business Logic in Routes
- **Sinal:** Funções de rota com lógica complexa, cálculos, ou acessos diretos ao banco sem usar Models.
- **Impacto:** Impossível reutilizar lógica ou testar em isolamento.
- **Recomendação:** Mover lógica de negócio para Services e acesso a dados para Models.

## [MEDIUM] Query N+1
- **Sinal:** Execução de consultas SQL dentro de loops (ex: buscar detalhes de cada item em um loop de listagem).
- **Impacto:** Degradação massiva de performance.
- **Recomendação:** Utilizar `JOINs` ou `Eager Loading`.

## [MEDIUM] Insecure Cryptography (Deprecated/Weak)
- **Sinal:** Uso de MD5, SHA1, ou implementações manuais de hashing (ex: base64 aninhado). Uso de APIs depreciadas para segurança.
- **Impacto:** Senhas facilmente quebráveis.
- **Recomendação:** Utilizar algoritmos modernos como BCrypt ou Argon2.

## [LOW] Magic Numbers / Hardcoded Config
- **Sinal:** Valores como portas, hosts, ou timeouts definidos no meio do código.
- **Impacto:** Dificulta a configuração em diferentes ambientes (dev/prod).
- **Recomendação:** Centralizar configurações em um módulo específico.

## [LOW] Lógica de Negócio em Models (Data Objects)
- **Sinal:** Models contendo cálculos complexos ou regras de domínio (ex: cálculo de desconto).
- **Impacto:** Acoplamento excessivo da regra de negócio com a estrutura de dados.
- **Recomendação:** Mover para Services ou Domain Logic.

## Detecção de APIs Deprecated
- **Python/Flask:** Uso de `flask.Markup` (em versões recentes), `app.before_first_request` (depreciado no Flask 2.3+).
- **Node.js:** Uso de `new Buffer()`, `fs.exists` (use `fs.access` ou `fs.stat`), ou `request` library (depreciada).
- **Recomendação:** Substituir por alternativas modernas (ex: `Buffer.from()`, `axios`/`fetch`).
