const express = require('express');
const commentsController = require('./commentsController');

const commentsRouter = express.Router();

commentsRouter.get('/', commentsController.getAllComments);
commentsRouter.get('/:id', commentsController.getCommentById);
commentsRouter.post('/', commentsController.createComment);

module.exports = commentsRouter;
