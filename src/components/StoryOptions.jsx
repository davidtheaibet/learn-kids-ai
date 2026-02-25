import { motion } from 'framer-motion';
import { useState } from 'react';

const themes = [
  { id: 'adventure', name: 'Adventure', icon: '🗺️', color: 'from-orange-400 to-red-500' },
  { id: 'animals', name: 'Animals', icon: '🦁', color: 'from-green-400 to-teal-500' },
  { id: 'space', name: 'Space', icon: '🚀', color: 'from-purple-400 to-indigo-500' },
  { id: 'princess', name: 'Princess', icon: '👑', color: 'from-pink-400 to-rose-500' },
  { id: 'pirates', name: 'Pirates', icon: '⚓', color: 'from-blue-400 to-cyan-500' },
  { id: 'dinosaurs', name: 'Dinosaurs', icon: '🦕', color: 'from-green-500 to-emerald-600' }
];

const characters = [
  { id: 'dragon', name: 'Dragon', icon: '🐉' },
  { id: 'unicorn', name: 'Unicorn', icon: '🦄' },
  { id: 'robot', name: 'Robot', icon: '🤖' },
  { id: 'pirate', name: 'Pirate', icon: '🏴‍☠️' },
  { id: 'princess', name: 'Princess', icon: '👸' },
  { id: 'astronaut', name: 'Astronaut', icon: '👨‍🚀' }
];

export default function StoryOptions({ selectedTheme, setSelectedTheme, selectedCharacter, setSelectedCharacter }) {
  return (
    <div className="space-y-6 mb-8">
      {/* Themes */}
      <div>
        <h3 className="text-white font-bold text-lg mb-3 text-center drop-shadow-md">
          Pick a Theme! 🎨
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((theme) => (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTheme(theme.id)}
              className={`p-3 rounded-2xl bg-gradient-to-br ${theme.color} 
                ${selectedTheme === theme.id ? 'ring-4 ring-white scale-105' : 'opacity-80'}
                transition-all shadow-lg`}
            >
              <span className="text-3xl">{theme.icon}</span>
              <p className="text-white text-xs font-bold mt-1">{theme.name}</p>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Characters */}
      <div>
        <h3 className="text-white font-bold text-lg mb-3 text-center drop-shadow-md">
          Choose Your Hero! ⭐
        </h3>
        <div className="flex justify-center gap-3 flex-wrap">
          {characters.map((char) => (
            <motion.button
              key={char.id}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedCharacter(char.id)}
              className={`w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-3xl
                ${selectedCharacter === char.id ? 'ring-4 ring-kids-purple scale-110' : ''}
                transition-all`}
            >
              {char.icon}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
