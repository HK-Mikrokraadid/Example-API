const express = require('express');
const usersController = require('./usersController');
const { isAdmin, isLoggedIn } = require('../auth/authMiddleware');

const usersRouter = express.Router();

usersRouter
  .post('/', usersController.createUser)
  .use(isLoggedIn)
  .get('/:id', usersController.getUserById)
  .patch('/:id', usersController.updateUser)
  .delete('/:id', usersController.deleteUser)
  .use(isAdmin)
  .get('/', usersController.getAllUsers);

module.exports = usersRouter;
