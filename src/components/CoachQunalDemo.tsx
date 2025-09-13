import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CoachQunalDemoProps {
  onStartChat: () => void;
}

export const CoachQunalDemo: React.FC<CoachQunalDemoProps> = ({ onStartChat }) => {
  const [showDemo, setShowDemo] = useState(false);

  const demoQuestions = [
    "What's the difference between alpha and beta in portfolio management?",
    "How do I calculate Value at Risk (VaR) for my trading strategy?",
    "Can you explain the Black-Scholes model in simple terms?",
    "What are the key metrics I should track for algorithmic trading?",
    "How do I implement a mean reversion strategy in Python?"
  ];

  const demoResponse = `Great question! Let me break this down for you:

**Alpha vs Beta:**
- **Alpha (α)**: Measures excess returns above what's expected based on risk. It's your "edge" - the value you add through skill or strategy.
- **Beta (β)**: Measures systematic risk relative to the market. A beta of 1.0 means the asset moves with the market.

**Key Differences:**
• Alpha is skill-based, Beta is risk-based
• Alpha can be positive/negative, Beta is typically positive
• Alpha is what you want to maximize, Beta is what you manage

**Practical Example:**
If your portfolio has α = 0.05 and β = 1.2, you're:
- Outperforming by 5% annually (alpha)
- 20% more volatile than the market (beta)

Would you like me to explain how to calculate these metrics for your specific strategy?`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Coach Qunal
            </h2>
            <p className="text-sm text-gray-600">Your AI Quantitative Finance Coach</p>
          </div>
        </div>
        
        <p className="text-gray-700 max-w-2xl mx-auto">
          Meet Coach Qunal, your personal AI mentor for quantitative finance. Get expert guidance on trading strategies, 
          risk management, mathematical concepts, and career development in quantitative finance.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <MessageCircle className="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold mb-2">Expert Guidance</h3>
            <p className="text-sm text-gray-600">
              Get answers to complex quant finance questions with detailed explanations and examples.
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <Sparkles className="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold mb-2">Personalized Learning</h3>
            <p className="text-sm text-gray-600">
              Receive tailored advice based on your skill level and learning goals.
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <Bot className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">24/7 Available</h3>
            <p className="text-sm text-gray-600">
              Access your quant finance coach anytime, anywhere on the platform.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Demo Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Try Coach Qunal</h3>
          <p className="text-sm text-gray-600">
            Click the chat bubble in the bottom-right corner to start a conversation!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {demoQuestions.map((question, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => setShowDemo(true)}
              >
                {question}
              </Badge>
            ))}
          </div>
          
          {showDemo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-2">Coach Qunal</p>
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {demoResponse}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div className="flex justify-center">
            <Button 
              onClick={onStartChat}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Chatting with Coach Qunal
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default CoachQunalDemo;
