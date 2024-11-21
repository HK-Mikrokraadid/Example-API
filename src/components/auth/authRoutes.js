const express = require('express');
const RateLimit = require('express-rate-limit');
const authController = require('./authController');

const authRouter = express.Router();

// set up rate limiter: maximum of 5 requests per minute
const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per windowMs
});

// apply rate limiter to login route
authRouter.post('/', limiter, authController.login);

module.exports = authRouter;
