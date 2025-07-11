const express = require("express");
const router = express.Router();
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getCategories,
  upload
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { authenticateToken } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);

// Protected routes
router.post("/", protect, upload.array('images', 5), addProduct);
router.get("/my/products", protect, getMyProducts);
router.put("/:id", protect, upload.array('images', 5), updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
