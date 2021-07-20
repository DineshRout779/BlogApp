const express = require("express");
const router = express.Router();
const index = require("../controllers");
const { verifyToken } = require("../middlewares/verifyToken");

router.get("/", index.index);
router.get("/login", index.login);
router.get("/register", index.register);

router.get("/delete/:userId/:blogId", verifyToken, (req, res) => {
  const { userId, blogId } = req.params;

  db.query("DELETE FROM posts WHERE id= ?", [blogId], (error, results) => {
    if (error) {
      return console.log(error);
    }
    console.log("post deleted!");
    res.redirect(`/dashboard/${userId}`);
  });
});

router.get("/profile/:userId", verifyToken, (req, res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );

  const { userId } = req.params;

  //search profile by id
  db.query("SELECT * FROM users WHERE id = ?", [userId], (error, userData) => {
    if (error) {
      console.log(error);
    }
    const author = userData[0].name;
    db.query(
      "SELECT * FROM posts WHERE author = ?",
      [author],
      (error, blogData) => {
        if (error) {
          console.log(error);
        }
        res.render("profile", {
          title: "Profile | BlogApp",
          userData,
          blogData,
        });
      }
    );
  });
});

router.get("/edit/:userId/:blogId", (req, res) => {
  const { blogId, userId } = req.params;

  db.query("SELECT * FROM posts WHERE id=?", [blogId], (error, blogData) => {
    if (error) {
      return console.log(error);
    }
    db.query("SELECT * FROM users WHERE id=?", [userId], (error, userData) => {
      if (error) {
        return console.log(error);
      }
      res.render("editPost", {
        title: "Edit post | BlogApp",
        blogData,
        userData,
      });
    });
  });
});

router.post("/edit/:userId/:blogId", verifyToken, (req, res) => {
  const { title, body } = req.body;
  const { userId, blogId } = req.params;

  db.query(
    "UPDATE posts SET title= ? , body= ? WHERE id= ?",
    [title, body, blogId],
    (error, results) => {
      if (error) {
        return console.log(error);
      }
      console.log("Post updated!");
      res.redirect(`/dashboard/${userId}`);
    }
  );
});

module.exports = router;
