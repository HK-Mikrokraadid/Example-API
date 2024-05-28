const express = require('express');
const usersController = require('./usersController');
const { isLoggedIn, isAdmin } = require('../auth/authMiddleware');

const usersRouter = express.Router();

usersRouter.post('/', usersController.createUser);
usersRouter.use(isLoggedIn);
usersRouter.use(isAdmin);
usersRouter.get('/', usersController.getAllUsers);
usersRouter.get('/:id', usersController.getUserById);

module.exports = usersRouter;
