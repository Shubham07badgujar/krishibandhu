const express = require("express");
const router = express.Router();
const { getWeather } = require("../controllers/weatherController");

// router.get("/", getWeather); // /api/weather?lat=28.61&lon=77.20

const axios = require("axios");

router.get("/", async (req, res) => {
  const { lat, lon, city } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    let url = "";

    if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
      return res.status(400).json({ message: "Coordinates or city required" });
    }

    const { data } = await axios.get(url);
    res.json(data);
  } catch (error) {
    console.error("Weather fetch failed:", error.message);
    res.status(500).json({ message: "Failed to fetch weather" });
  }
});

router.get("/forecast", async (req, res) => {
  const { city } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!city) return res.status(400).json({ message: "City required" });

  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    const filtered = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);
    res.json(filtered);
  } catch (err) {
    console.error("Forecast fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch forecast" });
  }
});

module.exports = router;
