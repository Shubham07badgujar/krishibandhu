const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Load controller functions directly
const schemeController = require("../controllers/schemeController");

// Debug checking if controller methods are available
console.log("Controller methods available:", Object.keys(schemeController));
console.log("createScheme type:", typeof schemeController.createScheme);
console.log("saveScheme type:", typeof schemeController.saveScheme);

// Create test handler for debugging
const testHandler = (req, res) => {
  res.json({ message: "Test handler working" });
};

// Public route to get schemes - first, try our test handler
router.get("/test", testHandler);

// Now try the actual getSchemes from controller
router.get("/", schemeController.getSchemes);

// Try only one admin route first
router.post("/", protect, isAdmin, schemeController.createScheme);

// Only register the save route if we get this far
router.post("/save/:id", protect, schemeController.saveScheme);

module.exports = router;
