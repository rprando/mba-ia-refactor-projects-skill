# Skill de Auditoria e Refatoração Arquitetural

Este repositório contém a solução para o desafio de criação de uma Skill para o **Gemini CLI** capaz de analisar, auditar e refatorar projetos legados para o padrão MVC de forma agnóstica de tecnologia.

---

## Sumário de Entrega

- [A) Análise Manual](#a-análise-manual)
- [B) Construção da Skill](#b-construção-da-skill)
- [C) Resultados](#c-resultados)
- [D) Como Executar](#d-como-executar)

---

## A) Análise Manual

Antes da automação, foi realizada uma inspeção manual nos três projetos para identificar os padrões de falha que a skill deveria ser capaz de resolver.

### Projeto 1: code-smells-project (Python/Flask)
| Problema | Severidade | Justificativa |
|---|---|---|
| **Credenciais Hardcoded** | CRITICAL | A `SECRET_KEY` está exposta diretamente no código (`app.py`). |
| **SQL Injection e Backdoor** | CRITICAL | Endpoint `/admin/query` permite SQL arbitrário e `models.py` usa concatenação de strings. |
| **Vazamento de Dados** | MEDIUM | Endpoint `/health` expõe a chave secreta e o path do DB. |
| **Fat Controllers** | HIGH | Lógica de negócio e notificações misturadas nos controllers. |
| **Regras no Model** | HIGH | Cálculos de desconto progressivo dentro da camada de dados. |

### Projeto 2: ecommerce-api-legacy (Node.js/Express)
| Problema | Severidade | Justificativa |
|---|---|---|
| **God Class** | CRITICAL | `AppManager.js` gerencia DB, rotas, checkout e pagamentos. |
| **Credenciais Expostas** | CRITICAL | Senhas e chaves de gateway em `utils.js`. |
| **Callback Hell** | HIGH | Fluxos de checkout com 4+ níveis de aninhamento. |
| **Dados Órfãos** | HIGH | Deleção de usuário não limpa tabelas relacionadas. |

### Projeto 3: task-manager-api (Python/Flask)
| Problema | Severidade | Justificativa |
|---|---|---|
| **Fat Routes** | HIGH | Lógica complexa de "overdue" calculada diretamente nas rotas. |
| **Query N+1** | MEDIUM | Loop de listagem fazendo consultas individuais para cada User/Category. |
| **Duplicação de Lógica** | MEDIUM | Regra de data de vencimento repetida em múltiplos endpoints. |

---

## B) Construção da Skill

A skill foi batizada de `refactor-arch` e construída seguindo as diretrizes do **Gemini CLI**.

### Estrutura da Skill
A skill está localizada em `.gemini/skills/refactor-arch/` e é composta por:
1.  **SKILL.md:** Define o fluxo de trabalho em 3 fases (Análise, Auditoria e Refatoração).
2.  **analysis.md:** Heurísticas para detecção de stack (Python, Node, Flask, Express).
3.  **anti_patterns.md:** Catálogo com 9 anti-patterns e detecção de APIs depreciadas (ex: `new Buffer`).
4.  **report_template.md:** Estrutura padronizada para o relatório de auditoria da Fase 2.
5.  **architecture_guidelines.md:** Regras do padrão MVC (Models, Controllers, Routes, Services).
6.  **refactoring_playbook.md:** Guia de transformação com exemplos de código antes/depois.

### Decisões de Design
- **Agnosticismo:** A skill utiliza heurísticas de arquivos (`package.json` vs `requirements.txt`) e padrões de código para identificar a tecnologia, permitindo que as mesmas regras de refatoração se adaptem ao contexto.
- **Segurança:** Foco prioritário em remover vulnerabilidades críticas como SQL Injection e exposição de segredos.
- **Modularidade:** Introdução de uma camada de `Services` para lógica de negócio que não pertence nem ao Model nem ao Controller.

---

## C) Resultados

### Resumo de Auditoria Automatizada
| Projeto | CRITICAL | HIGH | MEDIUM | LOW | Total |
|---|---|---|---|---|---|
| 1. code-smells-project | 3 | 2 | 2 | 1 | 8 |
| 2. ecommerce-api-legacy | 2 | 2 | 1 | 1 | 6 |
| 3. task-manager-api | 1 | 1 | 2 | 1 | 5 |

### Checklist de Validação

#### Projeto 1 - code-smells-project
- [x] Linguagem Python detectada corretamente.
- [x] 8 vulnerabilidades encontradas.
- [x] Refatorado para `src/` com separação MVC completa.
- [x] Queries SQL parametrizadas.

#### Projeto 2 - ecommerce-api-legacy
- [x] Linguagem Node.js detectada corretamente.
- [x] God Class `AppManager` decomposta.
- [x] Refatorado de Callbacks para `async/await`.
- [x] Configurações movidas para `config/index.js`.

#### Projeto 3 - task-manager-api
- [x] Identificado como Python/Flask com camadas parciais.
- [x] Lógica "overdue" movida para o Model Task.
- [x] Otimização de Query N+1 com `joinedload`.
- [x] Padronização de serialização `to_dict()`.

#### Estrutura Final dos Projetos

**1. code-smells-project (Python/Flask)**
```text
src/
├── app.py (Composition Root)
├── database.py
├── config/
│   └── settings.py (Variáveis de ambiente)
├── models/
│   └── product_model.py (SQL Parametrizado)
├── controllers/
├── routes/
└── services/
    └── sales_service.py (Lógica de negócio extraída)
```

**2. ecommerce-api-legacy (Node.js/Express)**
```text
src/
├── app.js
├── AppManager.js
├── utils.js
├── config/
│   └── index.js (Configurações centralizadas)
├── models/
│   └── User.js (Refatorado para Async/Await)
├── controllers/
├── routes/
└── services/
```

**3. task-manager-api (Python/Flask)**
```text
task-manager-api/
├── app.py
├── database.py
├── models/
│   ├── task.py (Lógica is_overdue centralizada)
│   ├── user.py
│   └── category.py
├── routes/
│   ├── task_routes.py (Otimizado com joinedload)
│   └── ...
├── services/
└── utils/
```

---

## D) Sessão Como Executar

### Pré-requisitos
Para replicar o ambiente e executar a refatoração, siga os passos abaixo:

1.  **Clonar o Repositório:**
    ```bash
    git clone https://github.com/<seu-usuario>/mba-ia-refactor-projects-skill.git
    cd mba-ia-refactor-projects-skill
    ```
2.  **Instalar Gemini CLI:** Certifique-se de ter o [Gemini CLI](https://github.com/google/gemini-cli) instalado e autenticado.
3.  **Ambiente:** Tenha Python 3.10+ e Node.js 18+ instalados para as validações locais.

### Invocação da Skill
Para iniciar o processo de auditoria e refatoração automática em qualquer um dos projetos:

```bash
cd [pasta-do-projeto]
gemini "/refactor-arch"
```

### Verificação
Os relatórios gerados pela Fase 2 estão disponíveis em:
- `reports/audit-project-1.md`
- `reports/audit-project-2.md`
- `reports/audit-project-3.md`

### Validação
Após a execução da Fase 3 pela skill, você pode validar o funcionamento:
1.  **Python:** `python src/app.py`
2.  **Node.js:** `npm start` (ou `node src/app.js`)
3.  Verifique os endpoints via `curl` ou Postman.