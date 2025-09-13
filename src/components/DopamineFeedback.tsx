import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DopamineFeedbackProps {
  trigger: 'score' | 'combo' | 'critical' | 'block' | 'miss' | null;
  score?: number;
  comboCount?: number;
  onComplete?: () => void;
}

const DopamineFeedback: React.FC<DopamineFeedbackProps> = ({ 
  trigger, 
  score = 0, 
  comboCount = 0,
  onComplete 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!trigger || !isVisible) return null;

  const getFeedbackConfig = () => {
    switch (trigger) {
      case 'score':
        return {
          text: `+${score}`,
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-400',
          emoji: '💰',
          animation: 'bounce'
        };
      case 'combo':
        return {
          text: `COMBO x${comboCount}!`,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-400',
          emoji: '🔥',
          animation: 'pulse'
        };
      case 'critical':
        return {
          text: 'CRITICAL WIN!',
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/20',
          borderColor: 'border-purple-400',
          emoji: '⚡',
          animation: 'shake'
        };
      case 'block':
        return {
          text: 'BLOCK!',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-400',
          emoji: '🛡️',
          animation: 'bounce'
        };
      case 'miss':
        return {
          text: 'MISSED!',
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-400',
          emoji: '👻',
          animation: 'shake'
        };
      default:
        return null;
    }
  };

  const config = getFeedbackConfig();
  if (!config) return null;

  const getAnimationVariants = () => {
    switch (config.animation) {
      case 'bounce':
        return {
          initial: { scale: 0, opacity: 0, y: 50 },
          animate: { 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1],
            y: [50, -20, 0]
          },
          exit: { scale: 0, opacity: 0, y: -50 }
        };
      case 'pulse':
        return {
          initial: { scale: 0, opacity: 0 },
          animate: { 
            scale: [0, 1.5, 1, 1.2, 1],
            opacity: [0, 1, 1, 1, 1]
          },
          exit: { scale: 0, opacity: 0 }
        };
      case 'shake':
        return {
          initial: { scale: 0, opacity: 0, x: 0 },
          animate: { 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1],
            x: [0, -10, 10, -5, 5, 0]
          },
          exit: { scale: 0, opacity: 0 }
        };
      default:
        return {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0, opacity: 0 }
        };
    }
  };

  const animationVariants = getAnimationVariants();

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <AnimatePresence>
        <motion.div
          key={trigger}
          initial={animationVariants.initial}
          animate={animationVariants.animate}
          exit={animationVariants.exit}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          {/* Main feedback bubble */}
          <motion.div
            className={`px-8 py-4 rounded-2xl border-2 ${config.bgColor} ${config.borderColor} backdrop-blur-sm`}
            animate={{
              boxShadow: [
                "0 0 0px currentColor",
                "0 0 30px currentColor, 0 0 60px currentColor",
                "0 0 0px currentColor"
              ]
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <div className="flex items-center space-x-3">
              <motion.span
                className="text-3xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {config.emoji}
              </motion.span>
              <span className={`text-2xl font-mono font-bold ${config.color}`}>
                {config.text}
              </span>
            </div>
          </motion.div>

          {/* Confetti particles */}
          {trigger === 'score' && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    scale: 0,
                    rotate: 0
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 400,
                    y: (Math.random() - 0.5) * 400,
                    scale: [0, 1, 0],
                    rotate: 360
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          )}

          {/* Score burst effect */}
          {trigger === 'score' && (
            <motion.div
              className="absolute -top-4 -right-4 text-4xl"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 1.5, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              ✨
            </motion.div>
          )}

          {/* Combo streak effect */}
          {trigger === 'combo' && (
            <motion.div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="text-6xl">🔥</div>
            </motion.div>
          )}

          {/* Critical win lightning */}
          {trigger === 'critical' && (
            <motion.div
              className="absolute -top-6 -left-6 text-5xl"
              animate={{ 
                scale: [1, 1.5, 1],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              ⚡
            </motion.div>
          )}

          {/* Miss ghost effect */}
          {trigger === 'miss' && (
            <motion.div
              className="absolute -top-4 -right-4 text-4xl"
              animate={{ 
                x: [0, 20, -20, 0],
                opacity: [1, 0.5, 1]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              👻
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DopamineFeedback;
