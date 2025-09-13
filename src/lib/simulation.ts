// Market Crash Simulation Engine
export interface MarketData {
  date: string;
  price: number;
  volume: number;
  volatility: number;
}

export interface SimulationConfig {
  initialCapital: number;
  strategy: string;
  riskManagement: string;
  leverage: number;
  stopLoss: number;
}

export interface SimulationResult {
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  volatility: number;
  winRate: number;
  totalTrades: number;
  profitFactor: number;
  calmarRatio: number;
  sortinoRatio: number;
  finalCapital: number;
  equityCurve: MarketData[];
  trades: Trade[];
}

export interface Trade {
  id: string;
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  type: 'long' | 'short';
  reason: string;
}

export interface CrisisScenario {
  id: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  description: string;
  maxDrawdown: number;
  volatility: number;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  marketData: MarketData[];
  keyEvents: CrisisEvent[];
  economicIndicators: EconomicIndicator[];
}

export interface CrisisEvent {
  date: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'extreme';
  marketReaction: number; // percentage change
}

export interface EconomicIndicator {
  name: string;
  value: number;
  unit: string;
  change: number;
  description: string;
}

// Historical Crisis Data
export const crisisScenarios: CrisisScenario[] = [
  {
    id: 'gfc-2008',
    name: '2008 Financial Crisis',
    code: 'GFC08',
    startDate: '2008-09-15',
    endDate: '2009-03-09',
    description: 'Lehman Brothers collapse triggers global financial meltdown',
    maxDrawdown: -56.8,
    volatility: 89.2,
    duration: '6 months',
    difficulty: 'Extreme',
    marketData: generateMarketData('2008-09-15', '2009-03-09', -56.8, 89.2),
    keyEvents: [
      {
        date: '2008-09-15',
        title: 'Lehman Brothers Bankruptcy',
        description: 'Lehman Brothers files for Chapter 11 bankruptcy, marking the largest bankruptcy in U.S. history.',
        impact: 'extreme',
        marketReaction: -4.4
      },
      {
        date: '2008-09-16',
        title: 'AIG Bailout',
        description: 'Federal Reserve provides $85 billion emergency loan to AIG to prevent collapse.',
        impact: 'extreme',
        marketReaction: -4.7
      },
      {
        date: '2008-10-03',
        title: 'TARP Legislation',
        description: 'Troubled Asset Relief Program (TARP) signed into law, authorizing $700 billion for financial system bailout.',
        impact: 'high',
        marketReaction: -1.5
      },
      {
        date: '2009-03-09',
        title: 'Market Bottom',
        description: 'S&P 500 reaches its lowest point of the crisis at 676.53.',
        impact: 'extreme',
        marketReaction: -2.4
      }
    ],
    economicIndicators: [
      {
        name: 'Unemployment Rate',
        value: 10.0,
        unit: '%',
        change: 5.0,
        description: 'Peak unemployment during the crisis'
      },
      {
        name: 'GDP Growth',
        value: -2.5,
        unit: '%',
        change: -4.8,
        description: 'Annual GDP contraction'
      },
      {
        name: 'VIX Index',
        value: 80.86,
        unit: 'points',
        change: 65.2,
        description: 'Peak fear index reading'
      }
    ]
  },
  {
    id: 'covid-2020',
    name: 'COVID-19 Crash',
    code: 'CV19',
    startDate: '2020-02-19',
    endDate: '2020-04-07',
    description: 'Pandemic-induced market panic and recovery',
    maxDrawdown: -33.9,
    volatility: 76.4,
    duration: '2 months',
    difficulty: 'Hard',
    marketData: generateMarketData('2020-02-19', '2020-04-07', -33.9, 76.4),
    keyEvents: [
      {
        date: '2020-02-19',
        title: 'Market Peak',
        description: 'S&P 500 reaches all-time high before COVID-19 impact becomes clear.',
        impact: 'low',
        marketReaction: 0.0
      },
      {
        date: '2020-03-09',
        title: 'Circuit Breaker Triggered',
        description: 'Trading halted after 7% decline, first circuit breaker since 2008.',
        impact: 'extreme',
        marketReaction: -7.6
      },
      {
        date: '2020-03-16',
        title: 'Fed Emergency Rate Cut',
        description: 'Federal Reserve cuts rates to 0-0.25% and announces $700B QE program.',
        impact: 'high',
        marketReaction: -12.0
      },
      {
        date: '2020-03-23',
        title: 'CARES Act Signed',
        description: '$2.2 trillion stimulus package signed into law.',
        impact: 'high',
        marketReaction: 9.4
      }
    ],
    economicIndicators: [
      {
        name: 'Unemployment Rate',
        value: 14.8,
        unit: '%',
        change: 10.3,
        description: 'Peak unemployment during lockdowns'
      },
      {
        name: 'GDP Growth',
        value: -3.4,
        unit: '%',
        change: -5.2,
        description: 'Annual GDP contraction'
      },
      {
        name: 'VIX Index',
        value: 82.69,
        unit: 'points',
        change: 70.1,
        description: 'Peak fear index reading'
      }
    ]
  },
  {
    id: 'dotcom-2000',
    name: 'Dot-com Bubble',
    code: 'DOT00',
    startDate: '2000-03-24',
    endDate: '2002-10-09',
    description: 'Technology stock bubble burst and prolonged bear market',
    maxDrawdown: -78.0,
    volatility: 67.8,
    duration: '31 months',
    difficulty: 'Hard',
    marketData: generateMarketData('2000-03-24', '2002-10-09', -78.0, 67.8),
    keyEvents: [
      {
        date: '2000-03-24',
        title: 'Nasdaq Peak',
        description: 'Nasdaq Composite reaches all-time high of 5,048.62.',
        impact: 'low',
        marketReaction: 0.0
      },
      {
        date: '2000-04-14',
        title: 'Tech Stock Crash Begins',
        description: 'Nasdaq falls 9.7% in single day, marking start of tech crash.',
        impact: 'extreme',
        marketReaction: -9.7
      },
      {
        date: '2001-09-11',
        title: '9/11 Attacks',
        description: 'Terrorist attacks compound market decline.',
        impact: 'extreme',
        marketReaction: -7.1
      },
      {
        date: '2002-10-09',
        title: 'Market Bottom',
        description: 'Nasdaq reaches lowest point at 1,108.49.',
        impact: 'extreme',
        marketReaction: -2.9
      }
    ],
    economicIndicators: [
      {
        name: 'Unemployment Rate',
        value: 6.0,
        unit: '%',
        change: 1.8,
        description: 'Peak unemployment during recession'
      },
      {
        name: 'GDP Growth',
        value: 0.3,
        unit: '%',
        change: -2.1,
        description: 'Minimal GDP growth'
      },
      {
        name: 'Tech Sector Weight',
        value: 35.0,
        unit: '%',
        change: -15.0,
        description: 'Tech sector market cap decline'
      }
    ]
  },
  {
    id: 'black-monday-1987',
    name: 'Black Monday',
    code: 'BLK87',
    startDate: '1987-10-19',
    endDate: '1987-10-19',
    description: 'Single-day market crash of 22.6%',
    maxDrawdown: -22.6,
    volatility: 45.2,
    duration: '1 day',
    difficulty: 'Medium',
    marketData: generateMarketData('1987-10-19', '1987-10-19', -22.6, 45.2),
    keyEvents: [
      {
        date: '1987-10-19',
        title: 'Black Monday',
        description: 'Dow Jones drops 22.6% in single day, largest one-day percentage decline in history.',
        impact: 'extreme',
        marketReaction: -22.6
      },
      {
        date: '1987-10-20',
        title: 'Recovery Begins',
        description: 'Markets begin recovery with 5.9% gain.',
        impact: 'high',
        marketReaction: 5.9
      }
    ],
    economicIndicators: [
      {
        name: 'Interest Rates',
        value: 7.25,
        unit: '%',
        change: 0.5,
        description: 'Federal funds rate'
      },
      {
        name: 'Dollar Index',
        value: 85.2,
        unit: 'points',
        change: -8.5,
        description: 'Dollar weakness'
      },
      {
        name: 'Program Trading',
        value: 25.0,
        unit: '%',
        change: 15.0,
        description: 'Percentage of program trading'
      }
    ]
  },
  {
    id: 'volatility-2018',
    name: 'Volatility Spike',
    code: 'VOL18',
    startDate: '2018-01-26',
    endDate: '2018-12-24',
    description: 'VIX explosion and trade war tensions',
    maxDrawdown: -19.8,
    volatility: 52.1,
    duration: '12 months',
    difficulty: 'Medium',
    marketData: generateMarketData('2018-01-26', '2018-12-24', -19.8, 52.1),
    keyEvents: [
      {
        date: '2018-01-26',
        title: 'Volatility Spike',
        description: 'VIX jumps from 11 to 37 in single day, triggering market selloff.',
        impact: 'extreme',
        marketReaction: -4.1
      },
      {
        date: '2018-03-22',
        title: 'Trade War Begins',
        description: 'Trump announces tariffs on Chinese goods, escalating trade tensions.',
        impact: 'high',
        marketReaction: -2.5
      },
      {
        date: '2018-10-10',
        title: 'Rate Hike Concerns',
        description: 'Fed signals continued rate hikes, spooking markets.',
        impact: 'high',
        marketReaction: -3.3
      },
      {
        date: '2018-12-24',
        title: 'Christmas Eve Low',
        description: 'S&P 500 reaches lowest point of the year.',
        impact: 'extreme',
        marketReaction: -2.7
      }
    ],
    economicIndicators: [
      {
        name: 'VIX Index',
        value: 36.07,
        unit: 'points',
        change: 25.0,
        description: 'Peak volatility reading'
      },
      {
        name: 'Trade Deficit',
        value: 621.0,
        unit: 'B USD',
        change: 50.0,
        description: 'Annual trade deficit'
      },
      {
        name: 'Fed Funds Rate',
        value: 2.5,
        unit: '%',
        change: 1.0,
        description: 'Year-end interest rate'
      }
    ]
  }
];

