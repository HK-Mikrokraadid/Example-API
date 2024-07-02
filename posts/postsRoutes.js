const express = require('express');
const postsController = require('./postsController');

const postsRouter = express.Router();

postsRouter
  .get('/', postsController.getAllPosts)
  .get('/:id', postsController.getPostById)
  .post('/', postsController.createPost)
  .patch('/:id', postsController.updatePost);

module.exports = postsRouter;
