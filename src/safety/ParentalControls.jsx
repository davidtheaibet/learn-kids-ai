import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ParentalControls({ isOpen, onClose }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('learnKids_parentSettings');
    return saved ? JSON.parse(saved) : {
      requirePin: true,
      pin: '1234',
      maxStoriesPerDay: 10,
      allowVoice: true,
      contentLevel: 'strict', // strict, moderate, relaxed
      approvedOnly: false,
      dataSharing: false
    };
  });
  
  const [enteredPin, setEnteredPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState({ stories: 0, lastActive: null });
  
  useEffect(() => {
    localStorage.setItem('learnKids_parentSettings', JSON.stringify(settings));
    
    // Load stats
    const stories = localStorage.getItem('learnKids_stories') || '0';
    const lastActive = localStorage.getItem('learnKids_lastActive');
    setStats({ stories: parseInt(stories), lastActive });
  }, [settings]);
  
  const verifyPin = () => {
    if (enteredPin === settings.pin) {
      setAuthenticated(true);
    } else {
      alert('Incorrect PIN');
    }
  };
  
  if (!isOpen) return null;
  
  if (!authenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full mx-4"
          onClick={e => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-kids-purple mb-4">🔒 Parent Area</h2>
          <p className="text-gray-600 mb-4">Enter PIN to access settings</p>
          <input
            type="password"
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            className="w-full p-4 text-2xl text-center border-2 border-kids-purple rounded-xl mb-4"
            placeholder="••••"
            maxLength={4}
          />
          <button
            onClick={verifyPin}
            className="w-full bg-kids-purple text-white py-3 rounded-xl font-bold"
          >
            Unlock 🔓
          </button>
          <button
            onClick={onClose}
            className="w-full mt-2 text-gray-500 py-2"
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-kids-purple">👨‍👩‍👧‍👦 Parent Dashboard</h2>
          <button onClick={onClose} className="text-2xl">✕</button>
        </div>
        
        {/* Stats */}
        <div className="bg-kids-blue/10 rounded-2xl p-4 mb-6">
          <h3 className="font-bold text-kids-blue mb-2">Activity</h3>
          <p>📚 Stories created: <strong>{stats.stories}</strong></p>
          <p>🕐 Last active: {stats.lastActive ? new Date(stats.lastActive).toLocaleDateString() : 'Today'}</p>
        </div>
        
        {/* Settings */}
        <div className="space-y-4">
          <h3 className="font-bold text-kids-purple">Safety Settings</h3>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span>Content filtering</span>
            <select 
              value={settings.contentLevel}
              onChange={(e) => setSettings({...settings, contentLevel: e.target.value})}
              className="p-2 rounded-lg border"
            >
              <option value="strict">Strict (Recommended)</option>
              <option value="moderate">Moderate</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span>Daily story limit</span>
            <input
              type="number"
              value={settings.maxStoriesPerDay}
              onChange={(e) => setSettings({...settings, maxStoriesPerDay: parseInt(e.target.value)})}
              className="w-20 p-2 rounded-lg border text-center"
              min={1}
              max={50}
            />
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span>Allow voice input</span>
            <button
              onClick={() => setSettings({...settings, allowVoice: !settings.allowVoice})}
              className={`w-14 h-7 rounded-full transition-colors ${settings.allowVoice ? 'bg-kids-green' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.allowVoice ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span>Data sharing</span>
            <button
              onClick={() => setSettings({...settings, dataSharing: !settings.dataSharing})}
              className={`w-14 h-7 rounded-full transition-colors ${settings.dataSharing ? 'bg-kids-green' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.dataSharing ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
          <p className="text-xs text-gray-500">Data sharing is OFF by default. Stories never leave your device.</p>
        </div>
        
        {/* Export Data */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-bold text-kids-purple mb-2">Data</h3>
          <button
            onClick={() => {
              const data = {
                stories: localStorage.getItem('learnKids_stories'),
                xp: localStorage.getItem('learnKids_xp'),
                level: localStorage.getItem('learnKids_level'),
                badges: localStorage.getItem('learnKids_badges')
              };
              console.log('Child data export:', data);
              alert('Data exported to console (for backup)');
            }}
            className="w-full py-2 bg-kids-blue text-white rounded-xl font-bold"
          >
            📥 Export Child's Data
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-kids-purple text-white rounded-xl font-bold"
        >
          Save & Close
        </button>
      </motion.div>
    </motion.div>
  );
}
