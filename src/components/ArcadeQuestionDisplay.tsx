import React from 'react';
import { motion } from 'framer-motion';
import { QuantQuestion } from '@/data/quantQuestions';

interface ArcadeQuestionDisplayProps {
  question: QuantQuestion;
  onAnswer: (selectedOption: number) => void;
  timeRemaining: number;
  isAnswered: boolean;
}

const ArcadeQuestionDisplay: React.FC<ArcadeQuestionDisplayProps> = ({
  question,
  onAnswer,
  timeRemaining,
  isAnswered
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 border-green-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-400';
      case 'hard': return 'bg-red-500/20 border-red-400';
      default: return 'bg-gray-500/20 border-gray-400';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Question Header */}
      <div className="flex justify-between items-center">
        <motion.div
          className="inline-block"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`inline-block px-3 py-1 rounded-lg border-2 ${getDifficultyBg(question.difficulty)}`}>
            <span className={`text-xs font-mono font-bold ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty.toUpperCase()} • {question.category}
            </span>
          </div>
        </motion.div>

        {/* Timer */}
        <motion.div
          className="text-xl font-mono font-bold text-cyan-400"
          animate={{
            scale: timeRemaining <= 5 ? [1, 1.2, 1] : 1,
            color: timeRemaining <= 5 ? '#ff0000' : '#22d3ee'
          }}
          transition={{ duration: 0.3, repeat: timeRemaining <= 5 ? Infinity : 0 }}
        >
          ⏱️ {timeRemaining}s
        </motion.div>
      </div>

      {/* Question */}
      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg p-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-lg font-mono font-bold text-white mb-4 leading-relaxed">
          {question.question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              className={`p-3 text-left rounded-lg border-2 transition-all duration-200 font-mono text-sm ${
                isAnswered
                  ? index === question.correctAnswer
                    ? 'bg-green-500/20 border-green-400 text-green-300'
                    : 'bg-red-500/20 border-red-400 text-red-300 opacity-50'
                  : 'bg-gray-700/50 border-gray-500 text-gray-200 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-cyan-300'
              }`}
              onClick={() => !isAnswered && onAnswer(index)}
              disabled={isAnswered}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isAnswered
                    ? index === question.correctAnswer
                      ? 'bg-green-500 border-green-400'
                      : 'bg-red-500 border-red-400'
                    : 'border-gray-400'
                }`}>
                  {isAnswered && index === question.correctAnswer && (
                    <span className="text-white text-xs">✓</span>
                  )}
                  {isAnswered && index !== question.correctAnswer && (
                    <span className="text-white text-xs">✗</span>
                  )}
                </div>
                <span className="font-bold text-sm">{String.fromCharCode(65 + index)}.</span>
                <span className="text-xs">{option}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Explanation (shown after answer) */}
      {isAnswered && (
        <motion.div
          className="bg-blue-500/20 border-2 border-blue-400 rounded-lg p-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h3 className="text-sm font-mono font-bold text-blue-400 mb-1">💡 Explanation:</h3>
          <p className="text-blue-300 font-mono text-xs">{question.explanation}</p>
        </motion.div>
      )}
    </div>
  );
};

export default ArcadeQuestionDisplay;
