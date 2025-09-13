import React from 'react';
import { motion } from 'framer-motion';

interface ArcadeLivesSystemProps {
  lives: number;
  maxLives: number;
  energy: number;
  maxEnergy: number;
  isGameOver: boolean;
  onGameOver?: () => void;
}

const ArcadeLivesSystem: React.FC<ArcadeLivesSystemProps> = ({
  lives,
  maxLives,
  energy,
  maxEnergy,
  isGameOver,
  onGameOver
}) => {
  const lifePercentage = (lives / maxLives) * 100;
  const energyPercentage = (energy / maxEnergy) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Lives and Energy - Side by Side */}
      <div className="grid grid-cols-2 gap-6">
        {/* Lives Display */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-mono font-bold text-pink-400">LIVES</h3>
            <span className="text-xs font-mono text-pink-300">{lives}/{maxLives}</span>
          </div>
          
          <div className="relative">
            {/* Lives bar background */}
            <div className="w-full h-4 bg-gray-800 border-2 border-pink-400 rounded-lg overflow-hidden">
              {/* Lives fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-red-400 relative"
                style={{ width: `${lifePercentage}%` }}
                animate={lives <= 1 ? {
                  boxShadow: [
                    "0 0 0px #ff0000",
                    "0 0 15px #ff0000, 0 0 30px #ff0000",
                    "0 0 0px #ff0000"
                  ]
                } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {/* Heart pattern overlay */}
                <div className="absolute inset-0 opacity-30">
                  <div className="w-full h-full flex items-center justify-center">
                    {[...Array(maxLives)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="text-xs mx-0.5"
                        animate={i < lives ? {
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        } : {
                          scale: 0.5,
                          opacity: 0.3
                        }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      >
                        ❤️
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Energy Display */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-mono font-bold text-blue-400">ENERGY</h3>
            <span className="text-xs font-mono text-blue-300">{energy}/{maxEnergy}</span>
          </div>
          
          <div className="relative">
            {/* Energy bar background */}
            <div className="w-full h-4 bg-gray-800 border-2 border-blue-400 rounded-lg overflow-hidden">
              {/* Energy fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 relative"
                style={{ width: `${energyPercentage}%` }}
                animate={{
                  boxShadow: [
                    "0 0 0px #00ffff",
                    "0 0 10px #00ffff, 0 0 20px #00ffff",
                    "0 0 0px #00ffff"
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {/* Lightning pattern overlay */}
                <div className="absolute inset-0 opacity-40">
                  <div className="w-full h-full flex items-center justify-center">
                    {[...Array(3)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="text-xs mx-0.5"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 0.8, 
                          repeat: Infinity, 
                          delay: i * 0.2 
                        }}
                      >
                        ⚡
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Overlay */}
      {isGameOver && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-center space-y-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Game Over Text */}
            <motion.div
              className="text-6xl font-bold font-mono text-red-400"
              animate={{
                textShadow: [
                  "0 0 0px #ff0000",
                  "0 0 30px #ff0000, 0 0 60px #ff0000",
                  "0 0 0px #ff0000"
                ]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              GAME OVER
            </motion.div>

            {/* Skull emoji */}
            <motion.div
              className="text-8xl"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              💀
            </motion.div>

            {/* Restart button */}
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-mono font-bold rounded-lg border-2 border-red-400 hover:from-red-500 hover:to-pink-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGameOver}
              animate={{
                boxShadow: [
                  "0 0 0px #ff0000",
                  "0 0 20px #ff0000, 0 0 40px #ff0000",
                  "0 0 0px #ff0000"
                ]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              PLAY AGAIN
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Low Lives Warning */}
      {lives <= 1 && !isGameOver && (
        <motion.div
          className="text-center mt-2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="inline-block px-3 py-1 bg-red-500/20 border border-red-400 rounded-lg"
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 0px #ff0000",
                "0 0 15px #ff0000, 0 0 30px #ff0000",
                "0 0 0px #ff0000"
              ]
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <span className="text-xs font-mono text-red-400 font-bold">
              ⚠️ LOW LIVES! ⚠️
            </span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ArcadeLivesSystem;
