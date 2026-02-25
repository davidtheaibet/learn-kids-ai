import { motion } from 'framer-motion';
import { getThemeGradient } from './ImageGenerator';

export default function StoryCanvas({ story, theme, character }) {
  const gradient = getThemeGradient(theme);
  
  const characters = {
    dragon: '🐉', unicorn: '🦄', robot: '🤖',
    pirate: '🏴‍☠️', princess: '👸', astronaut: '👨‍🚀'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-8 shadow-2xl`}
    >
      {/* Decorative elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute -top-10 -right-10 text-9xl opacity-20"
      >
        ✨
      </motion.div>
      
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute -bottom-5 -left-5 text-8xl opacity-20"
      >
        {characters[character] || '⭐'}
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10 text-white">
        <div className="text-center mb-6">
          <span className="text-6xl">{characters[character]}</span>
        </div>
        <p className="text-lg leading-relaxed whitespace-pre-line font-medium drop-shadow-md">
          {story}
        </p>
      </div>
    </motion.div>
  );
}
