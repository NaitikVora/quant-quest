import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp,
  Zap,
  Target,
  Crown,
  Users,
  TrendingDown,
  BarChart3,
  Brain,
  Sword
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserService } from "@/services/userService";
import { User } from "@/types/user";

// Fallback data for when no users are available
const fallbackLeaderboardData = [
  {
    rank: 1,
    username: "QuantKing",
    rating: 2847,
    winRate: 94.2,
    streak: 12,
    specialty: "Risk Master",
    avatar: "QK"
  },
  {
    rank: 2, 
    username: "AlgoWiz",
    rating: 2731,
    winRate: 91.8,
    streak: 8,
    specialty: "Speed Solver",
    avatar: "AW"
  },
  {
    rank: 3,
    username: "StatSensei", 
    rating: 2698,
    winRate: 89.4,
    streak: 5,
    specialty: "Crash Survivor",
    avatar: "SS"
  },
  {
    rank: 4,
    username: "DerivativeDealer",
    rating: 2654,
    winRate: 87.9,
    streak: 3,
    specialty: "Portfolio Pro",
    avatar: "DD"
  },
  {
    rank: 5,
    username: "VaRViking",
    rating: 2611,
    winRate: 86.1,
    streak: 7,
    specialty: "Battle Tested",
    avatar: "VV"
  }
];

const achievements = [
  {
    icon: Crown,
    title: "Crash Survivor",
    description: "Survived 2008 Financial Crisis",
    rarity: "Legendary",
    color: "text-yellow-400"
  },
  {
    icon: Zap,
    title: "Speed Demon",
    description: "Solved puzzle in under 30s",
    rarity: "Epic", 
    color: "text-purple-400"
  },
  {
    icon: Target,
    title: "Precision Trader",
    description: "Won 10 battles in a row",
    rarity: "Rare",
    color: "text-blue-400"
  }
];

