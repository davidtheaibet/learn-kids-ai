import { motion } from 'framer-motion';

export default function AnimatedBackground({ theme }) {
  const themeElements = {
    adventure: ['🏔️', '🌲', '🦅', '⛰️'],
    animals: ['🦁', '🐘', '🦒', '🌿'],
    space: ['🚀', '🌙', '⭐', '🪐'],
    princess: ['🏰', '🌸', '💎', '👑'],
    pirates: ['⚓', '🏝️', '🦜', '⛵'],
    dinosaurs: ['🦕', '🌴', '🥚', '🦖']
  };
  
  const elements = themeElements[theme] || ['⭐', '🌈', '✨', '🎈'];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((emoji, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100
          }}
          animate={{ 
            y: -100,
            x: Math.random() * window.innerWidth
          }}
          transition={{ 
            repeat: Infinity,
            duration: 10 + Math.random() * 10,
            delay: i * 2,
            ease: "linear"
          }}
          className="absolute text-4xl opacity-20"
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}
