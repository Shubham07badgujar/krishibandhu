const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/adminController");
const { protect, restrictToAdmin } = require("../middleware/authMiddleware");

router.get("/stats", protect, restrictToAdmin, getAdminStats);

module.exports = router;
