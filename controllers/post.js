const { Post, User } = require("../models");

exports.findAllData = async (req, res) => {
  try {
    const title = req.query.title;
    const { userId } = req.params;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    await Post.findAll({ where: condition, raw: true })
      .then(async (posts) => {
        await User.findOne({
          where: { id: userId },
          raw: true,
        })
          .then((user) => {
            res.render("posts", { posts, user });
          })
          .catch((err) => {
            res.sendStatus(404).json({
              message: err,
            });
          });
      })
      .catch((err) => {
        res.sendStatus(404).json({
          message: err,
        });
      });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

exports.addPostPage = async (req, res) => {
  const { userId } = req.params;

  await User.findOne({ where: { id: userId }, raw: true })
    .then((user) => {
      res.render("addPost", {
        title: "Add Post | BlogApp",
        user,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404).json(err);
    });
};

exports.create = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ where: { id: userId } });
  const { title, desc, body } = req.body;
  const post = {
    title,
    desc,
    body,
    author: user.name,
  };
  await Post.create(post)
    .then(() => {
      res.redirect(`/posts/${userId}`);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404).json({
        message: err,
      });
    });
};

exports.view = async (req, res) => {
  try {
    const { blogId, userId } = req.params;
    await Post.findOne({ where: { id: blogId }, raw: true })
      .then(async (post) => {
        await User.findOne({ where: { id: userId }, raw: true })
          .then((user) => {
            res.render("viewBlog", {
              title: "Blog | BlogApp",
              post,
              user,
            });
          })
          .catch((e) => {
            console.log(e);
            res.sendStatus(e);
          });
      })
      .catch((e) => {
        console.log(e);
        res.sendStatus(e);
      });
  } catch (error) {
    console.log(error);
    res.sendStatus(error);
  }
};

exports.updatePostPage = async (req, res) => {
  const { userId, blogId } = req.params;

  await Post.findOne({ where: { id: blogId }, raw: true })
    .then((post) => {
      User.findOne({ where: { id: userId }, raw: true }).then((user) => {
        res.render("editPost", {
          post,
          user,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404).json(err);
    });
};

exports.update = async (req, res) => {
  try {
    const { blogId, userId } = req.params;
    const { title, desc, body } = req.body;
    const post = {
      title: title,
      desc: desc,
      body: body,
    };
    await Post.update(post, { where: { id: blogId } })
      .then((post) => {
        console.log(post);
        res.redirect(`/posts/${userId}`);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(error);
      });
  } catch (error) {
    console.log(error);
    res.sendStatus(error);
  }
};

exports.delete = async (req, res) => {
  try {
    const { blogId, userId } = req.params;

    await Post.destroy({ where: { id: blogId } })
      .then(() => {
        res.redirect(`/posts/${userId}`);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(err);
      });
  } catch (error) {
    console.log(error);
  }
};
