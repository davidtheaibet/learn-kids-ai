import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceInput from './components/VoiceInput';
import StoryDisplay from './components/StoryDisplay';
import BigButton from './components/BigButton';
import Gamification from './components/Gamification';
import PippinMascot from './components/PippinMascot';
import Celebration from './components/Celebration';
import StoryOptions from './components/StoryOptions';
import ParentalControls from './safety/ParentalControls';
import { sanitizeInput, sanitizeOutput } from './safety/ContentFilter';
import AnimatedBackground from './art/AnimatedBackground';
import StoryCanvas from './art/StoryCanvas';
import StorybookExporter from './art/StorybookExporter';
import AudioPlayer from './audio/AudioPlayer';
import { AudioToggle } from './audio/SoundEffects';

// Ollama story generator
const generateStory = async (prompt, theme, character) => {
  try {
    const themeContext = {
      adventure: 'an exciting adventure',
      animals: 'a story about friendly animals',
      space: 'a space exploration adventure',
      princess: 'a magical princess story',
      pirates: 'a fun pirate adventure',
      dinosaurs: 'a story with friendly dinosaurs'
    };
    
    const charContext = {
      dragon: 'with a friendly dragon as the hero',
      unicorn: 'with a magical unicorn',
      robot: 'with a helpful robot',
      pirate: 'with a brave pirate captain',
      princess: 'with a kind princess',
      astronaut: 'with a brave astronaut'
    };
    
    const fullPrompt = `Write a short, magical children's story (2-3 paragraphs) for ages 4-9. 
Theme: ${themeContext[theme] || 'a fun adventure'}.
Main character: ${charContext[character] || 'a friendly hero'}.
Story idea: ${prompt}

Make it kid-friendly, exciting, with a happy ending. Include emojis. Keep it under 200 words.`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'tinyllama',
        prompt: fullPrompt,
        stream: false
      })
    });
    
    if (!response.ok) {
      throw new Error('Ollama not responding');
    }
    
    const data = await response.json();
    return data.response || generateFallbackStory(prompt, theme, character);
  } catch (error) {
    console.error('Ollama error:', error);
    return generateFallbackStory(prompt, theme, character);
  }
};

const generateFallbackStory = (prompt, theme, character) => {
  return `Once upon a time, there was a wonderful ${character || 'friend'} who loved going on adventures! 🌟

One sunny day, they decided to explore ${theme || 'a magical world'}. Along the way, they discovered something amazing: ${prompt}!

With courage and kindness, they saved the day and made new friends. Everyone cheered and lived happily ever after! 🎉✨

The end! 🌈`;
};

