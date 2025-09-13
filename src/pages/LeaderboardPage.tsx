import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp,
  Zap,
  Target,
  Crown,
  Star,
  Flame,
  Clock,
  Users,
  Activity,
  BarChart3,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { useState, useEffect } from "react";

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'weekly' | 'monthly'>('global');
  const [liveActivity, setLiveActivity] = useState<any[]>([]);
  const [currentUser] = useState({
    username: "QuantTrader_2024",
    rank: 47,
    rating: 1847,
    winRate: 68.4,
    streak: 5,
    totalBattles: 127,
    puzzlesSolved: 89,
    crashSurvivals: 3,
    achievements: 12
  });

  const globalLeaderboard = [
    {
      rank: 1,
      username: "QuantKing",
      rating: 2847,
      winRate: 94.2,
      streak: 12,
      specialty: "Risk Master",
      avatar: "QK",
      change: "up",
      changeValue: 23
    },
    {
      rank: 2, 
      username: "AlgoWiz",
      rating: 2731,
      winRate: 91.8,
      streak: 8,
      specialty: "Speed Solver",
      avatar: "AW",
      change: "down",
      changeValue: 5
    },
    {
      rank: 3,
      username: "StatSensei", 
      rating: 2698,
      winRate: 89.4,
      streak: 5,
      specialty: "Crash Survivor",
      avatar: "SS",
      change: "up",
      changeValue: 12
    },
    {
      rank: 4,
      username: "DerivativeDealer",
      rating: 2654,
      winRate: 87.9,
      streak: 3,
      specialty: "Portfolio Pro",
      avatar: "DD",
      change: "stable",
      changeValue: 0
    },
    {
      rank: 5,
      username: "VaRViking",
      rating: 2611,
      winRate: 86.1,
      streak: 7,
      specialty: "Battle Tested",
      avatar: "VV",
      change: "up",
      changeValue: 8
    },
    {
      rank: 6,
      username: "MarketMaven",
      rating: 2589,
      winRate: 84.7,
      streak: 4,
      specialty: "Trend Tracker",
      avatar: "MM",
      change: "down",
      changeValue: 3
    },
    {
      rank: 7,
      username: "VolatilityViper",
      rating: 2556,
      winRate: 83.2,
      streak: 6,
      specialty: "Volatility Expert",
      avatar: "VV",
      change: "up",
      changeValue: 15
    },
    {
      rank: 8,
      username: "RiskRanger",
      rating: 2523,
      winRate: 81.9,
      streak: 2,
      specialty: "Risk Analyst",
      avatar: "RR",
      change: "stable",
      changeValue: 0
    },
    {
      rank: 9,
      username: "AlgorithmAce",
      rating: 2491,
      winRate: 80.4,
      streak: 9,
      specialty: "Algo Master",
      avatar: "AA",
      change: "up",
      changeValue: 7
    },
    {
      rank: 10,
      username: "PortfolioPilot",
      rating: 2458,
      winRate: 79.1,
      streak: 3,
      specialty: "Portfolio Manager",
      avatar: "PP",
      change: "down",
      changeValue: 2
    }
  ];

  const recentAchievements = [
    {
      id: 1,
      icon: Crown,
      title: "Crash Survivor",
      description: "Survived 2008 Financial Crisis simulation",
      rarity: "Legendary",
      color: "text-yellow-400",
      earnedDate: "2024-01-15",
      xpReward: 500
    },
    {
      id: 2,
      icon: Zap,
      title: "Speed Demon",
      description: "Solved puzzle in under 30 seconds",
      rarity: "Epic", 
      color: "text-purple-400",
      earnedDate: "2024-01-14",
      xpReward: 300
    },
    {
      id: 3,
      icon: Target,
      title: "Precision Trader",
      description: "Won 5 battles in a row",
      rarity: "Rare",
      color: "text-blue-400",
      earnedDate: "2024-01-13",
      xpReward: 200
    },
    {
      id: 4,
      icon: Star,
      title: "Puzzle Master",
      description: "Solved 50 daily puzzles",
      rarity: "Rare",
      color: "text-green-400",
      earnedDate: "2024-01-12",
      xpReward: 250
    },
    {
      id: 5,
      icon: Flame,
      title: "Hot Streak",
      description: "Maintained 7-day win streak",
      rarity: "Epic",
      color: "text-orange-400",
      earnedDate: "2024-01-11",
      xpReward: 400
    }
  ];

  const liveActivityData = [
    { id: 1, user: "QuantKing", action: "won", target: "AlgoWiz", time: "2m ago", type: "battle" },
    { id: 2, user: "StatSensei", action: "solved", target: "Portfolio Optimization", time: "5m ago", type: "puzzle" },
    { id: 3, user: "VaRViking", action: "survived", target: "COVID-19 Crash", time: "8m ago", type: "crash" },
    { id: 4, user: "DerivativeDealer", action: "achieved", target: "Risk Master", time: "12m ago", type: "achievement" },
    { id: 5, user: "MarketMaven", action: "won", target: "RiskRanger", time: "15m ago", type: "battle" },
    { id: 6, user: "VolatilityViper", action: "solved", target: "Black-Scholes Pricing", time: "18m ago", type: "puzzle" },
    { id: 7, user: "AlgorithmAce", action: "survived", target: "Dot-com Bubble", time: "22m ago", type: "crash" },
    { id: 8, user: "PortfolioPilot", action: "achieved", target: "Speed Demon", time: "25m ago", type: "achievement" }
  ];

  const userStats = [
    { label: "Total Battles", value: currentUser.totalBattles, change: "+12", changeType: "up" },
    { label: "Puzzles Solved", value: currentUser.puzzlesSolved, change: "+8", changeType: "up" },
    { label: "Crash Survivals", value: currentUser.crashSurvivals, change: "+1", changeType: "up" },
    { label: "Achievements", value: currentUser.achievements, change: "+2", changeType: "up" },
    { label: "Win Rate", value: `${currentUser.winRate}%`, change: "+2.1%", changeType: "up" },
    { label: "Current Streak", value: currentUser.streak, change: "+3", changeType: "up" }
  ];

  // Simulate live activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivity(prev => {
        const newActivity = [...prev];
        if (newActivity.length > 8) {
          newActivity.shift();
        }
        const randomActivity = liveActivityData[Math.floor(Math.random() * liveActivityData.length)];
        newActivity.push({ ...randomActivity, id: Date.now(), time: "now" });
        return newActivity;
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4" />;
    if (rank === 2) return <Medal className="h-4 w-4" />;
    if (rank === 3) return <Award className="h-4 w-4" />;
    return rank;
  };

  const getChangeIcon = (change: string) => {
    if (change === "up") return <ArrowUp className="h-3 w-3 text-success" />;
    if (change === "down") return <ArrowDown className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="border-b border-border/50 bg-card/30">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <p className="text-primary font-mono text-sm mb-2">COMPETITIVE RANKINGS</p>
              <h1 className="text-4xl md:text-5xl font-mono font-bold mb-4 text-foreground">
                LEADERBOARD
              </h1>
              <div className="h-px bg-primary w-24 mb-6"></div>
            </div>
            
            <p className="text-lg font-mono text-muted-foreground mb-8 leading-relaxed">
              Track your progress against the elite quantitative minds. Climb the rankings through skillful battles, puzzle mastery, and market crash survival.
            </p>

            {/* Current User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-sm mb-8">
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">YOUR RANK</h3>
                <p className="text-accent text-lg font-bold">#{currentUser.rank}</p>
              </div>
              
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">RATING</h3>
                <p className="text-success text-lg font-bold">{currentUser.rating}</p>
              </div>
              
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">WIN RATE</h3>
                <p className="text-primary text-lg font-bold">{currentUser.winRate}%</p>
              </div>
              
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">CURRENT STREAK</h3>
                <p className="text-warning text-lg font-bold">{currentUser.streak}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Leaderboard */}
            <div className="lg:col-span-2 space-y-6">
              {/* Leaderboard Tabs */}
              <div className="flex gap-2 font-mono">
                <Button
                  variant={activeTab === 'global' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('global')}
                  className="rounded-none"
                >
                  GLOBAL
                </Button>
                <Button
                  variant={activeTab === 'weekly' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('weekly')}
                  className="rounded-none"
                >
                  WEEKLY
                </Button>
                <Button
                  variant={activeTab === 'monthly' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('monthly')}
                  className="rounded-none"
                >
                  MONTHLY
                </Button>
              </div>

              {/* Leaderboard */}
              <Card className="card-terminal">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Trophy className="h-6 w-6 text-accent" />
                    <h2 className="text-xl font-mono font-bold text-foreground">
                      {activeTab.toUpperCase()} RANKINGS
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {globalLeaderboard.map((player) => (
                      <div 
                        key={player.rank}
                        className="flex items-center justify-between p-4 rounded-lg bg-card/50 hover:bg-card/80 transition-all duration-200 border border-border/30"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                            player.rank === 1 ? 'bg-accent text-accent-foreground' :
                            player.rank === 2 ? 'bg-muted-foreground text-background' :
                            player.rank === 3 ? 'bg-warning text-warning-foreground' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {getRankIcon(player.rank)}
                          </div>
                          
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-primary text-primary-foreground font-mono">
                              {player.avatar}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="font-mono text-foreground font-semibold">{player.username}</div>
                            <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                              {player.specialty}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <div className="font-mono font-bold text-lg text-foreground">{player.rating}</div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">{player.winRate}% WR</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{player.streak} streak</span>
                            <div className="flex items-center gap-1">
                              {getChangeIcon(player.change)}
                              <span className={`text-xs ${
                                player.change === 'up' ? 'text-success' :
                                player.change === 'down' ? 'text-destructive' :
                                'text-muted-foreground'
                              }`}>
                                {player.changeValue}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              
              {/* Recent Achievements */}
              <Card className="card-terminal">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Award className="h-6 w-6 text-accent" />
                    <h3 className="text-lg font-mono font-bold text-foreground">RECENT ACHIEVEMENTS</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {recentAchievements.map((achievement) => {
                      const Icon = achievement.icon;
                      return (
                        <div key={achievement.id} className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/30">
                          <Icon className={`h-6 w-6 ${achievement.color} flex-shrink-0 mt-0.5`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-sm text-foreground font-semibold">{achievement.title}</div>
                            <div className="text-xs text-muted-foreground mb-2">
                              {achievement.description}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                                {achievement.rarity}
                              </Badge>
                              <span className="text-xs text-accent">+{achievement.xpReward} XP</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {achievement.earnedDate}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>

              {/* Live Activity */}
              <Card className="card-terminal">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="h-6 w-6 text-success" />
                    <h3 className="text-lg font-mono font-bold text-foreground">LIVE ACTIVITY</h3>
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-3">
                    {liveActivity.length > 0 ? liveActivity.slice(-6).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg bg-card/30">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-mono text-foreground">
                            <span className="text-primary">{activity.user}</span> {activity.action} <span className="text-accent">{activity.target}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{activity.time}</div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-sm text-muted-foreground font-mono text-center py-4">
                        No recent activity
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* User Statistics */}
              <Card className="card-terminal">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-mono font-bold text-foreground">YOUR STATS</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {userStats.map((stat, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-mono text-muted-foreground">{stat.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-foreground font-semibold">{stat.value}</span>
                            <div className="flex items-center gap-1">
                              {stat.changeType === 'up' ? <ArrowUp className="h-3 w-3 text-success" /> :
                               stat.changeType === 'down' ? <ArrowDown className="h-3 w-3 text-destructive" /> :
                               <Minus className="h-3 w-3 text-muted-foreground" />}
                              <span className={`text-xs ${
                                stat.changeType === 'up' ? 'text-success' :
                                stat.changeType === 'down' ? 'text-destructive' :
                                'text-muted-foreground'
                              }`}>
                                {stat.change}
                              </span>
                            </div>
                          </div>
                        </div>
                        {stat.label === 'Win Rate' && (
                          <Progress value={currentUser.winRate} className="h-1.5" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="card-terminal">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="h-6 w-6 text-warning" />
                    <h3 className="text-lg font-mono font-bold text-foreground">QUICK ACTIONS</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="btn-terminal rounded-none w-full">
                      <Target className="mr-2 h-4 w-4" />
                      FIND OPPONENT
                    </Button>
                    <Button variant="outline" className="rounded-none w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      DAILY PUZZLE
                    </Button>
                    <Button variant="outline" className="rounded-none w-full">
                      <Users className="mr-2 h-4 w-4" />
                      VIEW PROFILE
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
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

export default LeaderboardPage;
