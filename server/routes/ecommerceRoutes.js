const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/fileUploadMiddleware");

// Import controllers
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} = require("../controllers/ecommerceController");

// =====================
// PRODUCT ROUTES
// =====================

// Public routes
router.get("/products", getProducts);
router.get("/products/:id", getProductById);

// Protected routes
router.post("/products", protect, upload.array("images", 5), createProduct);
router.put("/products/:id", protect, upload.array("images", 5), updateProduct);
router.delete("/products/:id", protect, deleteProduct);
router.get("/my-products", protect, getMyProducts);

// =====================
// CART ROUTES
// =====================

router.get("/cart", protect, getCart);
router.post("/cart", protect, addToCart);
router.put("/cart", protect, updateCartItem);
router.delete("/cart/:productId", protect, removeFromCart);
router.delete("/cart", protect, clearCart);

// =====================
// ORDER ROUTES
// =====================

router.post("/orders", protect, createOrder);
router.get("/orders", protect, getOrders);
router.get("/orders/:id", protect, getOrderById);
router.put("/orders/:id/status", protect, updateOrderStatus);

module.exports = router;
