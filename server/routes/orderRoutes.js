const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  processPayment,
  cancelOrder,
  getOrderStats
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/stats", getOrderStats);
router.get("/:orderId", getOrderById);
router.put("/:orderId/status", updateOrderStatus);
router.post("/:orderId/payment", processPayment);
router.put("/:orderId/cancel", cancelOrder);

module.exports = router;
