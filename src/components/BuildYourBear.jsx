import { useState } from 'react';
import { motion } from 'framer-motion';

const bearParts = {
  fur: [
    { name: 'Brown Bear', color: '#8B4513', emoji: '🐻' },
    { name: 'Polar Bear', color: '#F5F5DC', emoji: '🐻‍❄️' },
    { name: 'Black Bear', color: '#2C2C2C', emoji: '🐻' },
    { name: 'Panda', color: '#FFF', emoji: '🐼' },
    { name: 'Pink Bear', color: '#FFB6C1', emoji: '🧸' },
    { name: 'Purple Bear', color: '#DDA0DD', emoji: '🧸' }
  ],
  eyes: [
    { name: 'Big Happy', emoji: '👀', style: 'big' },
    { name: 'Winking', emoji: '😉', style: 'wink' },
    { name: 'Sleepy', emoji: '😴', style: 'sleepy' },
    { name: 'Sparkle', emoji: '✨', style: 'sparkle' },
    { name: 'Cute', emoji: '🥺', style: 'cute' },
    { name: 'Sunglasses', emoji: '😎', style: 'cool' }
  ],
  accessories: [
    { name: 'None', emoji: '', style: 'none' },
    { name: 'Bow Tie', emoji: '🎀', style: 'bow' },
    { name: 'Hat', emoji: '🎩', style: 'hat' },
    { name: 'Glasses', emoji: '👓', style: 'glasses' },
    { name: 'Crown', emoji: '👑', style: 'crown' },
    { name: 'Scarf', emoji: '🧣', style: 'scarf' },
    { name: 'Bow', emoji: '🎀', style: 'bow2' },
    { name: 'Flower', emoji: '🌸', style: 'flower' }
  ],
  outfits: [
    { name: 'None', emoji: '', color: 'transparent' },
    { name: 'Superhero', emoji: '🦸', color: '#DC143C' },
    { name: 'Princess', emoji: '👸', color: '#FF69B4' },
    { name: 'Astronaut', emoji: '👨‍🚀', color: '#4169E1' },
    { name: 'Doctor', emoji: '👨‍⚕️', color: '#FFF' },
    { name: 'Chef', emoji: '👨‍🍳', color: '#FFF' },
    { name: 'Wizard', emoji: '🧙', color: '#4B0082' }
  ]
};

