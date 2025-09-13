export interface QuantQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-3)
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  explanation: string;
}

export const quantQuestions: QuantQuestion[] = [
  {
    id: 1,
    question: "What does the Sharpe ratio measure?",
    options: [
      "Risk-adjusted return per unit of volatility",
      "Total return of a portfolio",
      "Maximum drawdown of an investment",
      "Correlation between two assets"
    ],
    correctAnswer: 0,
    difficulty: 'easy',
    category: 'Risk Metrics',
    explanation: "The Sharpe ratio measures risk-adjusted return by dividing excess return by volatility."
  },
  {
    id: 2,
    question: "In Black-Scholes model, what does the delta of an option represent?",
    options: [
      "The time decay of the option",
      "The sensitivity of option price to underlying asset price",
      "The volatility of the underlying asset",
      "The risk-free interest rate"
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Options',
    explanation: "Delta measures how much the option price changes for a $1 change in the underlying asset price."
  },
  {
    id: 3,
    question: "What is the primary purpose of Value at Risk (VaR)?",
    options: [
      "To maximize portfolio returns",
      "To estimate potential losses over a specific time horizon",
      "To calculate portfolio beta",
      "To determine optimal asset allocation"
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Risk Management',
    explanation: "VaR estimates the maximum potential loss over a given time period with a specified confidence level."
  },
  {
    id: 4,
    question: "Which of the following is NOT a characteristic of a normal distribution?",
    options: [
      "Symmetric around the mean",
      "Mean equals median equals mode",
      "Skewness equals zero",
      "Kurtosis equals zero"
    ],
    correctAnswer: 3,
    difficulty: 'medium',
    category: 'Statistics',
    explanation: "Normal distribution has kurtosis of 3, not zero. Excess kurtosis (kurtosis - 3) equals zero."
  },
  {
    id: 5,
    question: "What does the Capital Asset Pricing Model (CAPM) equation represent?",
    options: [
      "Expected return = Risk-free rate + Beta × (Market return - Risk-free rate)",
      "Expected return = Alpha + Beta × Market return",
      "Expected return = Risk-free rate + Alpha + Beta × Market return",
      "Expected return = Beta × Market return"
    ],
    correctAnswer: 0,
    difficulty: 'medium',
    category: 'Portfolio Theory',
    explanation: "CAPM states that expected return equals risk-free rate plus beta times market risk premium."
  },
  {
    id: 6,
    question: "In Monte Carlo simulation, what is the primary advantage over analytical methods?",
    options: [
      "Faster computation",
      "Handles complex, non-linear payoffs and multiple risk factors",
      "More accurate for simple options",
      "Requires less computational resources"
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Simulation',
    explanation: "Monte Carlo can handle complex payoffs and multiple correlated risk factors that analytical methods cannot."
  },
  {
    id: 7,
    question: "What does the Sortino ratio improve upon compared to the Sharpe ratio?",
    options: [
      "It uses total volatility instead of downside volatility",
      "It uses downside deviation instead of total volatility",
      "It includes transaction costs",
      "It measures maximum drawdown"
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Risk Metrics',
    explanation: "Sortino ratio uses downside deviation (only negative returns) instead of total volatility."
  },
  {
    id: 8,
    question: "In the context of portfolio optimization, what does the efficient frontier represent?",
    options: [
      "All possible portfolios with maximum return",
      "All possible portfolios with minimum risk",
      "Portfolios that offer the highest return for a given level of risk",
      "Portfolios with zero correlation between assets"
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'Portfolio Theory',
    explanation: "The efficient frontier shows portfolios that maximize return for each level of risk."
  },
  {
    id: 9,
    question: "What is the main assumption behind the Efficient Market Hypothesis (EMH)?",
    options: [
      "Markets are always rational",
      "All available information is instantly reflected in prices",
      "Investors always make optimal decisions",
      "Transaction costs are zero"
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'Market Theory',
    explanation: "EMH assumes that all available information is immediately and fully reflected in asset prices."
  },
  {
    id: 10,
    question: "In the context of derivatives, what does 'gamma' measure?",
    options: [
      "Rate of change of delta with respect to underlying price",
      "Rate of change of option price with respect to time",
      "Rate of change of option price with respect to volatility",
      "Rate of change of option price with respect to interest rate"
    ],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Options',
    explanation: "Gamma measures the rate of change of delta (first derivative) with respect to the underlying asset price (second derivative)."
  },
  {
    id: 11,
    question: "What does the Calmar ratio measure?",
    options: [
      "Return per unit of volatility",
      "Return per unit of maximum drawdown",
      "Return per unit of beta",
      "Return per unit of correlation"
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Risk Metrics',
    explanation: "Calmar ratio is annual return divided by maximum drawdown, measuring return per unit of worst-case loss."
  },
  {
    id: 12,
    question: "In time series analysis, what does 'stationarity' mean?",
    options: [
      "The series has no trend",
      "Statistical properties don't change over time",
      "The series has constant variance only",
      "The series has zero mean"
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Time Series',
    explanation: "Stationarity means the statistical properties (mean, variance, autocorrelation) remain constant over time."
  },
  {
    id: 13,
    question: "What is the primary purpose of cointegration in pairs trading?",
    options: [
      "To maximize individual stock returns",
      "To find stocks that move together in the long run",
      "To minimize transaction costs",
      "To calculate portfolio beta"
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'Pairs Trading',
    explanation: "Cointegration identifies pairs of stocks that have a long-term equilibrium relationship despite short-term deviations."
  },
  {
    id: 14,
    question: "In the context of machine learning for finance, what is 'look-ahead bias'?",
    options: [
      "Using future information that wouldn't be available at prediction time",
      "Looking at too much historical data",
      "Using only recent data for predictions",
      "Ignoring market microstructure effects"
    ],
    correctAnswer: 0,
    difficulty: 'hard',
    category: 'Machine Learning',
    explanation: "Look-ahead bias occurs when future information is used in backtesting that wouldn't have been available in real-time trading."
  },
  {
    id: 15,
    question: "What does the Information Ratio measure?",
    options: [
      "Return per unit of tracking error",
      "Return per unit of volatility",
      "Return per unit of beta",
      "Return per unit of maximum drawdown"
    ],
    correctAnswer: 0,
    difficulty: 'medium',
    category: 'Risk Metrics',
    explanation: "Information ratio measures active return per unit of tracking error, showing risk-adjusted outperformance."
  }
];

export const getRandomQuestion = (): QuantQuestion => {
  const randomIndex = Math.floor(Math.random() * quantQuestions.length);
  return quantQuestions[randomIndex];
};

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): QuantQuestion[] => {
  return quantQuestions.filter(q => q.difficulty === difficulty);
};
