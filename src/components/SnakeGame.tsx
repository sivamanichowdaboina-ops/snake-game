import React, { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef<Point>(INITIAL_DIRECTION);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (directionRef.current.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (directionRef.current.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (directionRef.current.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (directionRef.current.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
  };

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = {
          x: prevSnake[0].x + directionRef.current.x,
          y: prevSnake[0].y + directionRef.current.y,
        };

        // Collision check
        if (
          head.x < 0 || head.x >= GRID_SIZE ||
          head.y < 0 || head.y >= GRID_SIZE ||
          prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food check
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            onScoreChange(newScore);
            return newScore;
          });
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [gameOver, food, onScoreChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#ffffff' : '#00f3ff';
      
      // Raw pixel shadow
      ctx.shadowBlur = 0;
      ctx.fillStyle = isHead ? '#ffffff' : '#00f3ff';
      
      // Draw standard square without rounded edges for 'raw' look
      ctx.fillRect(
        segment.x * cellSize,
        segment.y * cellSize,
        cellSize,
        cellSize
      );

      // Add "jitter" or secondary color for head in magenta
      if (isHead) {
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(
          segment.x * cellSize + cellSize/4,
          segment.y * cellSize + cellSize/4,
          cellSize/2,
          cellSize/2
        );
      }
    });

    // Draw food - jarring magenta
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(
      food.x * cellSize,
      food.y * cellSize,
      cellSize,
      cellSize
    );

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative p-2 bg-black border-4 border-neon-cyan/80 shadow-[10px_10px_0_#ff00ff]">
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          className="bg-black block"
        />
        
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neon-pink/90 backdrop-blur-sm z-50">
            <h2 className="text-black text-6xl font-black mb-6 tracking-tighter uppercase glitch-text" data-text="TERMINATED">TERMINATED</h2>
            <button
              onClick={resetGame}
              className="px-10 py-4 bg-black hover:bg-white text-neon-cyan font-black uppercase text-lg tracking-[0.2em] transition-all border-4 border-black"
            >
              REBOOT_SESSION
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-6 text-neon-cyan font-mono text-[11px] uppercase tracking-widest font-black">
        <span className="bg-white/5 px-2 py-1">[LINK_ESTABLISHED]</span>
        <span className="bg-white/5 px-2 py-1">[COORD: {snake[0].x},{snake[0].y}]</span>
      </div>
    </div>
  );
};
