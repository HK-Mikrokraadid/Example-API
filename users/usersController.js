const usersService = require('./usersService');

const getAllUsers = async (req, res) => {
  const users = await usersService.getAllUsers();
  return res.status(200).json({
    success: true,
    message: 'All users',
    users,
  });
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await usersService.getUserById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
  return res.status(200).json({
    success: true,
    message: 'User by id',
    user,
  });
};

const createUser = async (req, res) => {
  const {
    firstName, lastName, email, password,
  } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'First name, last name, email and password are required',
    });
  }
  const user = {
    firstName, lastName, email, password,
  };
  const id = await usersService.createUser(user);
  return res.status(201).json({
    success: true,
    message: 'User created',
    userId: id,
  });
};

module.exports = { getAllUsers, getUserById, createUser };
