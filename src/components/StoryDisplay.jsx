import { motion } from 'framer-motion';

export default function StoryDisplay({ story, isGenerating }) {
  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="kids-card text-center py-12"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="text-6xl mb-4"
        >
          ✨
        </motion.div>
        <p className="text-kids-purple font-bold text-xl">Pippin is writing your story...</p>
        <div className="flex justify-center gap-2 mt-4">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-3 h-3 bg-kids-purple rounded-full" />
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-3 h-3 bg-kids-pink rounded-full" />
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-3 h-3 bg-kids-blue rounded-full" />
        </div>
      </motion.div>
    );
  }

  if (!story) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="kids-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-3xl">📖</span>
        <h2 className="text-2xl font-bold text-kids-purple">Your Story</h2>
      </div>
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story}</p>
      </div>
      <div className="flex gap-3 mt-6">
        <button className="px-4 py-2 bg-kids-green text-white rounded-xl font-bold hover:bg-green-600 transition">
          🎨 Add Pictures
        </button>
        <button className="px-4 py-2 bg-kids-blue text-white rounded-xl font-bold hover:bg-blue-600 transition">
          💾 Save Story
        </button>
        <button className="px-4 py-2 bg-kids-orange text-white rounded-xl font-bold hover:bg-orange-600 transition">
          🔊 Read Aloud
        </button>
      </div>
    </motion.div>
  );
}
