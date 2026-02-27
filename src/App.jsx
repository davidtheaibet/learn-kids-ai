import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Components
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
import PartyInvitation from './components/PartyInvitation';
import QuizGame from './components/QuizGame';

// Navigation Component
function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { path: '/app', label: 'Home', icon: '🏠' },
    { path: '/app/stories', label: 'Stories', icon: '📚' },
    { path: '/app/quiz', label: 'Quiz', icon: '🎮' },
    { path: '/app/party', label: 'Party', icon: '🎉' },
  ];
  
  return (
    <nav className="app-nav">
      <div className="nav-brand">
        <img src="/assets/logo.jpg" alt="LearnKids AI" className="nav-logo" />
        <span className="nav-title">LearnKids AI</span>
      </div>
      
      <div className="nav-links-container">
        {navItems.map(item => (
          <Link 
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
      
      <div className="nav-actions">
        <AudioToggle />
        <Link to="/app/parental" className="nav-parental-btn">
          👨‍👩‍👧‍👦 Parents
        </Link>
      </div>
    </nav>
  );
}

// Home/Dashboard Component
function HomeDashboard({ streak, xp, level, badges }) {
  return (
    <motion.div 
      className="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-header">
        <PippinMascot message="What would you like to create today?" />
        <Gamification streak={streak} xp={xp} level={level} badges={badges} />
      </div>
      
      <div className="feature-cards">
        <Link to="/app/stories" className="feature-card-large">
          <div className="card-icon">📚</div>
          <h3>Create a Story</h3>
          <p>Use your voice to make magical stories!</p>
        </Link>
        
        <Link to="/app/quiz" className="feature-card-large">
          <div className="card-icon">🎮</div>
          <h3>Play Quiz</h3>
          <p>Test your knowledge and earn badges!</p>
        </Link>
        
        <Link to="/app/party" className="feature-card-large">
          <div className="card-icon">🎉</div>
          <h3>Party Invites</h3>
          <p>Create fun invitations for your friends!</p>
        </Link>
      </div>
    </motion.div>
  );
}

// Stories Page
function StoriesPage() {
  const [isListening, setIsListening] = useState(false);
  const [story, setStory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('adventure');
  const [selectedCharacter, setSelectedCharacter] = useState('dragon');
  const [showCelebration, setShowCelebration] = useState(false);

  const generateStory = async (prompt, theme, character) => {
    try {
      setIsGenerating(true);
      
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
      
      if (!response.ok) throw new Error('Ollama not responding');
      
      const data = await response.json();
      setStory(data.response);
      setShowCelebration(true);
    } catch (error) {
      console.error('Story generation error:', error);
      setStory(`Once upon a time, there was a wonderful ${character || 'friend'} who loved adventures! 🌟

One sunny day, they decided to explore ${theme || 'a magical world'}. Along the way, they discovered something amazing: ${prompt}!

With courage and kindness, they saved the day and lived happily ever after! 🎉✨`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="page-title">📚 Create a Magical Story</h2>
      
      <div className="story-creator">
        <StoryOptions 
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          selectedCharacter={selectedCharacter}
          setSelectedCharacter={setSelectedCharacter}
        />
        
        <VoiceInput 
          isListening={isListening}
          setIsListening={setIsListening}
          onTranscript={(text) => generateStory(text, selectedTheme, selectedCharacter)}
        />
        
        {isGenerating && (
          <div className="generating">
            <PippinMascot message="Creating your story..." />
            <div className="spinner"></div>
          </div>
        )}
        
        {story && !isGenerating && (
          <StoryDisplay 
            story={story} 
            onExport={() => setShowCelebration(true)}
          />
        )}
        
        {showCelebration && (
          <Celebration onClose={() => setShowCelebration(false)} />
        )}
      </div>
    </motion.div>
  );
}

// Quiz Page
function QuizPage() {
  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="page-title">🎮 Quiz Time!</h2>
      <QuizGame />
    </motion.div>
  );
}

// Party Page
function PartyPage() {
  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="page-title">🎉 Create Party Invitations</h2>
      <PartyInvitation />
    </motion.div>
  );
}

// Parental Controls Page
function ParentalPage() {
  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="page-title">👨‍👩‍👧‍👦 Parental Controls</h2>
      <ParentalControls />
    </motion.div>
  );
}

// Main App
function App() {
  // Load gamification state from localStorage
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
    return saved ? parseInt(saved) : 1;
  });
  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('learnKids_badges');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem('learnKids_streak', streak.toString());
    localStorage.setItem('learnKids_xp', xp.toString());
    localStorage.setItem('learnKids_level', level.toString());
    localStorage.setItem('learnKids_badges', JSON.stringify(badges));
  }, [streak, xp, level, badges]);

  const addXP = (amount) => {
    setXp(prev => {
      const newXP = prev + amount;
      // Level up every 100 XP
      if (newXP >= level * 100) {
        setLevel(l => l + 1);
      }
      return newXP;
    });
  };

  const addBadge = (badge) => {
    if (!badges.includes(badge)) {
      setBadges([...badges, badge]);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <AnimatedBackground />
        
        <Routes>
          {/* Landing page is at root */}
          <Route path="/" element={<Navigate to="/app" />} />
          
          {/* App routes */}
          <Route path="/app/*" element={
            <>
              <Navigation />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={
                    <HomeDashboard 
                      streak={streak} 
                      xp={xp} 
                      level={level} 
                      badges={badges} 
                    />
                  } />
                  <Route path="/stories" element={<StoriesPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/party" element={<PartyPage />} />
                  <Route path="/parental" element={<ParentalPage />} />
                </Routes>
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
