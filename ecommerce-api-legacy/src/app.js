require('dotenv').config();
const express = require('express');
const { initDb } = require('./config/database');
const { config } = require('./utils');
const routes = require('./routes');

const app = express();
app.use(express.json());

// Initialize database
initDb();

// Setup routes
app.use('/api', routes);

app.listen(config.port, () => {
    console.log(`Frankenstein LMS rodando na porta ${config.port}...`);
});
