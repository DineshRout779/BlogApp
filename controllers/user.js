const { Post, User } = require("../models");

// show user profile
exports.viewProfile = async (req, res) => {
  const { userId } = req.params;
  await User.findOne({ where: { id: userId }, raw: true })
    .then(async (user) => {
      await Post.findAll({ where: { author: user.name }, raw: true })
        .then((posts) => {
          res.render("profile", {
            title: "Profile | BlogApp",
            user,
            posts,
          });
        })
        .catch((err) => {
          console.log(err);
          res.render("profile", {
            title: "Profile | BlogApp",
            err,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.render("profile", {
        title: "Profile | BlogApp",
        err,
      });
    });
};

// update profile
exports.updateProfile = async (req, res) => {};

// delete profile
exports.deleteProfile = async (req, res) => {};
