import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const WeatherNews = ({ news }) => {
  const { t } = useTranslation();
  if (!news || news.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}      className="mt-8"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">{t("weather.weatherNews")}</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {news.slice(0, 3).map((item, index) => (
          <motion.a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            {item.urlToImage && (
              <div className="h-40 overflow-hidden">
                <img 
                  src={item.urlToImage} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
            <div className="p-4">
              <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
              <p className="text-xs text-gray-500 mt-2">{new Date(item.publishedAt).toLocaleDateString()}</p>
            </div>
          </motion.a>
        ))}
      </div>
      {news.length > 3 && (
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="mt-4 text-center"
        >
          <a 
            href="#" 
            className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
          >
            View more news
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WeatherNews;
