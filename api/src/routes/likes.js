const express = require('express');
const router = express.Router();
const likesController = require('../controller/likesController');

router.post('/', likesController.createLike);
router.get('/', likesController.getAllLikes);

module.exports = router;