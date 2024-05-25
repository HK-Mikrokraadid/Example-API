const postsService = require('./postsService');

const getAllPosts = async (req, res) => {
  const posts = await postsService.getAllPosts();
  return res.status(200).json({
    success: true,
    message: 'All posts',
    posts,
  });
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  const post = await postsService.getPostById(id);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Post by id',
    post,
  });
};

module.exports = { getAllPosts, getPostById };
