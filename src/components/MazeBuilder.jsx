import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function MazeBuilder() {
  const canvasRef = useRef(null);
  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [goalPos, setGoalPos] = useState({ x: 9, y: 9 });
  const [gameWon, setGameWon] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const gridSize = { easy: 10, medium: 15, hard: 20 };

  // Generate maze using recursive backtracking
  const generateMaze = (size) => {
    const grid = Array(size).fill(null).map(() => 
      Array(size).fill(null).map(() => ({ visited: false, walls: { top: true, right: true, bottom: true, left: true } }))
    );
    
    const stack = [];
    let current = { x: 0, y: 0 };
    grid[0][0].visited = true;
    
    const getUnvisitedNeighbors = (cell) => {
      const neighbors = [];
      const { x, y } = cell;
      
      if (y > 0 && !grid[y - 1][x].visited) neighbors.push({ x, y: y - 1, dir: 'top' });
      if (x < size - 1 && !grid[y][x + 1].visited) neighbors.push({ x: x + 1, y, dir: 'right' });
      if (y < size - 1 && !grid[y + 1][x].visited) neighbors.push({ x, y: y + 1, dir: 'bottom' });
      if (x > 0 && !grid[y][x - 1].visited) neighbors.push({ x: x - 1, y, dir: 'left' });
      
      return neighbors;
    };
    
    while (true) {
      const neighbors = getUnvisitedNeighbors(current);
      
      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        stack.push(current);
        
        // Remove walls
        if (next.dir === 'top') {
          grid[current.y][current.x].walls.top = false;
          grid[next.y][next.x].walls.bottom = false;
        } else if (next.dir === 'right') {
          grid[current.y][current.x].walls.right = false;
          grid[next.y][next.x].walls.left = false;
        } else if (next.dir === 'bottom') {
          grid[current.y][current.x].walls.bottom = false;
          grid[next.y][next.x].walls.top = false;
        } else if (next.dir === 'left') {
          grid[current.y][current.x].walls.left = false;
          grid[next.y][next.x].walls.right = false;
        }
        
        grid[next.y][next.x].visited = true;
        current = { x: next.x, y: next.y };
      } else if (stack.length > 0) {
        current = stack.pop();
      } else {
        break;
      }
    }
    
    return grid;
  };

  const initGame = () => {
    const size = gridSize[difficulty];
    const newMaze = generateMaze(size);
    setMaze(newMaze);
    setPlayerPos({ x: 0, y: 0 });
    setGoalPos({ x: size - 1, y: size - 1 });
    setGameWon(false);
  };

  useEffect(() => {
    initGame();
  }, [difficulty]);

  const movePlayer = (dx, dy) => {
    if (gameWon) return;
    
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    const size = gridSize[difficulty];
    
    if (newX < 0 || newX >= size || newY < 0 || newY >= size) return;
    
    const currentCell = maze[playerPos.y]?.[playerPos.x];
    if (!currentCell) return;
    
    // Check walls
    if (dx === 1 && currentCell.walls.right) return;
    if (dx === -1 && currentCell.walls.left) return;
    if (dy === 1 && currentCell.walls.bottom) return;
    if (dy === -1 && currentCell.walls.top) return;
    
    setPlayerPos({ x: newX, y: newY });
    
    if (newX === goalPos.x && newY === goalPos.y) {
      setGameWon(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': movePlayer(0, -1); break;
        case 'ArrowDown': case 's': case 'S': movePlayer(0, 1); break;
        case 'ArrowLeft': case 'a': case 'A': movePlayer(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D': movePlayer(1, 0); break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, maze, gameWon]);

  const cellSize = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 30 : 25;

  return (
    <div className="maze-builder">
      <div className="maze-header">
        <h3>🎮 Build & Solve Your Maze!</h3>
        <div className="difficulty-selector">
          <label>Difficulty:</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy (10x10)</option>
            <option value="medium">Medium (15x15)</option>
            <option value="hard">Hard (20x20)</option>
          </select>
          <button className="new-maze-btn" onClick={initGame}>🔄 New Maze</button>
        </div>
      </div>
      
      <div className="maze-instructions">
        Use arrow keys or WASD to move! 🏃‍♂️ Find the treasure! 💎
      </div>
      
      <div className="maze-container" style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize[difficulty]}, ${cellSize}px)`,
        gap: 0,
        width: 'fit-content',
        margin: '0 auto',
        border: '3px solid #667eea',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {maze.map((row, y) => 
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className="maze-cell"
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: playerPos.x === x && playerPos.y === y ? '#667eea' : 
                                goalPos.x === x && goalPos.y === y ? '#fbbf24' : '#fff',
                borderTop: cell.walls.top ? '2px solid #333' : '2px solid transparent',
                borderRight: cell.walls.right ? '2px solid #333' : '2px solid transparent',
                borderBottom: cell.walls.bottom ? '2px solid #333' : '2px solid transparent',
                borderLeft: cell.walls.left ? '2px solid #333' : '2px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: cellSize * 0.6
              }}
            >
              {playerPos.x === x && playerPos.y === y ? '😊' : 
               goalPos.x === x && goalPos.y === y ? '💎' : ''}
            </div>
          ))
        )}
      </div>
      
      {gameWon && (
        <motion.div 
          className="maze-win"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            textAlign: 'center',
            padding: '20px',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            borderRadius: '15px',
            marginTop: '20px'
          }}
        >
          <h2>🎉 You Escaped the Maze! 🎉</h2>
          <p>Amazing job! You're a maze master!</p>
          <button className="play-again-btn" onClick={initGame}>Play Again</button>
        </motion.div>
      )}
      
      <div className="maze-controls">
        <button onClick={() => movePlayer(0, -1)}>⬆️</button>
        <div>
          <button onClick={() => movePlayer(-1, 0)}>⬅️</button>
          <button onClick={() => movePlayer(0, 1)}>⬇️</button>
          <button onClick={() => movePlayer(1, 0)}>➡️</button>
        </div>
      </div>
    </div>
  );
}
