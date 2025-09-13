import { Card } from "@/components/ui/card";

export const SkillTree = () => {
  const skills = [
    { 
      id: 1, 
      name: "STATISTICS", 
      code: "STAT",
      unlocked: true, 
      level: 3,
      xp: 450,
      maxXp: 500
    },
    { 
      id: 2, 
      name: "RISK MGMT", 
      code: "RISK",
      unlocked: true, 
      level: 2,
      xp: 280,
      maxXp: 500
    },
    { 
      id: 3, 
      name: "PORTFOLIO", 
      code: "PORT",
      unlocked: true, 
      level: 1,
      xp: 120,
      maxXp: 500
    },
    { 
      id: 4, 
      name: "ALGO TRADING", 
      code: "ALGO",
      unlocked: false, 
      level: 0,
      xp: 0,
      maxXp: 500
    },
  ];

  return (
    <section className="py-20 px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12">
          <h2 className="text-2xl font-mono font-bold mb-2 text-primary">
            SKILL PROGRESSION
          </h2>
          <div className="h-px bg-primary/30 w-full mb-8"></div>
        </div>

        <div className="space-y-4 font-mono">
          {skills.map((skill) => (
            <Card key={skill.id} className={`card-terminal p-4 ${!skill.unlocked ? 'opacity-40' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className={`skill-node ${skill.unlocked ? 'unlocked' : 'locked'}`}>
                    <span className="text-xs font-bold">{skill.code}</span>
                  </div>
                  <div>
                    <h3 className="text-base text-foreground">
                      {skill.name}
                      {skill.unlocked && <span className="text-primary ml-2">[ACTIVE]</span>}
                      {!skill.unlocked && <span className="text-muted-foreground ml-2">[LOCKED]</span>}
                    </h3>
                  </div>
                </div>
                {skill.unlocked && (
                  <span className="text-xs text-muted-foreground">
                    LVL {skill.level}
                  </span>
                )}
              </div>
              
              {skill.unlocked && (
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
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};