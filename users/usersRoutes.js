const express = require('express');
const usersController = require('./usersController');
const { isAdmin } = require('../auth/authMiddleware');

const usersRouter = express.Router();

usersRouter
  .post('/', usersController.createUser)
  .use(isAdmin)
  .get('/', usersController.getAllUsers)
  .get('/:id', usersController.getUserById);

module.exports = usersRouter;
