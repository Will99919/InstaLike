const express = require('express');
const router = express.Router();
const usersController = require('../controller/usersController');

router.post('/', usersController.createUser);
router.get('/', usersController.getAllUsers);
router.post('/login', usersController.loginUser);

module.exports = router;