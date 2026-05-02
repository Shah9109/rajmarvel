import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const backgroundImages = [
    "/assets/30cc4124-827e-42a9-81b6-89d8e1178105.JPG",
    "/assets/35a13823-406e-4c9c-a571-3fd8a54bb333.JPG",
    "/assets/ChatGPT Image May 1, 2026, 03_24_34 PM.png"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-[#fdf2f4] min-h-[90vh] overflow-hidden flex items-center">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={backgroundImages[currentImageIndex]}
            alt="Exterior Design"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-[#fdf2f4]/95 via-[#fdf2f4]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#fdf2f4] via-transparent to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl mt-12 md:mt-0"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-4 mb-6"
          >
            <span className="w-12 h-[2px] bg-primary"></span>
            <span className="text-primary tracking-[0.2em] text-sm md:text-base font-semibold uppercase">Premium Quality</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight text-secondary">
            CRAFTING <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#fbcfe8] to-primary">ROYAL</span> <br />
            EXTERIORS
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-700 font-light mb-10 max-w-xl leading-relaxed"
          >
            Transform your home into a masterpiece with our intricate Rajasthani carvings, jharokhas, and custom Haveli-style stonework.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/projects" className="bg-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-primary transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] transform hover:-translate-y-1">
              Explore Designs
            </Link>
            <Link to="/contact" className="px-8 py-4 rounded-full font-bold uppercase tracking-wider border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300 backdrop-blur-sm transform hover:-translate-y-1">
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
