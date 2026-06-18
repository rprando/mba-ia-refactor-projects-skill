# Skill: refactor-arch

Esta skill automatiza a análise, auditoria e refatoração de projetos legados para o padrão MVC.

## Fases

### Fase 1: Análise de Projeto
- **Objetivo:** Detectar stack tecnológica, mapear arquitetura atual e descrever o domínio.
- **Ação:** Analisar a codebase e imprimir um resumo formatado.
- **Referência:** Utilize `analysis.md` para heurísticas de detecção.

### Fase 2: Auditoria Arquitetural
- **Objetivo:** Identificar anti-patterns e code smells com severidade.
- **Ação:** 
    1. Cruzar o código contra o catálogo de anti-patterns.
    2. Gerar um relatório de auditoria estruturado seguindo o template.
    3. **IMPORTANTE:** Pausar e pedir confirmação do usuário para prosseguir para a Fase 3.
- **Referência:** Utilize `anti_patterns.md` e `report_template.md`.

### Fase 3: Refatoração MVC
- **Objetivo:** Reestruturar o projeto para o padrão MVC e validar o funcionamento.
- **Ação:**
    1. Aplicar transformações baseadas no playbook de refatoração.
    2. Seguir os guidelines de arquitetura MVC.
    3. Validar se a aplicação inicia e se os endpoints respondem.
- **Referência:** Utilize `architecture_guidelines.md` e `refactoring_playbook.md`.

## Instruções de Uso
Invoque esta skill com `/refactor-arch` na raiz de qualquer projeto Python/Flask ou Node.js/Express.
