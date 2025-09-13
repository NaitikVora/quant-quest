import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArcadeCountdownProps {
  onComplete: () => void;
  isVisible: boolean;
}

const ArcadeCountdown: React.FC<ArcadeCountdownProps> = ({ onComplete, isVisible }) => {
  const [count, setCount] = useState(3);
  const [showGo, setShowGo] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          setShowGo(true);
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 1000);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <AnimatePresence mode="wait">
        {!showGo ? (
          <motion.div
            key={count}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: [0, 1, 1],
              rotate: [0, 5, -5, 0]
            }}
            exit={{ 
              scale: 0,
              opacity: 0,
              rotate: 0
            }}
            transition={{ 
              duration: 0.6,
              ease: "easeOut"
            }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                textShadow: [
                  "0 0 0px #00ff00",
                  "0 0 20px #00ff00, 0 0 40px #00ff00",
                  "0 0 0px #00ff00"
                ]
              }}
              transition={{ 
                duration: 0.3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-9xl font-bold text-green-400 font-mono"
              style={{
                fontFamily: 'Courier New, monospace',
                textShadow: '0 0 20px #00ff00, 0 0 40px #00ff00',
                filter: 'drop-shadow(0 0 10px #00ff00)'
              }}
            >
              {count}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="go"
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ 
              scale: [0, 1.5, 1],
              opacity: [0, 1, 1],
              rotate: [180, 0],
              textShadow: [
                "0 0 0px #ff0000",
                "0 0 30px #ff0000, 0 0 60px #ff0000",
                "0 0 0px #ff0000"
              ]
            }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut"
            }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                textShadow: [
                  "0 0 0px #ff0000",
                  "0 0 30px #ff0000, 0 0 60px #ff0000",
                  "0 0 0px #ff0000"
                ]
              }}
              transition={{ 
                duration: 0.2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-9xl font-bold text-red-400 font-mono"
              style={{
                fontFamily: 'Courier New, monospace',
                textShadow: '0 0 30px #ff0000, 0 0 60px #ff0000',
                filter: 'drop-shadow(0 0 15px #ff0000)'
              }}
            >
              GO!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Screen shake effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          x: [0, -2, 2, -1, 1, 0],
          y: [0, -1, 1, -2, 2, 0]
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </div>
  );
};

export default ArcadeCountdown;
