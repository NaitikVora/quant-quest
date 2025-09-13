import React from 'react';
import { motion } from 'framer-motion';

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isPlayer: boolean;
}

interface VSBattleArenaProps {
  player: Player;
  opponent: Player;
  isAnimating: boolean;
}

const VSBattleArena: React.FC<VSBattleArenaProps> = ({ player, opponent, isAnimating }) => {
  return (
    <div className="relative w-full max-w-6xl mx-auto p-4">
      {/* Background Arena */}
      <div className="relative bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 rounded-xl border-2 border-cyan-400/30 p-4 overflow-hidden">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(cyan 1px, transparent 1px),
                             linear-gradient(90deg, cyan 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Player vs Opponent Layout */}
        <div className="relative flex items-center justify-between">
          {/* Player Side */}
          <motion.div
            className="flex flex-col items-center space-y-2"
            animate={isAnimating ? {
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            } : {}}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            {/* Player Avatar */}
            <div className="relative">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full border-2 border-green-300 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 0px #00ff00",
                    "0 0 15px #00ff00, 0 0 30px #00ff00",
                    "0 0 0px #00ff00"
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="text-lg">👤</span>
              </motion.div>
              
              {/* Blinking eyes effect */}
              <motion.div
                className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
              />
            </div>

            {/* Player Name */}
            <div className="text-center">
              <h3 className="text-sm font-mono font-bold text-green-400">{player.name}</h3>
              <p className="text-xs text-green-300">Score: {player.score}</p>
            </div>
          </motion.div>

          {/* VS Section */}
          <div className="flex flex-col items-center space-y-2">
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <div className="text-4xl font-bold text-yellow-400 font-mono" style={{
                textShadow: '0 0 15px #ffff00, 0 0 30px #ffff00',
                filter: 'drop-shadow(0 0 8px #ffff00)'
              }}>
                VS
              </div>
              
              {/* Lightning bolt effect */}
              <motion.div
                className="absolute -top-1 -right-1 text-lg"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                ⚡
              </motion.div>
            </motion.div>

            {/* Battle status */}
            <motion.div
              className="px-3 py-1 bg-red-500/20 border border-red-400 rounded-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="text-xs font-mono text-red-400 font-bold">BATTLE IN PROGRESS</span>
            </motion.div>
          </div>

          {/* Opponent Side */}
          <motion.div
            className="flex flex-col items-center space-y-2"
            animate={isAnimating ? {
              scale: [1, 1.05, 1],
              rotate: [0, -2, 2, 0]
            } : {}}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
          >
            {/* Opponent Avatar */}
            <div className="relative">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-600 rounded-full border-2 border-red-300 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 0px #ff0000",
                    "0 0 15px #ff0000, 0 0 30px #ff0000",
                    "0 0 0px #ff0000"
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              >
                <span className="text-lg">🤖</span>
              </motion.div>
              
              {/* Blinking eyes effect */}
              <motion.div
                className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
              />
              <motion.div
                className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>

            {/* Opponent Name */}
            <div className="text-center">
              <h3 className="text-sm font-mono font-bold text-red-400">{opponent.name}</h3>
              <p className="text-xs text-red-300">Score: {opponent.score}</p>
            </div>
          </motion.div>
        </div>

        {/* Energy waves */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(0,255,0,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(255,0,0,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(0,255,0,0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );
};

export default VSBattleArena;
