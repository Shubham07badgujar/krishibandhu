import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const FeatureShowcase = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  // Set visibility when component mounts for animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Feature data array with icons, titles, and descriptions
  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t("schemes.features.eligibility"),
      description: t("schemes.features.eligibilityDesc", "Check your eligibility for various agricultural schemes based on your location and farm details")
    },
    {
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: t("schemes.features.updates"),
      description: t("schemes.features.updatesDesc", "Stay updated with the latest agricultural schemes and policy changes")
    },
    {
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: t("schemes.features.application"),
      description: t("schemes.features.applicationDesc", "Simple guides on how to apply for agricultural schemes with required document lists")
    },
    {
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: t("schemes.features.tracking"),
      description: t("schemes.features.trackingDesc", "Track the status of your scheme applications through our platform")
    }
  ];
  return (
    <motion.div 
      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6 my-8 overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-br from-green-200/20 to-transparent rounded-full -mr-10 -mt-10 z-0"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-200/20 to-transparent rounded-full -ml-10 -mb-10 z-0"></div>
      
      <motion.h2 
        className="text-2xl font-bold text-green-800 mb-6 text-center relative z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t("schemes.featuresTitle", "Key Features of Our Agricultural Schemes Portal")}
      </motion.h2>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
            }}
            className="bg-white/90 backdrop-blur-sm p-5 rounded-xl shadow hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-green-100"
          >
            <motion.div 
              className="bg-gradient-to-br from-green-100 to-green-50 rounded-full p-3 mb-4"
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              {feature.icon}
            </motion.div>
            <h3 className="font-semibold text-lg text-green-700 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="mt-8 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button 
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium py-2 px-6 rounded-md shadow-md hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{t("schemes.learnMore", "Learn More About Schemes")}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default FeatureShowcase;
