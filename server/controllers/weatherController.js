const fetchWeather = require("../utils/fetchWeather");

const getWeather = async (req, res) => {
    const { lat, lon, city } = req.query;
  
    try {
      let data;
      if (city) {
        data = await fetchWeather(null, null, city);
      } else if (lat && lon) {
        data = await fetchWeather(lat, lon);
      } else {
        return res.status(400).json({ message: "Coordinates or city required" });
      }
  
      res.json(data);
    } catch (err) {
      console.error("Weather fetch failed", err);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  };

module.exports = { getWeather };
