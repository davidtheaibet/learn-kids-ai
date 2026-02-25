import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceEngine } from './VoiceEngine';

export default function AudioPlayer({ story, isPlaying, setIsPlaying }) {
  const [progress, setProgress] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const voiceEngineRef = useRef(null);
  const words = story?.split(/\s+/) || [];
  
  useEffect(() => {
    voiceEngineRef.current = new VoiceEngine();
  }, []);
  
  useEffect(() => {
    if (isPlaying && story) {
      voiceEngineRef.current?.speak(story, () => {
        setIsPlaying(false);
        setProgress(100);
      });
    } else {
      voiceEngineRef.current?.stop();
    }
    
    return () => voiceEngineRef.current?.stop();
  }, [isPlaying, story, setIsPlaying]);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  if (!story) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 shadow-lg border-2 border-kids-purple mt-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl
              ${isPlaying ? 'bg-kids-red text-white' : 'bg-kids-green text-white'}`}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </motion.button>
          <div>
            <p className="font-bold text-kids-purple">
              {isPlaying ? 'Reading...' : 'Read to Me'}
            </p>
            <p className="text-xs text-gray-500">
              Hunter the Voice
            </p>
          </div>
        </div>
        
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-1"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [10, 25, 10] }}
                  transition={{ repeat: Infinity, delay: i * 0.15, duration: 0.5 }}
                  className="w-1.5 bg-kids-purple rounded-full"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${progress}%` }}
          className="h-full bg-kids-purple rounded-full"
        />
      </div>
      
      <p className="text-xs text-gray-500 mt-2 text-center">
        🔊 Make sure your volume is up!
      </p>
    </motion.div>
  );
}
