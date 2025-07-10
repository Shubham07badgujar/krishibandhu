import WeatherWidget from "../features/weather/WeatherWidget";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const WeatherPage = () => {
  const { t } = useTranslation();
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Add animation when page loads
  useEffect(() => {
    // Small delay to ensure smooth animation
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-[80vh] p-6 bg-gradient-to-b from-green-50 to-blue-50 transition-all duration-1000`}
    >
      <div className="max-w-5xl mx-auto">        <motion.h1 
          variants={itemVariants}
          className="text-3xl font-bold text-green-800 mb-6"
        >
          {t("weather.pageTitle", "Weather Forecast")}
          <motion.span 
            variants={itemVariants}
            className="block text-base font-normal text-green-600 mt-1"
          >
            {t("weather.pageDescription", "Get accurate weather information for your farming needs")}
          </motion.span>
        </motion.h1>
        
        <motion.div 
          variants={itemVariants}
          className="transform transition-all duration-1000"
        >
          <WeatherWidget />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WeatherPage;
