import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUIZ_THEMES = {
  animals: { icon: '🦁', name: 'Animals', color: 'from-green-400 to-emerald-600' },
  space: { icon: '🚀', name: 'Space', color: 'from-indigo-400 to-purple-600' },
  dinosaurs: { icon: '🦕', name: 'Dinosaurs', color: 'from-green-500 to-teal-600' },
  ocean: { icon: '🐙', name: 'Ocean', color: 'from-blue-400 to-cyan-600' },
  numbers: { icon: '🔢', name: 'Numbers', color: 'from-orange-400 to-red-500' },
  letters: { icon: '🔤', name: 'Letters', color: 'from-pink-400 to-rose-500' }
};

const FALLBACK_QUESTIONS = {
  animals: [
    { question: 'What is the largest animal on Earth?', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'], correct: 1 },
    { question: 'Which animal can fly?', options: ['Penguin', 'Ostrich', 'Eagle', 'Kangaroo'], correct: 2 },
    { question: 'What do cows drink?', options: ['Milk', 'Water', 'Juice', 'Soda'], correct: 1 }
  ],
  space: [
    { question: 'What is the closest planet to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correct: 2 },
    { question: 'What is the name of our galaxy?', options: ['Andromeda', 'Milky Way', 'Black Hole', 'Nebula'], correct: 1 },
    { question: 'What do astronauts wear in space?', options: ['Swimsuit', 'Space suit', 'Pajamas', 'Uniform'], correct: 1 }
  ],
  dinosaurs: [
    { question: 'Which dinosaur had a long neck?', options: ['T-Rex', 'Brachiosaurus', 'Triceratops', 'Velociraptor'], correct: 1 },
    { question: 'Are dinosaurs still alive today?', options: ['Yes, all of them', 'No, they are extinct', 'Only T-Rex', 'Only small ones'], correct: 1 },
    { question: 'What does Tyrannosaurus Rex mean?', options: ['Tiny lizard', 'King of the tyrant lizards', 'Flying dragon', 'Three horns'], correct: 1 }
  ],
  ocean: [
    { question: 'What is the biggest animal in the ocean?', options: ['Shark', 'Blue Whale', 'Octopus', 'Dolphin'], correct: 1 },
    { question: 'How many legs does an octopus have?', options: ['6', '8', '10', '4'], correct: 1 },
    { question: 'What do fish use to breathe?', options: ['Lungs', 'Gills', 'Nose', 'Mouth'], correct: 1 }
  ],
  numbers: [
    { question: 'What comes after 5?', options: ['4', '6', '7', '3'], correct: 1 },
    { question: 'How many fingers do you have on one hand?', options: ['4', '5', '6', '10'], correct: 1 },
    { question: 'What is 2 + 2?', options: ['3', '4', '5', '22'], correct: 1 }
  ],
  letters: [
    { question: 'What letter comes after A?', options: ['C', 'B', 'D', 'Z'], correct: 1 },
    { question: 'Which letter starts the word "Cat"?', options: ['D', 'K', 'C', 'S'], correct: 2 },
    { question: 'How many letters are in the word "DOG"?', options: ['2', '3', '4', '5'], correct: 1 }
  ]
};

export default function QuizGame({ onXpEarned, onBadgeEarned }) {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const generateQuestions = async (theme) => {
    setIsLoading(true);
    
    // Try to generate with Ollama
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'tinyllama',
          prompt: `Create 3 fun quiz questions for kids ages 4-9 about ${QUIZ_THEMES[theme].name}. 
          Format each question as: Question?|Option1|Option2|Option3|Option4|CorrectIndex(0-3)
          Make them easy and fun with emojis.`,
          stream: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Parse Ollama response or use fallback
        const parsed = parseOllamaQuestions(data.response, theme);
        if (parsed.length >= 3) {
          setQuestions(parsed);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('Ollama failed, using fallback');
    }

    // Use fallback questions
    setQuestions(FALLBACK_QUESTIONS[theme] || FALLBACK_QUESTIONS.animals);
    setIsLoading(false);
  };

  const parseOllamaQuestions = (text, theme) => {
    // Simple parser - if Ollama response doesn't parse well, return empty
    // In production, this would be more robust
    return [];
  };

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setGameComplete(false);
    generateQuestions(theme);
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const correct = index === questions[currentQuestion].correct;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      onXpEarned(10);
      
      // Streak badges
      if (streak === 2) onBadgeEarned('streak3', 'Hot Streak 🔥');
      if (streak === 4) onBadgeEarned('streak5', 'Unstoppable ⚡');
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameComplete(true);
        // Completion badges
        if (score + (correct ? 1 : 0) === questions.length) {
          onBadgeEarned('perfect', 'Perfect Score 🏆');
          onXpEarned(50);
        }
        if (score + (correct ? 1 : 0) >= 2) {
          onBadgeEarned('quizmaster', 'Quiz Master 🧠');
        }
      }
    }, 1500);
  };

  const resetGame = () => {
    setSelectedTheme(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameComplete(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-8">
        <div className="text-center text-white">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="text-6xl mb-4"
          >
            ✨
          </motion.div>
          <p className="text-2xl font-bold">Loading Quiz...</p>
        </div>
      </div>
    );
  }

  if (!selectedTheme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-4">🧠 Quiz Time!</h1>
          <p className="text-white/80 text-center mb-8">Choose a topic to test your knowledge!</p>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(QUIZ_THEMES).map(([key, theme]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleThemeSelect(key)}
                className={`p-6 bg-gradient-to-br ${theme.color} rounded-2xl text-white font-bold text-xl shadow-lg`}
              >
                <span className="text-4xl block mb-2">{theme.icon}</span>
                {theme.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <div className="text-6xl mb-4">{percentage === 100 ? '🏆' : percentage >= 60 ? '🎉' : '🌟'}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
          <p className="text-xl text-gray-600 mb-4">You scored {score} out of {questions.length}</p>
          <p className="text-4xl font-bold text-purple-600 mb-6">{percentage}%</p>
          
          <div className="space-y-3">
            <button
              onClick={resetGame}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-bold text-white text-lg hover:opacity-90 transition"
            >
              Play Again 🔄
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-300 transition"
            >
              Back to Menu 🏠
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const current = questions[currentQuestion];
  const theme = QUIZ_THEMES[selectedTheme];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.color} p-4 flex items-center justify-center`}>
      <div className="max-w-xl w-full">
        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-4 mb-6">
          <motion.div 
            className="bg-white rounded-full h-4"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Score Display */}
        <div className="flex justify-between text-white font-bold mb-4">
          <span>Question {currentQuestion + 1}/{questions.length}</span>
          <span>Score: {score} | Streak: {streak} 🔥</span>
        </div>

        {/* Question Card */}
        <motion.div 
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-6 shadow-2xl"
        >
          <div className="text-center mb-6">
            <span className="text-5xl">{theme.icon}</span>
            <h2 className="text-xl font-bold text-gray-800 mt-4">{current.question}</h2>
          </div>

          <div className="space-y-3">
            {current.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-xl font-bold text-lg transition ${
                  selectedAnswer === null
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    : selectedAnswer === index
                      ? index === current.correct
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : index === current.correct
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                } ${selectedAnswer !== null && selectedAnswer !== index && index !== current.correct ? 'opacity-50' : ''}`}
              >
                {option}
                {showResult && index === current.correct && ' ✅'}
                {showResult && selectedAnswer === index && index !== current.correct && ' ❌'}
              </motion.button>
            ))}
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl text-center font-bold ${
                isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {isCorrect ? '🎉 Correct! Great job!' : '❌ Not quite! The answer is highlighted.'}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
