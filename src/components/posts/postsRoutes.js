const express = require('express');
const postsController = require('./postsController');
const commentsController = require('../comments/commentsController');

const postsRouter = express.Router();

postsRouter
  .get('/', postsController.getAllPosts)
  .get('/:id', postsController.getPostById)
  .post('/', postsController.createPost)
  .patch('/:id', postsController.updatePost)
  .delete('/:id', postsController.deletePost)
  .get('/:id/comments', commentsController.getPostComments);

module.exports = postsRouter;
