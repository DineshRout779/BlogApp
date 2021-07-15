const jwt = require("jsonwebtoken");

// middleware for authentication.
const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  // check if token exits
  if (token) {
    jwt.verify(token, "secret", (error, decodedToken) => {
      if (error) {
        console.log(error);
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

module.exports = { verifyToken };
