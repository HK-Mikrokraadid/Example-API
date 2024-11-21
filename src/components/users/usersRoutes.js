const express = require('express');
const usersController = require('./usersController');
const { isAdmin, isLoggedIn } = require('../auth/authMiddleware');
const rateLimit = require('express-rate-limit');

const usersRouter = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

usersRouter
  .post('/', usersController.createUser)
  .use(isLoggedIn)
  .use(limiter)
  .get('/:id', usersController.getUserById)
  .patch('/:id', usersController.updateUser)
  .delete('/:id', usersController.deleteUser)
  .use(isAdmin)
  .get('/', usersController.getAllUsers);

module.exports = usersRouter;
