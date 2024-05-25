const users = require('./users');
const hashService = require('../general/hashService');

const getUserById = async (id) => {
  const user = users.find((u) => u.id === id);
  return user;
};

const getAllUsers = async () => users;

const createUser = async (user) => {
  const hashedPassword = await hashService.hashPassword(user.password);
  const id = users.length + 1;
  const newUser = {
    ...user, id, password: hashedPassword, role: 'user',
  };
  users.push(newUser);
  return newUser.id;
};

const getUserByEmail = async (email) => {
  const user = users.find((u) => u.email === email);
  return user;
};

module.exports = {
  getUserById, getAllUsers, createUser, getUserByEmail,
};
