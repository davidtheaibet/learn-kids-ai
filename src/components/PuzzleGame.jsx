import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const puzzleImages = [
  { name: '🦁 Lion', emoji: '🦁', color: '#fbbf24' },
  { name: '🐘 Elephant', emoji: '🐘', color: '#9ca3af' },
  { name: '🦒 Giraffe', emoji: '🦒', color: '#fbbf24' },
  { name: '🐬 Dolphin', emoji: '🐬', color: '#60a5fa' },
  { name: '🦋 Butterfly', emoji: '🦋', color: '#a78bfa' },
  { name: '🌈 Rainbow', emoji: '🌈', color: '#f472b6' }
];

export default function PuzzleGame() {
  const [difficulty, setDifficulty] = useState(3); // 3x3, 4x4, 5x5
  const [pieces, setPieces] = useState([]);
  const [emptyIndex, setEmptyIndex] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(puzzleImages[0]);

  const initPuzzle = () => {
    const totalPieces = difficulty * difficulty;
    const newPieces = Array.from({ length: totalPieces - 1 }, (_, i) => i + 1);
    newPieces.push(0); // Empty piece
    
    // Shuffle
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]];
    }
    
    setPieces(newPieces);
    setEmptyIndex(newPieces.indexOf(0));
    setMoves(0);
    setTimer(0);
    setIsPlaying(true);
    setIsSolved(false);
  };

  useEffect(() => {
    initPuzzle();
  }, [difficulty, selectedImage]);

  useEffect(() => {
    let interval;
    if (isPlaying && !isSolved) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isSolved]);

  const canMove = (index) => {
    const row = Math.floor(index / difficulty);
    const col = index % difficulty;
    const emptyRow = Math.floor(emptyIndex / difficulty);
    const emptyCol = emptyIndex % difficulty;
    
    return (Math.abs(row - emptyRow) + Math.abs(col - emptyCol)) === 1;
  };

  const movePiece = (index) => {
    if (!canMove(index) || isSolved) return;
    
    const newPieces = [...pieces];
    [newPieces[index], newPieces[emptyIndex]] = [newPieces[emptyIndex], newPieces[index]];
    
    setPieces(newPieces);
    setEmptyIndex(index);
    setMoves(m => m + 1);
    
    // Check if solved
    const isComplete = newPieces.every((piece, i) => {
      if (i === newPieces.length - 1) return piece === 0;
      return piece === i + 1;
    });
    
    if (isComplete) {
      setIsSolved(true);
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="puzzle-game">
      <div className="puzzle-header">
        <h3>🧩 Sliding Puzzle</h3>
        
        <div className="puzzle-controls">
          <div className="image-selector">
            <label>Picture:</label>
            <div className="emoji-options">
              {puzzleImages.map(img => (
                <button
                  key={img.name}
                  className={`emoji-btn ${selectedImage.name === img.name ? 'selected' : ''}`}
                  onClick={() => setSelectedImage(img)}
                  style={{ 
                    backgroundColor: selectedImage.name === img.name ? img.color : '#f3f4f6',
                    fontSize: '1.5rem'
                  }}
                >
                  {img.emoji}
                </button>
              ))}
            </div>
          </div>
          
          <div className="difficulty-selector">
            <label>Size:</label>
            <select value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))}>
              <option value={3}>Easy (3x3)</option>
              <option value={4}>Medium (4x4)</option>
              <option value={5}>Hard (5x5)</option>
            </select>
          </div>
          
          <button className="new-game-btn" onClick={initPuzzle}>🔄 New Game</button>
        </div>
      </div>
      
      <div className="puzzle-stats">
        <span>⏱️ Time: {formatTime(timer)}</span>
        <span>🎯 Moves: {moves}</span>
      </div>
      
      <div 
        className="puzzle-board"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${difficulty}, 80px)`,
          gap: '4px',
          width: 'fit-content',
          margin: '20px auto',
          padding: '10px',
          backgroundColor: '#e5e7eb',
          borderRadius: '12px'
        }}
      >
        {pieces.map((piece, index) => (
          <motion.div
            key={`${difficulty}-${index}`}
            className={`puzzle-piece ${piece === 0 ? 'empty' : ''}`}
            onClick={() => movePiece(index)}
            whileHover={piece !== 0 ? { scale: canMove(index) ? 1.05 : 1 } : {}}
            whileTap={piece !== 0 ? { scale: 0.95 } : {}}
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: piece === 0 ? 'transparent' : selectedImage.color,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: piece === 0 ? '0' : '2rem',
              cursor: piece !== 0 && canMove(index) ? 'pointer' : 'default',
              boxShadow: piece !== 0 ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
              border: piece !== 0 ? '2px solid #fff' : '2px dashed #ccc'
            }}
          >
            {piece !== 0 && (
              <>
                <span style={{ position: 'absolute', fontSize: '2.5rem', opacity: 0.3 }}>
                  {selectedImage.emoji}
                </span>
                <span style={{ position: 'relative', zIndex: 1, fontWeight: 'bold', color: '#fff' }}>
                  {piece}
                </span>
              </>
            )}
          </motion.div>
        ))}
      </div>
      
      {isSolved && (
        <motion.div
          className="puzzle-win"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            textAlign: 'center',
            padding: '30px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '20px',
            marginTop: '20px',
            color: 'white'
          }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: '4rem', marginBottom: '10px' }}
          >
            {selectedImage.emoji}
          </motion.div>
          <h2>🎉 Puzzle Solved! 🎉</h2>
          <p>Amazing! You solved it in {moves} moves and {formatTime(timer)}!</p>
          <button 
            className="play-again-btn"
            onClick={initPuzzle}
            style={{
              marginTop: '15px',
              padding: '12px 30px',
              fontSize: '1.1rem',
              background: 'white',
              color: '#059669',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Play Again
          </button>
        </motion.div>
      )}
      
      <div className="puzzle-instructions">
        <p>💡 <strong>How to play:</strong> Click on a piece next to the empty space to slide it!</p>
        <p>🎯 Arrange numbers 1 to {difficulty * difficulty - 1} in order.</p>
      </div>
    </div>
  );
}
