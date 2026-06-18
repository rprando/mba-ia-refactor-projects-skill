# Heurísticas de Análise de Projeto

## Detecção de Stack

### Linguagem
- **Python:** Presença de arquivos `.py`, `requirements.txt`, `Pipfile`, `pyproject.toml`.
- **Node.js:** Presença de arquivos `.js`, `.ts`, `package.json`, `node_modules`.

### Framework
- **Flask (Python):** `import flask` ou `from flask import Flask` no código.
- **Express (Node.js):** `require('express')` ou `import express from 'express'`.

### Banco de Dados
- **SQLite:** `import sqlite3`, `import sqlalchemy` com `sqlite:///`, ou presença de arquivos `.db`, `.sqlite`.
- **PostgreSQL/MySQL:** Strings de conexão específicas em arquivos de config ou `.env`.

## Mapeamento de Arquitetura

### Monolítica Flat
- Todos os arquivos na raiz.
- Falta de pastas como `models/`, `controllers/`, `routes/`.

### Camadas Parciais
- Presença de algumas pastas (ex: `models/`), mas lógica misturada em outros arquivos (ex: business logic no `routes/`).

### Domínio
- Identificar entidades principais buscando por nomes de tabelas SQL ou classes de modelos (ex: `User`, `Product`, `Order`, `Task`).
