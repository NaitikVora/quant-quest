import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Shield, 
  PieChart, 
  Cpu, 
  Lock, 
  CheckCircle,
  ArrowRight
} from "lucide-react";

const skills = [
  {
    id: 1,
    name: "Statistics",
    icon: BarChart3,
    level: 3,
    maxLevel: 5,
    unlocked: true,
    description: "Master statistical analysis and probability theory",
    subskills: ["Probability", "Regression", "Hypothesis Testing"]
  },
  {
    id: 2,
    name: "Risk Management", 
    icon: Shield,
    level: 2,
    maxLevel: 5,
    unlocked: true,
    description: "Learn to measure and control financial risk",
    subskills: ["VaR", "Stress Testing", "Portfolio Risk"]
  },
  {
    id: 3,
    name: "Portfolio Theory",
    icon: PieChart, 
    level: 1,
    maxLevel: 5,
    unlocked: true,
    description: "Optimize asset allocation and diversification",
    subskills: ["Modern Portfolio Theory", "CAPM", "Factor Models"]
  },
  {
    id: 4,
    name: "Algorithmic Trading",
    icon: Cpu,
    level: 0,
    maxLevel: 5,
    unlocked: false,
    description: "Build automated trading strategies",
    subskills: ["Backtesting", "Signal Generation", "Execution"]
  }
];

export const SkillTree = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Master the Skill Tree
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Progress through interconnected quant finance skills. Each level unlocks new tools, 
            strategies, and challenges. Your skill levels directly impact your performance in battles and puzzles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            const progress = (skill.level / skill.maxLevel) * 100;
            
            return (
              <Card 
                key={skill.id} 
                className={`card-glow transition-all duration-500 hover:scale-105 ${
                  skill.unlocked ? 'border-success/30' : 'border-muted-foreground/20'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`skill-node ${skill.unlocked ? 'unlocked' : 'locked'}`}>
                      {skill.unlocked ? (
                        <Icon className="h-8 w-8" />
                      ) : (
                        <Lock className="h-8 w-8" />
                      )}
                    </div>
                    <Badge variant={skill.unlocked ? "default" : "secondary"}>
                      Lvl {skill.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{skill.name}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {skill.description}
                  </p>
                  
                  {skill.unlocked && (
                    <>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{skill.level}/{skill.maxLevel}</span>
                        </div>
                        <Progress 
                          value={progress} 
                          className="h-2"
                        />
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Unlocked Skills:</h4>
                        <div className="space-y-1">
                          {skill.subskills.slice(0, skill.level).map((subskill) => (
                            <div key={subskill} className="flex items-center text-xs text-success">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {subskill}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center text-muted-foreground mb-4">
            <span className="text-sm">Next unlock requires:</span>
            <ArrowRight className="h-4 w-4 mx-2" />
            <span className="text-sm font-medium">Portfolio Theory Level 3</span>
          </div>
        </div>
      </div>
    </section>
  );
};