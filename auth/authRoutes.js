const express = require('express');
const authController = require('./authController');

const authRouter = express.Router();

authRouter.post('/', authController.login);

module.exports = authRouter;
