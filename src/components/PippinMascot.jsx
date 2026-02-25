import { motion } from 'framer-motion';

export default function PippinMascot({ mood = 'happy', isListening, isGenerating }) {
  const moods = {
    happy: { emoji: '🦊', bounce: true },
    listening: { emoji: '👂', bounce: true },
    thinking: { emoji: '🤔', bounce: false },
    excited: { emoji: '🎉', bounce: true },
    sleeping: { emoji: '😴', bounce: false }
  };
  
  const currentMood = isListening ? 'listening' : isGenerating ? 'thinking' : mood;
  const { emoji, bounce } = moods[currentMood];

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-40"
      animate={bounce ? {
        y: [0, -20, 0],
        rotate: [0, -10, 10, 0]
      } : {}}
      transition={{ 
        repeat: Infinity, 
        duration: isListening ? 0.5 : 2,
        ease: "easeInOut"
      }}
    >
      <div className="relative">
        {/* Speech bubble */}
        {(isListening || isGenerating) && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-16 -left-20 bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-kids-purple whitespace-nowrap"
          >
            <p className="text-sm font-bold text-kids-purple">
              {isListening ? "I'm listening..." : "Creating magic..."}
            </p>
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b-2 border-r-2 border-kids-purple transform rotate-45"></div>
          </motion.div>
        )}
        
        {/* Mascot */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-7xl cursor-pointer drop-shadow-2xl"
        >
          {emoji}
        </motion.div>
        
        {/* Name tag */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-kids-purple text-white px-3 py-1 rounded-full text-xs font-bold">
          Pippin
        </div>
      </div>
    </motion.div>
  );
}
