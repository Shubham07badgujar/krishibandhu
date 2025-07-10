const express = require("express");
const router = express.Router();
const path = require('path');
const { protect } = require("../middleware/authMiddleware");

// Use the original controller which we've fixed
const { 
  analyzeCropImage, 
  getUserCropHealthRecords, 
  getCropHealthRecord,
  testVisionAPI
} = require("../controllers/cropHealthController");

// File upload middleware
const fileUpload = require('express-fileupload');
router.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  abortOnLimit: true,
  useTempFiles: false,
  tempFileDir: path.join(__dirname, '../temp'),
  createParentPath: true,
  parseNested: true
}));

// Route: POST /api/crop-health/analyze
// Description: Analyze a crop image and return health assessment
// Access: Private (requires login)
router.post("/analyze", protect, analyzeCropImage);

// Route: GET /api/crop-health
// Description: Get all crop health records for a user
// Access: Private
router.get("/", protect, getUserCropHealthRecords);

// Route: GET /api/crop-health/:id
// Description: Get a specific crop health record
// Access: Private
router.get("/:id", protect, getCropHealthRecord);

// Debug routes for testing Gemini Vision API
// IMPORTANT: Remove in production
router.post("/test-vision", testVisionAPI);
router.get("/test-vision", testVisionAPI);

module.exports = router;