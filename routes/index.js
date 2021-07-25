const express = require("express");
const router = express.Router();
const index = require("../controllers");

router.get("/", index.index);
router.get("/login", index.login);
router.get("/register", index.register);

module.exports = router;
