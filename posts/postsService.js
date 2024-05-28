const posts = require('./posts');

const getAllPosts = async () => posts;

const getPostById = async (id) => {
  const post = posts.find((post) => post.id === id);
  return post;
};

const createPost = async (post) => {
  const id = posts.length + 1;
  post.id = id;
  posts.push(post);
  return post;
}

module.exports = { getAllPosts, getPostById, createPost };
