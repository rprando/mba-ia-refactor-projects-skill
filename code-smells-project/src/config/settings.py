import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "minha-chave-super-secreta-123")
    DEBUG = os.getenv("DEBUG", "True") == "True"
    DB_PATH = "loja.db"
    PORT = int(os.getenv("PORT", 5000))
    HOST = os.getenv("HOST", "0.0.0.0")
