import { useState } from 'react';
import { motion } from 'framer-motion';

const sleepThemes = [
  { name: 'Starry Night', emoji: '🌙', color: '#1a1a2e', sound: 'peaceful crickets' },
  { name: 'Ocean Waves', emoji: '🌊', color: '#006994', sound: 'gentle waves' },
  { name: 'Forest Dreams', emoji: '🌲', color: '#2d5016', sound: 'rustling leaves' },
  { name: 'Cloud Castle', emoji: '☁️', color: '#87CEEB', sound: 'soft wind' },
  { name: 'Dreamland', emoji: '🦄', color: '#dda0dd', sound: 'magical chimes' },
  { name: 'Space Dreams', emoji: '🚀', color: '#191970', sound: 'space ambience' }
];

const characters = [
  { name: 'Sleepy Bear', emoji: '🐻', trait: 'loves honey and naps' },
  { name: 'Dreamy Bunny', emoji: '🐰', trait: 'hops through dreams' },
  { name: 'Snuggly Cat', emoji: '😺', trait: 'purrs softly' },
  { name: 'Little Star', emoji: '⭐', trait: 'twinkles in the night' },
  { name: 'Moon Friend', emoji: '🌙', trait: 'watches over dreams' },
  { name: 'Cloud Sheep', emoji: '🐑', trait: 'floats on fluffy clouds' }
];

const sleepDurations = [
  { name: 'Quick Nap', minutes: 2, length: 'short' },
  { name: 'Bedtime Story', minutes: 5, length: 'medium' },
  { name: 'Deep Sleep', minutes: 10, length: 'long' }
];

