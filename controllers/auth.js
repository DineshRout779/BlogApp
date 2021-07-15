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
    // const statement = "SELECT * FROM users where email = ?";
    // db.query(statement, [email], (err, results) => {
    //   console.log(results);
    //   if (err) {
    //     console.log(err);
    //   }
    //   // if account doesn't exists
    //   if (results.length === 0) {
    //
    //   } else {
    //     let hash = results[0].password;
    //     // check entered pw with pw in stored in db
    //     bcrypt.compare(password, hash, function (err, result) {
    //       // execute code to test for access and login
    //       hasAccess(result, results);
    //     });
    //   }
    // });
    // const hasAccess = (result, results) => {
    //   if (result) {
    //     // account found
    //     const id = results[0].id;
    //     // generating token
    //     const token = jwt.sign({ id }, "secret", {
    //       expiresIn: 60 * 60 * 24,
    //     });
    //     const cookieOptions = {
    //       expires: new Date(
    //         Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
    //       ),
    //       httpOnly: true,
    //     };
    //     res.cookie("jwt", token, cookieOptions);
    //     return res.status(200).redirect(`/dashboard/${id}`);
    //   } else {
    //     // access denied
    //     res.render("login", { message: "Incorrect email or password" });
    //   }
    // };
  } catch (error) {
    console.log(error);
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
              message: "err",
            });
          }
          bcryptjs.hash(password, salt, (err, hash) => {
            if (err) {
              console.log(err);
              res.status(401).render("register", {
                message: "Something went wrong!",
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
                  message: "Something went wrong!",
                });
              });
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).render("register", {
        message: "Something went wrong!",
      });
    });
  // db.query(
  //   "SELECT email FROM users WHERE email = ? ",
  //   [email],
  //   async (error, results) => {
  //     if (error) {
  //       console.log(error);
  //     }
  //     if (results.length > 0) {
  //       return res.render("register", {
  //         message: "That email has already been use!",
  //       });
  //     } else if (password !== passwordConfirm) {
  //       return res.render("register", {
  //         message: "Passwords do not match!",
  //       });
  //     }

  //     // Generate Salt
  //     const salt = bcrypt.genSaltSync(10);

  //     // Hash Password
  //     const hash = bcrypt.hashSync(password, salt);

  //     console.log(`hash is ${hash}`);

  //     db.query(
  //       "INSERT INTO users SET ?",
  //       { name: name, email: email, password: hash },
  //       (error, results) => {
  //         if (error) {
  //           console.log(error);
  //         } else {
  //           return res.render("register", {
  //             message: "User registered ",
  //             content: "<a href='/login' class='def-a'>Login</a>",
  //           });
  //         }
  //       }
  //     );
  //   }
  // );
};

// auth logout
exports.logout = (req, res) => {
  res.clearCookie("jwt");
  console.log("logged out");
  res.redirect("/");
};
