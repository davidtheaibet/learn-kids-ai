import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BigButton from './BigButton';

export default function VoiceInput({ onTranscript, isListening, setIsListening }) {
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        setError(null);
      };

      rec.onend = () => {
        setIsListening(false);
        if (transcript && transcript.trim()) {
          onTranscript(transcript.trim());
        }
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(event.error);
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, [onTranscript, setIsListening, transcript]);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        setTranscript('');
        setError(null);
        setIsListening(true);
        recognition.start();
      } catch (err) {
        console.error('Failed to start recognition:', err);
        setError('start-failed');
        setIsListening(false);
      }
    }
  }, [recognition, setIsListening]);

  const stopListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.stop();
      } catch (err) {
        console.error('Failed to stop recognition:', err);
      }
      setIsListening(false);
    }
  }, [recognition, setIsListening]);

  if (!recognition) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="kids-card text-center p-8"
      >
        <span className="text-6xl mb-4 block">🎤</span>
        <p className="text-gray-600 font-bold text-lg">Voice input not supported</p>
        <p className="text-sm text-gray-500 mt-2">Try using Chrome or Safari on desktop/mobile</p>
        <div className="mt-4 p-4 bg-yellow-50 rounded-xl">
          <p className="text-sm text-yellow-700">
            💡 Tip: Type your story idea instead!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="text-center">
      <AnimatePresence mode="wait">
        {isListening ? (
          <motion.div
            key="listening"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="kids-card"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="mb-4"
            >
              <span className="text-6xl">👂</span>
            </motion.div>
            
            <motion.div
              className="flex justify-center gap-1 mb-4"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    height: [20, 50, 20],
                    backgroundColor: ['#FF6B9D', '#C44569', '#FF6B9D']
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 0.5,
                    delay: i * 0.1 
                  }}
                  className="w-3 rounded-full bg-kids-pink"
                />
              ))}
            </motion.div>
            
            <p className="text-kids-purple font-bold text-xl animate-pulse mb-4">
              I'm listening...
            </p>
            
            {transcript && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 italic bg-white/50 p-3 rounded-xl mb-4"
              >
                "{transcript}"
              </motion.p>
            )}
            
            <BigButton onClick={stopListening} color="red" icon="🛑">
              Stop Listening
            </BigButton>
          </motion.div>
        ) : (
          <motion.div
            key="button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm"
              >
                Oops! Try again. Make sure to allow microphone access 🎤
              </motion.div>
            )}
            
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
              whileTap={{ scale: 0.95 }}
            >
              <BigButton onClick={startListening} color="pink" icon="🎤">
                Tell Me a Story!
              </BigButton>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 mt-4 text-sm font-medium"
            >
              Click and tell me what happens! 🌟
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
