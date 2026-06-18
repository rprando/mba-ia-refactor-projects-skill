# Playbook de Refatoração

Este guia contém padrões de transformação para converter código legado para MVC.

## 1. Configuração para Variáveis de Ambiente
**Antes:**
```python
app.config["SECRET_KEY"] = "minha-chave-super-secreta-123"
```
**Depois:**
```python
import os
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "default-dev-key")
```

## 2. SQL Concatenado para Parametrizado
**Antes:**
```javascript
this.db.run("DELETE FROM users WHERE id = " + id);
```
**Depois:**
```javascript
this.db.run("DELETE FROM users WHERE id = ?", [id]);
```

## 3. Lógica de Rota para Controller
**Antes:**
```python
@app.route("/produtos")
def listar():
    db = get_db()
    res = db.execute("SELECT * FROM produtos").fetchall()
    return jsonify(res)
```
**Depois:**
```python
# routes.py
app.add_url_rule("/produtos", "listar", product_controller.listar)

# product_controller.py
def listar():
    produtos = product_model.get_all()
    return jsonify(produtos)
```

## 4. Extração de Lógica de Negócio para Service
**Antes (no controller):**
```python
if faturamento > 1000:
    desconto = faturamento * 0.1
```
**Depois (em service.py):**
```python
def calcular_desconto(faturamento):
    return faturamento * 0.1 if faturamento > 1000 else 0
```

## 5. Eliminação de God Class para MVC
**Antes:**
Uma única classe `AppManager` faz tudo.
**Depois:**
Separar métodos de `AppManager` em arquivos distintos dentro de `models/`, `controllers/` e `routes/`.

## 6. Centralização de Tratamento de Erros
**Antes:**
`try/except` em cada função de rota com `return jsonify({"erro": str(e)}), 500`.
**Depois:**
Usar um Error Handler global do framework (ex: `@app.errorhandler(Exception)` no Flask).

## 7. Parametrização de Porta e Host
**Antes:**
```python
app.run(host="0.0.0.0", port=5000)
```
**Depois:**
```python
port = int(os.getenv("PORT", 5000))
app.run(host="0.0.0.0", port=port)
```

## 8. Substituição de API Depreciada
**Antes:**
```javascript
let buf = new Buffer("senha");
```
**Depois:**
```javascript
let buf = Buffer.from("senha");
```

## 9. Resolução de Query N+1
**Antes:**
```python
for user in users:
    user['orders'] = db.execute("SELECT * FROM orders WHERE user_id = " + str(user['id']))
```
**Depois:**
```python
# Use um JOIN ou busque todos de uma vez
orders = db.execute("SELECT * FROM orders WHERE user_id IN (SELECT id FROM users)")
# Mapeie as ordens para os usuários em memória
```
