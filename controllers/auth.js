const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { User } = require("../models");

// auth login
exports.login = (req, res) => {
  try {
    const { email, password } = req.body;
    User.findOne({ where: { email } })
      .then((user) => {
        if (user === null) {
          res
            .status(401)
            .render("login", { message: "Account does not exists" });
        } else {
          bcryptjs.compare(password, user.password, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              const token = jwt.sign(
                { email: user.email },
                "secret",
                (err, token) => {
                  if (err) {
                    console.log(err);
                    res.status(401).json({
                      message: err,
                    });
                  }
                  console.log(token);
                  const cookieOptions = {
                    expires: new Date(
                      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
                    ),
                    httpOnly: true,
                  };
                  res
                    .cookie("jwt", token, cookieOptions)
                    .status(200)
                    .redirect(`/posts/${user.id}`);
                }
              );
            } else {
              res.status(401).render("login", {
                message: "Email and password doesnt match",
              });
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(401).render("login", {
          message: "Something went wrong! Please try again",
        });
      });
  } catch (error) {
    console.log(error);
    res.sendStatus(error);
  }
};

// auth register
exports.register = (req, res) => {
  console.log(req.body);
  const { name, email, password, passwordConfirm } = req.body;
  if (password !== passwordConfirm) {
    return res.render("register", {
      message: "Passwords do not match!",
    });
  }
  User.findOne({ where: { email } })
    .then((result) => {
      if (result) {
        res.status(401).render("register", {
          message: "That email has already been use!",
        });
      } else {
        bcryptjs.genSalt(10, (err, salt) => {
          if (err) {
            console.log(err);
            res.status(401).render("register", {
              message: err,
            });
          }
          bcryptjs.hash(password, salt, (err, hash) => {
            if (err) {
              console.log(err);
              res.status(401).render("register", {
                message: err,
              });
            }

            const user = {
              name,
              email,
              password: hash,
            };

            User.create(user)
              .then((result) => {
                res.status(200).render("register", {
                  message: "User registered ",
                  content: "<a href='/login' class='def-a'>Login</a>",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).render("register", {
                  message: err,
                });
              });
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).render("register", {
        message: err,
      });
    });
};

// auth logout
exports.logout = (req, res) => {
  res.clearCookie("jwt");
  console.log("logged out");
  res.redirect("/");
};
