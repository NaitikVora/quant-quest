import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import PacManProgressBar from "./PacManProgressBar";
import ArcadeSoundManager from "./ArcadeSoundManager";

interface QuantAlgorithmCompetitionProps {
  onBack: () => void;
}

interface Dataset {
  id: string;
  name: string;
  symbol: string;
  period: string;
  volatility: number;
  trend: 'bullish' | 'bearish' | 'sideways';
  majorEvents: string[];
  previewData: number[];
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  parameters: {
    maShort: number;
    maLong: number;
    stopLoss: number;
    takeProfit: number;
    positionSize: number;
  };
}

interface BattleResult {
  player1Score: number;
  player2Score: number;
  winner: 'player1' | 'player2' | 'tie';
  metrics: {
    player1: {
      returns: number;
      sharpe: number;
      drawdown: number;
      winRate: number;
    };
    player2: {
      returns: number;
      sharpe: number;
      drawdown: number;
      winRate: number;
    };
  };
}

const QuantAlgorithmCompetition: React.FC<QuantAlgorithmCompetitionProps> = ({ onBack }) => {
  const [currentPhase, setCurrentPhase] = useState<'dataset' | 'configuration' | 'battle' | 'results'>('dataset');
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [player1Strategy, setPlayer1Strategy] = useState<Strategy>({
    id: 'ma_crossover',
    name: 'Moving Average Crossover',
    description: 'Buy when short MA crosses above long MA',
    parameters: { maShort: 20, maLong: 50, stopLoss: 5, takeProfit: 10, positionSize: 25 }
  });
  const [player2Strategy, setPlayer2Strategy] = useState<Strategy>({
    id: 'mean_reversion',
    name: 'Mean Reversion',
    description: 'Buy when price deviates from mean',
    parameters: { maShort: 10, maLong: 30, stopLoss: 3, takeProfit: 8, positionSize: 20 }
  });
  const [battleResults, setBattleResults] = useState<BattleResult | null>(null);
  const [countdown, setCountdown] = useState(90);
  const [isBattleRunning, setIsBattleRunning] = useState(false);
  const [battleProgress, setBattleProgress] = useState(0);
  const [player1Progress, setPlayer1Progress] = useState(0);
  const [player2Progress, setPlayer2Progress] = useState(0);
  const [showOvertake, setShowOvertake] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [finalPlayer1Progress, setFinalPlayer1Progress] = useState(0);
  const [finalPlayer2Progress, setFinalPlayer2Progress] = useState(0);
  const [soundTrigger, setSoundTrigger] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const battleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sound helper function
  const playSound = (soundType: string) => {
    if (!isMuted) {
      setSoundTrigger(soundType);
    }
  };

  // Available datasets
  const datasets: Dataset[] = [
    {
      id: 'spy_2023',
      name: 'SPY 2023',
      symbol: 'SPY',
      period: 'Jan-Dec 2023',
      volatility: 18.5,
      trend: 'bullish',
      majorEvents: ['Banking Crisis', 'AI Boom', 'Fed Rate Hikes'],
      previewData: [100, 102, 98, 105, 108, 110, 107, 112, 115, 118, 120, 125]
    },
    {
      id: 'btc_2022',
      name: 'Bitcoin 2022',
      symbol: 'BTC',
      period: 'Jan-Dec 2022',
      volatility: 65.2,
      trend: 'bearish',
      majorEvents: ['Crypto Winter', 'FTX Collapse', 'Regulatory Crackdown'],
      previewData: [100, 95, 88, 82, 75, 70, 65, 60, 55, 50, 45, 40]
    },
    {
      id: 'vix_2020',
      name: 'VIX 2020',
      symbol: 'VIX',
      period: 'Mar-Oct 2020',
      volatility: 89.7,
      trend: 'sideways',
      majorEvents: ['COVID Crash', 'Market Recovery', 'Volatility Spike'],
      previewData: [100, 150, 200, 180, 120, 100, 80, 90, 110, 95, 85, 100]
    }
  ];

  // Available strategies
  const strategies = [
    { id: 'ma_crossover', name: 'MA Crossover', description: 'Moving Average Crossover' },
    { id: 'mean_reversion', name: 'Mean Reversion', description: 'Mean Reversion Strategy' },
    { id: 'momentum', name: 'Momentum', description: 'Momentum Trading' },
    { id: 'pairs_trading', name: 'Pairs Trading', description: 'Pairs Trading Strategy' }
  ];

  // Sound effects
  const playSound = (type: 'select' | 'overtake' | 'achievement' | 'victory' | 'defeat') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'select':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.type = 'square';
        break;
      case 'overtake':
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
        oscillator.type = 'sawtooth';
        break;
      case 'achievement':
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
        oscillator.type = 'sine';
        break;
      case 'victory':
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.4);
        oscillator.frequency.setValueAtTime(1047, audioContext.currentTime + 0.6);
        oscillator.type = 'sine';
        break;
      case 'defeat':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
        oscillator.type = 'sawtooth';
        break;
    }
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // Draw dataset preview chart
  const drawChart = (data: number[], canvas: HTMLCanvasElement, color: string) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw price line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    
    data.forEach((value, index) => {
      const x = (width / (data.length - 1)) * index;
      const y = height - ((value - min) / range) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  };

  // Handle dataset selection
  const handleDatasetSelect = (dataset: Dataset) => {
    setSelectedDataset(dataset);
    playSound('coin'); // Selection sound
    setTimeout(() => {
      setCurrentPhase('configuration');
    }, 1000);
  };

  // Handle strategy parameter change
  const handleParameterChange = (player: 'player1' | 'player2', param: string, value: number) => {
    if (player === 'player1') {
      setPlayer1Strategy(prev => ({
        ...prev,
        parameters: { ...prev.parameters, [param]: value }
      }));
    } else {
      setPlayer2Strategy(prev => ({
        ...prev,
        parameters: { ...prev.parameters, [param]: value }
      }));
    }
    playSound('coin'); // Parameter adjustment sound
  };

  // Start battle
  const startBattle = () => {
    setCurrentPhase('battle');
    setIsBattleRunning(true);
    setCountdown(90);
    setBattleProgress(0);
    setPlayer1Progress(0);
    setPlayer2Progress(0);
    playSound('go'); // Battle start sound
    
    // Pre-determine the winner and final progress values
    const player1FinalProgress = Math.random() * 40 + 60; // 60-100
    const player2FinalProgress = Math.random() * 40 + 60; // 60-100
    const winner = player1FinalProgress > player2FinalProgress ? 'player1' : 'player2';
    
    setFinalPlayer1Progress(player1FinalProgress);
    setFinalPlayer2Progress(player2FinalProgress);
    
    // Simulate battle progress
    battleIntervalRef.current = setInterval(() => {
      setBattleProgress(prev => {
        if (prev >= 100) {
          setIsBattleRunning(false);
          if (battleIntervalRef.current) {
            clearInterval(battleIntervalRef.current);
          }
          
          // Generate battle results based on final progress
          const results: BattleResult = {
            player1Score: (player1FinalProgress / 100) * 0.4 + 0.6, // 0.6-1.0 based on progress
            player2Score: (player2FinalProgress / 100) * 0.4 + 0.6,
            winner: winner,
            metrics: {
              player1: {
                returns: (player1FinalProgress / 100) * 20 + 5, // 5-25% based on progress
                sharpe: (player1FinalProgress / 100) * 1.5 + 0.5, // 0.5-2.0 based on progress
                drawdown: Math.max(2, 12 - (player1FinalProgress / 100) * 10), // Lower drawdown for higher progress
                winRate: (player1FinalProgress / 100) * 30 + 60 // 60-90% based on progress
              },
              player2: {
                returns: (player2FinalProgress / 100) * 20 + 5,
                sharpe: (player2FinalProgress / 100) * 1.5 + 0.5,
                drawdown: Math.max(2, 12 - (player2FinalProgress / 100) * 10),
                winRate: (player2FinalProgress / 100) * 30 + 60
              }
            }
          };
          
          setBattleResults(results);
          setCurrentPhase('results');
          playSound(results.winner === 'player1' ? 'victory' : 'defeat');
          return 100;
        }
        
        // Simulate overtaking moments
        if (Math.random() < 0.1 && prev > 20) {
          setShowOvertake(true);
          playSound('overtake');
          setTimeout(() => setShowOvertake(false), 2000);
        }
        
        // Simulate achievements
        if (prev === 25 || prev === 50 || prev === 75) {
          const newAchievement = `Milestone ${prev}% reached!`;
          setAchievements(prev => [...prev, newAchievement]);
          playSound('milestone');
        }
        
        // Progress sound for general advancement
        if (prev % 10 === 0 && prev > 0) {
          playSound('progress');
        }
        
        return prev + 1;
      });
      
      // Update player progress towards predetermined final values
      setPlayer1Progress(prev => {
        const target = player1FinalProgress;
        const diff = target - prev;
        const newProgress = Math.min(target, prev + (diff * 0.02) + Math.random() * 0.5);
        
        // Play sound when player 1 makes significant progress
        if (newProgress - prev > 2) {
          playSound('coin');
        }
        
        return newProgress;
      });
      
      setPlayer2Progress(prev => {
        const target = player2FinalProgress;
        const diff = target - prev;
        const newProgress = Math.min(target, prev + (diff * 0.02) + Math.random() * 0.5);
        
        // Play sound when player 2 makes significant progress
        if (newProgress - prev > 2) {
          playSound('coin');
        }
        
        return newProgress;
      });
      
      setCountdown(prev => {
        const newCountdown = Math.max(0, prev - 1);
        
        // Play danger sound when countdown is low
        if (newCountdown === 10 || newCountdown === 5 || newCountdown === 3 || newCountdown === 1) {
          playSound('danger');
        }
        
        return newCountdown;
      });
    }, 100);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (battleIntervalRef.current) {
        clearInterval(battleIntervalRef.current);
      }
    };
  }, []);

  // Draw charts when dataset changes
  useEffect(() => {
    if (selectedDataset && canvasRef.current) {
      const color = selectedDataset.trend === 'bullish' ? '#10b981' : 
                   selectedDataset.trend === 'bearish' ? '#ef4444' : '#f59e0b';
      drawChart(selectedDataset.previewData, canvasRef.current, color);
    }
  }, [selectedDataset]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-purple-900 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-cyan-500/30">
        <div>
          <h1 className="text-2xl font-mono font-bold text-white">QUANT ALGORITHM COMPETITION</h1>
          <p className="text-sm text-cyan-300 font-mono">Phase {currentPhase === 'dataset' ? '1' : currentPhase === 'configuration' ? '2' : currentPhase === 'battle' ? '3' : '4'}: {currentPhase.toUpperCase()}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant="outline"
            className={`rounded-none ${isMuted ? 'border-red-500 text-red-400' : 'border-green-500 text-green-400'}`}
          >
            {isMuted ? '🔇' : '🔊'}
          </Button>
          <Button variant="outline" onClick={onBack} className="rounded-none">
            ← Back to Lobby
          </Button>
        </div>
      </div>

      {/* Phase 1: Dataset Selection */}
      {currentPhase === 'dataset' && (
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-mono font-bold text-white mb-4">SELECT YOUR BATTLEFIELD</h2>
              <p className="text-cyan-300 font-mono">Choose from 3 different market datasets. Each has unique characteristics and challenges.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {datasets.map((dataset) => (
                <motion.div
                  key={dataset.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                  onClick={() => handleDatasetSelect(dataset)}
                >
                  <Card className="bg-gray-800/50 border-cyan-500/30 p-6 hover:border-cyan-400/50 transition-all duration-300">
                    <div className="mb-4">
                      <h3 className="text-xl font-mono font-bold text-white mb-2">{dataset.name}</h3>
                      <p className="text-sm text-cyan-300 font-mono">{dataset.symbol} • {dataset.period}</p>
                    </div>
                    
                    <div className="mb-4">
                      <canvas
                        ref={dataset.id === 'spy_2023' ? canvasRef : undefined}
                        width={300}
                        height={150}
                        className="w-full h-32 border border-gray-600 rounded"
                      />
                    </div>
                    
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Volatility:</span>
                        <span className="text-yellow-400">{dataset.volatility}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Trend:</span>
                        <Badge 
                          variant="outline" 
                          className={`${
                            dataset.trend === 'bullish' ? 'border-green-500 text-green-400' :
                            dataset.trend === 'bearish' ? 'border-red-500 text-red-400' :
                            'border-yellow-500 text-yellow-400'
                          }`}
                        >
                          {dataset.trend.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-300">Major Events:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dataset.majorEvents.map((event, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-gray-500 text-gray-400">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-mono font-bold">
                      SELECT DATASET
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: Algorithm Configuration */}
      {currentPhase === 'configuration' && (
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-mono font-bold text-white mb-4">ALGORITHM CONFIGURATION ARENA</h2>
              <p className="text-cyan-300 font-mono">Configure your trading strategy parameters. You have {countdown} seconds!</p>
              <div className={`mt-4 text-2xl font-mono font-bold ${countdown < 30 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
                {countdown}s
              </div>
            </div>
            
            {/* Dataset Summary Statistics */}
            {selectedDataset && (
              <div className="mb-8">
                <Card className="bg-gray-800/50 border-cyan-500/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-lg font-mono font-bold text-white">{selectedDataset.name}</h3>
                        <p className="text-sm text-cyan-300 font-mono">{selectedDataset.symbol} • {selectedDataset.period}</p>
                      </div>
                      <div className="w-24 h-16 border border-gray-600 rounded">
                        <canvas
                          width={96}
                          height={64}
                          className="w-full h-full"
                          ref={(canvas) => {
                            if (canvas) {
                              const color = selectedDataset.trend === 'bullish' ? '#10b981' : 
                                           selectedDataset.trend === 'bearish' ? '#ef4444' : '#f59e0b';
                              drawChart(selectedDataset.previewData, canvas, color);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <div className="text-2xl font-mono font-bold text-yellow-400">{selectedDataset.volatility}%</div>
                        <div className="text-xs text-gray-300 font-mono">Volatility</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-mono font-bold ${
                          selectedDataset.trend === 'bullish' ? 'text-green-400' :
                          selectedDataset.trend === 'bearish' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {selectedDataset.trend === 'bullish' ? '↗' : selectedDataset.trend === 'bearish' ? '↘' : '→'}
                        </div>
                        <div className="text-xs text-gray-300 font-mono">Trend</div>
                      </div>
                      <div>
                        <div className="text-2xl font-mono font-bold text-blue-400">{selectedDataset.majorEvents.length}</div>
                        <div className="text-xs text-gray-300 font-mono">Events</div>
                      </div>
                      <div>
                        <div className="text-2xl font-mono font-bold text-purple-400">
                          {selectedDataset.trend === 'bullish' ? '+12.5' : selectedDataset.trend === 'bearish' ? '-35.2' : '+2.1'}%
                        </div>
                        <div className="text-xs text-gray-300 font-mono">Return</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Player 1 Configuration */}
              <Card className="bg-gray-800/50 border-cyan-500/30 p-6">
                <h3 className="text-xl font-mono font-bold text-cyan-400 mb-6">PLAYER 1 (YOU)</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-mono text-gray-300 mb-2 block">Strategy</label>
                    <select 
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white font-mono"
                      value={player1Strategy.id}
                      onChange={(e) => {
                        const strategy = strategies.find(s => s.id === e.target.value);
                        if (strategy) {
                          setPlayer1Strategy(prev => ({ ...prev, id: strategy.id, name: strategy.name, description: strategy.description }));
                        }
                      }}
                    >
                      {strategies.map(strategy => (
                        <option key={strategy.id} value={strategy.id}>{strategy.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-mono text-gray-300 mb-2 block">
                      MA Short Period: {player1Strategy.parameters.maShort}
                    </label>
                    <Slider
                      value={[player1Strategy.parameters.maShort]}
                      onValueChange={(value) => handleParameterChange('player1', 'maShort', value[0])}
                      max={200}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-mono text-gray-300 mb-2 block">
                      MA Long Period: {player1Strategy.parameters.maLong}
                    </label>
                    <Slider
                      value={[player1Strategy.parameters.maLong]}
                      onValueChange={(value) => handleParameterChange('player1', 'maLong', value[0])}
                      max={200}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-mono text-gray-300 mb-2 block">
                      Stop Loss: {player1Strategy.parameters.stopLoss}%
                    </label>
                    <Slider
                      value={[player1Strategy.parameters.stopLoss]}
                      onValueChange={(value) => handleParameterChange('player1', 'stopLoss', value[0])}
                      max={10}
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-mono text-gray-300 mb-2 block">
                      Take Profit: {player1Strategy.parameters.takeProfit}%
                    </label>
                    <Slider
                      value={[player1Strategy.parameters.takeProfit]}
                      onValueChange={(value) => handleParameterChange('player1', 'takeProfit', value[0])}
                      max={15}
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-mono text-gray-300 mb-2 block">
                      Position Size: {player1Strategy.parameters.positionSize}%
                    </label>
                    <Slider
                      value={[player1Strategy.parameters.positionSize]}
                      onValueChange={(value) => handleParameterChange('player1', 'positionSize', value[0])}
                      max={50}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              </Card>
              
              {/* Player 2 Configuration */}
              <Card className="bg-gray-800/50 border-purple-500/30 p-6">
                <h3 className="text-xl font-mono font-bold text-purple-400 mb-6">PLAYER 2 (OPPONENT)</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-mono text-gray-300 mb-2 block">Strategy</label>
                    <select 
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white font-mono"
                      value={player2Strategy.id}
                      onChange={(e) => {
                        const strategy = strategies.find(s => s.id === e.target.value);
                        if (strategy) {
                          setPlayer2Strategy(prev => ({ ...prev, id: strategy.id, name: strategy.name, description: strategy.description }));
                        }
                      }}
                    >
                      {strategies.map(strategy => (
                        <option key={strategy.id} value={strategy.id}>{strategy.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-mono text-gray-300 mb-2 block">
                      MA Short Period: {player2Strategy.parameters.maShort}
                    </label>
                    <Slider
                      value={[player2Strategy.parameters.maShort]}
                      onValueChange={(value) => handleParameterChange('player2', 'maShort', value[0])}
                      max={200}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-mono text-gray-300 mb-2 block">
                      MA Long Period: {player2Strategy.parameters.maLong}
                    </label>
                    <Slider
                      value={[player2Strategy.parameters.maLong]}
                      onValueChange={(value) => handleParameterChange('player2', 'maLong', value[0])}
                      max={200}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-mono text-gray-300 mb-2 block">
                      Stop Loss: {player2Strategy.parameters.stopLoss}%
                    </label>
                    <Slider
                      value={[player2Strategy.parameters.stopLoss]}
                      onValueChange={(value) => handleParameterChange('player2', 'stopLoss', value[0])}
                      max={10}
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-mono text-gray-300 mb-2 block">
                      Take Profit: {player2Strategy.parameters.takeProfit}%
                    </label>
                    <Slider
                      value={[player2Strategy.parameters.takeProfit]}
                      onValueChange={(value) => handleParameterChange('player2', 'takeProfit', value[0])}
                      max={15}
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-mono text-gray-300 mb-2 block">
                      Position Size: {player2Strategy.parameters.positionSize}%
                    </label>
                    <Slider
                      value={[player2Strategy.parameters.positionSize]}
                      onValueChange={(value) => handleParameterChange('player2', 'positionSize', value[0])}
                      max={50}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="text-center mt-8">
              <Button 
                onClick={startBattle}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-mono font-bold px-8 py-4 text-lg"
              >
                START ALGORITHM BATTLE
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Phase 3: Live Algorithm Battle */}
      {currentPhase === 'battle' && (
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-mono font-bold text-white mb-4">LIVE ALGORITHM BATTLE</h2>
              <p className="text-cyan-300 font-mono">Watch your algorithms compete in real-time!</p>
            </div>
            
            {/* Overtake Animation */}
            <AnimatePresence>
              {showOvertake && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                >
                  <div className="text-6xl font-mono font-bold text-yellow-400 animate-pulse">
                    OVERTAKE!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Battle Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Player 1 Progress */}
              <Card className="bg-gray-800/50 border-cyan-500/30 p-6">
                <h3 className="text-xl font-mono font-bold text-cyan-400 mb-4">PLAYER 1 (YOU)</h3>
                
                <div className="space-y-4">
                  <PacManProgressBar 
                    progress={player1Progress} 
                    color="text-cyan-400" 
                    playerName="Performance"
                    isActive={isBattleRunning}
                  />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                    <div>
                      <p className="text-gray-300 mb-1">Returns</p>
                      <p className="text-green-400 text-lg font-bold">+{Math.round(player1Progress * 0.8)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-300 mb-1">Sharpe</p>
                      <p className="text-yellow-400 text-lg font-bold">{(player1Progress * 0.015 + 0.5).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 mb-1">Drawdown</p>
                      <p className="text-red-400 text-lg font-bold">-{Math.round(player1Progress * 0.1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-300 mb-1">Win Rate</p>
                      <p className="text-blue-400 text-lg font-bold">{Math.round(60 + player1Progress * 0.3)}%</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Player 2 Progress */}
              <Card className="bg-gray-800/50 border-purple-500/30 p-6">
                <h3 className="text-xl font-mono font-bold text-purple-400 mb-4">PLAYER 2 (OPPONENT)</h3>
                
                <div className="space-y-4">
                  <PacManProgressBar 
                    progress={player2Progress} 
                    color="text-purple-400" 
                    playerName="Performance"
                    isActive={isBattleRunning}
                  />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                    <div>
                      <p className="text-gray-300 mb-1">Returns</p>
                      <p className="text-green-400 text-lg font-bold">+{Math.round(player2Progress * 0.8)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-300 mb-1">Sharpe</p>
                      <p className="text-yellow-400 text-lg font-bold">{(player2Progress * 0.015 + 0.5).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 mb-1">Drawdown</p>
                      <p className="text-red-400 text-lg font-bold">-{Math.round(player2Progress * 0.1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-300 mb-1">Win Rate</p>
                      <p className="text-blue-400 text-lg font-bold">{Math.round(60 + player2Progress * 0.3)}%</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Achievements */}
            {achievements.length > 0 && (
              <Card className="bg-gray-800/50 border-yellow-500/30 p-4 mb-6">
                <h3 className="text-lg font-mono font-bold text-yellow-400 mb-2">ACHIEVEMENTS UNLOCKED</h3>
                <div className="flex flex-wrap gap-2">
                  {achievements.map((achievement, index) => (
                    <Badge key={index} className="bg-yellow-600 text-white">
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
            
            {/* Battle Progress Bar */}
            <div className="text-center">
              <div className="flex justify-between text-sm font-mono text-gray-300 mb-2">
                <span>Battle Progress</span>
                <span>{battleProgress}%</span>
              </div>
              <Progress value={battleProgress} className="h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Phase 4: Results */}
      {currentPhase === 'results' && battleResults && (
        <div className="p-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h2 className="text-4xl font-mono font-bold text-white mb-4">
                  {battleResults.winner === 'player1' ? 'VICTORY!' : 'DEFEAT!'}
                </h2>
                <p className="text-cyan-300 font-mono text-lg">
                  {battleResults.winner === 'player1' ? 'Your algorithm outperformed the opponent!' : 'The opponent\'s algorithm was superior this time.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <Card className="bg-gray-800/50 border-cyan-500/30 p-6">
                  <h3 className="text-xl font-mono font-bold text-cyan-400 mb-4">YOUR PERFORMANCE</h3>
                  <div className="space-y-3 text-sm font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Final Score:</span>
                      <span className="text-cyan-400 font-bold">{battleResults.player1Score.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Performance:</span>
                      <span className="text-cyan-400 font-bold">{Math.round(finalPlayer1Progress)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Returns:</span>
                      <span className="text-green-400 font-bold">+{battleResults.metrics.player1.returns.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Sharpe Ratio:</span>
                      <span className={`font-bold ${
                        battleResults.metrics.player1.sharpe > 1.0 ? 'text-green-400' :
                        battleResults.metrics.player1.sharpe > 0.5 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {battleResults.metrics.player1.sharpe.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Max Drawdown:</span>
                      <span className="text-red-400 font-bold">-{battleResults.metrics.player1.drawdown.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Win Rate:</span>
                      <span className="text-blue-400 font-bold">{battleResults.metrics.player1.winRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-gray-800/50 border-purple-500/30 p-6">
                  <h3 className="text-xl font-mono font-bold text-purple-400 mb-4">OPPONENT PERFORMANCE</h3>
                  <div className="space-y-3 text-sm font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Final Score:</span>
                      <span className="text-purple-400 font-bold">{battleResults.player2Score.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Performance:</span>
                      <span className="text-purple-400 font-bold">{Math.round(finalPlayer2Progress)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Returns:</span>
                      <span className="text-green-400 font-bold">+{battleResults.metrics.player2.returns.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Sharpe Ratio:</span>
                      <span className={`font-bold ${
                        battleResults.metrics.player2.sharpe > 1.0 ? 'text-green-400' :
                        battleResults.metrics.player2.sharpe > 0.5 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {battleResults.metrics.player2.sharpe.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Max Drawdown:</span>
                      <span className="text-red-400 font-bold">-{battleResults.metrics.player2.drawdown.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Win Rate:</span>
                      <span className="text-blue-400 font-bold">{battleResults.metrics.player2.winRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => {
                    setCurrentPhase('dataset');
                    setSelectedDataset(null);
                    setBattleResults(null);
                    setAchievements([]);
                  }}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-mono font-bold px-6 py-3"
                >
                  REMATCH
                </Button>
                <Button 
                  onClick={onBack}
                  variant="outline"
                  className="rounded-none"
                >
                  BACK TO LOBBY
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Synthwave Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
        {currentPhase === 'battle' && (
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                initial={{ x: Math.random() * window.innerWidth, y: -10 }}
                animate={{ y: window.innerHeight + 10 }}
                transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 3 }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Sound Manager */}
      <ArcadeSoundManager 
        soundTrigger={soundTrigger}
        isMuted={isMuted}
        onSoundComplete={() => setSoundTrigger(null)}
      />
    </div>
  );
};

export default QuantAlgorithmCompetition;
