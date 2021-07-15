const express = require("express");
const router = express.Router();
const post = require("../controllers/post");

const { verifyToken } = require("../middlewares/verifyToken");

router.get("/:id", verifyToken, post.findAllData);
router.post("/:id", verifyToken, post.create);
router.get("/add/:id", verifyToken, post.addPostPage);

module.exports = router;
