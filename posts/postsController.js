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
  const id = Number(req.params.id);
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

const createPost = async (req, res) => {
  const { title, body } = req.body;
  const userId = res.locals.user.id;
  const newPost = await postsService.createPost({ title, body, userId });
  return res.status(201).json({
    success: true,
    message: 'Post created',
    post: newPost,
  });
}

module.exports = { getAllPosts, getPostById, createPost };
