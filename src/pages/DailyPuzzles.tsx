import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import { useState } from "react";

const DailyPuzzles = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'archive' | 'leaderboard'>('today');

  const todayPuzzles = [
    {
      id: 1,
      title: "Portfolio Optimization",
      difficulty: "Medium",
      category: "Risk Management",
      points: 150,
      timeLimit: "45min",
      description: "Optimize a portfolio of 20 assets to maximize Sharpe ratio while maintaining VaR constraints.",
      completed: false,
      progress: 0
    },
    {
      id: 2,
      title: "Black-Scholes Pricing",
      difficulty: "Hard",
      category: "Options",
      points: 200,
      timeLimit: "60min",
      description: "Implement and validate Black-Scholes model for European options with dividend adjustments.",
      completed: false,
      progress: 0
    },
    {
      id: 3,
      title: "Monte Carlo Simulation",
      difficulty: "Easy",
      category: "Simulation",
      points: 100,
      timeLimit: "30min",
      description: "Simulate 10,000 price paths for a stock using geometric Brownian motion.",
      completed: true,
      progress: 100
    }
  ];

  const archivePuzzles = [
    {
      id: 1,
      title: "Volatility Surface Construction",
      difficulty: "Hard",
      category: "Derivatives",
      points: 250,
      completed: true,
      date: "2024-01-14",
      score: 0.92
    },
    {
      id: 2,
      title: "Pairs Trading Strategy",
      difficulty: "Medium",
      category: "Strategy",
      points: 180,
      completed: true,
      date: "2024-01-13",
      score: 0.87
    },
    {
      id: 3,
      title: "Credit Risk Modeling",
      difficulty: "Hard",
      category: "Risk",
      points: 220,
      completed: false,
      date: "2024-01-12",
      score: null
    }
  ];

  const leaderboard = [
    { rank: 1, username: "QuantMaster_2024", score: 2847, streak: 15 },
    { rank: 2, username: "AlgoTrader_X", score: 2734, streak: 12 },
    { rank: 3, username: "RiskAnalyst_Pro", score: 2656, streak: 8 },
    { rank: 4, username: "MarketWizard_99", score: 2543, streak: 6 },
    { rank: 5, username: "VolatilityKing", score: 2487, streak: 4 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Header */}
      <section className="border-b border-border/50 bg-card/30">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <p className="text-primary font-mono text-sm mb-2">SKILL BUILDING</p>
              <h1 className="text-4xl md:text-5xl font-mono font-bold mb-4 text-foreground">
                DAILY PUZZLES
              </h1>
              <div className="h-px bg-primary w-24 mb-6"></div>
            </div>
            
            <p className="text-lg font-mono text-muted-foreground mb-8 leading-relaxed">
              Build core competencies through targeted exercises in quantitative finance and algorithmic trading.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-sm mb-8">
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">TOTAL SCORE</h3>
                <p className="text-accent text-lg font-bold">2,847</p>
              </div>
              
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">STREAK</h3>
                <p className="text-success text-lg font-bold">15 days</p>
              </div>
              
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">COMPLETED</h3>
                <p className="text-primary text-lg font-bold">127</p>
              </div>
              
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">AVG SCORE</h3>
                <p className="text-muted-foreground text-lg font-bold">0.89</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-6 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-2 mb-8 font-mono">
            <Button
              variant={activeTab === 'today' ? 'default' : 'outline'}
              onClick={() => setActiveTab('today')}
              className="rounded-none"
            >
              TODAY'S PUZZLES
            </Button>
            <Button
              variant={activeTab === 'archive' ? 'default' : 'outline'}
              onClick={() => setActiveTab('archive')}
              className="rounded-none"
            >
              ARCHIVE
            </Button>
            <Button
              variant={activeTab === 'leaderboard' ? 'default' : 'outline'}
              onClick={() => setActiveTab('leaderboard')}
              className="rounded-none"
            >
              LEADERBOARD
            </Button>
          </div>

          {/* Today's Puzzles Tab */}
          {activeTab === 'today' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-mono font-bold text-foreground">TODAY'S CHALLENGES</h2>
                <Badge variant="outline" className="border-accent/50 text-accent">
                  RESET IN 14:32:15
                </Badge>
              </div>

              {todayPuzzles.map((puzzle) => (
                <Card key={puzzle.id} className="card-terminal p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-mono text-foreground">{puzzle.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={`${
                            puzzle.difficulty === 'Easy' ? 'border-success/50 text-success' :
                            puzzle.difficulty === 'Medium' ? 'border-warning/50 text-warning' :
                            'border-destructive/50 text-destructive'
                          }`}
                        >
                          {puzzle.difficulty}
                        </Badge>
                        <Badge variant="outline" className="border-primary/50 text-primary">
                          {puzzle.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {puzzle.description}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm font-mono">
                        <span className="text-accent">Points: {puzzle.points}</span>
                        <span className="text-muted-foreground">Time: {puzzle.timeLimit}</span>
                      </div>
                    </div>
                  </div>

                  {!puzzle.completed && puzzle.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm font-mono mb-2">
                        <span>Progress</span>
                        <span>{puzzle.progress}%</span>
                      </div>
                      <Progress value={puzzle.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-4">
                    {puzzle.completed ? (
                      <Button variant="outline" className="rounded-none flex-1">
                        VIEW SOLUTION
                      </Button>
                    ) : (
                      <Button className="btn-terminal rounded-none flex-1">
                        {puzzle.progress > 0 ? 'CONTINUE' : 'START PUZZLE'}
                      </Button>
                    )}
                    <Button variant="outline" className="rounded-none">
                      HINTS
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Archive Tab */}
          {activeTab === 'archive' && (
            <div className="space-y-4">
              <h2 className="text-xl font-mono font-bold text-foreground mb-6">PUZZLE ARCHIVE</h2>

              {archivePuzzles.map((puzzle) => (
                <Card key={puzzle.id} className="card-terminal p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div>
                        <h3 className="text-lg font-mono text-foreground mb-1">{puzzle.title}</h3>
                        <p className="text-sm text-muted-foreground">Category: {puzzle.category}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Points: {puzzle.points}</p>
                        <p>Date: {puzzle.date}</p>
                      </div>
                      {puzzle.completed && (
                        <div className="text-sm font-mono">
                          <p className="text-muted-foreground mb-1">Score</p>
                          <p className="text-success font-bold">{(puzzle.score! * 100).toFixed(0)}%</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge 
                        variant={puzzle.completed ? 'default' : 'outline'}
                        className={puzzle.completed ? 'bg-success' : 'border-muted-foreground/50 text-muted-foreground'}
                      >
                        {puzzle.completed ? 'COMPLETED' : 'INCOMPLETE'}
                      </Badge>
                      <Button variant="outline" size="sm" className="rounded-none">
                        {puzzle.completed ? 'REVIEW' : 'ATTEMPT'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              <h2 className="text-xl font-mono font-bold text-foreground mb-6">DAILY LEADERBOARD</h2>

              <Card className="card-terminal p-6">
                <div className="space-y-4">
                  {leaderboard.map((player, index) => (
                    <div key={player.rank} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-sm ${
                          index === 0 ? 'text-accent' : 
                          index === 1 ? 'text-muted-foreground' : 
                          index === 2 ? 'text-warning' : 'text-foreground'
                        }`}>
                          #{player.rank}
                        </div>
                        <div>
                          <h3 className="font-mono text-foreground">{player.username}</h3>
                          <p className="text-sm text-muted-foreground">Streak: {player.streak} days</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-accent font-bold">{player.score}</p>
                        <p className="text-sm text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Subtle grid background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
    </div>
  );
};

export default DailyPuzzles;
