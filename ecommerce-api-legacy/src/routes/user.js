const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.delete('/:id', UserController.delete);

module.exports = router;
