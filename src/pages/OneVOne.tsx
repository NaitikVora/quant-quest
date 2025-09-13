import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import ArcadeBattle from "@/components/ArcadeBattle";
import { useState } from "react";

const OneVOne = () => {
  const [activeTab, setActiveTab] = useState<'lobby' | 'active' | 'history'>('lobby');
  const [showArcadeBattle, setShowArcadeBattle] = useState(false);

  const lobbyMatches = [
    {
      id: 1,
      opponent: "QuantMaster_2024",
      rating: 1847,
      timeLimit: "30min",
      dataset: "SPY_2023",
      status: "waiting"
    },
    {
      id: 2,
      opponent: "AlgoTrader_X",
      rating: 1923,
      timeLimit: "45min",
      dataset: "BTC_2022",
      status: "waiting"
    },
    {
      id: 3,
      opponent: "RiskAnalyst_Pro",
      rating: 1756,
      timeLimit: "60min",
      dataset: "VIX_2020",
      status: "waiting"
    }
  ];

  const activeMatches = [
    {
      id: 1,
      opponent: "MarketWizard_99",
      rating: 1987,
      timeRemaining: "23:45",
      dataset: "NASDAQ_2021",
      myScore: 0.847,
      opponentScore: 0.823,
      progress: 65
    }
  ];

  const matchHistory = [
    {
      id: 1,
      opponent: "QuantKing_Alpha",
      rating: 2012,
      result: "victory",
      score: "0.912 vs 0.887",
      dataset: "EURUSD_2023",
      date: "2024-01-15"
    },
    {
      id: 2,
      opponent: "RiskMaster_Beta",
      rating: 1893,
      result: "defeat",
      score: "0.756 vs 0.891",
      dataset: "GOLD_2022",
      date: "2024-01-14"
    }
  ];

  const handleStartArcadeBattle = () => {
    setShowArcadeBattle(true);
  };

  const handleReturnToLobby = () => {
    setShowArcadeBattle(false);
  };

  // Show arcade battle if active
  if (showArcadeBattle) {
    return <ArcadeBattle onReturnToLobby={handleReturnToLobby} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Header */}
      <section className="border-b border-border/50 bg-card/30">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <p className="text-primary font-mono text-sm mb-2">COMPETITIVE TRADING</p>
              <h1 className="text-4xl md:text-5xl font-mono font-bold mb-4 text-foreground">
                1V1 CHALLENGES
              </h1>
              <div className="h-px bg-primary w-24 mb-6"></div>
              
              {/* Arcade Mode Banner */}
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-purple-400/30 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-mono font-bold text-purple-400 mb-2">
                      🎮 ARCADE MODE AVAILABLE! 🎮
                    </h2>
                    <p className="text-sm text-purple-300 font-mono">
                      Experience high-energy, retro-style battles with animated progress bars, 
                      confetti effects, and competitive dopamine triggers!
                    </p>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono font-bold px-6 py-3 rounded-lg border-2 border-purple-400"
                    onClick={handleStartArcadeBattle}
                  >
                    START ARCADE BATTLE
                  </Button>
                </div>
              </div>
            </div>
            
            <p className="text-lg font-mono text-muted-foreground mb-8 leading-relaxed">
              Head-to-head competition on identical market data. Performance measured by Sharpe ratio and max drawdown.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-sm mb-8">
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">CURRENT RATING</h3>
                <p className="text-accent text-lg font-bold">1,847</p>
              </div>
              
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">WIN RATE</h3>
                <p className="text-success text-lg font-bold">68.4%</p>
              </div>
              
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">ACTIVE MATCHES</h3>
                <p className="text-primary text-lg font-bold">1</p>
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
              variant={activeTab === 'lobby' ? 'default' : 'outline'}
              onClick={() => setActiveTab('lobby')}
              className="rounded-none"
            >
              MATCHMAKING
            </Button>
            <Button
              variant={activeTab === 'active' ? 'default' : 'outline'}
              onClick={() => setActiveTab('active')}
              className="rounded-none"
            >
              ACTIVE MATCHES
            </Button>
            <Button
              variant={activeTab === 'history' ? 'default' : 'outline'}
              onClick={() => setActiveTab('history')}
              className="rounded-none"
            >
              HISTORY
            </Button>
          </div>

          {/* Lobby Tab */}
          {activeTab === 'lobby' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-mono font-bold text-foreground">AVAILABLE MATCHES</h2>
                <Button 
                  className="btn-terminal rounded-none"
                  onClick={handleStartArcadeBattle}
                >
                  CREATE MATCH
                </Button>
              </div>

              {lobbyMatches.map((match) => (
                <Card key={match.id} className="card-terminal p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div>
                        <h3 className="text-lg font-mono text-foreground mb-1">{match.opponent}</h3>
                        <p className="text-sm text-muted-foreground">Rating: {match.rating}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Dataset: {match.dataset}</p>
                        <p>Time Limit: {match.timeLimit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="border-primary/50 text-primary">
                        {match.status.toUpperCase()}
                      </Badge>
                      <Button 
                        size="sm" 
                        className="btn-terminal rounded-none"
                        onClick={handleStartArcadeBattle}
                      >
                        JOIN
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Active Matches Tab */}
          {activeTab === 'active' && (
            <div className="space-y-4">
              <h2 className="text-xl font-mono font-bold text-foreground mb-6">ONGOING MATCHES</h2>

              {activeMatches.map((match) => (
                <Card key={match.id} className="card-terminal p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-mono text-foreground">{match.opponent}</h3>
                      <div className="text-sm text-muted-foreground">
                        Time Remaining: <span className="text-accent font-bold">{match.timeRemaining}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm font-mono mb-2">
                        <span>Progress</span>
                        <span>{match.progress}%</span>
                      </div>
                      <Progress value={match.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                      <div>
                        <p className="text-muted-foreground mb-1">Your Score</p>
                        <p className="text-success text-lg font-bold">{match.myScore}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Opponent Score</p>
                        <p className="text-muted-foreground text-lg font-bold">{match.opponentScore}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      className="btn-terminal rounded-none flex-1"
                      onClick={handleStartArcadeBattle}
                    >
                      CONTINUE MATCH
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-none"
                      onClick={handleStartArcadeBattle}
                    >
                      SPECTATE
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h2 className="text-xl font-mono font-bold text-foreground mb-6">MATCH HISTORY</h2>

              {matchHistory.map((match) => (
                <Card key={match.id} className="card-terminal p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div>
                        <h3 className="text-lg font-mono text-foreground mb-1">{match.opponent}</h3>
                        <p className="text-sm text-muted-foreground">Rating: {match.rating}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Dataset: {match.dataset}</p>
                        <p>Date: {match.date}</p>
                      </div>
                      <div className="text-sm font-mono">
                        <p className="text-muted-foreground mb-1">Score</p>
                        <p className="text-foreground">{match.score}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge 
                        variant={match.result === 'victory' ? 'default' : 'destructive'}
                        className={match.result === 'victory' ? 'bg-success' : ''}
                      >
                        {match.result.toUpperCase()}
                      </Badge>
                      <Button variant="outline" size="sm" className="rounded-none">
                        REPLAY
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
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

import { Footer } from "@/components/Footer";

const OneVOneWithFooter = () => (
  <>
    <OneVOne />
    <Footer />
  </>
);

export default OneVOneWithFooter;
