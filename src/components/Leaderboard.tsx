import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp,
  Zap,
  Target,
  Crown
} from "lucide-react";

const leaderboardData = [
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
                  Global Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboardData.map((player, index) => (
                    <div 
                      key={player.rank}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          player.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                          player.rank === 2 ? 'bg-gray-300 text-gray-800' :
                          player.rank === 3 ? 'bg-amber-600 text-amber-100' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {player.rank <= 3 ? (
                            player.rank === 1 ? <Crown className="h-4 w-4" /> :
                            player.rank === 2 ? <Medal className="h-4 w-4" /> :
                            <Award className="h-4 w-4" />
                          ) : (
                            player.rank
                          )}
                        </div>
                        
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {player.avatar}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="font-semibold">{player.username}</div>
                          <Badge variant="outline" className="text-xs">
                            {player.specialty}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="font-bold text-lg">{player.rating}</div>
                        <div className="text-xs text-muted-foreground">
                          {player.winRate}% WR • {player.streak} streak
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
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
                  {achievements.map((achievement, index) => {
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
                  })}
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
                    <span className="font-semibold text-success">2,847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Battles</span>
                    <span className="font-semibold text-accent">142</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Puzzles Solved Today</span>
                    <span className="font-semibold text-primary">8,931</span>
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