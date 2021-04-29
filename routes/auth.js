const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/login", authController.login);

router.post("/register", authController.register);

router.get("/logout", authController.logout);

router.post("/admin", authController.adminViewBlogs);

router.get("/adminViewUsers", authController.adminViewUsers);

module.exports = router;
