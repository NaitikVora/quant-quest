import React from 'react';
import { motion } from 'framer-motion';

interface ArcadeProgressBarsProps {
  playerProgress: number;
  opponentProgress: number;
  playerScore: number;
  opponentScore: number;
  isAnimating: boolean;
}

const ArcadeProgressBars: React.FC<ArcadeProgressBarsProps> = ({
  playerProgress,
  opponentProgress,
  playerScore,
  opponentScore,
  isAnimating
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Progress Bars - Side by Side */}
      <div className="grid grid-cols-2 gap-6">
        {/* Player Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-mono font-bold text-green-400">YOU</h3>
            <div className="text-xs font-mono text-green-300">Score: {playerScore}</div>
          </div>
          
          <div className="relative">
            {/* Progress bar background - Pac-Man style maze */}
            <div className="w-full h-6 bg-gray-800 border-2 border-green-400 rounded-lg overflow-hidden relative">
              {/* Maze pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                  backgroundImage: `repeating-linear-gradient(
                    90deg,
                    transparent 0px,
                    transparent 6px,
                    #00ff00 6px,
                    #00ff00 8px
                  )`
                }} />
              </div>
              
              {/* Progress fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 relative"
                style={{ width: `${playerProgress}%` }}
                animate={isAnimating ? {
                  boxShadow: [
                    "0 0 0px #00ff00",
                    "0 0 15px #00ff00, 0 0 30px #00ff00",
                    "0 0 0px #00ff00"
                  ]
                } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {/* Animated dots along the path */}
                <motion.div
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                />
              </motion.div>
              
              {/* Player avatar moving along the bar */}
              <motion.div
                className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-green-400 rounded-full border border-white flex items-center justify-center"
                style={{ left: `calc(${playerProgress}% - 8px)` }}
                animate={{
                  y: [0, -1, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <span className="text-xs">👤</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Opponent Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-mono font-bold text-red-400">OPPONENT</h3>
            <div className="text-xs font-mono text-red-300">Score: {opponentScore}</div>
          </div>
          
          <div className="relative">
            {/* Progress bar background - Pac-Man style maze */}
            <div className="w-full h-6 bg-gray-800 border-2 border-red-400 rounded-lg overflow-hidden relative">
              {/* Maze pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                  backgroundImage: `repeating-linear-gradient(
                    90deg,
                    transparent 0px,
                    transparent 6px,
                    #ff0000 6px,
                    #ff0000 8px
                  )`
                }} />
              </div>
              
              {/* Progress fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-pink-400 relative"
                style={{ width: `${opponentProgress}%` }}
                animate={isAnimating ? {
                  boxShadow: [
                    "0 0 0px #ff0000",
                    "0 0 15px #ff0000, 0 0 30px #ff0000",
                    "0 0 0px #ff0000"
                  ]
                } : {}}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
              >
                {/* Animated dots along the path */}
                <motion.div
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 0.3, repeat: Infinity, delay: 0.2 }}
                />
              </motion.div>
              
              {/* Opponent avatar moving along the bar */}
              <motion.div
                className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-red-400 rounded-full border border-white flex items-center justify-center"
                style={{ left: `calc(${opponentProgress}% - 8px)` }}
                animate={{
                  y: [0, -1, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
              >
                <span className="text-xs">🤖</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Status */}
      <div className="text-center">
        <motion.div
          className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg border-2 border-purple-400"
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 0px #ff00ff",
              "0 0 15px #ff00ff, 0 0 30px #ff00ff",
              "0 0 0px #ff00ff"
            ]
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="text-sm font-mono font-bold text-white">
            {playerProgress > opponentProgress ? "LEADING!" : 
             playerProgress < opponentProgress ? "CATCHING UP!" : "TIE!"}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default ArcadeProgressBars;
