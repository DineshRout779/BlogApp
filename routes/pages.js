const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const router = express.Router();

dotenv.config({ path: "./.env" });

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

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

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login | NodeApp" });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/dashboard", verifyToken, (req, res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );

  db.query("SELECT * FROM posts", (error, results) => {
    if (error) {
      console.log(error);
    }
    const blogs = [...results];
    res.render("dashboard", { title: "Dashboard | NodeApp", blogs });
  });
});

router.get("/viewBlog/:id", verifyToken, (req, res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );

  const { id } = req.params;

  db.query("SELECT * FROM posts WHERE id = ?", [id], (error, results) => {
    if (error) {
      console.log(error);
    }
    const blogs = [...results];
    res.render("viewBlog", { title: "Blog | NodeApp", blogs });
  });
});

// restricted admin route
// router.get("/admin", (req, res) => {
//   res.render("adminLogin", { title: "Verify" });
// });

module.exports = router;
