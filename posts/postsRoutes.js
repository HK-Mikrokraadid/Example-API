const express = require('express');
const postsController = require('./postsController');

const postsRouter = express.Router();

postsRouter.get('/', postsController.getAllPosts);
postsRouter.get('/:id', postsController.getPostById);
postsRouter.post('/', postsController.createPost);

module.exports = postsRouter;
