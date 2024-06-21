const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config');
const usersRouter = require('./users/usersRoutes');
const postsRouter = require('./posts/postsRoutes');
const commentsRouter = require('./comments/commentsRoutes');
const authRouter = require('./auth/authRoutes');
const { notFound, errorHandling } = require('./general/generalMiddlewares');
const ping = require('./general/generalController');
const { isLoggedIn } = require('./auth/authMiddleware');
const logger = require('./general/logger');


const app = express();

const port = config.port || 3000;

app.use(cors());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) }}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  logger.info(`Blog app listening at http://localhost:${port}`);
});


// --- File separator ---

const config = {
  port: 3000,
  jwtSecret: 'my-secret-key',
  saltRounds: 10,
  db: {
    host: 'db',
    user: 'mrt',
    password: 'secret',
    database: 'blog',
    port: 3306,
  }
};

module.exports = config;


// --- File separator ---

const express = require('express');
const usersController = require('./usersController');
const { isAdmin } = require('../auth/authMiddleware');

const usersRouter = express.Router();

usersRouter.post('/', usersController.createUser);
usersRouter.use(isAdmin);
usersRouter.get('/', usersController.getAllUsers);
usersRouter.get('/:id', usersController.getUserById);

module.exports = usersRouter;


// --- File separator ---

const usersService = require('./usersService');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await usersService.getAllUsers();
    return res.status(200).json({
      success: true,
      message: 'All users',
      users,
    });
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await usersService.getUserById(id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    return res.status(200).json({
      success: true,
      message: 'User by id',
      user,
    });
  } catch (error) {
    return next(error);
  }

};

const createUser = async (req, res, next) => {
  try {
    const {
      firstName, lastName, email, password,
    } = req.body;
    if (!firstName || !lastName || !email || !password) {
      const error = new Error('First name, last name, email and password are required');
      error.status = 400;
      throw error;
    }
    const user = {
      firstName, lastName, email, password,
    };
    const id = await usersService.createUser(user);
    return res.status(201).json({
      success: true,
      message: 'User created',
      id,
    });
  } catch (error) {
    return next(error);
  }

};

module.exports = { getAllUsers, getUserById, createUser };


// --- File separator ---

const hashService = require('../general/hashService');
const db = require('../db');

const getAllUsers = async () => {
  try {
    const [rows] = await db.query(
      `SELECT
        firstName, lastName, email, created_at
      FROM
        users
      WHERE
        deleted_at IS NULL`);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const createUser = async (user) => {
  try {
    const hashedPassword = await hashService.hashPassword(user.password);
    const [result] = await db.query('INSERT INTO users SET ?', { ...createdUser, password: hashedPassword });
    const id = result.insertId;
    return id;
  } catch (error) {
    throw error;
  }

};

const getUserByEmail = async (email) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND deleted_at IS NULL', [email]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUserById, getAllUsers, createUser, getUserByEmail,
};


// --- File separator ---

const bcrypt = require('bcrypt');
const config = require('../config');

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, config.saltRounds);
  return hashedPassword;
};

const comparePasswords = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

module.exports = { hashPassword, comparePasswords };


// --- File separator ---

const mysql = require('mysql2');
const { db } = require('./config');

const pool = mysql.createPool(db).promise();

module.exports = pool;


// --- File separator ---

