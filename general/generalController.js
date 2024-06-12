const ping = (req, res) => {
  res.json({
    success: true,
    message: 'API is alive and well!'
  });
};

module.exports = ping;
