import React from 'react';
import { motion } from 'motion/react';

export function BackgroundAnimations({ isDarkMode }) {
  return (
    <>
      {/* Animated Background */}
      <motion.div 
        className="fixed inset-0 -z-10 transition-all duration-[8s] ease-in-out"
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7209b7 100%)'
            : 'linear-gradient(135deg, #ffeef8 0%, #ffe4f2 25%, #ffd6eb 50%, #ffc4e1 75%, #ff99cc 100%)',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${
            isDarkMode ? 'bg-purple-400/30' : 'bg-pink-300/40'
          } pointer-events-none`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Additional magical sparkles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className={`absolute text-2xl pointer-events-none ${
            isDarkMode ? 'text-purple-300/60' : 'text-pink-400/60'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.5, 1.2, 0.5],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut"
          }}
        >
          {i % 2 === 0 ? '✨' : '🌟'}
        </motion.div>
      ))}
    </>
  );
}