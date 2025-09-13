import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import MarketCrashSimulation from "@/components/MarketCrashSimulation";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MarketCrashes = () => {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'simulation' | 'results'>('scenarios');
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const navigate = useNavigate();

  const crashScenarios = [
    {
      id: "gfc-2008",
      name: "2008 Financial Crisis",
      code: "GFC08",
      date: "Sep 2008 - Mar 2009",
      description: "Lehman Brothers collapse triggers global financial meltdown",
      difficulty: "Extreme",
      duration: "6 months",
      maxDrawdown: "-56.8%",
      volatility: "89.2%",
      completed: false,
      bestScore: null
    },
    {
      id: "covid-2020",
      name: "COVID-19 Crash",
      code: "CV19",
      date: "Feb 2020 - Apr 2020",
      description: "Pandemic-induced market panic and recovery",
      difficulty: "Hard",
      duration: "2 months",
      maxDrawdown: "-33.9%",
      volatility: "76.4%",
      completed: true,
      bestScore: 0.847
    },
    {
      id: "dotcom-2000",
      name: "Dot-com Bubble",
      code: "DOT00",
      date: "Mar 2000 - Oct 2002",
      description: "Technology stock bubble burst and prolonged bear market",
      difficulty: "Hard",
      duration: "31 months",
      maxDrawdown: "-78.0%",
      volatility: "67.8%",
      completed: false,
      bestScore: null
    },
    {
      id: "black-monday-1987",
      name: "Black Monday",
      code: "BLK87",
      date: "Oct 1987",
      description: "Single-day market crash of 22.6%",
      difficulty: "Medium",
      duration: "1 day",
      maxDrawdown: "-22.6%",
      volatility: "45.2%",
      completed: true,
      bestScore: 0.723
    },
    {
      id: "volatility-2018",
      name: "Volatility Spike",
      code: "VOL18",
      date: "Jan 2018 - Dec 2018",
      description: "VIX explosion and trade war tensions",
      difficulty: "Medium",
      duration: "12 months",
      maxDrawdown: "-19.8%",
      volatility: "52.1%",
      completed: false,
      bestScore: null
    }
  ];

  const simulationSettings = {
    scenario: "COVID-19 Crash",
    initialCapital: 100000,
    strategy: "Buy & Hold",
    riskManagement: "Stop Loss: 15%",
    leverage: "1x"
  };

  const handleStartSimulation = (scenario: any) => {
    setSelectedScenario(scenario);
  };

  const handleSimulationComplete = (results: any) => {
    setSimulationResults(results);
    setSelectedScenario(null);
    setActiveTab('results');
  };

  const handleBackToScenarios = () => {
    setSelectedScenario(null);
    setSimulationResults(null);
  };

  // Show simulation if scenario is selected
  if (selectedScenario) {
    return (
      <MarketCrashSimulation
        scenario={selectedScenario}
        onComplete={handleSimulationComplete}
        onBack={handleBackToScenarios}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Header */}
      <section className="border-b border-border/50 bg-card/30">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <p className="text-primary font-mono text-sm mb-2">STRESS TESTING</p>
              <h1 className="text-4xl md:text-5xl font-mono font-bold mb-4 text-foreground">
                MARKET CRASHES
              </h1>
              <div className="h-px bg-primary w-24 mb-6"></div>
            </div>
            
            <p className="text-lg font-mono text-muted-foreground mb-8 leading-relaxed">
              Test strategies against historical crashes and volatility events. Navigate through the most challenging market conditions.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-sm mb-8">
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">SCENARIOS</h3>
                <p className="text-accent text-lg font-bold">12</p>
              </div>
              
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">COMPLETED</h3>
                <p className="text-success text-lg font-bold">2</p>
              </div>
              
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">AVG SCORE</h3>
                <p className="text-primary text-lg font-bold">0.785</p>
              </div>
              
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">BEST RETURN</h3>
                <p className="text-muted-foreground text-lg font-bold">+21.5%</p>
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
              variant={activeTab === 'scenarios' ? 'default' : 'outline'}
              onClick={() => setActiveTab('scenarios')}
              className="rounded-none"
            >
              SCENARIOS
            </Button>
            <Button
              variant={activeTab === 'simulation' ? 'default' : 'outline'}
              onClick={() => setActiveTab('simulation')}
              className="rounded-none"
            >
              SIMULATION
            </Button>
            <Button
              variant={activeTab === 'results' ? 'default' : 'outline'}
              onClick={() => setActiveTab('results')}
              className="rounded-none"
            >
              RESULTS
            </Button>
          </div>

          {/* Scenarios Tab */}
          {activeTab === 'scenarios' && (
            <div className="space-y-4">
              <h2 className="text-xl font-mono font-bold text-foreground mb-6">HISTORICAL SCENARIOS</h2>

              {crashScenarios.map((scenario) => (
                <Card key={scenario.id} className="card-terminal p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-mono text-foreground">{scenario.name}</h3>
                        <Badge variant="outline" className="border-primary/50 text-primary">
                          {scenario.code}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`${
                            scenario.difficulty === 'Medium' ? 'border-warning/50 text-warning' :
                            scenario.difficulty === 'Hard' ? 'border-destructive/50 text-destructive' :
                            'border-destructive text-destructive'
                          }`}
                        >
                          {scenario.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {scenario.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
                        <div>
                          <p className="text-muted-foreground mb-1">Period</p>
                          <p className="text-foreground">{scenario.date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Duration</p>
                          <p className="text-foreground">{scenario.duration}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Max Drawdown</p>
                          <p className="text-destructive">{scenario.maxDrawdown}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Volatility</p>
                          <p className="text-warning">{scenario.volatility}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {scenario.completed ? (
                        <Badge className="bg-success">
                          COMPLETED
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-muted-foreground/50 text-muted-foreground">
                          NOT ATTEMPTED
                        </Badge>
                      )}
                      {scenario.bestScore && (
                        <span className="text-sm font-mono text-accent">
                          Best Score: {(scenario.bestScore * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <Button 
                        className="btn-terminal rounded-none"
                        onClick={() => handleStartSimulation(scenario)}
                      >
                        START SIMULATION
                      </Button>
                      <Button 
                        variant="outline" 
                        className="rounded-none"
                        onClick={() => navigate(`/simulation/${scenario.id}`)}
                      >
                        DETAILS
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Simulation Tab */}
          {activeTab === 'simulation' && (
            <div className="space-y-6">
              <h2 className="text-xl font-mono font-bold text-foreground mb-6">SIMULATION SETUP</h2>

              <Card className="card-terminal p-6">
                <h3 className="text-lg font-mono text-foreground mb-4">CURRENT SIMULATION</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-mono text-muted-foreground mb-2 block">Scenario</label>
                      <div className="text-foreground font-mono">{simulationSettings.scenario}</div>
                    </div>
                    <div>
                      <label className="text-sm font-mono text-muted-foreground mb-2 block">Initial Capital</label>
                      <div className="text-foreground font-mono">${simulationSettings.initialCapital.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="text-sm font-mono text-muted-foreground mb-2 block">Strategy</label>
                      <div className="text-foreground font-mono">{simulationSettings.strategy}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-mono text-muted-foreground mb-2 block">Risk Management</label>
                      <div className="text-foreground font-mono">{simulationSettings.riskManagement}</div>
                    </div>
                    <div>
                      <label className="text-sm font-mono text-muted-foreground mb-2 block">Leverage</label>
                      <div className="text-foreground font-mono">{simulationSettings.leverage}</div>
                    </div>
                    <div>
                      <label className="text-sm font-mono text-muted-foreground mb-2 block">Status</label>
                      <Badge className="bg-success">READY TO START</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="card-terminal p-6">
                <h3 className="text-lg font-mono text-foreground mb-4">SIMULATION CONTROLS</h3>
                <div className="flex gap-4">
                  <Button className="btn-terminal rounded-none flex-1">
                    START SIMULATION
                  </Button>
                  <Button variant="outline" className="rounded-none">
                    CONFIGURE STRATEGY
                  </Button>
                  <Button variant="outline" className="rounded-none">
                    LOAD PRESET
                  </Button>
                </div>
              </Card>

              <Card className="card-terminal p-6">
                <h3 className="text-lg font-mono text-foreground mb-4">SIMULATION PROGRESS</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-mono">
                    <span>Progress</span>
                    <span>0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                  <div className="text-sm text-muted-foreground font-mono">
                    Simulation not started. Click "START SIMULATION" to begin.
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="space-y-4">
              <h2 className="text-xl font-mono font-bold text-foreground mb-6">SIMULATION RESULTS</h2>

              {simulationResults ? (
                <Card className="card-terminal p-6">
                  <h3 className="text-lg font-mono text-foreground mb-4">PERFORMANCE METRICS</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border/30">
                      <div className="flex-1">
                        <h4 className="font-mono text-foreground mb-1">Total Return</h4>
                        <p className="text-sm text-muted-foreground">Scenario: {simulationResults.scenario}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-mono text-lg font-bold ${simulationResults.totalReturn < 0 ? 'text-destructive' : 'text-success'}`}>
                          {simulationResults.totalReturn.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-border/30">
                      <div className="flex-1">
                        <h4 className="font-mono text-foreground mb-1">Final Portfolio Value</h4>
                        <p className="text-sm text-muted-foreground">Started with: $100,000</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-mono text-lg font-bold ${simulationResults.finalValue < 100000 ? 'text-destructive' : 'text-success'}`}>
                          ${simulationResults.finalValue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-border/30">
                      <div className="flex-1">
                        <h4 className="font-mono text-foreground mb-1">Maximum Drawdown</h4>
                        <p className="text-sm text-muted-foreground">Worst single-day loss</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-lg font-bold text-destructive">
                          {simulationResults.maxDrawdown.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="card-terminal p-6">
                  <div className="text-center py-8">
                    <h3 className="text-lg font-mono text-foreground mb-4">NO RESULTS YET</h3>
                    <p className="text-muted-foreground font-mono mb-4">
                      Complete a simulation to see your results here.
                    </p>
                    <Button 
                      className="btn-terminal rounded-none"
                      onClick={() => setActiveTab('scenarios')}
                    >
                      START SIMULATION
                    </Button>
                  </div>
                </Card>
              )}

              <Card className="card-terminal p-6">
                <h3 className="text-lg font-mono text-foreground mb-4">PORTFOLIO ANALYSIS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-mono text-foreground mb-2">Risk Metrics</h4>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">VaR (95%)</span>
                        <span className="text-foreground">-8.4%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CVaR (95%)</span>
                        <span className="text-foreground">-12.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Beta</span>
                        <span className="text-foreground">0.87</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-mono text-foreground mb-2">Return Metrics</h4>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Annualized Return</span>
                        <span className="text-foreground">-15.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sortino Ratio</span>
                        <span className="text-foreground">-0.42</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Calmar Ratio</span>
                        <span className="text-foreground">-0.66</span>
                      </div>
                    </div>
                  </div>
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

export default MarketCrashes;