function App() {
  const [isListening, setIsListening] = useState(false);
  const [story, setStory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('adventure');
  const [selectedCharacter, setSelectedCharacter] = useState('dragon');
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Gamification state
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('learnKids_streak');
    return saved ? parseInt(saved) : 1;
  });
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('learnKids_xp');
    return saved ? parseInt(saved) : 0;
  });
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('learnKids_level');
    return saved ? parseInt(saved) : 0;
  });
  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('learnKids_badges');
    return saved ? JSON.parse(saved) : [];
  });
  const [storyCount, setStoryCount] = useState(() => {
    const saved = localStorage.getItem('learnKids_stories');
    return saved ? parseInt(saved) : 0;
  });
  const [showParentalControls, setShowParentalControls] = useState(false);
  const [safetyWarning, setSafetyWarning] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Save gamification data
  useEffect(() => {
    localStorage.setItem('learnKids_streak', streak);
    localStorage.setItem('learnKids_xp', xp);
    localStorage.setItem('learnKids_level', level);
    localStorage.setItem('learnKids_badges', JSON.stringify(badges));
    localStorage.setItem('learnKids_stories', storyCount);
  }, [streak, xp, level, badges, storyCount]);

  const handleTranscript = async (transcript) => {
    if (!transcript.trim()) return;
    
    // Jaxon Safety Check
    const safetyCheck = sanitizeInput(transcript);
    if (!safetyCheck.safe) {
      setSafetyWarning(safetyCheck.reason);
      setTimeout(() => setSafetyWarning(null), 3000);
      return;
    }
    
    const safeTranscript = safetyCheck.text;
    localStorage.setItem('learnKids_lastActive', new Date().toISOString());
    
    setIsGenerating(true);
    try {
      let generatedStory = await generateStory(safeTranscript, selectedTheme, selectedCharacter);
      
      // Jaxon Output Filter
      generatedStory = sanitizeOutput(generatedStory);
      
      setStory(generatedStory);
      
      // Update gamification
      const newXp = xp + 25;
      const newStoryCount = storyCount + 1;
      setXp(newXp);
      setStoryCount(newStoryCount);
      
      // Level up every 100 XP
      if (newXp >= (level + 1) * 100) {
        setLevel(level + 1);
      }
      
      // Award badges
      const newBadges = [...badges];
      if (newStoryCount === 1 && !newBadges.find(b => b.id === 'first')) {
        newBadges.push({ id: 'first', name: 'First Story', icon: '🌟' });
      }
      if (newStoryCount === 5 && !newBadges.find(b => b.id === 'five')) {
        newBadges.push({ id: 'five', name: 'Storyteller', icon: '📚' });
      }
      if (newStoryCount === 10 && !newBadges.find(b => b.id === 'ten')) {
        newBadges.push({ id: 'ten', name: 'Story Master', icon: '👑' });
      }
      if (!newBadges.find(b => b.id === 'voice') && transcript.length > 20) {
        newBadges.push({ id: 'voice', name: 'Voice Master', icon: '🎤' });
      }
      setBadges(newBadges);
      
      // Show celebration
      setShowCelebration(true);
    } catch (error) {
      console.error('Error:', error);
      setStory('Oops! Pippin got a little confused. Try again? 🙈');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetStory = () => {
    setStory(null);
    setIsListening(false);
    setShowCelebration(false);
  };

  // Typing effect for story
  const [displayedStory, setDisplayedStory] = useState('');
  useEffect(() => {
    if (story) {
      setDisplayedStory('');
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedStory(story.slice(0, i));
        i++;
        if (i > story.length) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    }
  }, [story]);

  return (
    <div className="min-h-screen py-8 px-4 pb-32 relative">
      {/* Mason's Animated Background */}
      <AnimatedBackground theme={selectedTheme} />
      
      {/* Gamification Header */}
      <Gamification 
        streak={streak} 
        xp={xp} 
        level={level} 
        badges={badges}
      />
      
      {/* Celebration */}
      <Celebration 
        show={showCelebration} 
        xp={25} 
        onComplete={() => setShowCelebration(false)}
      />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto pt-24"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-7xl mb-4"
          >
            📚✨
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-2 drop-shadow-lg">
            LearnKidsAI
          </h1>
          <p className="text-white/90 text-xl font-bold">
            Create magical stories with Pippin! 🌈
          </p>
          <p className="text-white/70 text-sm mt-2">
            {storyCount} stories created • Level {level + 1}
          </p>
          
          {/* Hunter's Audio Toggle */}
          <div className="mt-4 flex justify-center">
            <AudioToggle 
              enabled={audioEnabled} 
              onToggle={() => setAudioEnabled(!audioEnabled)}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!story && !isGenerating && (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
              >
                {/* Story Options */}
                <StoryOptions
                  selectedTheme={selectedTheme}
                  setSelectedTheme={setSelectedTheme}
                  selectedCharacter={selectedCharacter}
                  setSelectedCharacter={setSelectedCharacter}
                />
                
                {/* Voice Input */}
                <VoiceInput 
                  onTranscript={handleTranscript}
                  isListening={isListening}
                  setIsListening={setIsListening}
                />
                
                {/* Safety Warning */}
                <AnimatePresence>
                  {safetyWarning && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-red-100 border-2 border-red-400 text-red-700 p-4 rounded-xl mt-4 text-center"
                    >
                      <p className="font-bold">🛡️ {safetyWarning}</p>
                      <p className="text-sm mt-1">Let's try a different idea!</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Tips */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-6 text-white/80"
                >
                  <p className="text-sm">💡 Try saying: "A dragon who loves ice cream"</p>
                </motion.div>
                
                {/* Parent Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={() => setShowParentalControls(true)}
                  className="mt-8 text-white/60 text-sm hover:text-white/80 underline"
                >
                  👨‍👩‍👧‍👦 Parent Area
                </motion.button>
              </motion.div>
            )}

            {isGenerating && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="kids-card text-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="text-6xl mb-4"
                >
                  ✨
                </motion.div>
                <p className="text-2xl font-bold text-kids-purple">
                  Pippin is creating magic...
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, delay: i * 0.2, duration: 0.6 }}
                      className="w-3 h-3 bg-kids-purple rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {story && !isGenerating && (
              <motion.div
                key="story"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Mason's Story Canvas */}
                <StoryCanvas 
                  story={displayedStory}
                  theme={selectedTheme}
                  character={selectedCharacter}
                />
                
                {/* Mason's Export Feature */}
                <StorybookExporter
                  story={story}
                  theme={selectedTheme}
                  character={selectedCharacter}
                />
                
                {/* Hunter's Audio Player */}
                {audioEnabled && (
                  <AudioPlayer
                    story={story}
                    isPlaying={isPlayingAudio}
                    setIsPlaying={setIsPlayingAudio}
                  />
                )}
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center mt-8"
                >
                  <BigButton onClick={resetStory} color="purple" icon="🔄">
                    Create Another Story
                  </BigButton>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/60 text-sm">
          <p>🛡️ Safe & Private — Your stories stay on your device</p>
          <p className="mt-1">Made with ❤️ for kids everywhere</p>
        </div>
      </motion.div>
      
      {/* Pippin Mascot */}
      <PippinMascot 
        isListening={isListening}
        isGenerating={isGenerating}
      />
      
      {/* Parental Controls */}
      <ParentalControls 
        isOpen={showParentalControls}
        onClose={() => setShowParentalControls(false)}
      />
    </div>
  );
}

// Character lookup for icon
const characters = [
  { id: 'dragon', name: 'Dragon', icon: '🐉' },
  { id: 'unicorn', name: 'Unicorn', icon: '🦄' },
  { id: 'robot', name: 'Robot', icon: '🤖' },
  { id: 'pirate', name: 'Pirate', icon: '🏴‍☠️' },
  { id: 'princess', name: 'Princess', icon: '👸' },
  { id: 'astronaut', name: 'Astronaut', icon: '👨‍🚀' }
];

export default App;
