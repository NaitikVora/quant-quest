import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArcadeVictoryScreenProps {
  isVisible: boolean;
  isVictory: boolean;
  playerScore: number;
  opponentScore: number;
  ratingChange: number;
  badges: string[];
  onPlayAgain: () => void;
  onReturnToLobby: () => void;
}

const ArcadeVictoryScreen: React.FC<ArcadeVictoryScreenProps> = ({
  isVisible,
  isVictory,
  playerScore,
  opponentScore,
  ratingChange,
  badges,
  onPlayAgain,
  onReturnToLobby
}) => {
  const [showFireworks, setShowFireworks] = useState(false);
  const [showBadges, setShowBadges] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowFireworks(true);
      setTimeout(() => setShowBadges(true), 1000);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      {/* Fireworks Background */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)]
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
                y: [0, -100, -200]
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        className="text-center space-y-8 relative z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Victory/Defeat Text */}
        <motion.div
          className="text-6xl font-bold font-mono"
          animate={{
            textShadow: [
              "0 0 0px currentColor",
              "0 0 30px currentColor, 0 0 60px currentColor",
              "0 0 0px currentColor"
            ]
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {isVictory ? (
            <span className="text-green-400">VICTORY!</span>
          ) : (
            <span className="text-red-400">DEFEAT!</span>
          )}
        </motion.div>

        {/* Trophy or Skull */}
        <motion.div
          className="text-8xl"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {isVictory ? '🏆' : '💀'}
        </motion.div>

        {/* Score Comparison */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm border-2 border-gray-600 rounded-lg p-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3 className="text-2xl font-mono font-bold text-white mb-4">FINAL SCORES</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-lg font-mono text-green-400 mb-2">YOU</div>
              <motion.div
                className="text-4xl font-bold text-green-300"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                {playerScore}
              </motion.div>
            </div>
            <div className="text-center">
              <div className="text-lg font-mono text-red-400 mb-2">OPPONENT</div>
              <motion.div
                className="text-4xl font-bold text-red-300"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                {opponentScore}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Rating Change */}
        <motion.div
          className="text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <div className="text-lg font-mono text-gray-300 mb-2">RATING CHANGE</div>
          <motion.div
            className={`text-3xl font-bold font-mono ${
              ratingChange > 0 ? 'text-green-400' : 'text-red-400'
            }`}
            animate={{
              scale: [1, 1.2, 1],
              textShadow: [
                "0 0 0px currentColor",
                "0 0 20px currentColor, 0 0 40px currentColor",
                "0 0 0px currentColor"
              ]
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {ratingChange > 0 ? '+' : ''}{ratingChange}
          </motion.div>
        </motion.div>

        {/* Badges */}
        <AnimatePresence>
          {showBadges && badges.length > 0 && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <h3 className="text-xl font-mono font-bold text-yellow-400">BADGES EARNED</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-2 rounded-lg border-2 border-yellow-400 font-mono font-bold"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: 1.4 + index * 0.2, 
                      duration: 0.5,
                      ease: "easeOut"
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {badge}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-6 justify-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-mono font-bold rounded-lg border-2 border-green-400 hover:from-green-500 hover:to-emerald-500 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayAgain}
            animate={{
              boxShadow: [
                "0 0 0px #00ff00",
                "0 0 20px #00ff00, 0 0 40px #00ff00",
                "0 0 0px #00ff00"
              ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            PLAY AGAIN
          </motion.button>

          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-mono font-bold rounded-lg border-2 border-gray-400 hover:from-gray-500 hover:to-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReturnToLobby}
          >
            RETURN TO LOBBY
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ArcadeVictoryScreen;
