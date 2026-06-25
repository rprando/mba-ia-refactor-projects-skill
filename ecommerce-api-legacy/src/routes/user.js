const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/', UserController.list);
router.get('/:id', UserController.get);
router.delete('/:id', UserController.delete);

module.exports = router;
