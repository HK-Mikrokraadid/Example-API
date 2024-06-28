const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const usersRouter = require('./users/usersRoutes');
const postsRouter = require('./posts/postsRoutes');
const commentsRouter = require('./comments/commentsRoutes');
const authRouter = require('./auth/authRoutes');
const { notFound, errorHandling } = require('./general/generalMiddlewares');
const ping = require('./general/generalController');
const { isLoggedIn } = require('./auth/authMiddleware');
const logger = require('./general/logger');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) }}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/ping', ping);
app.use('/login', authRouter);
app.use(isLoggedIn);
app.use('/comments', commentsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

app.use('*', notFound);

app.use(errorHandling);

module.exports = app;
