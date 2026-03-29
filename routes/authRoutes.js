const express = require("express");
const router = express.Router();
const { register, login, logoutUser, verifyEmail } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logoutUser);
router.get("/verify-email/:token", verifyEmail);

module.exports = router;