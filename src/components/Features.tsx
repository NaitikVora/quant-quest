import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Features = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      id: 1,
      title: "1V1 CHALLENGES",
      code: "PVP",
      description: "Head-to-head competition on identical market data. Performance measured by Sharpe ratio and max drawdown.",
      stats: "2,341 ACTIVE MATCHES",
      route: "/1v1"
    },
    {
      id: 2,
      title: "DAILY PUZZLES",
      code: "DLY",
      description: "Backtesting challenges, risk calculations, and strategy optimization problems.",
      stats: "98% COMPLETION RATE",
      route: "/daily-puzzles"
    },
    {
      id: 3,
      title: "MARKET CRASHES",
      code: "BSS",
      description: "Navigate historical crashes. Test strategies against 2008, 2020, and other volatility events.",
      stats: "12 SCENARIOS AVAILABLE",
      route: "/market-crashes"
    }
  ];

  return (
    <section className="py-20 px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12">
          <h2 className="text-2xl font-mono font-bold mb-2 text-primary">
            GAME MODES
          </h2>
          <div className="h-px bg-primary/30 w-full mb-8"></div>
        </div>

        <div className="space-y-6 font-mono">
          {features.map((feature) => (
            <Card key={feature.id} className="card-terminal p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-primary border border-primary px-2 py-1">
                      {feature.code}
                    </span>
                    <h3 className="text-lg text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-accent">
                  {feature.stats}
                </div>
                <Button 
                  size="sm" 
                  className="btn-terminal rounded-none"
                  onClick={() => navigate(feature.route)}
                >
                  ENTER
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};