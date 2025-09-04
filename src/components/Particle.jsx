import React from 'react';
import { motion } from 'framer-motion';

const Particle = ({ particle }) => {
  const opacity = particle.life / particle.maxLife;
  const scale = particle.life / particle.maxLife;

  return (
    <motion.div
      className="particle"
      style={{
        left: particle.x,
        top: particle.y,
        opacity: opacity,
        transform: `scale(${scale})`,
      }}
      animate={{
        opacity: [1, 0],
        scale: [1, 0],
      }}
      transition={{
        duration: particle.maxLife / 60, // Assuming 60fps
        ease: "easeOut"
      }}
    />
  );
};

export default Particle;
