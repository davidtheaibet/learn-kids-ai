import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BigButton from './BigButton';

export default function VoiceInput({ onTranscript, isListening, setIsListening }) {
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };

      rec.onend = () => {
        setIsListening(false);
        if (transcript) {
          onTranscript(transcript);
        }
      };

      setRecognition(rec);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  if (!recognition) {
    return (
      <div className="kids-card text-center">
        <p className="text-gray-600">🎤 Voice input not supported in this browser</p>
        <p className="text-sm text-gray-500 mt-2">Try using Chrome or Safari</p>
      </div>
    );
  }

  return (
    <div className="kids-card text-center">
      {isListening ? (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <BigButton onClick={stopListening} color="red" icon="🛑">
            Stop Listening
          </BigButton>
        </motion.div>
      ) : (
        <BigButton onClick={startListening} color="pink" icon="🎤">
          Tell Me a Story!
        </BigButton>
      )}
      
      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-kids-pink/20 rounded-2xl"
        >
          <p className="text-kids-purple font-bold animate-pulse">Listening...</p>
          <p className="text-gray-600 mt-2 italic">"{transcript}"</p>
        </motion.div>
      )}
    </div>
  );
}
