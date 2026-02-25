import { useState } from 'react';
import { motion } from 'framer-motion';
import VoiceInput from './components/VoiceInput';
import StoryDisplay from './components/StoryDisplay';
import BigButton from './components/BigButton';

// Ollama local LLM story generator
const generateStory = async (prompt) => {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'tinyllama',
        prompt: `Create a short, magical children's story (2-3 paragraphs) based on this idea: ${prompt}\n\nMake it kid-friendly, age 4-9, with a happy ending. Use simple words and include emojis.`,
        stream: false
      })
    });
    
    if (!response.ok) {
      throw new Error('Ollama not responding');
    }
    
    const data = await response.json();
    return data.response || 'Pippin is thinking... try again! 🌟';
  } catch (error) {
    console.error('Ollama error:', error);
    // Fallback to mock if Ollama isn't ready
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `Once upon a time, there was a magical adventure about ${prompt}! ✨\n\nThe story continues with wonder and excitement... (Pippin is learning to tell better stories!) 🌈`;
  }
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
