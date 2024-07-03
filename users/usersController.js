const usersService = require('./usersService');
const hashService = require('../general/hashService');

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
    if (id !== res.locals.user.id && res.locals.user.role !== 'admin') {
      const error = new Error('Unauthorized');
      error.status = 403;
      throw error;
    }
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
    const existingUser = await usersService.getUserByEmail(email);
    if (existingUser) {
      const error = new Error('User already exists');
      error.status = 409;
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

const deleteUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await usersService.getUserById(id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    if (user.id !== res.locals.user.id && res.locals.user.role !== 'admin') {
      const error = new Error('Unauthorized');
      error.status = 403;
      throw error;
    }
    await usersService.deleteUser(id);
    return res.status(200).json({
      success: true,
      message: 'User deleted',
    });
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await usersService.getUserByIdWithPassword(id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    if (user.id !== res.locals.user.id && res.locals.user.role !== 'admin') {
      const error = new Error('Unauthorized');
      error.status = 403;
      throw error;
    }
    const {
      firstName, lastName, email, password, role,
    } = req.body;
    if (!firstName && !lastName && !email && !password && !role) {
      const error = new Error('First name, last name, email or password are required');
      error.status = 400;
      throw error;
    }
    let hash;
    if (password && password.length > 0) {
      hash = await hashService.hashPassword(password);
    }
    if (role !== 'admin' && role !== 'user') {
      const error = new Error('Role must be admin or user');
      error.status = 400;
      throw error;
    }
    if (res.locals.user.role !== 'admin' && role === 'admin') {
      const error = new Error('Unauthorized');
      error.status = 403;
      throw error;
    }
    const updatedUser = {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      password: hash || user.password,
      role: role || user.role,
    };
    await usersService.updateUser(id, updatedUser);
    return res.status(200).json({
      success: true,
      message: 'User updated',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getAllUsers, getUserById, createUser, deleteUser, updateUser };
