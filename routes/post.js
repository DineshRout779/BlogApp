const express = require("express");
const router = express.Router();
const post = require("../controllers/post");

const { verifyToken } = require("../middlewares/verifyToken");

router.get("/:userId", verifyToken, post.findAllData);

router.post("/:userId", verifyToken, post.create);
router.get("/add/:userId", verifyToken, post.addPostPage);

router.get("/:userId/:blogId", verifyToken, post.view);

router.get("/update/:userId/:blogId", verifyToken, post.updatePostPage);
router.put("/:userId/:blogId", verifyToken, post.update);

router.delete("/:userId/:blogId", verifyToken, post.delete);

module.exports = router;
