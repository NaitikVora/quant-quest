import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  dangerouslyAllowBrowser: true, // Required for browser usage
});

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
}

// Coach Qunal System Prompt
const COACH_QUNAL_SYSTEM_PROMPT = `You are a Quant coach. You should just help the user with quant and quant quesions only be respectful and be helpful`;

class ChatbotService {
  private sessions: Map<string, ChatSession> = new Map();
  private currentSessionId: string | null = null;

  constructor() {
    this.initializeSession();
  }

  private initializeSession(): void {
    const sessionId = this.generateSessionId();
    this.currentSessionId = sessionId;
    this.sessions.set(sessionId, {
      id: sessionId,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async sendMessage(content: string): Promise<ChatMessage> {
    if (!this.currentSessionId) {
      this.initializeSession();
    }

    const session = this.sessions.get(this.currentSessionId!);
    if (!session) {
      throw new Error('Session not found');
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: this.generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    session.messages.push(userMessage);
    session.lastActivity = new Date();

    // Check if API key is available
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      // Demo mode - return a sample response
      const demoResponse = this.getDemoResponse(content);
      const assistantMessage: ChatMessage = {
        id: this.generateMessageId(),
        role: 'assistant',
        content: demoResponse,
        timestamp: new Date(),
      };

      session.messages.push(assistantMessage);
      session.lastActivity = new Date();

      return assistantMessage;
    }

    try {
      // Prepare messages for Claude API
      const claudeMessages = session.messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

      // Call Claude API
      const response = await anthropic.messages.create({
        model: 'claude-opus-4-1-20250805',
        max_tokens: 1000,
        system: COACH_QUNAL_SYSTEM_PROMPT,
        messages: claudeMessages,
      });

      // Extract response content
      const assistantContent = response.content[0];
      if (assistantContent.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: this.generateMessageId(),
        role: 'assistant',
        content: assistantContent.text,
        timestamp: new Date(),
      };

      session.messages.push(assistantMessage);
      session.lastActivity = new Date();

      return assistantMessage;
    } catch (error) {
      console.error('Error calling Claude API:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: this.generateMessageId(),
        role: 'assistant',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment. If the problem persists, please check your internet connection or try refreshing the page.',
        timestamp: new Date(),
      };

      session.messages.push(errorMessage);
      return errorMessage;
    }
  }

  private getDemoResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('alpha') || lowerMessage.includes('beta')) {
      return `Great question about alpha and beta! Let me break this down:

**Alpha (α)**: Measures excess returns above what's expected based on risk. It's your "edge" - the value you add through skill or strategy.

**Beta (β)**: Measures systematic risk relative to the market. A beta of 1.0 means the asset moves with the market.

**Key Differences:**
• Alpha is skill-based, Beta is risk-based
• Alpha can be positive/negative, Beta is typically positive
• Alpha is what you want to maximize, Beta is what you manage

**Practical Example:**
If your portfolio has α = 0.05 and β = 1.2, you're:
- Outperforming by 5% annually (alpha)
- 20% more volatile than the market (beta)

*Note: This is a demo response. Configure your API key for real-time AI assistance!*`;
    }
    
    if (lowerMessage.includes('var') || lowerMessage.includes('value at risk')) {
      return `Value at Risk (VaR) is a key risk management metric! Here's how to calculate it:

**VaR Definition:**
VaR measures the maximum potential loss over a specific time period with a given confidence level.

**Common Methods:**
1. **Historical Simulation**: Use past returns to estimate future risk
2. **Parametric (Variance-Covariance)**: Assume normal distribution
3. **Monte Carlo**: Simulate thousands of scenarios

**Example Calculation:**
For a $1M portfolio with 95% confidence over 1 day:
- If VaR = $50,000, there's a 5% chance of losing more than $50,000 in one day

**Formula (Parametric):**
VaR = Portfolio Value × Z-score × Standard Deviation × √Time

*Note: This is a demo response. Configure your API key for real-time AI assistance!*`;
    }
    
    if (lowerMessage.includes('black-scholes') || lowerMessage.includes('options')) {
      return `The Black-Scholes model is fundamental to options pricing! Here's a simplified explanation:

**What it does:**
Pricing European options using current stock price, strike price, time to expiration, risk-free rate, and volatility.

**Key Components:**
• S = Current stock price
• K = Strike price
• T = Time to expiration
• r = Risk-free rate
• σ = Volatility

**The Formula:**
C = S × N(d1) - K × e^(-rT) × N(d2)

Where:
- d1 = [ln(S/K) + (r + σ²/2)T] / (σ√T)
- d2 = d1 - σ√T
- N() = Cumulative normal distribution

**Intuition:**
The option price reflects the probability-weighted payoff, discounted to present value.

*Note: This is a demo response. Configure your API key for real-time AI assistance!*`;
    }
    
    if (lowerMessage.includes('python') || lowerMessage.includes('programming')) {
      return `Python is excellent for quantitative finance! Here are key libraries:

**Essential Libraries:**
• **NumPy**: Numerical computing and arrays
• **Pandas**: Data manipulation and analysis
• **Matplotlib/Seaborn**: Data visualization
• **SciPy**: Scientific computing and statistics
• **Scikit-learn**: Machine learning
• **QuantLib**: Quantitative finance library

**Trading-Specific:**
• **yfinance**: Yahoo Finance data
• **TA-Lib**: Technical analysis indicators
• **Zipline**: Backtesting framework
• **PyFolio**: Portfolio analysis

**Example Code Structure:**
\`\`\`python
import pandas as pd
import numpy as np
import yfinance as yf

# Get data
data = yf.download('AAPL', start='2020-01-01')
# Calculate returns
returns = data['Close'].pct_change()
# Risk metrics
volatility = returns.std() * np.sqrt(252)
\`\`\`

*Note: This is a demo response. Configure your API key for real-time AI assistance!*`;
    }
    
    // Default response
    return `Hello! I'm Coach Qunal, your quantitative finance mentor. I can help you with:

**Core Topics:**
• Trading strategies and algorithms
• Risk management and portfolio theory
• Mathematical concepts (stochastic calculus, linear algebra)
• Programming for finance (Python, R, MATLAB)
• Career guidance in quantitative finance
• Financial modeling and valuation

**Try asking me about:**
- "What's the difference between alpha and beta?"
- "How do I calculate Value at Risk?"
- "Explain the Black-Scholes model"
- "What Python libraries should I use for trading?"

*Note: This is a demo response. Configure your API key for real-time AI assistance!*`;
  }

  getCurrentSession(): ChatSession | null {
    if (!this.currentSessionId) return null;
    return this.sessions.get(this.currentSessionId) || null;
  }

  getMessageHistory(): ChatMessage[] {
    const session = this.getCurrentSession();
    return session ? session.messages : [];
  }

  clearSession(): void {
    if (this.currentSessionId) {
      this.sessions.delete(this.currentSessionId);
    }
    this.initializeSession();
  }

  // Rate limiting (simple implementation)
  private lastRequestTime = 0;
  private readonly RATE_LIMIT_MS = 1000; // 1 second between requests

  private checkRateLimit(): boolean {
    const now = Date.now();
    if (now - this.lastRequestTime < this.RATE_LIMIT_MS) {
      return false;
    }
    this.lastRequestTime = now;
    return true;
  }

  async sendMessageWithRateLimit(content: string): Promise<ChatMessage> {
    if (!this.checkRateLimit()) {
      throw new Error('Please wait a moment before sending another message.');
    }
    return this.sendMessage(content);
  }
}

// Export singleton instance
export const chatbotService = new ChatbotService();
