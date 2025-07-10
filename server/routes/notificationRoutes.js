const express = require("express");
const router = express.Router();
const { 
  getNotifications, 
  createNotification,
  markAsRead,
  deleteNotification 
} = require("../controllers/notificationController");
const { protect, restrictToAdmin } = require("../middleware/authMiddleware");

router.get("/", protect, getNotifications);
router.post("/", protect, restrictToAdmin, createNotification);
router.put("/:notificationId/read", protect, markAsRead);
router.delete("/:notificationId", protect, deleteNotification);

module.exports = router;