// Generate realistic market data for simulation
function generateMarketData(startDate: string, endDate: string, maxDrawdown: number, volatility: number): MarketData[] {
  const data: MarketData[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  let currentPrice = 100; // Starting price
  const peakPrice = 100;
  const bottomPrice = peakPrice * (1 + maxDrawdown / 100);
  
  for (let i = 0; i <= days; i++) {
    const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    
    // Simulate price movement with trend toward bottom
    const progress = i / days;
    const trendPrice = peakPrice + (bottomPrice - peakPrice) * Math.pow(progress, 0.7);
    
    // Add random volatility
    const randomChange = (Math.random() - 0.5) * volatility / 100;
    currentPrice = trendPrice * (1 + randomChange);
    
    // Ensure price doesn't go below bottom
    currentPrice = Math.max(currentPrice, bottomPrice * 0.95);
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      price: Math.round(currentPrice * 100) / 100,
      volume: Math.floor(Math.random() * 1000000) + 500000,
      volatility: volatility * (0.8 + Math.random() * 0.4)
    });
  }
  
  return data;
}

// Simulation Engine
export class MarketCrashSimulator {
  private config: SimulationConfig;
  private scenario: CrisisScenario;
  private currentCapital: number;
  private trades: Trade[] = [];
  private equityCurve: MarketData[] = [];
  private currentPosition: Trade | null = null;

