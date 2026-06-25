# Skill de Auditoria e Refatoração Arquitetural (`refactor-arch`)

Este repositório contém a solução completa e definitiva para o desafio de criação de uma Skill customizada para o **Gemini CLI**, projetada para analisar, auditar e refatorar projetos legados para o padrão MVC de forma estritamente agnóstica de tecnologia.

---

## 📌 Sumário de Entrega

- [A) Análise Manual](#a-análise-manual)
- [B) Construção da Skill](#b-construção-da-skill)
- [C) Resultados e Estrutura Final dos Projetos](#c-resultados-e-estrutura-final-dos-projetos)
- [D) Sessão Como Executar (Guia Completo para Avaliação)](#d-sessão-como-executar-guia-completo-para-avaliação)

---

## A) Análise Manual

Antes da automação, foi realizada uma inspeção minuciosa nos três projetos para identificar os padrões de falha que a skill deveria ser capaz de resolver. Para garantir a representatividade arquitetural, foram documentados no mínimo 5 problemas por projeto, cobrindo com precisão as severidades CRITICAL/HIGH, MEDIUM e LOW.

### Projeto 1: code-smells-project (Python/Flask)
| Problema | Severidade | Justificativa |
|---|---|---|
| **Credenciais Hardcoded** | CRITICAL | A `SECRET_KEY` está exposta diretamente no código (`app.py`), configurando grave vulnerabilidade de segurança. |
| **SQL Injection e Backdoor** | CRITICAL | Endpoint `/admin/query` permite SQL arbitrário e `models.py` usa concatenação de strings direta no banco. |
| **God Class / Fat Controllers** | HIGH | Alta coesão e forte acoplamento: lógica de negócio e notificações estão misturadas nos controllers, dificultando testes isolados. |
| **Regras de Negócio no Model** | HIGH | Cálculos de desconto progressivo acoplados dentro da camada de dados, violando o *Single Responsibility Principle* (SRP). |
| **Vazamento de Dados** | MEDIUM | Endpoint `/health` expõe a chave secreta e o path do DB para o ambiente externo. |
| **Query N+1 em Pedidos** | MEDIUM | Consultas iterativas executadas dentro de loops para buscar itens de pedidos em `models.py`. |
| **Magic Numbers / Config** | LOW | Porta `5000` e host `0.0.0.0` fixados hardcoded no `app.run`. |
| **Ciclo de Vida de Conexão** | LOW | Estrutura legada de controle manual da thread de conexão sem hook limpo no ciclo de requisição. |

### Projeto 2: ecommerce-api-legacy (Node.js/Express)
| Problema | Severidade | Justificativa |
|---|---|---|
| **God Class (AppManager)** | CRITICAL | `AppManager.js` concentra responsabilidades de DB, rotas, checkout e pagamentos no mesmo escopo. |
| **Credenciais Expostas** | CRITICAL | Senhas de DB e chaves de gateway de pagamento expostas no arquivo `utils.js`. |
| **Callback Hell** | HIGH | Fluxos de checkout com 4+ níveis de aninhamento de callbacks, tornando a manutenção assíncrona insustentável. |
| **Dados Órfãos / Integridade** | HIGH | A deleção de um usuário não possui rotinas de *cascade* e deixa registros órfãos nas tabelas relacionadas. |
| **Weak Cryptography** | MEDIUM | Função `badCrypto` usa implementação manual e frágil de ofuscação de senhas. |
| **Poluição de Resposta HTTP** | MEDIUM | Erros crus e stack traces do banco repassados no payload da resposta HTTP. |
| **Porta de Servidor Hardcoded** | LOW | Porta do servidor Express definida diretamente no código. |
| **Uso de API Depreciada** | LOW | Utilização do construtor legado `new Buffer()` para codificação de strings. |

### Projeto 3: task-manager-api (Python/Flask)
| Problema | Severidade | Justificativa |
|---|---|---|
| **Hardcoded Credentials** | CRITICAL | `SECRET_KEY` exposta de forma insegura no arquivo principal `app.py`. |
| **Fat Routes** | HIGH | Lógica complexa de verificação de atraso ("overdue") calculada diretamente nas rotas. |
| **Query N+1 na Listagem** | MEDIUM | Loop de listagem no endpoint principal realizando consultas individuais iterativas para User/Category. |
| **Ineficiência em Estatísticas** | MEDIUM | O endpoint `task_stats` carrega a tabela inteira na memória com `Task.query.all()` para iterar em loop. |
| **Serialização Inconsistente** | LOW | Uso misto de `to_dict()` e construção manual de dicionários para montar o payload da resposta. |
| **Configuração de Porta Fixa** | LOW | Porta `5000` e host definidos de forma estática no `app.run`. |

---

## B) Construção da Skill

A skill foi batizada de `refactor-arch` e construída seguindo as diretrizes de custom skills do **Gemini CLI**. Para garantir que a automação pudesse ser acionada independentemente do diretório onde o avaliador inicie seus testes, a estrutura completa da skill foi **replicada dentro de cada um dos 3 projetos**.

### Arquivos de Referência (`.gemini/skills/refactor-arch/`)
1.  **SKILL.md:** Define o fluxo de trabalho obrigatório em 3 fases sequenciais (Análise, Auditoria e Refatoração) com pausa de segurança na Fase 2.
2.  **analysis.md:** Heurísticas para detecção de stack (Python, Node, Flask, Express, SQLite).
3.  **anti_patterns.md:** Catálogo robusto contendo 9 anti-patterns de arquitetura e detecção de APIs depreciadas (ex: `new Buffer()`).
4.  **report_template.md:** Estrutura padronizada para os relatórios de auditoria.
5.  **architecture_guidelines.md:** Regras do padrão MVC (Models, Controllers, Routes, Services).
6.  **refactoring_playbook.md:** Guia de transformação com 9 padrões concretos de código *Antes/Depois*.

---

## C) Resultados e Estrutura Final dos Projetos

### Resumo de Auditoria Automatizada (Fase 2)
A automação inspecionou e gerou os relatórios catalogando os problemas antes de aplicar a refatoração. Todos os relatórios possuem o mínimo exigido de 5 findings detalhados e ordenados por severidade.

| Projeto | CRITICAL | HIGH | MEDIUM | LOW | Total | Relatório de Auditoria |
|---|---|---|---|---|---|---|
| **1. code-smells-project** | 2 | 2 | 2 | 2 | 8 | `reports/audit-project-1.md` |
| **2. ecommerce-api-legacy** | 2 | 2 | 2 | 2 | 8 | `reports/audit-project-2.md` |
| **3. task-manager-api** | 1 | 1 | 2 | 2 | 6 | `reports/audit-project-3.md` |

---

### Avaliação da Estrutura Final dos Projetos (Pós-Fase 3)

A execução da Fase 3 promoveu reestruturações arquiteturais cirúrgicas, isolando responsabilidades e assegurando que os endpoints originais funcionem com 100% de precisão.

#### 📦 1. code-smells-project (Python/Flask)
- **O que mudou:** O entrypoint em `src/app.py` foi configurado como *Composition Root*. O acesso ao banco e as queries brutas em `models/` foram parametrizadas para barrar SQL Injection. Para máxima compatibilidade em qualquer interpretador Python, foi inserido o `sys.path` com **imports absolutos**, eliminando erros de importação relativa.
```text
code-smells-project/
├── .gemini/skills/refactor-arch/ (Skill embutida)
├── requirements.txt
├── src/
│   ├── app.py (Composition Root e Entrypoint)
│   ├── database.py (Controle de conexão e Init DB)
│   ├── config/
│   │   └── settings.py
│   ├── models/
│   │   ├── product_model.py
│   │   ├── user_model.py
│   │   └── order_model.py
│   ├── controllers/
│   │   ├── product_controller.py
│   │   ├── user_controller.py
│   │   └── order_controller.py
│   ├── routes/
│   │   ├── product_routes.py
│   │   ├── user_routes.py
│   │   └── order_routes.py
│   └── services/
│       └── sales_service.py
```

#### 📦 2. ecommerce-api-legacy (Node.js/Express)
- **O que mudou:** A antiga God Class `AppManager` foi dissolvida nas pastas `models`, `controllers`, `routes` e `services`, com transição total para `async/await`. Foi resolvida uma falha nativa na geração de senhas ao substituir o pacote C++ `bcrypt` pelo módulo nativo `crypto` do Node.js (utilizando o robusto algoritmo *Scrypt*). Além disso, foram incluídas rotas amigáveis `GET` em `/api/users/:id` e `/api/checkout` para facilitar a exploração via navegador e via REST Client (`api.http`).
```text
ecommerce-api-legacy/
├── .gemini/skills/refactor-arch/ (Skill embutida)
├── .env (Segredos e Variáveis de Ambiente)
├── api.http (Suíte de requisições prontas para teste)
├── package.json
├── src/
│   ├── app.js (Entrypoint e Express setup)
│   ├── utils.js
│   ├── config/
│   │   └── database.js (SQLite em memória e Seed)
│   ├── models/
│   │   └── Database.js (Wrapper de concorrência com Promises)
│   ├── controllers/
│   │   ├── CheckoutController.js
│   │   ├── ReportController.js
│   │   └── UserController.js (Agora com listagem e busca por ID)
│   ├── routes/
│   │   ├── index.js
│   │   ├── checkout.js (Rota GET adicionada para guiar testes)
│   │   ├── report.js
│   │   └── user.js
│   └── services/
│       ├── CheckoutService.js (Migrado para Crypto nativo)
│       ├── ReportService.js
│       └── UserService.js (Deleção em cascata)
```

#### 📦 3. task-manager-api (Python/Flask)
- **O que mudou:** A infraestrutura que já possuía pastas parciais foi otimizada sem quebra. A `SECRET_KEY` e a `DATABASE_URI` foram protegidas via `os.getenv`. A lógica duplicada de checagem de tarefas atrasadas (`overdue`) nas rotas foi enxugada, aproveitando a regra centralizada do Model. O endpoint de estatísticas (`/tasks/stats`) foi refatorado para filtrar e contar direto no banco de dados via SQLAlchemy, evitando gargalos de memória.
```text
task-manager-api/
├── .gemini/skills/refactor-arch/ (Skill embutida)
├── app.py (Entrypoint e orquestração)
├── database.py
├── requirements.txt
├── models/
│   ├── task.py (Lógica de regra de negócio is_overdue)
│   ├── user.py
│   └── category.py
├── routes/
│   ├── task_routes.py (Rotas magras e otimizadas)
│   ├── user_routes.py
│   └── report_routes.py
```

---

## D) Sessão Como Executar (Guia Completo para Avaliação)

Este guia foi elaborado para que o professor/avaliador possa clonar o repositório, inspecionar o funcionamento da skill e testar os servidores de forma direta, clara e fluida.

### 🛠️ Pré-requisitos
- **Git** instalado.
- **Python 3.10+** (para rodar os Projetos 1 e 3).
- **Node.js 18+** (para rodar o Projeto 2).
- **Gemini CLI** configurado e autenticado.

---

### Passo 1: Clonar o Repositório
No seu terminal, clone o projeto e entre na pasta raiz:
```bash
git clone https://github.com/<seu-usuario>/mba-ia-refactor-projects-skill.git
cd mba-ia-refactor-projects-skill
```

---

### Passo 2: Executar a Skill (`/refactor-arch`)
Como a skill está replicada em `.gemini/skills/refactor-arch/` dentro das três pastas, você pode invocar a automação entrando no diretório de qualquer projeto:

```bash
# Executar no Projeto 1
cd code-smells-project
gemini "/refactor-arch"

# Executar no Projeto 2
cd ../ecommerce-api-legacy
gemini "/refactor-arch"

# Executar no Projeto 3
cd ../task-manager-api
gemini "/refactor-arch"
```
*Observação: Ao executar, a skill realizará a Fase 1 (Análise), a Fase 2 (Auditoria) e pausará aguardando seu input (`y/n`) antes de iniciar a Fase 3 (Refatoração).*

---

### Passo 3: Inspecionar os Relatórios de Auditoria
Os relatórios da Fase 2 gerados e formatados pela automação já estão gravados na pasta `reports/`:
- 📄 `reports/audit-project-1.md`
- 📄 `reports/audit-project-2.md`
- 📄 `reports/audit-project-3.md`

---

### Passo 4: Subir os Servidores e Testar os Endpoints

Para comprovar que o código refatorado na Fase 3 continua funcional, siga as instruções para inicializar e testar cada projeto localmente.

#### 🟢 Projeto 1: `code-smells-project` (Python + Flask)
1. Abra um terminal na pasta `code-smells-project`.
2. Instale as dependências e inicie o servidor:
   ```bash
   pip install -r requirements.txt
   python src/app.py
   ```
3. O servidor rodará em `http://localhost:5000/`. Clique nos links abaixo para testar no navegador:
   - **🏠 API Inicial:** http://localhost:5000/
   - **🩺 Health Check (Sem vazar segredos):** http://localhost:5000/health
   - **📦 Listagem de Produtos:** http://localhost:5000/produtos
   - **📊 Relatório de Vendas:** http://localhost:5000/relatorios/vendas
4. Encerre o servidor (`CTRL+C`) antes de subir os próximos.

#### 🟢 Projeto 2: `ecommerce-api-legacy` (Node.js + Express)
1. Abra um terminal na pasta `ecommerce-api-legacy`.
2. Instale os pacotes e inicie a aplicação:
   ```bash
   npm install
   node src/app.js
   ```
3. A aplicação rodará em `http://localhost:3000/`. Você possui duas formas incríveis de testar:
   - **Via Navegador (Endpoints GET):**
     - 👤 Listar Usuários: http://localhost:3000/api/users
     - 🔍 Detalhes do Usuário ID 1: http://localhost:3000/api/users/1
     - 📊 Relatório Financeiro: http://localhost:3000/api/admin/financial-report
     - 💳 Guia de Checkout: http://localhost:3000/api/checkout
   - **Via REST Client no VS Code (Endpoints POST/DELETE):**
     - Abra o arquivo `api.http` no VS Code.
     - Clique em **`Send Request`** acima de `POST {{baseUrl}}/api/checkout` para simular uma compra real.
     - Clique em **`Send Request`** acima de `DELETE {{baseUrl}}/api/users/1` para testar a deleção com cascata no banco.
4. Encerre o servidor (`CTRL+C`) antes de subir o Projeto 3.

#### 🟢 Projeto 3: `task-manager-api` (Python + Flask)
1. Abra um terminal na pasta `task-manager-api`.
2. Instale as dependências e inicie o servidor:
   ```bash
   pip install -r requirements.txt
   python app.py
   ```
3. O servidor rodará em `http://localhost:5000/`. O banco SQLite (`tasks.db`) será gerado e populado automaticamente. Teste os endpoints no navegador:
   - **🏠 API Inicial:** http://localhost:5000/
   - **🩺 Health Check:** http://localhost:5000/health
   - **📝 Listagem de Tarefas (Sem Query N+1):** http://localhost:5000/tasks
   - **📊 Estatísticas (Otimizadas no banco):** http://localhost:5000/tasks/stats
   - **👤 Usuários:** http://localhost:5000/users
4. Encerre o servidor (`CTRL+C`) para concluir a avaliação.
