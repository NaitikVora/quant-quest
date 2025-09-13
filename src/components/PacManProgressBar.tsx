import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface PacManProgressBarProps {
  progress: number;
  color: string;
  playerName: string;
  isActive?: boolean;
}

const PacManProgressBar: React.FC<PacManProgressBarProps> = ({ 
  progress, 
  color, 
  playerName, 
  isActive = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pacManRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw food dots
    ctx.fillStyle = '#fbbf24'; // Yellow food color
    const dotSpacing = 8;
    const dotSize = 2;
    
    for (let i = 0; i < width; i += dotSpacing) {
      const x = i + dotSpacing / 2;
      const y = height / 2;
      
      // Only draw dots that haven't been "eaten" (behind the progress)
      if (x > (progress / 100) * width) {
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Draw track
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }, [progress]);

  return (
    <div className="relative">
      <div className="flex justify-between text-sm font-mono mb-2">
        <span className="text-gray-300">{playerName}</span>
        <span className={color}>{Math.round(progress)}%</span>
      </div>
      
      <div className="relative h-6 bg-gray-700 rounded-full overflow-hidden">
        {/* Progress background */}
        <div 
          className="h-full rounded-full transition-all duration-300"
          style={{ 
            width: `${progress}%`, 
            backgroundColor: color === 'text-cyan-400' ? '#06b6d4' : '#a855f7' 
          }}
        />
        
        {/* Food dots canvas */}
        <canvas
          ref={canvasRef}
          width={300}
          height={24}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Pac-Man character */}
        <motion.div
          ref={pacManRef}
          className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4"
          style={{ 
            left: `${Math.max(0, Math.min(progress - 2, 96))}%`,
            color: color === 'text-cyan-400' ? '#06b6d4' : '#a855f7'
          }}
          animate={isActive ? {
            rotate: [0, 15, 0, -15, 0],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{
            duration: 0.5,
            repeat: isActive ? Infinity : 0,
            repeatType: "reverse"
          }}
        >
          {/* Pac-Man SVG */}
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              fill="currentColor"
            />
            <path
              d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
              fill="currentColor"
            />
            {/* Mouth */}
            <path
              d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4c1.1 0 2.1-.45 2.83-1.17L12 14l-2.83-2.83C9.9 10.45 10.9 10 12 10c1.1 0 2.1.45 2.83 1.17L12 14l2.83 2.83C14.1 17.55 13.1 18 12 18c-2.21 0-4-1.79-4-4s1.79-4 4-4z"
              fill="currentColor"
              opacity="0.3"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default PacManProgressBar;
