const express = require('express');
const router = express.Router();
const commentsController = require('../controller/commentsController');

router.post('/', commentsController.createComment);
router.get('/', commentsController.getAllComments);

module.exports = router;