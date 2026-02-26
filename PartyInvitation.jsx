import { useState } from 'react';
import { motion } from 'framer-motion';

const THEMES = {
  birthday: { bg: 'from-pink-400 to-purple-500', icon: '🎂', title: 'Birthday Party' },
  superhero: { bg: 'from-blue-400 to-red-500', icon: '🦸', title: 'Superhero Party' },
  princess: { bg: 'from-pink-300 to-rose-400', icon: '👸', title: 'Princess Party' },
  pirate: { bg: 'from-cyan-500 to-blue-600', icon: '🏴‍☠️', title: 'Pirate Party' },
  dinosaur: { bg: 'from-green-400 to-emerald-600', icon: '🦕', title: 'Dinosaur Party' },
  space: { bg: 'from-indigo-500 to-purple-600', icon: '🚀', title: 'Space Party' }
};

export default function PartyInvitation() {
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [theme, setTheme] = useState('birthday');
  const [rsvp, setRsvp] = useState('');
  const [invitation, setInvitation] = useState(null);

  const generateInvitation = async () => {
    const themeData = THEMES[theme];
    
    const prompt = `Write a fun, exciting party invitation for a ${age}-year-old named ${childName}. 
Theme: ${themeData.title}
Make it playful, include emojis, and make it sound magical and exciting for kids.
Keep it to 3-4 sentences.`;

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'tinyllama',
          prompt: prompt,
          stream: false
        })
      });

      const data = await response.json();
      const aiText = data.response || generateFallbackText();
      
      setInvitation({
        theme: themeData,
        text: aiText,
        details: { childName, age, date, time, location, rsvp }
      });
    } catch (error) {
      setInvitation({
        theme: themeData,
        text: generateFallbackText(),
        details: { childName, age, date, time, location, rsvp }
      });
    }
  };

  const generateFallbackText = () => {
    const messages = {
      birthday: "🎉 You're invited to the most amazing birthday party ever! Get ready for games, cake, and tons of fun! 🎂🎈",
      superhero: "🦸 Calling all heroes! Join us for an action-packed superhero adventure! Bring your super powers! 💥",
      princess: "👑 You're royally invited to a magical princess celebration! Put on your crown and join the fun! ✨",
      pirate: "🏴‍☠️ Ahoy matey! Come aboard for a pirate adventure full of treasure and excitement! ⚓",
      dinosaur: "🦕 Roar! Come explore the prehistoric world with us! Dinosaurs, fossils, and fun await! 🌋",
      space: "🚀 Blast off to an out-of-this-world party! Join us for a cosmic adventure among the stars! 🌟"
    };
    return messages[theme];
  };

  const downloadInvitation = () => {
    const text = `${invitation.theme.icon} ${invitation.theme.title} ${invitation.theme.icon}

${invitation.text}

🎈 For: ${invitation.details.childName}'s ${invitation.details.age}th Birthday!
📅 Date: ${invitation.details.date}
🕐 Time: ${invitation.details.time}
📍 Location: ${invitation.details.location}
📞 RSVP: ${invitation.details.rsvp}

Can't wait to celebrate with you! 🎉

---
Made with ❤️ by LearnKid AI`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invitation.details.childName}-party-invitation.txt`;
    a.click();
  };

  if (invitation) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`min-h-screen bg-gradient-to-br ${invitation.theme.bg} p-8 flex items-center justify-center`}
      >
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-6xl">{invitation.theme.icon}</span>
            <h2 className="text-3xl font-bold mt-4 text-gray-800">{invitation.theme.title}</h2>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <p className="text-lg text-gray-700 mb-4">{invitation.text}</p>
            
            <div className="space-y-2 text-gray-600">
              <p>🎈 <strong>For:</strong> {invitation.details.childName}'s {invitation.details.age}th Birthday!</p>
              <p>📅 <strong>Date:</strong> {invitation.details.date}</p>
              <p>🕐 <strong>Time:</strong> {invitation.details.time}</p>
              <p>📍 <strong>Location:</strong> {invitation.details.location}</p>
              <p>📞 <strong>RSVP:</strong> {invitation.details.rsvp}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setInvitation(null)}
              className="flex-1 py-3 px-6 bg-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-300 transition"
            >
              Create New
            </button>
            <button
              onClick={downloadInvitation}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-bold text-white hover:opacity-90 transition"
            >
              Download 📥
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">🎉 Party Invitations</h1>
        <p className="text-gray-500 text-center mb-8">Create magical invitations with AI!</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Child's Name</label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              placeholder="e.g., Emma"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Age Turning</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              placeholder="e.g., 7"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              placeholder="e.g., 123 Party Lane"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Party Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(THEMES).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`p-3 rounded-xl border-2 transition ${
                    theme === key 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <span className="text-2xl">{data.icon}</span>
                  <p className="text-xs mt-1">{data.title.split(' ')[0]}</p>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">RSVP Contact</label>
            <input
              type="text"
              value={rsvp}
              onChange={(e) => setRsvp(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              placeholder="e.g., mom@email.com or 0412-345-678"
            />
          </div>
          
          <button
            onClick={generateInvitation}
            disabled={!childName || !age || !date || !time || !location}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-bold text-white text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            ✨ Create Magic Invitation!
          </button>
        </div>
      </div>
    </div>
  );
}
