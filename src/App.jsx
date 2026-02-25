import { useState } from 'react';
import { motion } from 'framer-motion';
import VoiceInput from './components/VoiceInput';
import StoryDisplay from './components/StoryDisplay';
import BigButton from './components/BigButton';

// Mock story generator (replace with local LLM later)
const generateStory = async (prompt) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const templates = [
    `Once upon a time, in a magical land far away, there lived a curious ${prompt.toLowerCase().includes('dragon') ? 'dragon' : 'creature'} who loved adventures.`,
    `In a cozy little village, there was a wonderful friend who dreamed of ${prompt}.`,
    `Long ago, when stars whispered secrets to the moon, something amazing happened...`
  ];
  
  return `${templates[Math.floor(Math.random() * templates.length)]}\n\n${prompt}\n\nAnd so, the adventure continued with laughter, friendship, and magic. The end! 🌟`;
};

function App() {
  const [isListening, setIsListening] = useState(false);
  const [story, setStory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTranscript = async (transcript) => {
    setIsGenerating(true);
    try {
      const generatedStory = await generateStory(transcript);
      setStory(generatedStory);
    } catch (error) {
      console.error('Error generating story:', error);
      setStory('Oops! Pippin got a little confused. Try again? 🙈');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetStory = () => {
    setStory(null);
    setIsListening(false);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl mb-4"
          >
            🌈
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
            LearnKidsAI
          </h1>
          <p className="text-white/80 text-lg font-semibold">
            Create magical stories with Pippin! ✨
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {!story && !isGenerating && (
            <VoiceInput 
              onTranscript={handleTranscript}
              isListening={isListening}
              setIsListening={setIsListening}
            />
          )}

          <StoryDisplay story={story} isGenerating={isGenerating} />

          {story && !isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <BigButton onClick={resetStory} color="purple" icon="🔄">
                Create Another Story
              </BigButton>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/60 text-sm">
          <p>🛡️ Safe & Private — No data leaves your device</p>
          <p className="mt-1">Made with ❤️ for kids everywhere</p>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
