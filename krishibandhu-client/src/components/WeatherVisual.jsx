import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";

// Import your Lottie weather animations
import sunnyAnim from "../assets/lottie/sunny.json";
import rainAnim from "../assets/lottie/rain.json";
import cloudAnim from "../assets/lottie/cloud.json";
import thunderAnim from "../assets/lottie/thunder.json";

const WeatherVisual = ({ condition }) => {
  const [animationData, setAnimationData] = useState(null);
  const [additionalEffects, setAdditionalEffects] = useState([]);
  
  useEffect(() => {
    if (!condition) return;
    
    const lowerCondition = condition.toLowerCase();
    
    // Set primary animation
    if (lowerCondition.includes("rain")) {
      setAnimationData(rainAnim);
      createRaindrops();
    } else if (lowerCondition.includes("clear") || lowerCondition.includes("sun")) {
      setAnimationData(sunnyAnim);
      createSunrays();
    } else if (lowerCondition.includes("cloud")) {
      setAnimationData(cloudAnim);
      createClouds();
    } else if (lowerCondition.includes("thunder") || lowerCondition.includes("storm")) {
      setAnimationData(thunderAnim);
      createLightning();
    } else {
      setAnimationData(cloudAnim);
      createClouds();
    }
  }, [condition]);

  // Create randomized cloud particles
  const createClouds = () => {
    const clouds = Array.from({ length: 10 }, (_, i) => ({
      id: `cloud-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 50 + Math.random() * 100,
      opacity: 0.4 + Math.random() * 0.3,
      animationDuration: 15 + Math.random() * 15
    }));
    setAdditionalEffects(clouds);
  };

  // Create randomized sunrays
  const createSunrays = () => {
    const rays = Array.from({ length: 5 }, (_, i) => ({
      id: `ray-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 70}%`,
      size: 100 + Math.random() * 200,
      opacity: 0.2 + Math.random() * 0.4,
      animationDuration: 20 + Math.random() * 10
    }));
    setAdditionalEffects(rays);
  };

  // Create randomized raindrops
  const createRaindrops = () => {
    const drops = Array.from({ length: 50 }, (_, i) => ({
      id: `drop-${i}`,
      left: `${Math.random() * 100}%`,
      top: `-${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      opacity: 0.5 + Math.random() * 0.5,
      animationDuration: 0.5 + Math.random() * 1.5
    }));
    setAdditionalEffects(drops);
  };

  // Create lightning flashes
  const createLightning = () => {
    const flashes = Array.from({ length: 3 }, (_, i) => ({
      id: `flash-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 50}%`,
      size: 100 + Math.random() * 100,
      opacity: 0.7,
      animationDuration: 4 + Math.random() * 6
    }));
    setAdditionalEffects(flashes);
  };

  const commonProps = {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 0,
      pointerEvents: "none"
    },
    loop: true,
    autoplay: true
  };

  if (!condition) return null;
  if (!animationData) return null;
  
  const renderEffects = () => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes("rain")) {
      return (
        <div className="absolute inset-0 overflow-hidden">
          {additionalEffects.map((drop) => (
            <motion.div
              key={drop.id}
              className="absolute bg-blue-200 rounded-full"
              style={{
                left: drop.left,
                top: drop.top,
                width: `${drop.size}px`,
                height: `${drop.size * 3}px`,
                opacity: drop.opacity
              }}
              animate={{
                top: "110%",
                opacity: [drop.opacity, drop.opacity, 0]
              }}
              transition={{
                duration: drop.animationDuration,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      );
    }
    
    if (lowerCondition.includes("clear") || lowerCondition.includes("sun")) {
      return (
        <div className="absolute inset-0 overflow-hidden">
          {additionalEffects.map((ray) => (
            <motion.div
              key={ray.id}
              className="absolute rounded-full"
              style={{
                left: ray.left,
                top: ray.top,
                width: `${ray.size}px`,
                height: `${ray.size}px`,
                opacity: ray.opacity,
                background: "radial-gradient(circle, rgba(255, 255, 190, 0.8) 0%, rgba(255, 255, 255, 0) 70%)"
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [ray.opacity, ray.opacity * 1.3, ray.opacity]
              }}
              transition={{
                duration: ray.animationDuration,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      );
    }
    
    if (lowerCondition.includes("thunder") || lowerCondition.includes("storm")) {
      return (
        <div className="absolute inset-0 overflow-hidden">
          {additionalEffects.map((flash) => (
            <motion.div
              key={flash.id}
              className="absolute"
              style={{
                left: flash.left,
                top: flash.top,
                width: `${flash.size}px`,
                height: `${flash.size}px`,
                background: "radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 70%)"
              }}
              animate={{
                opacity: [0, flash.opacity, 0.1, flash.opacity * 0.5, 0]
              }}
              transition={{
                duration: flash.animationDuration,
                repeat: Infinity,
                repeatDelay: Math.random() * 5,
                times: [0, 0.1, 0.2, 0.3, 1]
              }}
            />
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="relative w-full h-full">
      {renderEffects()}
      <Lottie animationData={animationData} {...commonProps} />
    </div>
  );
};

export default WeatherVisual;
