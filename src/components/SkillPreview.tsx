import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const SkillPreview = () => {
  const navigate = useNavigate();

  const previewSkills = [
    {
      id: 1,
      name: "STATISTICS & PROBABILITY",
      code: "STAT",
      level: 3,
      xp: 450,
      maxXp: 500,
      unlocked: true
    },
    {
      id: 2,
      name: "RISK MANAGEMENT",
      code: "RISK",
      level: 2,
      xp: 280,
      maxXp: 500,
      unlocked: true
    },
    {
      id: 3,
      name: "PROGRAMMING FUNDAMENTALS",
      code: "PROG",
      level: 4,
      xp: 480,
      maxXp: 500,
      unlocked: true
    },
    {
      id: 4,
      name: "PORTFOLIO OPTIMIZATION",
      code: "PORT",
      level: 1,
      xp: 120,
      maxXp: 500,
      unlocked: true
    }
  ];

  const stats = {
    totalSkills: 12,
    unlockedSkills: 5,
    completionRate: 42
  };

  return (
    <section className="py-20 px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12">
          <h2 className="text-2xl font-mono font-bold mb-2 text-primary">
            SKILL PROGRESSION
          </h2>
          <div className="h-px bg-primary/30 w-full mb-8"></div>
          <p className="text-muted-foreground font-mono text-sm mb-6">
            Master quantitative finance through structured learning paths. Build expertise from fundamentals to advanced strategies.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-sm mb-8">
            <div className="border-l-2 border-primary pl-4">
              <h3 className="text-foreground mb-1">SKILLS UNLOCKED</h3>
              <p className="text-accent text-lg font-bold">{stats.unlockedSkills}/{stats.totalSkills}</p>
            </div>
            
            <div className="border-l-2 border-primary pl-4">
              <h3 className="text-foreground mb-1">COMPLETION RATE</h3>
              <p className="text-success text-lg font-bold">{stats.completionRate}%</p>
            </div>
            
            <div className="border-l-2 border-primary pl-4">
              <h3 className="text-foreground mb-1">CURRENT LEVEL</h3>
              <p className="text-primary text-lg font-bold">2.5</p>
            </div>
          </div>
        </div>

        {/* Skill Preview Cards */}
        <div className="space-y-4 font-mono mb-8">
          {previewSkills.map((skill) => (
            <Card key={skill.id} className="card-terminal p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="skill-node unlocked">
                    <span className="text-xs font-bold">{skill.code}</span>
                  </div>
                  <div>
                    <h3 className="text-base text-foreground">
                      {skill.name}
                      <span className="text-primary ml-2">[ACTIVE]</span>
                    </h3>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  LVL {skill.level}
                </span>
              </div>
              
              <div className="ml-16">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">XP:</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-background border border-border flex">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 ${
                            i < Math.floor((skill.xp / skill.maxXp) * 20) 
                              ? 'bg-primary' 
                              : ''
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-primary">{skill.xp}/{skill.maxXp}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            className="btn-terminal rounded-none flex-1"
            onClick={() => navigate('/skill-progression')}
          >
            VIEW ALL SKILLS
          </Button>
          <Button 
            variant="outline" 
            className="rounded-none"
            onClick={() => navigate('/skill-progression')}
          >
            SKILL ANALYTICS
          </Button>
        </div>
      </div>
    </section>
  );
};
