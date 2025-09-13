import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import { ConfigurationForm } from "@/components/ConfigurationForm";
import { 
  Calendar,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Info,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Target,
  Shield,
  Zap
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getCrisisById, 
  runSimulation, 
  SimulationConfig, 
  SimulationResult,
  CrisisScenario 
} from "@/lib/simulation";

const SimulationPage = () => {
  const { crisisId } = useParams<{ crisisId: string }>();
  const navigate = useNavigate();
  const [crisis, setCrisis] = useState<CrisisScenario | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [simulationConfig, setSimulationConfig] = useState<SimulationConfig>({
    initialCapital: 100000,
    strategy: 'Buy & Hold',
    riskManagement: 'Stop Loss: 15%',
    leverage: 1,
    stopLoss: 15
  });
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);

  useEffect(() => {
    if (crisisId) {
      const crisisData = getCrisisById(crisisId);
      setCrisis(crisisData || null);
    }
  }, [crisisId]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const startSimulation = async () => {
    if (!crisis) return;

    setIsSimulating(true);
    setSimulationProgress(0);
    setSimulationResult(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    // Run actual simulation
    setTimeout(() => {
      const result = runSimulation(simulationConfig, crisis.id);
      setSimulationResult(result);
      setIsSimulating(false);
      clearInterval(progressInterval);
    }, 3000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'extreme': return 'text-destructive';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Extreme': return 'border-destructive text-destructive';
      case 'Hard': return 'border-destructive/50 text-destructive';
      case 'Medium': return 'border-warning/50 text-warning';
      case 'Easy': return 'border-success/50 text-success';
      default: return 'border-muted-foreground/50 text-muted-foreground';
    }
  };

  if (!crisis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-mono text-foreground mb-4">Crisis Not Found</h1>
          <Button onClick={() => navigate('/market-crashes')} className="btn-terminal rounded-none">
            Back to Market Crashes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="border-b border-border/50 bg-card/30">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/market-crashes')}
                className="rounded-none mb-4"
              >
                ← Back to Market Crashes
              </Button>
              
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="border-primary/50 text-primary">
                  {crisis.code}
                </Badge>
                <Badge variant="outline" className={getDifficultyColor(crisis.difficulty)}>
                  {crisis.difficulty}
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-mono font-bold mb-4 text-foreground">
                {crisis.name}
              </h1>
              <div className="h-px bg-primary w-24 mb-6"></div>
            </div>
            
            <p className="text-lg font-mono text-muted-foreground mb-8 leading-relaxed">
              {crisis.description}
            </p>

            {/* Crisis Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-sm mb-8">
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">PERIOD</h3>
                <p className="text-accent text-lg font-bold">{crisis.startDate} - {crisis.endDate}</p>
              </div>
              
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">DURATION</h3>
                <p className="text-success text-lg font-bold">{crisis.duration}</p>
              </div>
              
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">MAX DRAWDOWN</h3>
                <p className="text-destructive text-lg font-bold">{crisis.maxDrawdown}%</p>
              </div>
              
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-foreground mb-1">VOLATILITY</h3>
                <p className="text-warning text-lg font-bold">{crisis.volatility}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Half - Configuration and Controls */}
            <div className="space-y-6">
              {/* Configuration Form */}
              <ConfigurationForm
                config={simulationConfig}
                onConfigChange={setSimulationConfig}
                onStartSimulation={startSimulation}
                isSimulating={isSimulating}
                crisisDifficulty={crisis?.difficulty || 'Medium'}
              />

              {/* Simulation Progress */}
              {isSimulating && (
                <Card className="card-terminal">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Play className="h-6 w-6 text-success" />
                      <h3 className="text-lg font-mono font-bold text-foreground">SIMULATION PROGRESS</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-sm font-mono text-muted-foreground mb-2">Running Simulation...</div>
                        <Progress value={simulationProgress} className="h-2" />
                        <div className="text-xs font-mono text-muted-foreground mt-2">
                          {Math.round(simulationProgress)}% Complete
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="rounded-none w-full"
                        disabled
                      >
                        <Pause className="mr-2 h-4 w-4" />
                        SIMULATION RUNNING
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Simulation Results */}
              {simulationResult && (
                <Card className="card-terminal">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Target className="h-6 w-6 text-success" />
                      <h3 className="text-lg font-mono font-bold text-foreground">SIMULATION RESULTS</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-mono text-muted-foreground">Total Return</span>
                          <span className={`font-mono font-bold text-lg ${
                            simulationResult.totalReturn >= 0 ? 'text-success' : 'text-destructive'
                          }`}>
                            {simulationResult.totalReturn >= 0 ? '+' : ''}{simulationResult.totalReturn.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-mono text-muted-foreground">Max Drawdown</span>
                          <span className="font-mono font-bold text-lg text-destructive">
                            {simulationResult.maxDrawdown.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-mono text-muted-foreground">Sharpe Ratio</span>
                          <span className="font-mono font-bold text-lg text-accent">
                            {simulationResult.sharpeRatio.toFixed(3)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-mono text-muted-foreground">Win Rate</span>
                          <span className="font-mono font-bold text-lg text-primary">
                            {simulationResult.winRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-mono text-muted-foreground">Total Trades</span>
                          <span className="font-mono font-bold text-lg text-foreground">
                            {simulationResult.totalTrades}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-mono text-muted-foreground">Profit Factor</span>
                          <span className="font-mono font-bold text-lg text-success">
                            {simulationResult.profitFactor.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-mono text-muted-foreground">Calmar Ratio</span>
                          <span className="font-mono font-bold text-lg text-warning">
                            {simulationResult.calmarRatio.toFixed(3)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-mono text-muted-foreground">Final Capital</span>
                          <span className="font-mono font-bold text-lg text-accent">
                            ${simulationResult.finalCapital.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Quick Stats */}
              <Card className="card-terminal">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Info className="h-6 w-6 text-accent" />
                    <h3 className="text-lg font-mono font-bold text-foreground">CRISIS INFO</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-mono text-muted-foreground">Difficulty</span>
                        <Badge variant="outline" className={getDifficultyColor(crisis.difficulty)}>
                          {crisis.difficulty}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-mono text-muted-foreground">Duration</span>
                        <span className="text-sm font-mono text-foreground">{crisis.duration}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-mono text-muted-foreground">Max Drawdown</span>
                        <span className="text-sm font-mono text-destructive">{crisis.maxDrawdown}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-mono text-muted-foreground">Volatility</span>
                        <span className="text-sm font-mono text-warning">{crisis.volatility}%</span>
                      </div>
                    </div>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button 
                      variant="outline" 
                      className="rounded-none"
                      onClick={() => navigate('/market-crashes')}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      BACK TO CRISES
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-none"
                      onClick={() => navigate('/1v1')}
                    >
                      <Target className="mr-2 h-4 w-4" />
                      FIND OPPONENT
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-none"
                      onClick={() => navigate('/daily-puzzles')}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      DAILY PUZZLE
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Half - Key Events and Economic Indicators */}
            <div className="space-y-6">
              
              {/* Key Events */}
              <Card className="card-terminal">
                <div className="p-6">
                  <div 
                    className="flex items-center justify-between cursor-pointer mb-6"
                    onClick={() => toggleSection('events')}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-6 w-6 text-accent" />
                      <h3 className="text-lg font-mono font-bold text-foreground">KEY EVENTS</h3>
                    </div>
                    {expandedSections.has('events') ? 
                      <ChevronUp className="h-5 w-5 text-muted-foreground" /> :
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    }
                  </div>
                  
                  {expandedSections.has('events') && (
                    <div className="space-y-4">
                      {crisis.keyEvents.map((event, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-card/50 border border-border/30">
                          <div className="flex-shrink-0">
                            <div className={`w-3 h-3 rounded-full ${
                              event.impact === 'extreme' ? 'bg-destructive' :
                              event.impact === 'high' ? 'bg-warning' :
                              event.impact === 'medium' ? 'bg-accent' :
                              'bg-success'
                            }`}></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-mono text-foreground font-semibold">{event.title}</h4>
                              <Badge variant="outline" className={`text-xs ${getImpactColor(event.impact)}`}>
                                {event.impact.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{event.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                            <div className="flex items-center gap-2 text-sm">
                              <TrendingDown className="h-4 w-4 text-destructive" />
                              <span className="text-destructive font-mono">{event.marketReaction}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Economic Indicators */}
              <Card className="card-terminal">
                <div className="p-6">
                  <div 
                    className="flex items-center justify-between cursor-pointer mb-6"
                    onClick={() => toggleSection('indicators')}
                  >
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-6 w-6 text-primary" />
                      <h3 className="text-lg font-mono font-bold text-foreground">ECONOMIC INDICATORS</h3>
                    </div>
                    {expandedSections.has('indicators') ? 
                      <ChevronUp className="h-5 w-5 text-muted-foreground" /> :
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    }
                  </div>
                  
                  {expandedSections.has('indicators') && (
                    <div className="space-y-4">
                      {crisis.economicIndicators.map((indicator, index) => (
                        <div key={index} className="p-4 rounded-lg bg-card/50 border border-border/30">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-mono text-foreground font-semibold">{indicator.name}</h4>
                            <div className="text-right">
                              <div className="font-mono text-lg font-bold text-accent">{indicator.value} {indicator.unit}</div>
                              <div className={`text-sm font-mono ${
                                indicator.change >= 0 ? 'text-success' : 'text-destructive'
                              }`}>
                                {indicator.change >= 0 ? '+' : ''}{indicator.change} {indicator.unit}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{indicator.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
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

export default SimulationPage;
