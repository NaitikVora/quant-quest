import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp,
  Zap,
  Crown,
  ArrowUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LeaderboardPreview = () => {
  const navigate = useNavigate();

  const topPlayers = [
    {
      rank: 1,
      username: "QuantKing",
      rating: 2847,
      winRate: 94.2,
      specialty: "Risk Master",
      avatar: "QK"
    },
    {
      rank: 2, 
      username: "AlgoWiz",
      rating: 2731,
      winRate: 91.8,
      specialty: "Speed Solver",
      avatar: "AW"
    },
    {
      rank: 3,
      username: "StatSensei", 
      rating: 2698,
      winRate: 89.4,
      specialty: "Crash Survivor",
      avatar: "SS"
    }
  ];

  const currentUser = {
    rank: 47,
    rating: 1847,
    winRate: 68.4,
    streak: 5
  };

  const liveStats = {
    playersOnline: 2847,
    activeBattles: 142,
    puzzlesSolvedToday: 8931
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4" />;
    if (rank === 2) return <Medal className="h-4 w-4" />;
    if (rank === 3) return <Award className="h-4 w-4" />;
    return rank;
  };

  return (
    <section className="py-20 px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12">
          <h2 className="text-2xl font-mono font-bold mb-2 text-primary">
            LEADERBOARD
          </h2>
          <div className="h-px bg-primary/30 w-full mb-8"></div>
          <p className="text-muted-foreground font-mono text-sm mb-6">
            Compete with the elite quantitative minds. Track your progress and climb the rankings through skillful battles and puzzle mastery.
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
              <h3 className="text-foreground mb-1">STREAK</h3>
              <p className="text-warning text-lg font-bold">{currentUser.streak}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Players */}
          <Card className="card-terminal p-6">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="h-6 w-6 text-accent" />
              <h3 className="text-lg font-mono font-bold text-foreground">TOP PLAYERS</h3>
            </div>
            
            <div className="space-y-4">
              {topPlayers.map((player) => (
                <div 
                  key={player.rank}
                  className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      player.rank === 1 ? 'bg-accent text-accent-foreground' :
                      player.rank === 2 ? 'bg-muted-foreground text-background' :
                      player.rank === 3 ? 'bg-warning text-warning-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {getRankIcon(player.rank)}
                    </div>
                    
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground font-mono text-xs">
                        {player.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="font-mono text-sm text-foreground font-semibold">{player.username}</div>
                      <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                        {player.specialty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-foreground">{player.rating}</div>
                    <div className="text-xs text-muted-foreground">{player.winRate}% WR</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Live Activity */}
          <Card className="card-terminal p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-success" />
              <h3 className="text-lg font-mono font-bold text-foreground">LIVE STATS</h3>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono text-muted-foreground">Players Online</span>
                <span className="font-mono font-semibold text-success">{liveStats.playersOnline.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono text-muted-foreground">Active Battles</span>
                <span className="font-mono font-semibold text-accent">{liveStats.activeBattles}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono text-muted-foreground">Puzzles Solved Today</span>
                <span className="font-mono font-semibold text-primary">{liveStats.puzzlesSolvedToday.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            className="btn-terminal rounded-none flex-1"
            onClick={() => navigate('/leaderboard')}
          >
            VIEW FULL LEADERBOARD
          </Button>
          <Button 
            variant="outline" 
            className="rounded-none"
            onClick={() => navigate('/1v1')}
          >
            <Zap className="mr-2 h-4 w-4" />
            QUICK MATCH
          </Button>
        </div>
      </div>
    </section>
  );
};
