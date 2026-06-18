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
| **Credenciais Hardcoded** | CRITICAL | A `SECRET_KEY` está exposta diretamente no código (`app.py`), configurando grave vulnerabilidade de segurança. |
| **SQL Injection e Backdoor** | CRITICAL | Endpoint `/admin/query` permite SQL arbitrário e `models.py` usa concatenação de strings direta no banco. |
| **Vazamento de Dados** | MEDIUM | Endpoint `/health` expõe a chave secreta e o path do DB. |
| **God Class / Fat Controllers** | HIGH | Alta coesão e forte acoplamento: lógica de negócio e notificações estão misturadas nos controllers, dificultando testes isolados. |
| **Regras de Negócio no Model** | HIGH | Cálculos de desconto progressivo acoplados dentro da camada de dados, violando o *Single Responsibility Principle* (SRP). |

### Projeto 2: ecommerce-api-legacy (Node.js/Express)
| Problema | Severidade | Justificativa |
|---|---|---|
| **God Class** | CRITICAL | `AppManager.js` concentra responsabilidades de DB, rotas, checkout e pagamentos no mesmo escopo. |
| **Credenciais Expostas** | CRITICAL | Senhas e chaves de gateway de pagamento expostas no arquivo `utils.js`. |
| **Callback Hell** | HIGH | Fluxos de checkout com 4+ níveis de aninhamento, tornando a manutenção assíncrona insustentável. |
| **Dados Órfãos / Integridade** | HIGH | A deleção de um usuário não possui rotinas de *cascade* e não limpa tabelas relacionadas. |

### Projeto 3: task-manager-api (Python/Flask)
| Problema | Severidade | Justificativa |
|---|---|---|
| **Fat Routes** | HIGH | Lógica complexa de "overdue" calculada diretamente nas rotas em vez de ser encapsulada em services ou models. |
| **Query N+1** | MEDIUM | Loop de listagem no endpoint principal realizando consultas individuais iterativas para cada User/Category. |
| **Duplicação de Lógica** | MEDIUM | Regra de data de vencimento repetida em múltiplos endpoints (código não-DRY). |

---

## B) Construção da Skill

A skill foi batizada de `refactor-arch` e construída seguindo as diretrizes de custom skills do **Gemini CLI**.

### Decisões de Design e Estrutura
A skill está localizada em `.gemini/skills/refactor-arch/` e foi estruturada nos seguintes arquivos de referência:
1.  **SKILL.md:** Define o fluxo de trabalho em 3 fases (Análise, Auditoria e Refatoração).
2.  **analysis.md:** Heurísticas para detecção de stack (Python, Node, Flask, Express).
3.  **anti_patterns.md:** Catálogo com 9 anti-patterns e detecção de APIs depreciadas (ex: `new Buffer`).
4.  **report_template.md:** Estrutura padronizada para o relatório de auditoria da Fase 2.
5.  **architecture_guidelines.md:** Regras do padrão MVC (Models, Controllers, Routes, Services).
6.  **refactoring_playbook.md:** Guia de transformação com exemplos de código antes/depois.

### Agnosticismo de Tecnologia
A skill foi desenhada focando em *padrões arquiteturais* (como MVC, injeção de dependência e parametrização) em vez de focar apenas na sintaxe. O LLM utiliza o contexto do framework detectado na Fase 1 para aplicar os princípios universais definidos no catálogo.

### Desafios Encontrados e Soluções
* **Desafio:** Impedir que o LLM modificasse arquivos imediatamente sem a aprovação do usuário.
  * **Solução:** O `SKILL.md` foi fortemente parametrizado com um "hard stop" ao final da Fase 2, exigindo um input direto (`y/n`) antes de prosseguir com reescritas de código.
* **Desafio:** Lidar com a infraestrutura já existente do Projeto 3, que continha pastas parcialmente organizadas.
  * **Solução:** O `refactoring_playbook.md` incluiu heurísticas de "merge", instruindo o LLM a mover a lógica de rotas gordas para os `models` ou `services` já existentes, sem recriar a arquitetura do zero desnecessariamente.

---

## C) Resultados

### Resumo de Auditoria Automatizada (Fase 2)
A automação detectou com sucesso os code smells mapeados.

| Projeto | CRITICAL | HIGH | MEDIUM | LOW | Total |
|---|---|---|---|---|---|
| 1. code-smells-project | 3 | 2 | 2 | 1 | 8 |
| 2. ecommerce-api-legacy | 2 | 2 | 1 | 1 | 6 |
| 3. task-manager-api | 1 | 1 | 2 | 1 | 5 |

### Checklist de Validação

#### Projeto 1 - code-smells-project (Python/Flask)
- [x] Linguagem detectada corretamente.
- [x] Relatório gerado antes da refatoração.
- [x] Refatorado para `src/` com separação MVC completa.
- [x] Queries SQL parametrizadas e `SECRET_KEY` enviada para `.env`.
- [x] Aplicação inicializa sem erros e endpoints respondem.

#### Projeto 2 - ecommerce-api-legacy (Node.js/Express)
- [x] Linguagem detectada corretamente.
- [x] Relatório gerado e pausa para confirmação respeitada.
- [x] God Class `AppManager` isolada em Controllers e Models.
- [x] Refatorado de Callbacks para `async/await`.
- [x] Aplicação inicializa sem erros e endpoints respondem.

#### Projeto 3 - task-manager-api (Python/Flask)
- [x] Otimização de arquitetura já existente detectada.
- [x] Lógica "overdue" movida para o Model Task.
- [x] Otimização de Query N+1 com `joinedload` da ORM.
- [x] Aplicação inicializa sem erros e endpoints respondem.

### Observações sobre o Comportamento Multi-Stack
A skill comportou-se de maneira adaptável notável. No Node.js, ela deu prioridade natural à reestruturação de concorrência (`async/await`), enquanto nos projetos Python ela focou muito na modularidade e injeção do objeto Flask (`app`). O catálogo agnóstico provou ser eficaz ao tratar o padrão "God Class" de formas equivalentes, independentemente de ser um módulo `.js` gigante ou um `.py` sobrecarregado.

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

### Execução da Skill
A skill já está embutida nas pastas `.gemini/skills/refactor-arch/`. Para iniciar o processo de auditoria e refatoração em qualquer um dos projetos:

```bash
# Exemplo para o Projeto 1
cd code-smells-project
gemini "/refactor-arch"

# Exemplo para o Projeto 2
cd ../ecommerce-api-legacy
gemini "/refactor-arch"

# Exemplo para o Projeto 3
cd ../task-manager-api
gemini "/refactor-arch"
```
---
### Verificação de Relatórios
Os relatórios gerados pela Fase 2 estão disponíveis em:
- `reports/audit-project-1.md`
- `reports/audit-project-2.md`
- `reports/audit-project-3.md`

### Validação Pós-Refatoração
Após a execução da Fase 3 pela skill, você pode validar o funcionamento:
1.  **Python:** 
    ```bash
    pip install -r requirements.txt
    python src/app.py # ou python app.py dependendo do diretório final
    ```
2.  **Node.js:**
    ```bash
    npm install
    npm start # ou node src/app.js
    ```
