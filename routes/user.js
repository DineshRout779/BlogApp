const express = require("express");
const router = express.Router();
const user = require("../controllers/user");

const { verifyToken } = require("../middlewares/verifyToken");

router.get("/:userId", verifyToken, user.viewProfile);
router.put("/:userId", verifyToken, user.updateProfile);
router.delete("/:userId", verifyToken, user.deleteProfile);

module.exports = router;
