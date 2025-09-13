import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <p className="text-primary font-mono text-sm mb-4">QUANTITATIVE FINANCE PLATFORM</p>
            <h1 className="text-5xl md:text-7xl font-mono font-bold mb-6 text-foreground">
              QuantQuest
            </h1>
            <div className="h-px bg-primary w-32 mb-8"></div>
          </div>
          
          <p className="text-lg font-mono text-muted-foreground mb-12 leading-relaxed">
            Master quantitative finance through structured skill progression,
            peer-to-peer challenges, and historical market simulations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-base px-8 py-6 h-auto rounded-none"
              onClick={() => navigate('/market-crashes')}
            >
              START SIMULATION
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary/50 text-primary hover:bg-primary/10 font-mono text-base px-8 py-6 h-auto rounded-none"
              onClick={() => navigate('/leaderboard')}
            >
              VIEW RANKINGS
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-sm">
            <div className="border-l-2 border-primary pl-4">
              <h3 className="text-foreground mb-2">SKILL PROGRESSION</h3>
              <p className="text-muted-foreground">Structured learning paths from statistics to algorithmic trading</p>
            </div>
            
            <div className="border-l-2 border-primary pl-4">
              <h3 className="text-foreground mb-2">PEER CHALLENGES</h3>
              <p className="text-muted-foreground">Real-time competitive analysis on historical market data</p>
            </div>
            
            <div className="border-l-2 border-primary pl-4">
              <h3 className="text-foreground mb-2">DAILY PUZZLES</h3>
              <p className="text-muted-foreground">Build core competencies through targeted exercises</p>
            </div>
            
            <div className="border-l-2 border-primary pl-4">
              <h3 className="text-foreground mb-2">MARKET SIMULATIONS</h3>
              <p className="text-muted-foreground">Test strategies against historical crashes and volatility</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
    </section>
  );
};