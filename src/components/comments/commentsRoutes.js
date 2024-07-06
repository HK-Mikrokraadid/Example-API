const express = require('express');
const commentsController = require('./commentsController');

const commentsRouter = express.Router();

commentsRouter
  .get('/', commentsController.getAllComments)
  .get('/:id', commentsController.getCommentById)
  .post('/', commentsController.createComment);

module.exports = commentsRouter;
