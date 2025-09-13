import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Target, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-bg">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="animate-slide-up">
          <Badge variant="secondary" className="mb-6 text-lg px-4 py-2">
            🎮 Chess.com meets Wall Street
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            QuantQuest
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            Master quantitative finance through <span className="text-accent font-semibold">gamified challenges</span>, 
            <span className="text-success font-semibold"> real-time battles</span>, and 
            <span className="text-primary font-semibold"> skill progression</span>.
          </p>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Progress through skill trees, compete in 1v1 trading duels, solve daily quant puzzles, 
            and survive legendary market crashes. Are you ready to become a quant legend?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button size="lg" className="btn-hero text-lg px-8 py-4 rounded-xl">
              <Zap className="mr-2 h-5 w-5" />
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-xl border-primary/30 hover:border-primary">
              <Trophy className="mr-2 h-5 w-5" />
              View Leaderboard
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-float">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Skill Trees</h3>
              <p className="text-sm text-muted-foreground">Unlock advanced strategies</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4 animate-float" style={{animationDelay: "0.5s"}}>
                <Trophy className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">1v1 Battles</h3>
              <p className="text-sm text-muted-foreground">Real-time competitions</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4 animate-float" style={{animationDelay: "1s"}}>
                <Zap className="h-8 w-8 text-success" />
              </div>
              <h3 className="font-semibold text-foreground">Daily Puzzles</h3>
              <p className="text-sm text-muted-foreground">Build core skills</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4 animate-float" style={{animationDelay: "1.5s"}}>
                <TrendingUp className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="font-semibold text-foreground">Boss Battles</h3>
              <p className="text-sm text-muted-foreground">Survive market crashes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};