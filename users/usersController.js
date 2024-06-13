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
