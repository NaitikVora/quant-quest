import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Info, 
  AlertCircle, 
  CheckCircle, 
  DollarSign, 
  Target, 
  Shield, 
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calculator
} from "lucide-react";
import { useState } from "react";
import { SimulationConfig } from "@/lib/simulation";

interface ConfigurationFormProps {
  config: SimulationConfig;
  onConfigChange: (config: SimulationConfig) => void;
  onStartSimulation: () => void;
  isSimulating: boolean;
  crisisDifficulty: string;
}

export const ConfigurationForm = ({ 
  config, 
  onConfigChange, 
  onStartSimulation, 
  isSimulating,
  crisisDifficulty 
}: ConfigurationFormProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const strategies = [
    {
      id: 'Buy & Hold',
      name: 'Buy & Hold',
      description: 'Simple long-term strategy. Buy at the beginning and hold throughout the crisis.',
      riskLevel: 'Low',
      recommendedFor: ['Easy', 'Medium'],
      icon: TrendingUp,
      color: 'text-success'
    },
    {
      id: 'Momentum',
      name: 'Momentum Trading',
      description: 'Follow market trends. Buy on upward momentum, sell on downward momentum.',
      riskLevel: 'Medium',
      recommendedFor: ['Medium', 'Hard'],
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      id: 'Mean Reversion',
      name: 'Mean Reversion',
      description: 'Contrarian strategy. Buy when prices are low, sell when prices are high.',
      riskLevel: 'High',
      recommendedFor: ['Hard', 'Extreme'],
      icon: TrendingDown,
      color: 'text-warning'
    },
    {
      id: 'Risk Parity',
      name: 'Risk Parity',
      description: 'Adjust position size based on volatility. Maintain consistent risk exposure.',
      riskLevel: 'Medium',
      recommendedFor: ['Medium', 'Hard', 'Extreme'],
      icon: BarChart3,
      color: 'text-accent'
    }
  ];

  const riskManagementOptions = [
    {
      id: 'Stop Loss: 5%',
      value: 'Stop Loss: 5%',
      stopLoss: 5,
      description: 'Conservative risk management. Exit position if loss exceeds 5%.',
      recommendedFor: ['Easy', 'Medium']
    },
    {
      id: 'Stop Loss: 10%',
      value: 'Stop Loss: 10%',
      stopLoss: 10,
      description: 'Moderate risk management. Exit position if loss exceeds 10%.',
      recommendedFor: ['Medium', 'Hard']
    },
    {
      id: 'Stop Loss: 15%',
      value: 'Stop Loss: 15%',
      stopLoss: 15,
      description: 'Aggressive risk management. Exit position if loss exceeds 15%.',
      recommendedFor: ['Hard', 'Extreme']
    },
    {
      id: 'Stop Loss: 20%',
      value: 'Stop Loss: 20%',
      stopLoss: 20,
      description: 'Very aggressive risk management. Exit position if loss exceeds 20%.',
      recommendedFor: ['Extreme']
    },
    {
      id: 'No Stop Loss',
      value: 'No Stop Loss',
      stopLoss: 0,
      description: 'No automatic risk management. Manual position management required.',
      recommendedFor: ['Easy']
    }
  ];

  const validateConfig = (newConfig: SimulationConfig): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (newConfig.initialCapital < 1000) {
      errors.initialCapital = 'Minimum capital required: $1,000';
    }
    if (newConfig.initialCapital > 10000000) {
      errors.initialCapital = 'Maximum capital allowed: $10,000,000';
    }
    if (newConfig.leverage < 0.1 || newConfig.leverage > 10) {
      errors.leverage = 'Leverage must be between 0.1x and 10x';
    }
    if (newConfig.stopLoss < 0 || newConfig.stopLoss > 50) {
      errors.stopLoss = 'Stop loss must be between 0% and 50%';
    }

    return errors;
  };

  const handleConfigUpdate = (field: keyof SimulationConfig, value: any) => {
    const newConfig = { ...config, [field]: value };
    const errors = validateConfig(newConfig);
    setValidationErrors(errors);
    onConfigChange(newConfig);
  };

  const getRecommendedStrategy = () => {
    return strategies.find(s => s.recommendedFor.includes(crisisDifficulty)) || strategies[0];
  };

  const getRecommendedRiskManagement = () => {
    return riskManagementOptions.find(r => r.recommendedFor.includes(crisisDifficulty)) || riskManagementOptions[1];
  };

  const isConfigValid = Object.keys(validationErrors).length === 0;

  return (
    <Card className="card-terminal">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-mono font-bold text-foreground">SIMULATION CONFIGURATION</h3>
          </div>
          <Badge variant="outline" className="border-primary/50 text-primary">
            {crisisDifficulty}
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Top Row - Capital and Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Initial Capital */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-mono text-foreground">Initial Capital</Label>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={config.initialCapital}
                  onChange={(e) => handleConfigUpdate('initialCapital', parseInt(e.target.value) || 0)}
                  className="pl-10 font-mono"
                  placeholder="100000"
                  min="1000"
                  max="10000000"
                />
              </div>
              {validationErrors.initialCapital && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.initialCapital}
                </div>
              )}
              <div className="text-xs text-muted-foreground font-mono">
                Recommended: $10,000 - $1,000,000 for {crisisDifficulty.toLowerCase()} difficulty
              </div>
            </div>

            {/* Strategy Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-mono text-foreground">Trading Strategy</Label>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <Select value={config.strategy} onValueChange={(value) => handleConfigUpdate('strategy', value)}>
                <SelectTrigger className="font-mono">
                  <SelectValue>
                    {config.strategy}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {strategies.map((strategy) => {
                    const Icon = strategy.icon;
                    return (
                      <SelectItem key={strategy.id} value={strategy.id}>
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${strategy.color}`} />
                          <div>
                            <div className="font-mono">{strategy.name}</div>
                            <div className="text-xs text-muted-foreground">{strategy.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground font-mono">
                Recommended: {getRecommendedStrategy().name} for {crisisDifficulty.toLowerCase()} difficulty
              </div>
            </div>
          </div>

          {/* Bottom Row - Risk Management and Leverage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Management */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-mono text-foreground">Risk Management</Label>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <Select 
                value={config.riskManagement} 
                onValueChange={(value) => {
                  const option = riskManagementOptions.find(o => o.value === value);
                  if (option) {
                    const newConfig = { 
                      ...config, 
                      riskManagement: value, 
                      stopLoss: option.stopLoss 
                    };
                    const errors = validateConfig(newConfig);
                    setValidationErrors(errors);
                    onConfigChange(newConfig);
                  }
                }}
              >
                <SelectTrigger className="font-mono">
                  <SelectValue>
                    {config.riskManagement}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {riskManagementOptions.map((option) => (
                    <SelectItem key={option.id} value={option.value}>
                      <div>
                        <div className="font-mono">{option.value}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground font-mono">
                Recommended: {getRecommendedRiskManagement().value} for {crisisDifficulty.toLowerCase()} difficulty
              </div>
            </div>

            {/* Leverage */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-mono text-foreground">Leverage</Label>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <Slider
                  value={[config.leverage]}
                  onValueChange={(value) => handleConfigUpdate('leverage', value[0])}
                  max={10}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm font-mono text-muted-foreground">
                  <span>0.1x</span>
                  <span className="text-foreground font-bold">{config.leverage}x</span>
                  <span>10x</span>
                </div>
              </div>
              {validationErrors.leverage && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {validationErrors.leverage}
                </div>
              )}
              <div className="text-xs text-muted-foreground font-mono">
                Higher leverage = higher risk and potential returns. Recommended: 1x-3x for {crisisDifficulty.toLowerCase()} difficulty
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="rounded-none w-full"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </Button>

            {showAdvanced && (
              <div className="space-y-4 p-4 rounded-lg bg-card/50 border border-border/30">
                {/* Stop Loss Percentage */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-mono text-foreground">Stop Loss Percentage</Label>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={[config.stopLoss]}
                      onValueChange={(value) => handleConfigUpdate('stopLoss', value[0])}
                      max={50}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm font-mono text-muted-foreground">
                      <span>0%</span>
                      <span className="text-foreground font-bold">{config.stopLoss}%</span>
                      <span>50%</span>
                    </div>
                  </div>
                  {validationErrors.stopLoss && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.stopLoss}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Configuration Summary */}
          <div className="p-4 rounded-lg bg-card/50 border border-border/30">
            <h4 className="text-sm font-mono text-foreground font-semibold mb-3">Configuration Summary</h4>
            <div className="grid grid-cols-2 gap-3 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Capital:</span>
                <span className="text-foreground">${config.initialCapital.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Strategy:</span>
                <span className="text-foreground">{config.strategy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk Mgmt:</span>
                <span className="text-foreground">{config.riskManagement}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Leverage:</span>
                <span className="text-foreground">{config.leverage}x</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="btn-terminal rounded-none w-full"
              onClick={onStartSimulation}
              disabled={!isConfigValid || isSimulating}
            >
              {isSimulating ? (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  SIMULATION RUNNING...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  START SIMULATION
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="rounded-none w-full"
              onClick={() => {
                const recommended = {
                  initialCapital: crisisDifficulty === 'Extreme' ? 50000 : 100000,
                  strategy: getRecommendedStrategy().id,
                  riskManagement: getRecommendedRiskManagement().value,
                  leverage: crisisDifficulty === 'Extreme' ? 1 : 2,
                  stopLoss: getRecommendedRiskManagement().stopLoss
                };
                onConfigChange(recommended);
                setValidationErrors({});
              }}
            >
              <Target className="mr-2 h-4 w-4" />
              USE RECOMMENDED
            </Button>
          </div>

          {!isConfigValid && (
            <div className="flex items-center gap-2 text-sm text-destructive p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              Please fix configuration errors before starting simulation
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