  constructor(config: SimulationConfig, scenario: CrisisScenario) {
    this.config = config;
    this.scenario = scenario;
    this.currentCapital = config.initialCapital;
  }

  runSimulation(): SimulationResult {
    this.trades = [];
    this.equityCurve = [];
    this.currentPosition = null;

    for (let i = 0; i < this.scenario.marketData.length; i++) {
      const marketData = this.scenario.marketData[i];
      
      // Update equity curve
      this.equityCurve.push({
        ...marketData,
        price: this.currentCapital
      });

      // Execute trading logic based on strategy
      this.executeStrategy(marketData, i);
    }

    // Close any remaining position
    if (this.currentPosition) {
      this.closePosition(this.scenario.marketData[this.scenario.marketData.length - 1]);
    }

    return this.calculateResults();
  }

  private executeStrategy(marketData: MarketData, index: number): void {
    switch (this.config.strategy) {
      case 'Buy & Hold':
        this.executeBuyAndHold(marketData, index);
        break;
      case 'Momentum Trading':
        this.executeMomentum(marketData, index);
        break;
      case 'Mean Reversion':
        this.executeMeanReversion(marketData, index);
        break;
      case 'Risk Parity':
        this.executeRiskParity(marketData, index);
        break;
    }
  }

  private executeBuyAndHold(marketData: MarketData, index: number): void {
    if (index === 0) {
      // Buy at the beginning
      const quantity = (this.currentCapital * this.config.leverage) / marketData.price;
      this.openPosition('long', marketData, quantity, 'Initial buy');
    }
    
    // Check stop loss
    if (this.currentPosition && this.config.stopLoss > 0) {
      const lossPercentage = (this.currentPosition.entryPrice - marketData.price) / this.currentPosition.entryPrice * 100;
      if (lossPercentage >= this.config.stopLoss) {
        this.closePosition(marketData);
      }
    }
  }

