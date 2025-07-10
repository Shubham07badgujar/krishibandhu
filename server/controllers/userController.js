const User = require("../models/User");

const addBookmarkCity = async (req, res) => {
  const { city } = req.body;
  if (!city) return res.status(400).json({ message: "City required" });

  const user = await User.findById(req.user.id);
  if (!user.bookmarkedCities.includes(city)) {
    user.bookmarkedCities.push(city);
    await user.save();
  }

  res.json(user.bookmarkedCities);
};

const getBookmarkedCities = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.bookmarkedCities || []);
};

module.exports = { addBookmarkCity, getBookmarkedCities };
