const express = require("express");
const router = express.Router();
const { register, login, updateProfile, googleAuth } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.put("/profile", protect, updateProfile);

module.exports = router;
