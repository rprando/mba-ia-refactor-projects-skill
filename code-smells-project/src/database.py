import sqlite3
from flask import g
from .config.settings import Config

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(Config.DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()

def init_db(app):
    with app.app_context():
        db = get_db()
        with open("database.py", "r") as f:
            # Simplificando: o database.py original tem o schema no docstring ou similar
            # Aqui vamos apenas garantir que a conexão funciona
            pass
