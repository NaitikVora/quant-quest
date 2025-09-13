import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SkillTutorialModalProps {
  skill: {
    id: number;
    name: string;
    code: string;
    description: string;
    benefits: string[];
  };
  onComplete: (auraPoints: number) => void;
  onClose: () => void;
}

interface TutorialStep {
  id: number;
  title: string;
  content: string;
  type: 'text' | 'graph' | 'interactive' | 'quiz';
  data?: any;
}

const SkillTutorialModal: React.FC<SkillTutorialModalProps> = ({ skill, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [auraPoints, setAuraPoints] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [isAnimatingPoints, setIsAnimatingPoints] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sound effects for points
  const playPointSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Upward ascending tone for points
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const playCompletionSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Victory chord
    oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // Generate skill-specific tutorial content
  const generateTutorialSteps = (): TutorialStep[] => {
    const baseSteps: TutorialStep[] = [
      {
        id: 1,
        title: "Introduction",
        content: `Welcome to ${skill.name}! This tutorial will guide you through the fundamental concepts and practical applications.`,
        type: 'text'
      }
    ];

    // Add skill-specific content
    switch (skill.code) {
      case 'STAT':
        return [
          ...baseSteps,
          {
            id: 2,
            title: "Normal Distribution",
            content: "The normal distribution is fundamental in quantitative finance. It describes how data points are distributed around a mean value. In trading, returns often follow a normal distribution, making it crucial for risk management.",
            type: 'graph',
            data: { type: 'normal_distribution' }
          },
          {
            id: 3,
            title: "Hypothesis Testing",
            content: "Learn how to test statistical hypotheses in financial data analysis. This helps determine if trading strategies are statistically significant.",
            type: 'interactive'
          },
          {
            id: 4,
            title: "Confidence Intervals",
            content: "Understanding confidence intervals helps quantify uncertainty in financial predictions. A 95% confidence interval means we're 95% confident the true value lies within the range.",
            type: 'text'
          },
          {
            id: 5,
            title: "Knowledge Check",
            content: "Test your understanding of statistical concepts.",
            type: 'quiz',
            data: {
              questions: [
                {
                  question: "What does a 95% confidence interval mean?",
                  options: ["95% of data falls within the interval", "We're 95% confident the true parameter is in the interval", "The interval is 95% accurate", "95% of samples will be correct"],
                  correct: 1
                },
                {
                  question: "In hypothesis testing, what is the p-value?",
                  options: ["The probability of the null hypothesis", "The probability of observing the data given the null hypothesis", "The significance level", "The test statistic"],
                  correct: 1
                }
              ]
            }
          }
        ];

      case 'MATH':
        return [
          ...baseSteps,
          {
            id: 2,
            title: "Calculus in Finance",
            content: "Derivatives and integrals are essential for understanding option pricing and risk management. The Black-Scholes formula relies heavily on calculus concepts.",
            type: 'graph',
            data: { type: 'derivative_function' }
          },
          {
            id: 3,
            title: "Linear Algebra",
            content: "Matrix operations are crucial for portfolio optimization and factor models. Understanding eigenvectors helps in principal component analysis.",
            type: 'interactive'
          },
          {
            id: 4,
            title: "Stochastic Calculus",
            content: "Brownian motion and Ito's lemma form the foundation of modern quantitative finance. These concepts are essential for modeling asset price movements.",
            type: 'text'
          },
          {
            id: 5,
            title: "Knowledge Check",
            content: "Test your mathematical finance knowledge.",
            type: 'quiz',
            data: {
              questions: [
                {
                  question: "What is the Black-Scholes formula used for?",
                  options: ["Portfolio optimization", "Option pricing", "Risk management", "Market timing"],
                  correct: 1
                },
                {
                  question: "What does Ito's lemma describe?",
                  options: ["Portfolio returns", "The change in a function of a stochastic process", "Market volatility", "Interest rates"],
                  correct: 1
                }
              ]
            }
          }
        ];

      case 'PROG':
        return [
          ...baseSteps,
          {
            id: 2,
            title: "Python for Finance",
            content: "Learn essential Python libraries for quantitative analysis: NumPy for numerical computing, Pandas for data manipulation, and Matplotlib for visualization.",
            type: 'interactive'
          },
          {
            id: 3,
            title: "Data Structures",
            content: "Efficient data structures are crucial for handling large financial datasets. Understanding time complexity helps optimize trading algorithms.",
            type: 'text'
          },
          {
            id: 4,
            title: "Algorithm Design",
            content: "Design efficient algorithms for backtesting and strategy implementation. Proper algorithm design can make the difference between profitable and unprofitable strategies.",
            type: 'graph',
            data: { type: 'algorithm_complexity' }
          },
          {
            id: 5,
            title: "Knowledge Check",
            content: "Test your programming knowledge.",
            type: 'quiz',
            data: {
              questions: [
                {
                  question: "Which Python library is best for time series analysis?",
                  options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
                  correct: 1
                },
                {
                  question: "What is the time complexity of a binary search?",
                  options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
                  correct: 1
                }
              ]
            }
          }
        ];

      case 'RISK':
        return [
          ...baseSteps,
          {
            id: 2,
            title: "Value at Risk (VaR)",
            content: "VaR measures the maximum potential loss over a specific time period with a given confidence level. It's a cornerstone of risk management in finance.",
            type: 'graph',
            data: { type: 'var_calculation' }
          },
          {
            id: 3,
            title: "Portfolio Risk",
            content: "Understand how to calculate and manage portfolio-level risk metrics. Diversification is key to reducing overall portfolio risk.",
            type: 'interactive'
          },
          {
            id: 4,
            title: "Risk Controls",
            content: "Implement effective risk controls and monitoring systems. Stop-losses, position sizing, and correlation analysis are essential tools.",
            type: 'text'
          },
          {
            id: 5,
            title: "Knowledge Check",
            content: "Test your risk management knowledge.",
            type: 'quiz',
            data: {
              questions: [
                {
                  question: "What does VaR 95% mean?",
                  options: ["95% chance of profit", "5% chance of exceeding the loss", "95% of returns are positive", "Maximum 95% loss"],
                  correct: 1
                },
                {
                  question: "What is portfolio diversification?",
                  options: ["Investing in one asset", "Spreading investments across different assets", "High-risk investments", "Short-term trading"],
                  correct: 1
                }
              ]
            }
          }
        ];

      default:
        return [
          ...baseSteps,
          {
            id: 2,
            title: "Core Concepts",
            content: `Learn the fundamental concepts of ${skill.name}. This skill is essential for quantitative finance and will help you make better trading decisions.`,
            type: 'text'
          },
          {
            id: 3,
            title: "Practical Applications",
            content: `Apply ${skill.name} concepts in real-world scenarios. Understanding theory is important, but practical application is what makes the difference.`,
            type: 'interactive'
          },
          {
            id: 4,
            title: "Knowledge Check",
            content: "Test your understanding of the concepts covered.",
            type: 'quiz',
            data: {
              questions: [
                {
                  question: "What is the main benefit of this skill?",
                  options: ["Higher returns", "Better risk management", "Faster execution", "All of the above"],
                  correct: 3
                }
              ]
            }
          }
        ];
    }
  };

  const tutorialSteps = generateTutorialSteps();

  // Draw interactive graphs
  const drawGraph = (type: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    switch (type) {
      case 'normal_distribution':
        // Draw normal distribution curve
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = 0; x < width; x++) {
          const normalizedX = (x - width / 2) / (width / 6);
          const y = height / 2 - Math.exp(-normalizedX * normalizedX / 2) * (height / 3);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Add labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px monospace';
        ctx.fillText('Mean', width / 2 - 20, height - 10);
        ctx.fillText('Standard Deviation', width / 2 + 50, height - 10);
        break;
        
      case 'derivative_function':
        // Draw derivative function
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = 0; x < width; x++) {
          const normalizedX = (x - width / 2) / (width / 4);
          const y = height / 2 - Math.sin(normalizedX) * (height / 4);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        break;
        
      case 'var_calculation':
        // Draw VaR visualization
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(width * 0.1, height * 0.3, width * 0.05, height * 0.4);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(width * 0.2, height * 0.2, width * 0.6, height * 0.6);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.fillText('VaR 95%', width * 0.1, height * 0.25);
        ctx.fillText('95% of returns', width * 0.25, height * 0.15);
        break;
    }
  };

  // Handle step completion with sound
  const completeStep = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
      const pointsEarned = 10;
      setAuraPoints(auraPoints + pointsEarned);
      playPointSound();
      setIsAnimatingPoints(true);
      setTimeout(() => setIsAnimatingPoints(false), 1000);
    }
  };

  // Handle quiz submission
  const handleQuizSubmit = (stepId: number) => {
    const step = tutorialSteps.find(s => s.id === stepId);
    if (!step || step.type !== 'quiz') return;
    
    const questions = step.data?.questions || [];
    let correctAnswers = 0;
    
    questions.forEach((question: any, index: number) => {
      if (quizAnswers[stepId + index] === question.options[question.correct]) {
        correctAnswers++;
      }
    });
    
    const score = (correctAnswers / questions.length) * 100;
    if (score >= 70) {
      completeStep(stepId);
      const bonusPoints = 20;
      setAuraPoints(auraPoints + bonusPoints);
      playPointSound();
      setIsAnimatingPoints(true);
      setTimeout(() => setIsAnimatingPoints(false), 1000);
    }
    
    return score;
  };

  // Handle tutorial completion
  const handleComplete = () => {
    setShowCompletion(true);
    playCompletionSound();
    setTimeout(() => {
      onComplete(auraPoints);
    }, 2000);
  };

  // Draw graph when step changes
  useEffect(() => {
    const currentStepData = tutorialSteps[currentStep];
    if (currentStepData?.type === 'graph') {
      drawGraph(currentStepData.data?.type);
    }
  }, [currentStep]);

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl h-full sm:h-auto max-h-screen sm:max-h-[90vh] flex flex-col"
      >
        <Card className="card-terminal h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div>
              <h2 className="text-xl font-mono font-bold text-primary">{skill.name}</h2>
              <p className="text-sm text-muted-foreground font-mono">{skill.code} • Tutorial</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Aura Points</div>
                <div className={`text-lg font-mono font-bold text-accent transition-all duration-500 ${
                  isAnimatingPoints ? 'scale-110 text-success' : ''
                }`}>
                  {auraPoints}
                </div>
              </div>
              <Button variant="outline" onClick={onClose} className="rounded-none">
                ✕
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="px-6 py-4 border-b border-border/50">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Tutorial Content */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    Step {currentStep + 1} of {tutorialSteps.length}
                  </Badge>
                  <h3 className="text-lg font-mono font-bold text-foreground">
                    {currentStepData.title}
                  </h3>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {currentStepData.content}
                </p>

                {/* Step-specific content */}
                {currentStepData.type === 'graph' && (
                  <div className="my-6">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={300}
                      className="w-full h-64 border border-border/50 rounded"
                    />
                  </div>
                )}

                {currentStepData.type === 'interactive' && (
                  <div className="my-6 p-6 bg-muted/30 rounded-lg">
                    <h4 className="font-mono font-bold text-foreground mb-4">Interactive Exercise</h4>
                    <p className="text-muted-foreground mb-4">
                      Complete this exercise to understand the concept better. You'll earn 10 aura points!
                    </p>
                    <Button 
                      onClick={() => completeStep(currentStepData.id)}
                      className="btn-terminal rounded-none"
                    >
                      Complete Exercise (+10 Points)
                    </Button>
                  </div>
                )}

                {currentStepData.type === 'quiz' && (
                  <div className="my-6">
                    <h4 className="font-mono font-bold text-foreground mb-4">Knowledge Check</h4>
                    <p className="text-muted-foreground mb-4">
                      Answer correctly to earn 20 bonus aura points!
                    </p>
                    {currentStepData.data?.questions?.map((question: any, index: number) => (
                      <div key={index} className="mb-6 p-4 border border-border/50 rounded">
                        <h5 className="font-mono font-semibold text-foreground mb-3">
                          {question.question}
                        </h5>
                        <div className="space-y-2">
                          {question.options.map((option: string, optionIndex: number) => (
                            <label key={optionIndex} className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="radio"
                                name={`question-${currentStepData.id}-${index}`}
                                value={option}
                                onChange={(e) => setQuizAnswers({
                                  ...quizAnswers,
                                  [currentStepData.id + index]: e.target.value
                                })}
                                className="text-primary"
                              />
                              <span className="text-muted-foreground">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button 
                      onClick={() => handleQuizSubmit(currentStepData.id)}
                      className="btn-terminal rounded-none"
                    >
                      Submit Answers (+20 Points)
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center p-6 border-t border-border/50">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="rounded-none"
            >
              ← Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {completedSteps.includes(currentStepData.id) && (
                <Badge className="bg-success">✓ Completed</Badge>
              )}
            </div>
            
            {currentStep < tutorialSteps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="btn-terminal rounded-none"
              >
                Next →
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="btn-terminal rounded-none"
              >
                Complete Tutorial
              </Button>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Completion Animation */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-60 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-mono font-bold text-primary mb-2">
                Excellent Work!
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                You've completed the {skill.name} tutorial!
              </p>
              <div className="text-2xl font-mono font-bold text-accent mb-4">
                +{auraPoints} Aura Points Earned!
              </div>
              <p className="text-sm text-muted-foreground">
                Your knowledge has been enhanced. Keep learning to unlock more skills!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillTutorialModal;
