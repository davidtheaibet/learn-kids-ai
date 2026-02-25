import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Gamification({ streak, xp, level, badges }) {
  const levels = ['Story Novice', 'Story Explorer', 'Story Wizard', 'Story Master'];
  const progress = (xp % 100);
  
  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 right-4 left-4 md:left-auto md:w-80 z-50"
    >
      <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-4 border-4 border-kids-purple">
        {/* Header Stats */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-2xl"
            >
              🔥
            </motion.span>
            <span className="font-bold text-orange-500">{streak}</span>
            <span className="text-sm text-gray-600">day streak</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="font-bold text-purple-600">{xp} XP</span>
          </div>
        </div>
        
        {/* Level Badge */}
        <div className="text-center mb-2">
          <motion.div
            key={level}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block bg-gradient-to-r from-kids-pink to-kids-purple text-white px-4 py-1 rounded-full font-bold text-sm"
          >
            {levels[level] || levels[0]}
          </motion.div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute h-full bg-gradient-to-r from-kids-green to-kids-blue rounded-full"
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
            {progress}/100 XP
          </span>
        </div>
        
        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex gap-2 mt-3 justify-center">
            {badges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-2xl"
                title={badge.name}
              >
                {badge.icon}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
