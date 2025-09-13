import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Swords, 
  Puzzle, 
  Skull, 
  Users, 
  Zap, 
  Timer,
  Trophy,
  Target,
  TrendingDown
} from "lucide-react";

const features = [
  {
    icon: Swords,
    title: "1v1 Trading Battles",
    description: "Face off against other players in real-time trading competitions using identical historical market data.",
    details: [
      "Real-time matchmaking with skill-based opponents",
      "Judged on Sharpe ratio, max drawdown, and strategy robustness",
      "Live chat during battles for psychological warfare",
      "Climb the competitive leaderboards"
    ],
    status: "Live Now",
    statusColor: "success",
    cta: "Challenge Player"
  },
  {
    icon: Puzzle,
    title: "Daily Quant Puzzles",
    description: "Sharpen your skills with bite-sized challenges that build core quantitative finance competencies.",
    details: [
      "Daily rotation of backtesting fixes and overfitting detection",
      "XP rewards and streak multipliers for consistency",
      "Leaderboards for fastest solvers and highest accuracy",
      "Unlock advanced puzzles as your skills progress"
    ],
    status: "New Puzzle",
    statusColor: "primary",
    cta: "Solve Today's Puzzle"
  },
  {
    icon: Skull,
    title: "Boss Battles: Market Crashes",
    description: "Test your resilience against legendary market events. Survive the chaos and emerge stronger.",
    details: [
      "Recreated historical crashes: 2008 Financial Crisis, COVID-19, Dot-com Bubble",
      "Multiple difficulty levels with different preparation time",
      "Earn rare badges and character stat boosts for survival",
      "Unlock exclusive strategies and risk management tools"
    ],
    status: "Epic Mode",
    statusColor: "destructive",
    cta: "Face the Crash"
  }
];

export const Features = () => {
  return (
    <section className="py-24 px-6 bg-muted/5">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Three Ways to <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">Dominate</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose your path to quant mastery. Each game mode builds different skills 
            and offers unique rewards to fuel your progression.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const statusColors = {
              success: "bg-success text-success-foreground",
              primary: "bg-primary text-primary-foreground", 
              destructive: "bg-destructive text-destructive-foreground"
            };
            
            return (
              <Card 
                key={index}
                className="card-glow hover:scale-105 transition-all duration-500 relative overflow-hidden"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="absolute top-4 right-4">
                  <Badge className={statusColors[feature.statusColor as keyof typeof statusColors]}>
                    {feature.status}
                  </Badge>
                </div>
                
                <CardHeader className="pb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 animate-pulse-glow">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-3">{feature.title}</CardTitle>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent/20 mr-3 mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                        </div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full btn-hero"
                    size="lg"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    {feature.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Card className="card-glow max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Players</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-success mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Daily Battles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">Unique Puzzles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-destructive mb-2">15</div>
                  <div className="text-sm text-muted-foreground">Market Crashes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};