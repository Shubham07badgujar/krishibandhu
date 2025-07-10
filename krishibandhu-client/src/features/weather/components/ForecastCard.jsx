import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useTranslation } from "react-i18next";

// Lottie animations
import sunnyAnim from "../../../assets/lottie/sunny.json";
import rainAnim from "../../../assets/lottie/rain.json";
import cloudAnim from "../../../assets/lottie/cloud.json";
import thunderAnim from "../../../assets/lottie/thunder.json";

const getLottieForCondition = (condition = "") => {
  const d = condition.toLowerCase();
  if (d.includes("rain")) return rainAnim;
  if (d.includes("clear") || d.includes("sun")) return sunnyAnim;
  if (d.includes("cloud")) return cloudAnim;
  if (d.includes("thunder") || d.includes("storm")) return thunderAnim;
  return cloudAnim;
};

const getWeatherBackground = (condition = "") => {
  const d = condition.toLowerCase();
  
  switch (true) {
    case d.includes("clear"):
      return "from-yellow-300 to-blue-300";
    case d.includes("cloud"):
      return "from-blue-300 to-gray-300";
    case d.includes("rain"):
      return "from-blue-500 to-blue-300";
    case d.includes("thunder"):
      return "from-gray-600 to-purple-500";
    default:
      return "from-blue-400 to-blue-300";
  }
};

const ForecastCard = ({ forecast, index }) => {
  const { t } = useTranslation();
  
  // Safety checks for missing or malformed data
  if (!forecast || !forecast.dt || !forecast.weather || !forecast.weather[0]) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="bg-gradient-to-br from-gray-300 to-gray-200 p-3 rounded-lg shadow-md flex flex-col items-center justify-center text-white h-32"
      >
        <p className="text-gray-500">Data unavailable</p>
      </motion.div>
    );
  }
  
  // Handle different date formats
  const day = new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
  
  // Get weather condition - ensure we handle different data structures
  const condition = forecast.weather[0].main;
  const animationData = getLottieForCondition(condition);
  const gradientClass = getWeatherBackground(condition);
  
  // Extract temperature based on available data structure
  const getTemperature = () => {
    // Check different possible temperature structures
    if (forecast.temp && typeof forecast.temp.day === 'number') {
      return Math.round(forecast.temp.day);
    } else if (forecast.temp && typeof forecast.temp === 'number') {
      return Math.round(forecast.temp);
    } else if (forecast.main && forecast.main.temp) {
      return Math.round(forecast.main.temp);
    } else {
      return null;
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`bg-gradient-to-br ${gradientClass} p-3 rounded-lg shadow-md flex flex-col items-center text-white overflow-hidden relative weather-card-hover`}
    >
      {/* Weather condition specific animation */}
      <div className="absolute inset-0 opacity-50">
        {condition.toLowerCase().includes('rain') && <div className="animate-rain"></div>}
        {condition.toLowerCase().includes('snow') && <div className="animate-snow"></div>}
        {condition.toLowerCase().includes('clear') && <div className="sunshine-effect"></div>}
        {condition.toLowerCase().includes('cloud') && <div className="animate-clouds"></div>}
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 * index }}
        className="text-sm font-medium mb-1 z-10"
      >
        {day}
      </motion.p>
      
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 * index, type: "spring", stiffness: 260, damping: 20 }}
        className="w-12 h-12 my-1 z-10"
      >
        <Lottie animationData={animationData} loop={true} />
      </motion.div>      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 * index }}
        className="text-lg font-bold z-10"
      >
        {getTemperature() !== null ? `${getTemperature()}°C` : "N/A"}
      </motion.p>
        <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 * index }}
        className="z-10"
      >        <p className="text-xs opacity-80 bg-black/10 px-2 py-1 rounded-full backdrop-blur-sm">
          {forecast.weather && forecast.weather[0] && forecast.weather[0].description 
            ? forecast.weather[0].description 
            : t("weather.unavailable", "Weather info unavailable")}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ForecastCard;
