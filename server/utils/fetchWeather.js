const axios = require("axios");

const fetchWeather = async (lat, lon, city = "") => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  let url = "";

  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  }

  const { data } = await axios.get(url);
  return data;
};

module.exports = fetchWeather;
