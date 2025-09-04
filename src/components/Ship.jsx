import React from 'react';
import { motion } from 'framer-motion';

const Ship = ({ ship }) => {
  return (
    <motion.div
      className="ship"
      style={{
        left: ship.x,
        top: ship.y,
        width: ship.width,
        height: ship.height,
      }}
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

export default Ship;
