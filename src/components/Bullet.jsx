import React from 'react';
import { motion } from 'framer-motion';

const Bullet = ({ bullet, type }) => {
  return (
    <motion.div
      className={`bullet ${type}`}
      style={{
        left: bullet.x,
        top: bullet.y,
        width: bullet.width,
        height: bullet.height,
      }}
      animate={{
        boxShadow: [
          '0 0 8px currentColor',
          '0 0 15px currentColor',
          '0 0 8px currentColor'
        ],
      }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

export default Bullet;
