const { Post, User } = require("../models");

exports.findAllData = async (req, res) => {
  try {
    const title = req.query.title;
    const userId = req.params.id;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    await Post.findAll({ where: condition, raw: true })
      .then(async (posts) => {
        await User.findOne({
          where: { id: userId },
          raw: true,
        })
          .then((user) => {
            res.status(200).render("posts", { posts, user });
          })
          .catch((err) => {
            res.send(404).json({
              message: err,
            });
          });
      })
      .catch((err) => {
        res.send(404).json({
          message: err,
        });
      });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

exports.addPostPage = async (req, res) => {
  const { id } = req.params;

  await User.findOne({ where: { id }, raw: true })
    .then((user) => {
      res.status(200).render("addPost", {
        title: "Add Post | BlogApp",
        user,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json(err);
    });
};

exports.create = async (req, res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  const { id } = req.params;
  const user = await User.findOne({ where: { id } });
  const { title, desc, body } = req.body;
  const post = {
    title,
    desc,
    body,
    author: user.name,
  };
  await Post.create(post)
    .then(() => {
      res.redirect(`/posts/${id}`);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: err,
      });
    });
};
