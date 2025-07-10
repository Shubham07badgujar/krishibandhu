import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import WeatherVisual from "../../components/WeatherVisual";
import Lottie from "lottie-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import './weather.css';

// Lottie icons per condition
import sunnyAnim from "../../assets/lottie/sunny.json";
import rainAnim from "../../assets/lottie/rain.json";
import cloudAnim from "../../assets/lottie/cloud.json";
import thunderAnim from "../../assets/lottie/thunder.json";

// Helper function to determine which animation to use based on weather condition
const getLottieForCondition = (desc = "") => {
  const d = desc.toLowerCase();
  if (d.includes("rain")) return rainAnim;
  if (d.includes("clear") || d.includes("sun")) return sunnyAnim;
  if (d.includes("cloud")) return cloudAnim;
  if (d.includes("thunder") || d.includes("storm")) return thunderAnim;
  return cloudAnim;
};

// Import our new components
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import WeatherNews from "./components/WeatherNews";

// Remove the duplicate getLottieForCondition function since it's defined in the component files

const WeatherWidget = () => {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingAnimComplete, setLoadingAnimComplete] = useState(false);

  const [queryCity, setQueryCity] = useState("");
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("weatherCities");
    return saved ? JSON.parse(saved) : [];
  });

  // Track which weather card is selected for mobile view
  const [selectedCity, setSelectedCity] = useState(null);

  const { user } = useAuth();
  const [params] = useSearchParams();

  useEffect(() => {
    const savedCity = params.get("city");
    if (savedCity) {
      setQueryCity(savedCity);
    }

    // Set loading animation complete after 2 seconds for better UX
    const timer = setTimeout(() => {
      setLoadingAnimComplete(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (queryCity) {
      fetchWeatherByCity(queryCity);
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeatherByCity("Delhi")
      );
    }
  }, [queryCity]);

  useEffect(() => {
    if (queryCity) {
      fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/news/weather?city=${queryCity}`
      )
        .then((res) => res.json())
        .then((data) => setNews(data));
    }
  }, [queryCity]);

  const fetchWeather = async (lat, lon) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/weather?lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      setWeather(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load weather data");
      setLoading(false);
    }
  };
  const fetchWeatherByCity = async (cityName) => {
    try {
      setLoading(true);

      // Small delay for nicer animation
      await new Promise((resolve) => setTimeout(resolve, 300));

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/weather?city=${cityName}`
      );

      if (!res.ok) {
        throw new Error("City not found");
      }

      const data = await res.json();
      setWeather(data);
      setSelectedCity(data);
      setLoading(false);
      updateHistory(cityName);
      fetchForecast(cityName);
    } catch (err) {
      setError(`Failed to load weather: ${err.message}`);
      setLoading(false);
    }
  };

  const fetchForecast = async (cityName) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/weather/forecast?city=${cityName}`
      );
      const data = await res.json();
      setForecast(data);
    } catch (err) {
      console.error("Forecast fetch failed", err);
      setForecast([]);
    }
  };

  const updateHistory = (cityName) => {
    const updated = [
      cityName,
      ...history.filter((c) => c.toLowerCase() !== cityName.toLowerCase()),
    ].slice(0, 5);
    setHistory(updated);
    localStorage.setItem("weatherCities", JSON.stringify(updated));
  };

  const handleCityClick = (city) => {
    setQueryCity(city);
    setLoading(true);
  };
  // Exit-Animation
  const [isExiting, setIsExiting] = useState(false);
  const handleCityChange = (city) => {
    setIsExiting(true);
    setTimeout(() => {
      handleCityClick(city);
      setIsExiting(false);
    }, 400);
  };

  // Stagger animation for content
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };
  if (loading || !loadingAnimComplete) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center bg-white bg-opacity-70 p-8 rounded-xl shadow-lg backdrop-blur-sm"
        >
          <Lottie
            animationData={cloudAnim}
            loop={true}
            style={{ width: 150, height: 150, margin: "0 auto" }}
          />          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 mt-3 font-medium"
          >
            {t("loading")} {t("weather.title").toLowerCase()}...
          </motion.p>
        </motion.div>
      </div>
    );
  }
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-lg max-w-lg mx-auto my-8"
      >
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-bold text-lg">Error</p>
        </div>
        <p className="mb-4">{error}</p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setError(null);
            setQueryCity("Delhi");
          }}
          className="mt-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2 rounded-md shadow-md transition-all duration-300 flex items-center"
        >          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t("weather.tryAgain", "Try Again")}
        </motion.button>
      </motion.div>
    );
  }
  // Get weather condition for background effects
  const getWeatherCondition = () => {
    if (!weather || !weather.weather || !weather.weather[0]) return "";
    return weather.weather[0].description.toLowerCase();
  };

  // Set background class based on weather
  const getBgClass = () => {
    const condition = getWeatherCondition();

    if (condition.includes("rain"))
      return "bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400";
    if (condition.includes("clear") || condition.includes("sun"))
      return "bg-gradient-to-br from-blue-400 via-yellow-200 to-blue-300";
    if (condition.includes("cloud"))
      return "bg-gradient-to-br from-blue-300 via-gray-300 to-blue-200";
    if (condition.includes("thunder") || condition.includes("storm"))
      return "bg-gradient-to-br from-gray-800 via-purple-900 to-gray-700";
    if (condition.includes("snow"))
      return "bg-gradient-to-br from-blue-100 via-white to-gray-100";
    if (condition.includes("mist") || condition.includes("fog"))
      return "bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200";

    // Default
    return "bg-gradient-to-br from-green-100 to-blue-200";
  };

  return (
    <motion.div
      initial="hidden"
      animate={isExiting ? "exit" : "visible"}
      variants={containerVariants}
      className={`min-h-screen transition-colors duration-1000 ${getBgClass()}`}
    >
      <div className="relative">
        {/* Animated Weather visual in background */}
        {weather && (
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
            <WeatherVisual condition={getWeatherCondition()} />
          </div>
        )}        <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
          {/* Search bar section */}
          <motion.div variants={itemVariants} className="sticky top-0 z-30">
            <SearchBar
              onSearch={setQueryCity}
              history={history}
              onHistoryItemClick={handleCityChange}
            />
          </motion.div>

          {/* Current weather card */}
          <motion.div variants={itemVariants} className="mb-8">            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-white drop-shadow-md">
              {t("weather.title")}
            </h2>
            <WeatherCard weather={weather} loading={loading} active={true} />
          </motion.div>

          {/* Additional weather details section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6 mb-8"
          >            <h3 className="text-xl font-bold mb-4 text-gray-700">
              {t("weather.details", "Weather Details")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-gray-500 text-sm">{t("weather.feelsLike", "Feels Like")}</div>
                <div className="text-2xl font-semibold">
                  {Math.round(weather.main.feels_like)}°C
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 text-sm">{t("weather.humidity")}</div>
                <div className="text-2xl font-semibold">
                  {weather.main.humidity}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 text-sm">Min/Max</div>
                <div className="text-2xl font-semibold">
                  {Math.round(weather.main.temp_min)}°/
                  {Math.round(weather.main.temp_max)}°
                </div>
              </div>
              <div className="text-center">                <div className="text-gray-500 text-sm">{t("weather.wind")}</div>
                <div className="text-2xl font-semibold">
                  {weather.wind.speed} m/s
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center text-sm text-gray-600 border-t border-gray-200 pt-4">
              <div>
                <span className="mr-2">☀️</span>
                {t("weather.sunrise", "Sunrise")}: {" "}
                {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div>
                <span className="mr-2">🌙</span>
                {t("weather.sunset", "Sunset")}: {" "}
                {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </motion.div>          {/* Forecast section */}
          {Array.isArray(forecast) && forecast.length > 0 && (
            <motion.div variants={itemVariants} className="mb-8">          <h3 className="text-2xl font-bold text-white drop-shadow-md mb-4">
                {t("weather.forecast")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {forecast.map((day, idx) => (
                  <ForecastCard key={idx} forecast={day} index={idx} />
                ))}
              </div>
            </motion.div>
          )}

          {/* User bookmark option */}
          {user && queryCity && (
            <motion.div variants={itemVariants} className="mb-8 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/user/bookmark-city`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                      },
                      body: JSON.stringify({ city: queryCity }),
                    }
                  );
                  alert(`${queryCity} saved to your dashboard!`);
                }}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="text-xl">🔖</span>
                <span>Save {queryCity} for Quick Access</span>
              </motion.button>
            </motion.div>
          )}

          {/* Weather news section */}
          <motion.div variants={itemVariants}>
            <WeatherNews news={news} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
