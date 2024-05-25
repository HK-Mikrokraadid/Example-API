const express = require('express');
const usersController = require('./usersController');

const usersRouter = express.Router();

usersRouter.get('/', usersController.getAllUsers);
usersRouter.get('/:id', usersController.getUserById);
usersRouter.post('/', usersController.createUser);

module.exports = usersRouter;
