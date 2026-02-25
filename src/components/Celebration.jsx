import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Celebration({ show, xp, onComplete }) {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (show) {
      // Create confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -100 - Math.random() * 500,
        color: ['#FF6B9D', '#C44569', '#F8B500', '#6C5CE7', '#00CEC9'][Math.floor(Math.random() * 5)],
        rotation: Math.random() * 360,
        size: 10 + Math.random() * 20
      }));
      setParticles(newParticles);
      
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* XP Popup */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="bg-gradient-to-r from-kids-orange to-kids-pink text-white px-8 py-4 rounded-3xl shadow-2xl border-4 border-white">
              <motion.p 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: 2, duration: 0.5 }}
                className="text-4xl font-black"
              >
                +{xp} XP! 🎉
              </motion.p>
              <p className="text-center text-white/90 mt-2 font-bold">Amazing Story!</p>
            </div>
          </motion.div>
          
          {/* Confetti */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: p.x, y: p.y, rotate: 0, opacity: 1 }}
              animate={{ 
                y: window.innerHeight + 100,
                rotate: p.rotation + 720,
                opacity: 0
              }}
              transition={{ duration: 3 + Math.random() * 2, ease: "linear" }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '0%'
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
