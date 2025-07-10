import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const SearchBar = ({ onSearch, history, onHistoryItemClick }) => {
  const { t } = useTranslation();
  const [city, setCity] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Handle scroll events for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setCity("");
      setShowHistory(false);
    }
  };
  
  const handleFocus = () => {
    if (history.length > 0) {
      setShowHistory(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mb-6 sticky top-0 z-30 transition-all duration-300 
                 ${isSticky ? 'pt-3 pb-3 px-4 -mx-4 bg-white/90 backdrop-blur-md shadow-md rounded-lg' : ''}`}
    >
      <form onSubmit={handleSubmit} className="flex gap-2 mb-2 relative z-10">
        <div className="relative flex-grow">          <input
            type="text"
            placeholder={t("weather.searchPlaceholder")}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={handleFocus}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            className="w-full border border-gray-300 px-4 py-2 pl-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <AnimatePresence>
            {showHistory && history.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                {history.map((historyCity, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      onHistoryItemClick(historyCity);
                      setShowHistory(false);
                    }}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {historyCity}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-200 flex items-center"        >
          <span>{t("search", "Search")}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.button>
      </form>

      {isSticky ? null : (
        <AnimatePresence>
          {history.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-2"
            >
              <h4 className="text-sm text-gray-600 mb-2 font-medium">{t("weather.recentSearches")}:</h4>
              <div className="flex flex-wrap gap-2">
                {history.map((historyCity, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05, backgroundColor: "#e0f2fe" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onHistoryItemClick(historyCity)}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-green-50 hover:border-green-400 transition-all duration-200 shadow-sm"
                  >
                    {historyCity}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default SearchBar;