  private executeMomentum(marketData: MarketData, index: number): void {
    if (index < 5) return; // Need some history

    const recentPrices = this.scenario.marketData.slice(index - 5, index).map(d => d.price);
    const momentum = (marketData.price - recentPrices[0]) / recentPrices[0];

    if (momentum > 0.02 && !this.currentPosition) {
      // Strong upward momentum - buy
      const quantity = (this.currentCapital * 0.8 * this.config.leverage) / marketData.price;
      this.openPosition('long', marketData, quantity, 'Momentum buy');
    } else if (momentum < -0.02 && this.currentPosition) {
      // Strong downward momentum - sell
      this.closePosition(marketData);
    }
    
    // Check stop loss
    if (this.currentPosition && this.config.stopLoss > 0) {
      const lossPercentage = (this.currentPosition.entryPrice - marketData.price) / this.currentPosition.entryPrice * 100;
      if (lossPercentage >= this.config.stopLoss) {
        this.closePosition(marketData);
      }
    }
  }

  private executeMeanReversion(marketData: MarketData, index: number): void {
    if (index < 20) return; // Need more history

    const recentPrices = this.scenario.marketData.slice(index - 20, index).map(d => d.price);
    const average = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    const deviation = (marketData.price - average) / average;

    if (deviation < -0.05 && !this.currentPosition) {
      // Price below average - buy
      const quantity = (this.currentCapital * 0.6 * this.config.leverage) / marketData.price;
      this.openPosition('long', marketData, quantity, 'Mean reversion buy');
    } else if (deviation > 0.05 && this.currentPosition) {
      // Price above average - sell
      this.closePosition(marketData);
    }
    
    // Check stop loss
    if (this.currentPosition && this.config.stopLoss > 0) {
      const lossPercentage = (this.currentPosition.entryPrice - marketData.price) / this.currentPosition.entryPrice * 100;
      if (lossPercentage >= this.config.stopLoss) {
        this.closePosition(marketData);
      }
    }
  }

