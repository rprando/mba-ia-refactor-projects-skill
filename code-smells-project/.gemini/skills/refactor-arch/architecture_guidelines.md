# Guidelines de Arquitetura MVC

## Estrutura de Pastas Alvo
- `src/` ou raiz (dependendo do projeto)
    - `config/`: Configurações globais e variáveis de ambiente.
    - `models/`: Definição de dados e acesso ao banco (Queries, ORM).
    - `controllers/`: Lógica de orquestração das rotas.
    - `routes/`: Definição de endpoints e mapeamento para controllers.
    - `services/`: Lógica de negócio complexa e integrações externas.
    - `middlewares/`: Tratamento de erros, autenticação, etc.
    - `app.py` ou `app.js`: Ponto de entrada (Composition Root).

## Responsabilidades por Camada

### Models
- Representam as entidades do domínio.
- Responsáveis por salvar, buscar e deletar dados.
- **NUNCA** devem conter lógica de roteamento ou acesso direto a `request/response`.

### Controllers
- Recebem dados da requisição.
- Chamam os Models ou Services necessários.
- Retornam a resposta (JSON, status code).
- **NUNCA** devem conter queries SQL puras.

### Routes (Views no contexto de API)
- Definem os caminhos e verbos HTTP.
- Delegam a execução para o Controller correspondente.

### Services (Opcional, mas recomendado)
- Contêm regras de negócio puras (ex: cálculo de descontos, validações cruzadas).
- Realizam chamadas a APIs externas (gateways de pagamento, serviços de email).

### Config
- Centraliza o uso de `os.environ` ou `process.env`.
- Define constantes globais da aplicação.
