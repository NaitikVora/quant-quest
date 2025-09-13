import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ArcadeCountdown from './ArcadeCountdown';
import VSBattleArena from './VSBattleArena';
import ArcadeProgressBars from './ArcadeProgressBars';
import DopamineFeedback from './DopamineFeedback';
import ArcadeLivesSystem from './ArcadeLivesSystem';
import ArcadeVictoryScreen from './ArcadeVictoryScreen';
import ArcadeSoundEffects from './ArcadeSoundEffects';
import ArcadeQuestionDisplay from './ArcadeQuestionDisplay';
import { getRandomQuestion, QuantQuestion } from '@/data/quantQuestions';

interface ArcadeBattleProps {
  onReturnToLobby: () => void;
}

const ArcadeBattle: React.FC<ArcadeBattleProps> = ({ onReturnToLobby }) => {
  // Game state
  const [gamePhase, setGamePhase] = useState<'countdown' | 'battle' | 'victory'>('countdown');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [soundTrigger, setSoundTrigger] = useState<'countdown' | 'score' | 'combo' | 'critical' | 'block' | 'miss' | 'victory' | 'defeat' | null>(null);
  
  // Question state
  const [currentQuestion, setCurrentQuestion] = useState<QuantQuestion | null>(null);
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(30);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [questionTimer, setQuestionTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Player state
  const [playerScore, setPlayerScore] = useState(0);
  const [playerProgress, setPlayerProgress] = useState(0);
  const [playerLives, setPlayerLives] = useState(3);
  const [playerEnergy, setPlayerEnergy] = useState(100);
  
  // Opponent state (simulated)
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  
  // Feedback state
  const [feedbackTrigger, setFeedbackTrigger] = useState<'score' | 'combo' | 'critical' | 'block' | 'miss' | null>(null);
  const [comboCount, setComboCount] = useState(0);
  const [lastScoreTime, setLastScoreTime] = useState(0);
  
  // Victory state
  const [isVictory, setIsVictory] = useState(false);
  const [ratingChange, setRatingChange] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);

  // Simulate opponent progress
  useEffect(() => {
    if (gamePhase === 'battle') {
      const interval = setInterval(() => {
        setOpponentProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 2, 100);
          if (newProgress >= 100) {
            setGamePhase('victory');
            setIsVictory(false);
            setRatingChange(-25);
            setBadges(['Close Call']);
          }
          return newProgress;
        });
        
        setOpponentScore(prev => prev + Math.random() * 10);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gamePhase]);

  // Handle player actions
  const handlePlayerAction = useCallback((actionType: 'correct' | 'incorrect') => {
    if (gamePhase !== 'battle') return;

    const now = Date.now();
    const timeSinceLastScore = now - lastScoreTime;
    
    if (actionType === 'correct') {
      // Increase score and progress
      const scoreIncrease = 10 + Math.random() * 20;
      setPlayerScore(prev => prev + scoreIncrease);
      setPlayerProgress(prev => Math.min(prev + 5 + Math.random() * 5, 100));
      
      // Handle combo
      if (timeSinceLastScore < 2000) {
        setComboCount(prev => prev + 1);
        setFeedbackTrigger('combo');
        setSoundTrigger('combo');
      } else {
        setComboCount(1);
        setFeedbackTrigger('score');
        setSoundTrigger('score');
      }
      
      setLastScoreTime(now);
      
      // Check for critical win
      if (Math.random() < 0.1) {
        setFeedbackTrigger('critical');
        setSoundTrigger('critical');
        setPlayerScore(prev => prev + 50);
        setPlayerProgress(prev => Math.min(prev + 15, 100));
      }
      
      // Restore energy
      setPlayerEnergy(prev => Math.min(prev + 10, 100));
      
    } else {
      // Handle incorrect action
      setFeedbackTrigger('miss');
      setSoundTrigger('miss');
      setComboCount(0);
      setPlayerLives(prev => Math.max(prev - 1, 0));
      setPlayerEnergy(prev => Math.max(prev - 20, 0));
    }
  }, [gamePhase, lastScoreTime]);

  // Check for victory/defeat
  useEffect(() => {
    if (playerProgress >= 100 && gamePhase === 'battle') {
      setGamePhase('victory');
      setIsVictory(true);
      setRatingChange(25);
      setBadges(['First Win', 'Speed Demon', 'Combo Master']);
      setSoundTrigger('victory');
    } else if (playerLives <= 0 && gamePhase === 'battle') {
      setGamePhase('victory');
      setIsVictory(false);
      setRatingChange(-25);
      setBadges(['Close Call']);
      setSoundTrigger('defeat');
    }
  }, [playerProgress, playerLives, gamePhase]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (questionTimer) {
        clearInterval(questionTimer);
      }
    };
  }, [questionTimer]);

  const handleCountdownComplete = () => {
    setGamePhase('battle');
    setIsAnimating(true);
    setSoundTrigger('countdown');
    startNewQuestion();
  };

  const startNewQuestion = () => {
    const question = getRandomQuestion();
    setCurrentQuestion(question);
    setQuestionTimeRemaining(30);
    setIsQuestionAnswered(false);
    
    // Clear existing timer
    if (questionTimer) {
      clearInterval(questionTimer);
    }
    
    // Start new timer
    const timer = setInterval(() => {
      setQuestionTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - treat as wrong answer
          handleQuestionAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setQuestionTimer(timer);
  };

  const handleQuestionAnswer = (selectedOption: number) => {
    if (isQuestionAnswered || !currentQuestion) return;
    
    setIsQuestionAnswered(true);
    
    // Clear timer
    if (questionTimer) {
      clearInterval(questionTimer);
      setQuestionTimer(null);
    }
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      handlePlayerAction('correct');
    } else {
      handlePlayerAction('incorrect');
    }
    
    // Show explanation for 3 seconds, then start new question
    setTimeout(() => {
      if (gamePhase === 'battle') {
        startNewQuestion();
      }
    }, 3000);
  };

  const handleFeedbackComplete = () => {
    setFeedbackTrigger(null);
    setSoundTrigger(null);
  };

  const handlePlayAgain = () => {
    setGamePhase('countdown');
    setPlayerScore(0);
    setPlayerProgress(0);
    setPlayerLives(3);
    setPlayerEnergy(100);
    setOpponentScore(0);
    setOpponentProgress(0);
    setComboCount(0);
    setIsVictory(false);
    setRatingChange(0);
    setBadges([]);
    
    // Reset question state
    setCurrentQuestion(null);
    setQuestionTimeRemaining(30);
    setIsQuestionAnswered(false);
    if (questionTimer) {
      clearInterval(questionTimer);
      setQuestionTimer(null);
    }
  };

  const handleGameOver = () => {
    handlePlayAgain();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 p-2 overflow-hidden">
      {/* Countdown Phase */}
      <ArcadeCountdown
        isVisible={gamePhase === 'countdown'}
        onComplete={handleCountdownComplete}
      />

      {/* Battle Phase */}
      {gamePhase === 'battle' && (
        <div className="space-y-4">
          {/* VS Battle Arena */}
          <VSBattleArena
            player={{
              id: 'player',
              name: 'YOU',
              avatar: '👤',
              score: Math.round(playerScore),
              isPlayer: true
            }}
            opponent={{
              id: 'opponent',
              name: 'QUANT_BOT_3000',
              avatar: '🤖',
              score: Math.round(opponentScore),
              isPlayer: false
            }}
            isAnimating={isAnimating}
          />

          {/* Question Display */}
          {currentQuestion && (
            <ArcadeQuestionDisplay
              question={currentQuestion}
              onAnswer={handleQuestionAnswer}
              timeRemaining={questionTimeRemaining}
              isAnswered={isQuestionAnswered}
            />
          )}

          {/* Progress Bars */}
          <ArcadeProgressBars
            playerProgress={playerProgress}
            opponentProgress={opponentProgress}
            playerScore={Math.round(playerScore)}
            opponentScore={Math.round(opponentScore)}
            isAnimating={isAnimating}
          />

          {/* Lives System */}
          <ArcadeLivesSystem
            lives={playerLives}
            maxLives={3}
            energy={playerEnergy}
            maxEnergy={100}
            isGameOver={playerLives <= 0}
            onGameOver={handleGameOver}
          />
        </div>
      )}

      {/* Victory Screen */}
      <ArcadeVictoryScreen
        isVisible={gamePhase === 'victory'}
        isVictory={isVictory}
        playerScore={Math.round(playerScore)}
        opponentScore={Math.round(opponentScore)}
        ratingChange={ratingChange}
        badges={badges}
        onPlayAgain={handlePlayAgain}
        onReturnToLobby={onReturnToLobby}
      />

      {/* Dopamine Feedback */}
      <DopamineFeedback
        trigger={feedbackTrigger}
        score={Math.round(playerScore)}
        comboCount={comboCount}
        onComplete={handleFeedbackComplete}
      />


      {/* Sound Effects */}
      <ArcadeSoundEffects
        trigger={soundTrigger}
        isMuted={isMuted}
      />

      {/* Mute Button */}
      <div className="fixed top-4 right-4 z-40">
        <motion.button
          className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-lg text-white font-mono text-sm hover:bg-gray-700/50 transition-colors"
          onClick={() => setIsMuted(!isMuted)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMuted ? '🔇 SOUND OFF' : '🔊 SOUND ON'}
        </motion.button>
      </div>
    </div>
  );
};

export default ArcadeBattle;
