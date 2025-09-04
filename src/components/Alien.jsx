import React from 'react';
import { motion } from 'framer-motion';

const Alien = ({ alien }) => {
  if (!alien.alive) return null;

  return (
    <motion.div
      className="alien"
      style={{
        left: alien.x,
        top: alien.y,
        width: alien.width,
        height: alien.height,
      }}
      animate={{
        y: [0, -2, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.2 }
      }}
    >
      <img 
        src="/alien no eyes.png" 
        alt="Alien" 
        style={{ width: '100%', height: '100%' }}
        onError={(e) => {
          // Fallback if image doesn't load
          e.target.style.display = 'none';
          e.target.parentElement.style.background = 'linear-gradient(45deg, #ff00ff, #ff6600)';
          e.target.parentElement.style.borderRadius = '50%';
        }}
      />
    </motion.div>
  );
};

export default Alien;
