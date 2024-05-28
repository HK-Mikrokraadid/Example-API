const express = require('express');
const postsController = require('./postsController');
const { isLoggedIn } = require('../auth/authMiddleware');

const postsRouter = express.Router();

postsRouter.get('/', postsController.getAllPosts);
postsRouter.get('/:id', postsController.getPostById);
postsRouter.use(isLoggedIn);
postsRouter.post('/', postsController.createPost);

module.exports = postsRouter;
