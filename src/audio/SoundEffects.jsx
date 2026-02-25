import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SOUNDS = {
  magic: { emoji: '✨', color: 'from-yellow-300 to-orange-400' },
  celebration: { emoji: '🎉', color: 'from-pink-400 to-red-400' },
  success: { emoji: '🌟', color: 'from-green-400 to-teal-400' },
  chime: { emoji: '🎵', color: 'from-blue-400 to-purple-400' }
};

export function SoundEffect({ type, onComplete }) {
  const [visible, setVisible] = useState(true);
  const sound = SOUNDS[type] || SOUNDS.magic;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  if (!visible) return null;
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [1, 1.5, 0], opacity: [1, 1, 0] }}
      transition={{ duration: 1.5 }}
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        bg-gradient-to-br ${sound.color} rounded-full p-8 z-50 pointer-events-none`}
    >
      <span className="text-6xl">{sound.emoji}</span>
    </motion.div>
  );
}

export function AudioToggle({ enabled, onToggle }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold
        ${enabled ? 'bg-kids-green text-white' : 'bg-gray-300 text-gray-600'}`}
    >
      <span>{enabled ? '🔊' : '🔇'}</span>
      <span>{enabled ? 'Sound On' : 'Sound Off'}</span>
    </motion.button>
  );
}