const jwtService = require('../general/jwtService');

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      const error = new Error('Token is required');
      error.status = 401;
      throw error;
    }
    const payload = await jwtService.verifyToken(token);
    if (!payload) {
      const error = new Error('Invalid token');
      error.status = 401;
      throw error;
    }
    res.locals.user = payload;
    return next();
  } catch (error) {
    return next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const role = res.locals.user?.role;
    if (!role) {
      const error = new Error('You need to be logged in to access this route');
      error.status = 401;
      throw error;
    }
    if (role !== 'admin') {
      const error = new Error('Unauthorized');
      error.status = 403;
      throw error;
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { isLoggedIn, isAdmin };


// --- File separator ---

const jwt = require('jsonwebtoken');
const config = require('../config');

const secret = config.jwtSecret;

const generateToken = async (payload) => {
  const token = await jwt.sign(payload, secret, { expiresIn: '1h' });
  return token;
};

const verifyToken = async (token) => {
  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (error) {
    error.status = 401;
    error.message = 'Invalid token';
    throw error;
  }
};

module.exports = { generateToken, verifyToken };


// --- File separator ---

const express = require('express');
const postsController = require('./postsController');
const { isLoggedIn } = require('../auth/authMiddleware');

const postsRouter = express.Router();

postsRouter.get('/', postsController.getAllPosts);
postsRouter.get('/:id', postsController.getPostById);
postsRouter.use(isLoggedIn);
postsRouter.post('/', postsController.createPost);

module.exports = postsRouter;


// --- File separator ---

const postsService = require('./postsService');

const getAllPosts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { posts, total } = await postsService.getAllPosts(page, limit);
    return res.status(200).json({
      success: true,
      message: 'All posts',
      posts,
      pagination: {
        totalPages: Math.ceil(total / limit),
        itemsPerPage: limit,
        currentPage: page,
        totalItems: total,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const post = await postsService.getPostById(id);
    if (!post) {
      const error = new Error('Post not found');
      error.status = 404;
      throw error;
    }
    return res.status(200).json({
      success: true,
      message: 'Post by id',
      post,
    });
  } catch (error) {
    return next(error);
  }
};

const createPost = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      const error = new Error('title and body are required');
      error.status = 400;
      throw error;
    }
    const userId = res.locals.user.id;
    const post = {
      title, body, user_id: userId,
    };
    const id = await postsService.createPost(post);
    return res.status(201).json({
      success: true,
      message: 'Post created',
      id,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getAllPosts, getPostById, createPost };


// --- File separator ---

const db = require('../db');

const getAllPosts = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    // Select total of posts
    const [total] = await db.query('SELECT COUNT(*) as total FROM posts WHERE deleted_at IS NULL;');
    // select from posts using from and limit
    const [rows] = await db.query(`
      SELECT
        u.firstName,
        u.lastName,
        u.email,
        p.id,
        p.title,
        p.body,
        p.created_at,
        p.updated_at
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.deleted_at IS NULL
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?;
      `, [limit, offset]);
    return { posts: rows, total: total[0].total };
  } catch (error) {
    throw error;
  }
};

const getPostById = async (id) => {
  try {
    const [rows] = await db.query(`
      SELECT
        u.firstName,
        u.lastName,
        u.email,
        p.id,
        p.title,
        p.body,
        p.created_at,
        p.updated_at
      FROM posts p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.deleted_at IS NULL AND p.id = ?;`, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const createPost = async (post) => {
  try {
    const [result] = await db.query('INSERT INTO posts ?', post);
    return result.insertId;
  } catch (error) {
    throw error;
  }
}

module.exports = { getAllPosts, getPostById, createPost };


// --- File separator ---

const express = require('express');
const commentsController = require('./commentsController');

const commentsRouter = express.Router();

commentsRouter.get('/', commentsController.getAllComments);
commentsRouter.get('/:id', commentsController.getCommentById);
commentsRouter.post('/', commentsController.createComment);

module.exports = commentsRouter;


// --- File separator ---

const commentsService = require('./commentsService');

const getAllComments = async (req, res, next) => {
  try {
    const comments = await commentsService.getAllComments();
    return res.status(200).json({
      success: true,
      message: 'All comments',
      comments,
    });
  } catch (error) {
    return next(error);
  }
};

const getCommentById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const comment = await commentsService.getCommentById(id);
    if (!comment) {
      const error = new Error('Comment not found');
      error.status = 404;
      throw error;
    }
  } catch (error) {
    return next(error);
  }

  return res.status(200).json({
    success: true,
    message: 'Comment by id',
    comment,
  });
};

const createComment = async (req, res) => {
  try {
    const { name, email, body, postId } = req.body;
    if (!name || !email || !body || !postId) {
      const error = new Error('name, email, body and postId are required');
      error.status = 400;
      throw error;
    }
    const comment = {
      name,
      email,
      body,
      post_id: postId,
    };
    const id = await commentsService.createComment(comment);
    return res.status(201).json({
      success: true,
      message: 'comment created',
      id,
    });
  } catch (error) {
    return next(error);
  }

}

module.exports = { getAllComments, getCommentById, createComment };


// --- File separator ---

const db = require('../db');


const getAllComments = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM comments WHERE deleted_at IS NULL');
    return rows;
  } catch (error) {
    throw error;
  }
};

const getCommentById = async (id) => {
  try {
    const [rows] = await db.query('SELECT * FROM comments WHERE id = ? AND deleted_at IS NULL', [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const createComment = async (comment) => {
  try {
    const [result] = await db.query('INSERT INTO comments SET ?', comment);
    const id = result.insertId;
    return id;
  } catch (error) {
    throw error;
  }
}

module.exports = { getAllComments, getCommentById, createComment };


// --- File separator ---

const express = require('express');
const authController = require('./authController');

const authRouter = express.Router();

authRouter.post('/', authController.login);

module.exports = authRouter;


// --- File separator ---

const authService = require('./authService');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.status = 400;
      throw error;
    }
    const token = await authService.login(email, password);
    if (!token) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }
    return res.status(200).json({
      success: true,
      message: 'Logged in',
      token,
    });
  } catch (error) {
    return next(error);
  }

};

module.exports = { login };


// --- File separator ---

const usersService = require('../users/usersService');
const hashService = require('../general/hashService');
const jwtService = require('../general/jwtService');

const login = async (email, password) => {
  const user = await usersService.getUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }
  const isMatch = await hashService.comparePasswords(password, user.password);
  const payload = { id: user.id, email: user.email, role: user.role };
  const token = jwtService.generateToken(payload);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }
  return token;
};

module.exports = { login };


// --- File separator ---

const logger = require('./logger');

// eslint-disable-next-line no-unused-vars
const notFound = (req, res, next) => {
  res.status(404).send({
    success: false,
    message: 'Route not found',
  });
};

const errorHandling = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  // console.error(err.stack);
  if (!err.status || err.status === 500) {
    err.message = 'Internal Server Error';
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = { notFound, errorHandling };


// --- File separator ---

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;

// Kohandatud logi formaat
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }), // Logi veateated koos stack trace'iga
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: './logs/combined.log' }),
    new transports.File({ filename: './logs/errors.log', level: 'error' }),
  ],
});

module.exports = logger;


// --- File separator ---

const ping = (req, res) => {
  res.json({
    success: true,
    message: 'API is alive and well!'
  });
};

module.exports = ping;
