const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addBookmarkCity,
  getBookmarkedCities
} = require("../controllers/userController");

router.post("/bookmark-city", protect, addBookmarkCity);
router.get("/bookmark-cities", protect, getBookmarkedCities);

module.exports = router;