  private executeRiskParity(marketData: MarketData, index: number): void {
    // Simplified risk parity - adjust position based on volatility
    const targetVolatility = 0.15; // 15% target volatility
    const currentVolatility = marketData.volatility / 100;
    
    const positionSize = Math.min(targetVolatility / currentVolatility, 1.0);
    
    if (this.currentPosition) {
      this.closePosition(marketData);
    }
    
    if (positionSize > 0.3) {
      const quantity = (this.currentCapital * positionSize * this.config.leverage) / marketData.price;
      this.openPosition('long', marketData, quantity, 'Risk parity allocation');
    }
    
    // Check stop loss
    if (this.currentPosition && this.config.stopLoss > 0) {
      const lossPercentage = (this.currentPosition.entryPrice - marketData.price) / this.currentPosition.entryPrice * 100;
      if (lossPercentage >= this.config.stopLoss) {
        this.closePosition(marketData);
      }
    }
  }

  private openPosition(type: 'long' | 'short', marketData: MarketData, quantity: number, reason: string): void {
    if (this.currentPosition) return; // Already have a position

    this.currentPosition = {
      id: `trade_${this.trades.length + 1}`,
      entryDate: marketData.date,
      exitDate: '',
      entryPrice: marketData.price,
      exitPrice: 0,
      quantity: quantity,
      pnl: 0,
      type: type,
      reason: reason
    };
  }

  private closePosition(marketData: MarketData): void {
    if (!this.currentPosition) return;

    const pnl = this.currentPosition.type === 'long' 
      ? (marketData.price - this.currentPosition.entryPrice) * this.currentPosition.quantity
      : (this.currentPosition.entryPrice - marketData.price) * this.currentPosition.quantity;

    this.currentPosition.exitDate = marketData.date;
    this.currentPosition.exitPrice = marketData.price;
    this.currentPosition.pnl = pnl;

    this.currentCapital += pnl;
    this.trades.push(this.currentPosition);
    this.currentPosition = null;
  }

  private calculateResults(): SimulationResult {
    const totalReturn = (this.currentCapital - this.config.initialCapital) / this.config.initialCapital;
    
    // Calculate max drawdown
    let maxDrawdown = 0;
    let peak = this.config.initialCapital;
    
    for (const point of this.equityCurve) {
      if (point.price > peak) peak = point.price;
      const drawdown = (peak - point.price) / peak;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }

    // Calculate Sharpe ratio
    const returns = this.trades.map(trade => trade.pnl / this.config.initialCapital);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const returnStdDev = Math.sqrt(returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length);
    const sharpeRatio = returnStdDev > 0 ? avgReturn / returnStdDev : 0;

    // Calculate other metrics
    const winningTrades = this.trades.filter(trade => trade.pnl > 0);
    const winRate = this.trades.length > 0 ? winningTrades.length / this.trades.length : 0;
    
    const totalProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const totalLoss = this.trades.filter(trade => trade.pnl < 0).reduce((sum, trade) => sum + Math.abs(trade.pnl), 0);
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : 0;

    const volatility = this.scenario.volatility / 100;
    const calmarRatio = maxDrawdown > 0 ? totalReturn / maxDrawdown : 0;
    const sortinoRatio = sharpeRatio; // Simplified

    return {
      totalReturn: totalReturn * 100,
      maxDrawdown: maxDrawdown * 100,
      sharpeRatio,
      volatility: volatility * 100,
      winRate: winRate * 100,
      totalTrades: this.trades.length,
      profitFactor,
      calmarRatio,
      sortinoRatio,
      finalCapital: this.currentCapital,
      equityCurve: this.equityCurve,
      trades: this.trades
    };
  }
}

// Export utility functions
export const getCrisisById = (id: string): CrisisScenario | undefined => {
  return crisisScenarios.find(crisis => crisis.id === id);
};

export const getAllCrises = (): CrisisScenario[] => {
  return crisisScenarios;
};

export const runSimulation = (config: SimulationConfig, crisisId: string): SimulationResult | null => {
  const crisis = getCrisisById(crisisId);
  if (!crisis) return null;

  const simulator = new MarketCrashSimulator(config, crisis);
  return simulator.runSimulation();
};
