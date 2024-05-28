const users = require('./users');
const hashService = require('../general/hashService');

const getUserById = async (id) => {
  const user = users.find((u) => u.id === id);
  const { password, ...userToReturn } = user;
  return userToReturn;
};

const getAllUsers = async () => {
  // return users without passwords
  return users.map((u) => {
    const { password, ...user } = u;
    return user;
  });
};

const createUser = async (user) => {
  const hashedPassword = await hashService.hashPassword(user.password);
  const id = users.length + 1;
  const newUser = {
    ...user, id, password: hashedPassword, role: 'user',
  };
  users.push(newUser);
  const { password, ...createdUser } = newUser;
  return createdUser;
};

const getUserByEmail = async (email) => {
  const user = users.find((u) => u.email === email);
  return user;
};

module.exports = {
  getUserById, getAllUsers, createUser, getUserByEmail,
};