export default function SleepStoryCreator() {
  const [selectedTheme, setSelectedTheme] = useState(sleepThemes[0]);
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const [selectedDuration, setSelectedDuration] = useState(sleepDurations[1]);
  const [childName, setChildName] = useState('');
  const [story, setStory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateSleepStory = async () => {
    if (!childName.trim()) {
      alert('Please enter a name first!');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const stories = {
        short: `Once upon a time, ${childName} met ${selectedCharacter.name} ${selectedCharacter.emoji} in a beautiful ${selectedTheme.name.toLowerCase()} ${selectedTheme.emoji}. 

"Close your eyes," whispered ${selectedCharacter.name}, "and listen to the ${selectedTheme.sound}." 

${childName} felt warm and cozy. The world became soft and peaceful. Sweet dreams, ${childName}. 🌙✨`,
        
        medium: `In the gentle ${selectedTheme.name.toLowerCase()} ${selectedTheme.emoji}, ${childName} discovered a magical path made of soft clouds. 

${selectedCharacter.name} ${selectedCharacter.emoji} was waiting there. "Come," said the ${selectedCharacter.name.toLowerCase()}, who ${selectedCharacter.trait}. 

Together they walked through the ${selectedTheme.name.toLowerCase()}, listening to the ${selectedTheme.sound}. Everything was calm and peaceful.

${childName} felt sleepy and safe. The stars twinkled like friendly eyes watching over them.

"Rest now, ${childName}," said ${selectedCharacter.name}. "Tomorrow will be a beautiful new day."

And ${childName} drifted into the sweetest dreams. 🌟💤`,
        
        long: `As the sun set and the ${selectedTheme.name.toLowerCase()} ${selectedTheme.emoji} appeared, ${childName} got ready for bed. The ${selectedTheme.sound} created the perfect lullaby.

Suddenly, a gentle glow appeared by the window. It was ${selectedCharacter.name} ${selectedCharacter.emoji}! This special friend ${selectedCharacter.trait} and had come to take ${childName} on a dream adventure.

"Hold my hand," said ${selectedCharacter.name}, and together they floated into the ${selectedTheme.name.toLowerCase()}. 

They saw wonderful things:
🌟 Sparkling stars that danced just for them
☁️ Soft clouds that felt like cotton candy
🎵 Music made by the ${selectedTheme.sound}
🌈 Colors that don't exist when you're awake

${childName} and ${selectedCharacter.name} explored this peaceful world, where everything was soft, warm, and safe. They laughed softly and felt so happy.

As they journeyed, ${childName} felt eyelids growing heavy. The adventure was becoming a beautiful dream.

"Sleep now, dear ${childName}," whispered ${selectedCharacter.name}. "I'll stay with you all night, and when morning comes, I'll be in your heart."

${childName} smiled and cuddled into the softest sleep, surrounded by the gentle ${selectedTheme.sound}.

Goodnight, ${childName}. Sweet dreams. 🌙💫✨`
      };
      
      setStory(stories[selectedDuration.length]);
      setIsGenerating(false);
      setIsPlaying(true);
      
      // Auto-play with speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(stories[selectedDuration.length]);
        utterance.rate = 0.8;
        utterance.pitch = 0.9;
        utterance.onend = () => setIsPlaying(false);
        speechSynthesis.speak(utterance);
      }
    }, 2000);
  };

  const stopStory = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  return (
    <div className="sleep-story-creator">
      <div className="sleep-header">
        <h3>🌙 Create Your Sleep Story</h3>
        <p>A magical bedtime story just for you</p>
      </div>
      
      {!story ? (
        <div className="sleep-options">
          {/* Child's Name */}
          <div className="option-section">
            <label>👤 Who is this story for?</label>
            <input
              type="text"
              placeholder="Enter name..."
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="name-input"
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '1.2rem',
                borderRadius: '15px',
                border: '2px solid #ddd',
                marginTop: '10px'
              }}
            />
          </div>
          
          {/* Theme Selection */}
          <div className="option-section">
            <label>🎨 Dream Theme</label>
            <div className="theme-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '10px' }}>
              {sleepThemes.map(theme => (
                <button
                  key={theme.name}
                  onClick={() => setSelectedTheme(theme)}
                  style={{
                    padding: '20px 10px',
                    borderRadius: '15px',
                    border: selectedTheme.name === theme.name ? '3px solid #667eea' : '2px solid transparent',
                    backgroundColor: selectedTheme.name === theme.name ? theme.color : '#f3f4f6',
                    color: selectedTheme.name === theme.name ? '#fff' : '#333',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  <div style={{ fontSize: '2rem' }}>{theme.emoji}</div>
                  <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>{theme.name}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Character Selection */}
          <div className="option-section">
            <label>🧸 Sleepy Friend</label>
            <div className="character-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '10px' }}>
              {characters.map(char => (
                <button
                  key={char.name}
                  onClick={() => setSelectedCharacter(char)}
                  style={{
                    padding: '15px 10px',
                    borderRadius: '15px',
                    border: selectedCharacter.name === char.name ? '3px solid #667eea' : '2px solid transparent',
                    backgroundColor: selectedCharacter.name === char.name ? '#e0e7ff' : '#f3f4f6',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '2.5rem' }}>{char.emoji}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginTop: '5px' }}>{char.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '3px' }}>{char.trait}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Duration Selection */}
          <div className="option-section">
            <label>⏱️ Story Length</label>
            <div className="duration-grid" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {sleepDurations.map(dur => (
                <button
                  key={dur.name}
                  onClick={() => setSelectedDuration(dur)}
                  style={{
                    flex: 1,
                    padding: '15px',
                    borderRadius: '15px',
                    border: selectedDuration.name === dur.name ? '3px solid #667eea' : '2px solid transparent',
                    backgroundColor: selectedDuration.name === dur.name ? '#667eea' : '#f3f4f6',
                    color: selectedDuration.name === dur.name ? '#fff' : '#333',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{dur.name}</div>
                  <div style={{ fontSize: '0.85rem', marginTop: '5px' }}>~{dur.minutes} min</div>
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={generateSleepStory}
            disabled={isGenerating}
            style={{
              width: '100%',
              padding: '20px',
              fontSize: '1.3rem',
              background: 'linear-gradient(135deg, #1a1a2e, #4a4a6a)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {isGenerating ? (
              <>
                <span className="spinner" style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>🌙</span>
                Creating Your Dream...
              </>
            ) : (
              <>
                <span>✨</span> Create Sleep Story <span>✨</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <motion.div 
          className="story-display"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: `linear-gradient(135deg, ${selectedTheme.color}, #2d2d44)`,
            padding: '30px',
            borderRadius: '20px',
            color: 'white',
            marginTop: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Stars animation background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.3,
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.8rem' }}>
              {selectedTheme.emoji} {childName}'s Sleep Story {selectedTheme.emoji}
            </h2>
            
            <div style={{ 
              fontSize: '1.2rem', 
              lineHeight: '1.8',
              whiteSpace: 'pre-line',
              textAlign: 'center'
            }}>
              {story}
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              marginTop: '30px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => { stopStory(); setStory(null); }}
                style={{
                  padding: '12px 25px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                🔄 New Story
              </button>
              
              {isPlaying ? (
                <button
                  onClick={stopStory}
                  style={{
                    padding: '12px 25px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  ⏹️ Stop
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsPlaying(true);
                    const utterance = new SpeechSynthesisUtterance(story);
                    utterance.rate = 0.8;
                    utterance.pitch = 0.9;
                    utterance.onend = () => setIsPlaying(false);
                    speechSynthesis.speak(utterance);
                  }}
                  style={{
                    padding: '12px 25px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  ▶️ Read Aloud
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Sleep tips */}
      <div className="sleep-tips" style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '15px' }}>
        <h4>💤 Sleep Tips</h4>
        <ul style={{ marginTop: '10px', paddingLeft: '20px', color: '#555' }}>
          <li>Listen to the story with the lights dimmed</li>
          <li>Take slow, deep breaths as you listen</li>
          <li>Imagine you're in the story with your sleepy friend</li>
          <li>It's okay to fall asleep before the story ends!</li>
        </ul>
      </div>
    </div>
  );
}
