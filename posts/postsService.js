const posts = require('./posts');

const getAllPosts = async () => posts;

const getPostById = async (id) => {
  const post = posts.find((p) => p.id === id);
  return post;
};

module.exports = { getAllPosts, getPostById };