export default function BuildYourBear() {
  const [bear, setBear] = useState({
    fur: bearParts.fur[0],
    eyes: bearParts.eyes[0],
    accessory: bearParts.accessories[0],
    outfit: bearParts.outfits[0],
    name: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  const updateBear = (part, value) => {
    setBear(prev => ({ ...prev, [part]: value }));
    setIsSaved(false);
  };

  const saveBear = () => {
    if (!bear.name.trim()) {
      alert('Please give your bear a name!');
      return;
    }
    setIsSaved(true);
    // In real app, would save to backend
  };

  return (
    <div className="build-your-bear">
      <div className="bear-header">
        <h3>🧸 Build Your Bear!</h3>
        <p>Create your perfect cuddly friend!</p>
      </div>
      
      <div className="bear-builder-container">
        {/* Bear Preview */}
        <div className="bear-preview-section">
          <motion.div 
            className="bear-preview"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '280px',
              height: '320px',
              backgroundColor: bear.fur.color,
              borderRadius: '50% 50% 45% 45%',
              margin: '0 auto 20px',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Ears */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '30px',
              width: '60px',
              height: '60px',
              backgroundColor: bear.fur.color,
              borderRadius: '50%',
              boxShadow: '0 5px 10px rgba(0,0,0,0.1)'
            }} />
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '30px',
              width: '60px',
              height: '60px',
              backgroundColor: bear.fur.color,
              borderRadius: '50%',
              boxShadow: '0 5px 10px rgba(0,0,0,0.1)'
            }} />
            
            {/* Eyes */}
            <div style={{
              display: 'flex',
              gap: '40px',
              marginTop: '40px',
              fontSize: '3rem'
            }}>
              <span>{bear.eyes.emoji}</span>
            </div>
            
            {/* Nose */}
            <div style={{
              width: '30px',
              height: '20px',
              backgroundColor: '#333',
              borderRadius: '50%',
              marginTop: '10px'
            }} />
            
            {/* Mouth */}
            <div style={{
              fontSize: '2rem',
              marginTop: '5px'
            }}>
              🙂
            </div>
            
            {/* Outfit */}
            {bear.outfit.emoji && (
              <div style={{
                position: 'absolute',
                bottom: '60px',
                width: '180px',
                height: '100px',
                backgroundColor: bear.outfit.color,
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                opacity: 0.9
              }}>
                {bear.outfit.emoji}
              </div>
            )}
            
            {/* Accessory */}
            {bear.accessory.emoji && (
              <div style={{
                position: 'absolute',
                top: bear.accessory.style === 'hat' || bear.accessory.style === 'crown' ? '-20px' : '80px',
                fontSize: '3.5rem',
                zIndex: 10
              }}>
                {bear.accessory.emoji}
              </div>
            )}
          </motion.div>
          
          {/* Name Input */}
          <div className="bear-name-section">
            <input
              type="text"
              placeholder="Give your bear a name..."
              value={bear.name}
              onChange={(e) => updateBear('name', e.target.value)}
              className="bear-name-input"
              style={{
                padding: '12px 20px',
                fontSize: '1.2rem',
                borderRadius: '25px',
                border: '2px solid #ddd',
                textAlign: 'center',
                width: '100%',
                maxWidth: '250px'
              }}
            />
          </div>
          
          {isSaved && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bear-saved"
              style={{
                textAlign: 'center',
                padding: '15px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '15px',
                color: 'white',
                marginTop: '15px'
              }}
            >
              <h4>🎉 Meet {bear.name}! 🎉</h4>
              <p>Your bear is ready for adventures!</p>
            </motion.div>
          )}
        </div>
        
        {/* Customization Options */}
        <div className="bear-options">
          {/* Fur Color */}
          <div className="option-section">
            <h4>🎨 Fur Color</h4>
            <div className="option-grid">
              {bearParts.fur.map(fur => (
                <button
                  key={fur.name}
                  className={`option-btn ${bear.fur.name === fur.name ? 'selected' : ''}`}
                  onClick={() => updateBear('fur', fur)}
                  style={{
                    backgroundColor: fur.color,
                    border: bear.fur.name === fur.name ? '3px solid #667eea' : '2px solid transparent',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  {fur.emoji}
                </button>
              ))}
            </div>
          </div>
          
          {/* Eyes */}
          <div className="option-section">
            <h4>👀 Eyes</h4>
            <div className="option-grid">
              {bearParts.eyes.map(eye => (
                <button
                  key={eye.name}
                  className={`option-btn ${bear.eyes.name === eye.name ? 'selected' : ''}`}
                  onClick={() => updateBear('eyes', eye)}
                  style={{
                    backgroundColor: bear.eyes.name === eye.name ? '#e0e7ff' : '#f3f4f6',
                    border: bear.eyes.name === eye.name ? '3px solid #667eea' : '2px solid transparent',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  {eye.emoji}
                </button>
              ))}
            </div>
          </div>
          
          {/* Accessories */}
          <div className="option-section">
            <h4>🎀 Accessories</h4>
            <div className="option-grid">
              {bearParts.accessories.map(acc => (
                <button
                  key={acc.name}
                  className={`option-btn ${bear.accessory.name === acc.name ? 'selected' : ''}`}
                  onClick={() => updateBear('accessory', acc)}
                  style={{
                    backgroundColor: bear.accessory.name === acc.name ? '#e0e7ff' : '#f3f4f6',
                    border: bear.accessory.name === acc.name ? '3px solid #667eea' : '2px solid transparent',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  {acc.emoji || '❌'}
                </button>
              ))}
            </div>
          </div>
          
          {/* Outfit */}
          <div className="option-section">
            <h4>👕 Outfit</h4>
            <div className="option-grid">
              {bearParts.outfits.map(outfit => (
                <button
                  key={outfit.name}
                  className={`option-btn ${bear.outfit.name === outfit.name ? 'selected' : ''}`}
                  onClick={() => updateBear('outfit', outfit)}
                  style={{
                    backgroundColor: bear.outfit.name === outfit.name ? outfit.color || '#e0e7ff' : '#f3f4f6',
                    border: bear.outfit.name === outfit.name ? '3px solid #667eea' : '2px solid transparent',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  {outfit.emoji || '❌'}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            className="save-bear-btn"
            onClick={saveBear}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '20px'
            }}
          >
            🧸 Save My Bear!
          </button>
        </div>
      </div>
    </div>
  );
}
