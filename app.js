const express = require('express');
const cors = require('cors');
const config = require('./config');
const usersRouter = require('./users/usersRoutes');
const postsRouter = require('./posts/postsRoutes');
const commentsRouter = require('./comments/commentsRoutes');
const authRouter = require('./auth/authRoutes');
const { notFound, errorHandling } = require('./general/generalMiddlewares');
const { loggingMiddleware } = require('./general/loggingMiddleware');
const ping = require('./general/generalController');
const { isLoggedIn } = require('./auth/authMiddleware');

const app = express();

const port = config.port || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggingMiddleware);

app.use('/ping', ping);
app.use('/login', authRouter);
app.use(isLoggedIn);
app.use('/comments', commentsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

app.use('*', notFound);

app.use(errorHandling);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Blog app listening at http://localhost:${port}`);
});
