const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');
const usersRouter = require('./components/users/usersRoutes');
const postsRouter = require('./components/posts/postsRoutes');
const commentsRouter = require('./components/comments/commentsRoutes');
const authRouter = require('./components/auth/authRoutes');
const { notFound, errorHandling } = require('./components/general/generalMiddlewares');
const ping = require('./components/general/generalController');
const { isLoggedIn } = require('./components/auth/authMiddleware');
const logger = require('./components/general/logger');
require('dotenv').config();

const app = express();

app.use(cors());
// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) }}));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/ping', ping);
app.use('/login', authRouter);
app.use('/users', usersRouter);
app.use(isLoggedIn);
app.use('/comments', commentsRouter);
app.use('/posts', postsRouter);

app.use('*', notFound);

app.use(errorHandling);

module.exports = app;
