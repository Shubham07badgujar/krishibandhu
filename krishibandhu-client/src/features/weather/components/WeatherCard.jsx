import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useTranslation } from "react-i18next";

// Lottie animations
import sunnyAnim from "../../../assets/lottie/sunny.json";
import rainAnim from "../../../assets/lottie/rain.json";
import cloudAnim from "../../../assets/lottie/cloud.json";
import thunderAnim from "../../../assets/lottie/thunder.json";

const getWeatherBackground = (weather) => {
  if (!weather || !weather.weather || !weather.weather[0]) {
    return "bg-gradient-to-br from-blue-400 to-blue-300";
  }
  
  const condition = weather.weather[0].main.toLowerCase();
  
  switch (true) {
    case condition.includes("clear"):
      return "bg-gradient-to-br from-yellow-300 via-orange-300 to-blue-400";
    case condition.includes("cloud"):
      return "bg-gradient-to-br from-gray-300 via-blue-300 to-gray-200";
    case condition.includes("rain"):
      return "bg-gradient-to-br from-blue-500 via-blue-400 to-gray-400";
    case condition.includes("thunder"):
      return "bg-gradient-to-br from-gray-700 via-purple-600 to-gray-600";
    case condition.includes("snow"):
      return "bg-gradient-to-br from-blue-100 via-white to-blue-50";
    case condition.includes("mist") || condition.includes("fog"):
      return "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-300";
    default:
      return "bg-gradient-to-br from-blue-400 to-blue-300";
  }
};

const getLottieForCondition = (weather) => {
  if (!weather || !weather.weather || !weather.weather[0]) return cloudAnim;
  
  const condition = weather.weather[0].main.toLowerCase();
  
  if (condition.includes("rain")) return rainAnim;
  if (condition.includes("clear")) return sunnyAnim;
  if (condition.includes("cloud")) return cloudAnim;
  if (condition.includes("thunder") || condition.includes("storm")) return thunderAnim;
  
  return cloudAnim;
};

const WeatherCard = ({ weather, loading, onClick, active }) => {
  const { t } = useTranslation();
  
  if (loading || !weather) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-blue-300 to-blue-200 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center h-48"
      >
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-24 bg-blue-200 rounded mb-4"></div>
          <div className="h-6 w-16 bg-blue-200 rounded"></div>
        </div>
      </motion.div>
    );
  }

  const animationData = getLottieForCondition(weather);
  const backgroundClass = getWeatherBackground(weather);
    return (
    <motion.div
      whileHover={{ scale: active ? 1 : 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className={`${backgroundClass} p-6 rounded-xl shadow-lg flex flex-col items-center justify-center relative overflow-hidden cursor-pointer transform transition-all duration-300 ${active ? 'ring-2 ring-green-500 scale-105' : ''}`}
      style={{ minHeight: "200px" }}
    >
      {/* Animated particles based on weather */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`
          ${weather.weather[0].main.toLowerCase().includes('rain') ? 'animate-rain' : ''}
          ${weather.weather[0].main.toLowerCase().includes('snow') ? 'animate-snow' : ''}
        `}></div>
      </div>
      
      {/* Weather animation icon */}
      <div className="absolute right-0 top-0 w-24 h-24 opacity-80">
        <Lottie animationData={animationData} loop={true} />
      </div>
      
      {/* Weather information */}
      <div className="z-10 text-white text-center">
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-bold mb-1"
        >
          {weather.name}
        </motion.h3>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold mb-2"
        >
          {Math.round(weather.main.temp)}°C
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm opacity-90 backdrop-blur-sm bg-white/10 px-2 py-1 rounded-full inline-block"
        >
          {weather.weather[0].description}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 grid grid-cols-2 gap-2 text-sm"
        >          <div className="text-center backdrop-blur-sm bg-black/10 rounded-lg p-2">
            <div className="opacity-80">{t("weather.humidity")}</div>
            <div className="font-bold">{weather.main.humidity}%</div>
          </div>          <div className="text-center backdrop-blur-sm bg-black/10 rounded-lg p-2">
            <div className="opacity-80">{t("weather.wind")}</div>
            <div className="font-bold">{weather.wind.speed} m/s</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
