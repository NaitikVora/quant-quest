import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface MarketCrashSimulationProps {
  scenario: {
    id: string;
    name: string;
    code: string;
    date: string;
    description: string;
    difficulty: string;
    duration: string;
    maxDrawdown: string;
    volatility: string;
  };
  onComplete: (results: any) => void;
  onBack: () => void;
}

interface TradingStrategy {
  position: 'long' | 'short' | 'neutral';
  entryTiming: 'early' | 'late' | 'optimal';
  riskManagement: 'conservative' | 'moderate' | 'aggressive';
  stopLoss: boolean;
  takeProfit: boolean;
}

const MarketCrashSimulation: React.FC<MarketCrashSimulationProps> = ({
  scenario,
  onComplete,
  onBack
}) => {
  const [simulationPhase, setSimulationPhase] = useState<'setup' | 'running' | 'complete'>('setup');
  const [currentPrice, setCurrentPrice] = useState(100);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [day, setDay] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [priceHistory, setPriceHistory] = useState<number[]>([100]);
  const [portfolioHistory, setPortfolioHistory] = useState<number[]>([100000]);
  const [currentEvent, setCurrentEvent] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [tradingStrategy, setTradingStrategy] = useState<TradingStrategy>({
    position: 'long',
    entryTiming: 'optimal',
    riskManagement: 'moderate',
    stopLoss: true,
    takeProfit: false
  });
  const [strategyOutcome, setStrategyOutcome] = useState<'profit' | 'loss' | 'neutral'>('neutral');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  // Generate strategy-based market data
  const generateStrategyBasedData = () => {
    const days = 60;
    const data = [];
    let price = 100;
    
    // Calculate strategy effectiveness
    const isShortPosition = tradingStrategy.position === 'short';
    const isEarlyEntry = tradingStrategy.entryTiming === 'early';
    const isAggressive = tradingStrategy.riskManagement === 'aggressive';
    const hasStopLoss = tradingStrategy.stopLoss;
    const hasTakeProfit = tradingStrategy.takeProfit;
    
    // Determine if strategy will be profitable
    // Short position during crash = profitable, Long position during crash = loss
    const willBeProfitable = isShortPosition;
    
    // Calculate success probability based on strategy
    let successProbability = 0.3; // Base 30% chance
    if (isShortPosition) successProbability += 0.4; // Short during crash = +40%
    if (isEarlyEntry) successProbability += 0.2; // Early entry = +20%
    if (hasStopLoss) successProbability += 0.1; // Stop loss = +10%
    if (hasTakeProfit) successProbability += 0.1; // Take profit = +10%
    if (isAggressive) successProbability -= 0.1; // Aggressive = -10% (higher risk)
    
    const strategySuccess = Math.random() < successProbability;
    
    // Set outcome
    if (strategySuccess && willBeProfitable) {
      setStrategyOutcome('profit');
    } else if (!strategySuccess && !willBeProfitable) {
      setStrategyOutcome('loss');
    } else {
      setStrategyOutcome('neutral');
    }
    
    for (let i = 0; i < days; i++) {
      let volatility = 0.05;
      let trend = 0;
      
      // Market crash phases
      if (i < 10) {
        // Initial decline
        trend = -0.02;
        volatility = 0.08;
      } else if (i < 20) {
        // Sharp crash
        trend = -0.05;
        volatility = 0.12;
      } else if (i < 40) {
        // Volatile recovery attempts
        trend = 0.01;
        volatility = 0.10;
      } else {
        // Gradual recovery
        trend = 0.02;
        volatility = 0.06;
      }
      
      // Adjust based on strategy success
      if (strategySuccess && willBeProfitable) {
        // If short position succeeds, show portfolio going up while market crashes
        trend = trend * 0.5; // Reduce market impact on portfolio
      } else if (!strategySuccess && !willBeProfitable) {
        // If long position fails, amplify the crash
        trend = trend * 1.5;
        volatility = volatility * 1.2;
      }
      
      // Add randomness
      const randomChange = (Math.random() - 0.5) * volatility;
      price *= (1 + trend + randomChange);
      
      data.push(Math.max(price, 20)); // Floor at 20
    }
    
    return data;
  };

  // Generate data based on current strategy
  const [crashData, setCrashData] = useState<number[]>([]);
  
  useEffect(() => {
    setCrashData(generateStrategyBasedData());
  }, [tradingStrategy]);
  const events = [
    "Market opens with uncertainty...",
    "Early selling pressure begins...",
    "Panic selling intensifies!",
    "Circuit breakers triggered!",
    "Massive sell-off continues...",
    "Bargain hunters emerge...",
    "Volatility reaches extreme levels...",
    "Recovery attempts fail...",
    "Market finds temporary bottom...",
    "Gradual recovery begins...",
    "Confidence slowly returns...",
    "Market stabilizes..."
  ];

  // Sound effects
  const playSound = (type: 'crash' | 'recovery' | 'alert' | 'complete' | 'profit' | 'loss') => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'crash':
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.5);
        oscillator.type = 'sawtooth';
        break;
      case 'recovery':
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
        oscillator.type = 'sine';
        break;
      case 'alert':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
        oscillator.type = 'square';
        break;
      case 'complete':
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.4);
        oscillator.type = 'sine';
        break;
      case 'profit':
        // Upward ascending chord for profit
        oscillator.frequency.setValueAtTime(261, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(329, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(392, audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime + 0.3);
        oscillator.type = 'sine';
        break;
      case 'loss':
        // Downward descending tone for loss
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.4);
        oscillator.type = 'sawtooth';
        break;
    }
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // Draw price chart
  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw price line based on strategy outcome
    if (priceHistory.length > 1) {
      // Determine line color based on strategy outcome
      let lineColor = '#6b7280'; // Default gray
      if (strategyOutcome === 'profit') {
        lineColor = '#10b981'; // Green for profit
      } else if (strategyOutcome === 'loss') {
        lineColor = '#ef4444'; // Red for loss
      } else {
        lineColor = currentPrice < 100 ? '#ef4444' : '#10b981'; // Dynamic based on price
      }
      
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      priceHistory.forEach((price, index) => {
        const x = (width / (priceHistory.length - 1)) * index;
        const y = height - ((price - Math.min(...priceHistory)) / (Math.max(...priceHistory) - Math.min(...priceHistory))) * height;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Draw current price point
      const currentX = (width / (priceHistory.length - 1)) * (priceHistory.length - 1);
      const currentY = height - ((currentPrice - Math.min(...priceHistory)) / (Math.max(...priceHistory) - Math.min(...priceHistory))) * height;
      
      ctx.fillStyle = lineColor;
      ctx.beginPath();
      ctx.arc(currentX, currentY, 6, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  // Start simulation
  const startSimulation = () => {
    setSimulationPhase('running');
    setCurrentPrice(100);
    setPortfolioValue(100000);
    setDay(0);
    setPriceHistory([100]);
    setPortfolioHistory([100000]);
    
    let currentDay = 0;
    const maxDays = crashData.length;
    
    const runSimulation = () => {
      if (currentDay >= maxDays) {
        setSimulationPhase('complete');
        playSound('complete');
        return;
      }
      
      if (!isPaused) {
        const newPrice = crashData[currentDay];
        const priceChange = (newPrice - currentPrice) / currentPrice;
        const newPortfolioValue = portfolioValue * (1 + priceChange);
        
        setCurrentPrice(newPrice);
        setPortfolioValue(newPortfolioValue);
        setDay(currentDay + 1);
        setPriceHistory(prev => [...prev, newPrice]);
        setPortfolioHistory(prev => [...prev, newPortfolioValue]);
        
        // Set current event
        if (currentDay < events.length) {
          setCurrentEvent(events[currentDay]);
        }
        
        // Play sounds based on strategy outcome and price movement
        if (strategyOutcome === 'profit') {
          if (priceChange > 0.02) {
            playSound('profit');
          } else if (Math.abs(priceChange) > 0.01) {
            playSound('recovery');
          }
        } else if (strategyOutcome === 'loss') {
          if (priceChange < -0.03) {
            playSound('loss');
          } else if (priceChange < -0.01) {
            playSound('crash');
          }
        } else {
          // Neutral strategy - use original logic
          if (priceChange < -0.05) {
            playSound('crash');
          } else if (priceChange > 0.03) {
            playSound('recovery');
          } else if (Math.abs(priceChange) > 0.02) {
            playSound('alert');
          }
        }
        
        currentDay++;
      }
      
      simulationRef.current = setTimeout(runSimulation, 200);
    };
    
    runSimulation();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simulationRef.current) {
        clearTimeout(simulationRef.current);
      }
    };
  }, []);

  // Redraw chart when data changes
  useEffect(() => {
    drawChart();
  }, [priceHistory, currentPrice]);

  const totalReturn = ((portfolioValue - 100000) / 100000) * 100;
  const maxDrawdown = Math.min(...portfolioHistory.map(v => ((v - 100000) / 100000) * 100));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-red-500/30">
        <div>
          <h1 className="text-2xl font-mono font-bold text-white">{scenario.name}</h1>
          <p className="text-sm text-red-300 font-mono">{scenario.code} • {scenario.date}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="px-3 py-1 bg-gray-800/50 border border-gray-600 rounded text-white text-sm font-mono hover:bg-gray-700/50"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={onBack}
            className="px-3 py-1 bg-gray-800/50 border border-gray-600 rounded text-white text-sm font-mono hover:bg-gray-700/50"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Trading Strategy Controls */}
        <div className="w-1/3 p-4 space-y-4">
          {/* Trading Strategy Configuration */}
          <Card className="bg-gray-800/50 border-red-500/30 p-4">
            <h3 className="text-lg font-mono font-bold text-white mb-4">TRADING STRATEGY</h3>
            
            <div className="space-y-4">
              {/* Position Type */}
              <div>
                <Label className="text-sm font-mono text-gray-300 mb-2 block">Position Type</Label>
                <div className="flex gap-2">
                  {(['long', 'short', 'neutral'] as const).map((position) => (
                    <Button
                      key={position}
                      variant={tradingStrategy.position === position ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTradingStrategy(prev => ({ ...prev, position }))}
                      className="flex-1 text-xs font-mono"
                    >
                      {position.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Entry Timing */}
              <div>
                <Label className="text-sm font-mono text-gray-300 mb-2 block">Entry Timing</Label>
                <div className="flex gap-2">
                  {(['early', 'optimal', 'late'] as const).map((timing) => (
                    <Button
                      key={timing}
                      variant={tradingStrategy.entryTiming === timing ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTradingStrategy(prev => ({ ...prev, entryTiming: timing }))}
                      className="flex-1 text-xs font-mono"
                    >
                      {timing.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Risk Management */}
              <div>
                <Label className="text-sm font-mono text-gray-300 mb-2 block">Risk Level</Label>
                <div className="flex gap-2">
                  {(['conservative', 'moderate', 'aggressive'] as const).map((risk) => (
                    <Button
                      key={risk}
                      variant={tradingStrategy.riskManagement === risk ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTradingStrategy(prev => ({ ...prev, riskManagement: risk }))}
                      className="flex-1 text-xs font-mono"
                    >
                      {risk.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Risk Controls */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-mono text-gray-300">Stop Loss</Label>
                  <Switch
                    checked={tradingStrategy.stopLoss}
                    onCheckedChange={(checked) => setTradingStrategy(prev => ({ ...prev, stopLoss: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-mono text-gray-300">Take Profit</Label>
                  <Switch
                    checked={tradingStrategy.takeProfit}
                    onCheckedChange={(checked) => setTradingStrategy(prev => ({ ...prev, takeProfit: checked }))}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Simulation Controls */}
          <Card className="bg-gray-800/50 border-red-500/30 p-4">
            <h3 className="text-lg font-mono font-bold text-white mb-4">SIMULATION CONTROLS</h3>
            
            {simulationPhase === 'setup' && (
              <motion.button
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-mono font-bold rounded-lg border-2 border-red-500 hover:from-red-500 hover:to-red-600 transition-colors"
                onClick={startSimulation}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🚀 START SIMULATION
              </motion.button>
            )}
            
            {simulationPhase === 'running' && (
              <div className="space-y-2">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="w-full py-2 bg-yellow-600 text-white font-mono font-bold rounded border border-yellow-500 hover:bg-yellow-500"
                >
                  {isPaused ? '▶️ RESUME' : '⏸️ PAUSE'}
                </button>
                <div className="text-center text-sm text-gray-300 font-mono">
                  Day {day} of {crashData.length}
                </div>
              </div>
            )}
            
            {simulationPhase === 'complete' && (
              <motion.button
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-mono font-bold rounded-lg border-2 border-green-500 hover:from-green-500 hover:to-green-600 transition-colors"
                onClick={() => onComplete({
                  totalReturn,
                  maxDrawdown,
                  finalValue: portfolioValue,
                  scenario: scenario.name,
                  strategy: tradingStrategy,
                  outcome: strategyOutcome
                })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📊 VIEW RESULTS
              </motion.button>
            )}
          </Card>

          {/* Current Stats */}
          <Card className="bg-gray-800/50 border-red-500/30 p-4">
            <h3 className="text-lg font-mono font-bold text-white mb-4">CURRENT STATS</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300 font-mono">Current Price:</span>
                <span className={`font-mono font-bold ${currentPrice < 100 ? 'text-red-400' : 'text-green-400'}`}>
                  ${currentPrice.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300 font-mono">Portfolio Value:</span>
                <span className={`font-mono font-bold ${portfolioValue < 100000 ? 'text-red-400' : 'text-green-400'}`}>
                  ${portfolioValue.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300 font-mono">Total Return:</span>
                <span className={`font-mono font-bold ${totalReturn < 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {totalReturn.toFixed(2)}%
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300 font-mono">Strategy Outcome:</span>
                <Badge 
                  variant="outline" 
                  className={`${
                    strategyOutcome === 'profit' ? 'border-green-500 text-green-400' :
                    strategyOutcome === 'loss' ? 'border-red-500 text-red-400' :
                    'border-gray-500 text-gray-400'
                  }`}
                >
                  {strategyOutcome.toUpperCase()}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Current Event */}
          {currentEvent && (
            <motion.div
              className="bg-red-900/30 border border-red-500/50 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h4 className="text-sm font-mono font-bold text-red-300 mb-2">MARKET EVENT</h4>
              <p className="text-red-200 font-mono text-sm">{currentEvent}</p>
            </motion.div>
          )}
        </div>

        {/* Right Panel - Chart */}
        <div className="flex-1 p-4">
          <Card className="bg-gray-800/50 border-red-500/30 p-4 h-full">
            <h3 className="text-lg font-mono font-bold text-white mb-4">STRATEGY PERFORMANCE CHART</h3>
            
            <div className="relative h-[calc(100%-60px)]">
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full h-full"
              />
              
              {/* Price labels */}
              <div className="absolute top-0 right-0 text-xs font-mono text-gray-400">
                <div>${Math.max(...priceHistory).toFixed(2)}</div>
                <div className="mt-[calc(100%-40px)]">${Math.min(...priceHistory).toFixed(2)}</div>
              </div>
              
              {/* Strategy outcome indicator */}
              {strategyOutcome !== 'neutral' && (
                <div className="absolute top-4 left-4">
                  <Badge 
                    className={`${
                      strategyOutcome === 'profit' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {strategyOutcome === 'profit' ? '📈 PROFIT' : '📉 LOSS'}
                  </Badge>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {simulationPhase === 'running' && (
          <>
            {/* Falling red particles during loss */}
            {strategyOutcome === 'loss' && currentPrice < 80 && (
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-red-500 rounded-full"
                    initial={{ x: Math.random() * window.innerWidth, y: -10 }}
                    animate={{ y: window.innerHeight + 10 }}
                    transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                  />
                ))}
              </div>
            )}
            
            {/* Rising green particles during profit */}
            {strategyOutcome === 'profit' && currentPrice > 100 && (
              <div className="absolute inset-0">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-green-500 rounded-full"
                    initial={{ x: Math.random() * window.innerWidth, y: window.innerHeight + 10 }}
                    animate={{ y: -10 }}
                    transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 3 }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MarketCrashSimulation;
