const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/weather", async (req, res) => {
  const city = req.query.city || "India";
  const apiKey = process.env.NEWS_API_KEY;

  try {
    const url = `https://newsapi.org/v2/everything?q=${city}+weather&sortBy=publishedAt&apiKey=${apiKey}&language=en`;
    const { data } = await axios.get(url);
    res.json(data.articles.slice(0, 5)); // return top 5
  } catch (err) {
    console.error("News API error", err);
    res.status(500).json({ message: "Failed to fetch weather news" });
  }
});

module.exports = router;