export const Leaderboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('global');
  const [globalLeaderboard, setGlobalLeaderboard] = useState<User[]>([]);
  const [tradingLeaderboard, setTradingLeaderboard] = useState<User[]>([]);
  const [skillsLeaderboard, setSkillsLeaderboard] = useState<User[]>([]);
  const [challengesLeaderboard, setChallengesLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveStats, setLiveStats] = useState({
    playersOnline: 0,
    activeBattles: 0,
    puzzlesSolvedToday: 0
  });

  useEffect(() => {
    loadLeaderboards();
    loadLiveStats();
  }, []);

  const loadLeaderboards = async () => {
    try {
      setLoading(true);
      const [global, trading, skills, challenges] = await Promise.all([
        UserService.getGlobalLeaderboard(50),
        UserService.getTradingLeaderboard(50),
        UserService.getSkillsLeaderboard(50),
        UserService.getGlobalLeaderboard(50) // Using global for challenges for now
      ]);
      
      setGlobalLeaderboard(global);
      setTradingLeaderboard(trading);
      setSkillsLeaderboard(skills);
      setChallengesLeaderboard(challenges);
    } catch (error) {
      console.error('Error loading leaderboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLiveStats = async () => {
    // In a real app, this would come from a real-time service
    setLiveStats({
      playersOnline: Math.floor(Math.random() * 1000) + 2000,
      activeBattles: Math.floor(Math.random() * 100) + 100,
      puzzlesSolvedToday: Math.floor(Math.random() * 5000) + 5000
    });
  };

  const getCurrentLeaderboard = () => {
    switch (activeTab) {
      case 'trading':
        return tradingLeaderboard;
      case 'skills':
        return skillsLeaderboard;
      case 'challenges':
        return challengesLeaderboard;
      default:
        return globalLeaderboard;
    }
  };

  const getSpecialty = (user: User) => {
    if (user.stats.winRate >= 90) return 'Risk Master';
    if (user.stats.totalChallenges >= 50) return 'Battle Tested';
    if (user.skills.totalSkillPoints >= 1000) return 'Skill Master';
    if (user.stats.totalSimulations >= 100) return 'Crash Survivor';
    return user.profile.experience;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4" />;
    if (rank === 2) return <Medal className="h-4 w-4" />;
    if (rank === 3) return <Award className="h-4 w-4" />;
    return rank;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-400 text-yellow-900';
    if (rank === 2) return 'bg-gray-300 text-gray-800';
    if (rank === 3) return 'bg-amber-600 text-amber-100';
    return 'bg-muted text-muted-foreground';
  };

  const getScore = (user: User, type: string) => {
    switch (type) {
      case 'trading':
        return user.stats.netProfit;
      case 'skills':
        return user.skills.totalSkillPoints;
      case 'challenges':
        return user.stats.challengesWon;
      default:
        return user.leaderboard.globalPoints;
    }
  };

  const getScoreLabel = (type: string) => {
    switch (type) {
      case 'trading':
        return 'Net Profit';
      case 'skills':
        return 'Skill Points';
      case 'challenges':
        return 'Wins';
      default:
        return 'Points';
    }
  };

  const currentLeaderboard = getCurrentLeaderboard();
  const displayData = currentLeaderboard.length > 0 ? currentLeaderboard : fallbackLeaderboardData;

  return (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
              Hall of Fame
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The elite quantitative minds leading the competition. Climb the rankings 
            through skillful battles, puzzle mastery, and market crash survival.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Trophy className="mr-3 h-6 w-6 text-yellow-400" />
                  Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="global" className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Global
                    </TabsTrigger>
                    <TabsTrigger value="trading" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Trading
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Skills
                    </TabsTrigger>
                    <TabsTrigger value="challenges" className="flex items-center gap-2">
                      <Sword className="h-4 w-4" />
                      Battles
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={activeTab} className="mt-6">
                    <div className="space-y-4">
                      {loading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          <p className="text-muted-foreground mt-2">Loading leaderboard...</p>
                        </div>
                      ) : (
                        displayData.map((player, index) => {
                          const rank = index + 1;
                          const isCurrentUser = user && player.uid === user.uid;
                          const score = currentLeaderboard.length > 0 ? getScore(player, activeTab) : player.rating;
                          
                          return (
                            <div 
                              key={player.uid || player.rank}
                              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                                isCurrentUser 
                                  ? 'bg-primary/20 border border-primary/50' 
                                  : 'bg-muted/20 hover:bg-muted/40'
                              }`}
                            >
                              <div className="flex items-center space-x-4">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${getRankColor(rank)}`}>
                                  {getRankIcon(rank)}
                                </div>
                                
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className="bg-primary text-primary-foreground">
                                    {currentLeaderboard.length > 0 
                                      ? player.displayName.substring(0, 2).toUpperCase()
                                      : player.avatar
                                    }
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div>
                                  <div className="font-semibold flex items-center gap-2">
                                    {currentLeaderboard.length > 0 ? player.displayName : player.username}
                                    {isCurrentUser && <Badge variant="secondary" className="text-xs">You</Badge>}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {currentLeaderboard.length > 0 ? getSpecialty(player) : player.specialty}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="text-right space-y-1">
                                <div className="font-bold text-lg">
                                  {typeof score === 'number' ? score.toLocaleString() : score}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {currentLeaderboard.length > 0 ? (
                                    <>
                                      {player.stats.winRate.toFixed(1)}% WR • {player.stats.currentStreak} streak
                                    </>
                                  ) : (
                                    <>
                                      {player.winRate}% WR • {player.streak} streak
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6 text-center">
                  <Button variant="outline" className="w-full">
                    View Full Rankings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* User Stats (if logged in) */}
            {user && (
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Global Rank</span>
                      <span className="font-semibold text-primary">#{user.leaderboard.globalRank}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Win Rate</span>
                      <span className="font-semibold text-success">{user.stats.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Simulations</span>
                      <span className="font-semibold text-accent">{user.stats.totalSimulations}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Challenges Won</span>
                      <span className="font-semibold text-warning">{user.stats.challengesWon}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Skill Points</span>
                      <span className="font-semibold text-primary">{user.skills.totalSkillPoints}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Achievements */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-accent" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user && user.achievements.recentUnlocks.length > 0 ? (
                    user.achievements.recentUnlocks.slice(0, 3).map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20">
                        <span className="text-2xl flex-shrink-0 mt-0.5">{achievement.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{achievement.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {achievement.description}
                          </div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {achievement.rarity}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    achievements.map((achievement, index) => {
                      const Icon = achievement.icon;
                      return (
                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20">
                          <Icon className={`h-6 w-6 ${achievement.color} flex-shrink-0 mt-0.5`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{achievement.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {achievement.description}
                            </div>
                            <Badge variant="outline" className="text-xs mt-1">
                              {achievement.rarity}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Live Activity */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-success" />
                  Live Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Players Online</span>
                    <span className="font-semibold text-success">{liveStats.playersOnline.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Battles</span>
                    <span className="font-semibold text-accent">{liveStats.activeBattles}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Puzzles Solved Today</span>
                    <span className="font-semibold text-primary">{liveStats.puzzlesSolvedToday.toLocaleString()}</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4 btn-success">
                  <Zap className="mr-2 h-4 w-4" />
                  Quick Match
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};