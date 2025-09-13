import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserService } from "@/services/userService";
import { AchievementService } from "@/services/achievementService";
import { User, UserSkills } from "@/types/user";

export const SkillTree = () => {
  const { user, refreshUser } = useAuth();
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [userSkills, setUserSkills] = useState<UserSkills | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserSkills(user.skills);
    }
  }, [user]);

  const addSkillXP = async (category: string, skillId: string, xp: number) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await UserService.addSkillXP(user.uid, category, skillId, xp);
      
      // Check for achievements
      const unlockedAchievements = await AchievementService.checkAchievements(user, {
        skillUpdate: { category, skillId, xp }
      });
      
      // Refresh user data
      await refreshUser();
      
      if (unlockedAchievements.length > 0) {
        // Show achievement notification
        console.log('Unlocked achievements:', unlockedAchievements);
      }
    } catch (error) {
      console.error('Error adding skill XP:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSkillProgress = (category: string, skillId: string) => {
    if (!userSkills) return { level: 1, xp: 0, maxXp: 100, unlocked: false };
    
    const categorySkills = userSkills[category as keyof UserSkills];
    if (!categorySkills || !categorySkills.skills) {
      return { level: 1, xp: 0, maxXp: 100, unlocked: false };
    }
    
    const skill = categorySkills.skills[skillId];
    if (!skill) {
      return { level: 1, xp: 0, maxXp: 100, unlocked: false };
    }
    
    return {
      level: skill.level,
      xp: skill.xp,
      maxXp: skill.level * 100,
      unlocked: skill.unlocked
    };
  };

  const skillCategories = [
    {
      name: "FOUNDATION",
      color: "text-primary",
      skills: [
        {
          id: 1,
          name: "STATISTICS & PROBABILITY",
          code: "STAT",
          description: "Master statistical concepts, distributions, hypothesis testing, and probability theory essential for quantitative analysis.",
          unlocked: true,
          level: 3,
          xp: 450,
          maxXp: 500,
          prerequisites: [],
          benefits: ["Confidence intervals", "Hypothesis testing", "Statistical modeling"]
        },
        {
          id: 2,
          name: "MATHEMATICAL FINANCE",
          code: "MATH",
          description: "Learn calculus, linear algebra, and mathematical concepts specific to financial modeling and derivatives pricing.",
          unlocked: true,
          level: 2,
          xp: 320,
          maxXp: 500,
          prerequisites: [],
          benefits: ["Stochastic calculus", "Differential equations", "Linear algebra"]
        },
        {
          id: 3,
          name: "PROGRAMMING FUNDAMENTALS",
          code: "PROG",
          description: "Develop coding skills in Python/R for data analysis, backtesting, and algorithmic trading implementation.",
          unlocked: true,
          level: 4,
          xp: 480,
          maxXp: 500,
          prerequisites: [],
          benefits: ["Python/R proficiency", "Data structures", "Algorithm design"]
        }
      ]
    },
    {
      name: "CORE SKILLS",
      color: "text-success",
      skills: [
        {
          id: 4,
          name: "RISK MANAGEMENT",
          code: "RISK",
          description: "Understand VaR, CVaR, portfolio risk metrics, and implement robust risk controls in trading strategies.",
          unlocked: true,
          level: 2,
          xp: 280,
          maxXp: 500,
          prerequisites: [1, 2],
          benefits: ["VaR calculation", "Risk budgeting", "Drawdown control"]
        },
        {
          id: 5,
          name: "PORTFOLIO OPTIMIZATION",
          code: "PORT",
          description: "Learn modern portfolio theory, factor models, and optimization techniques for asset allocation.",
          unlocked: true,
          level: 1,
          xp: 120,
          maxXp: 500,
          prerequisites: [1, 4],
          benefits: ["Mean-variance optimization", "Factor models", "Rebalancing strategies"]
        },
        {
          id: 6,
          name: "TIME SERIES ANALYSIS",
          code: "TSA",
          description: "Master ARIMA, GARCH, cointegration, and other time series models for financial data analysis.",
          unlocked: false,
          level: 0,
          xp: 0,
          maxXp: 500,
          prerequisites: [1, 3],
          benefits: ["ARIMA modeling", "Volatility forecasting", "Cointegration tests"]
        }
      ]
    },
    {
      name: "ADVANCED TECHNIQUES",
      color: "text-warning",
      skills: [
        {
          id: 7,
          name: "MACHINE LEARNING",
          code: "ML",
          description: "Apply ML techniques including regression, classification, and deep learning to financial markets.",
          unlocked: false,
          level: 0,
          xp: 0,
          maxXp: 500,
          prerequisites: [3, 6],
          benefits: ["Feature engineering", "Model validation", "Ensemble methods"]
        },
        {
          id: 8,
          name: "DERIVATIVES PRICING",
          code: "DERIV",
          description: "Learn Black-Scholes, Monte Carlo methods, and exotic options pricing models.",
          unlocked: false,
          level: 0,
          xp: 0,
          maxXp: 500,
          prerequisites: [2, 4],
          benefits: ["Options pricing", "Greeks calculation", "Volatility surfaces"]
        },
        {
          id: 9,
          name: "ALGORITHMIC TRADING",
          code: "ALGO",
          description: "Develop and implement automated trading strategies with proper execution and risk management.",
          unlocked: false,
          level: 0,
          xp: 0,
          maxXp: 500,
          prerequisites: [5, 7],
          benefits: ["Strategy development", "Backtesting", "Execution algorithms"]
        }
      ]
    },
    {
      name: "SPECIALIZATION",
      color: "text-accent",
      skills: [
        {
          id: 10,
          name: "QUANTITATIVE RESEARCH",
          code: "RES",
          description: "Conduct rigorous quantitative research, hypothesis testing, and strategy development.",
          unlocked: false,
          level: 0,
          xp: 0,
          maxXp: 500,
          prerequisites: [7, 8],
          benefits: ["Research methodology", "Strategy validation", "Performance attribution"]
        },
        {
          id: 11,
          name: "MARKET MICROSTRUCTURE",
          code: "MICRO",
          description: "Understand order flow, market making, and high-frequency trading concepts.",
          unlocked: false,
          level: 0,
          xp: 0,
          maxXp: 500,
          prerequisites: [9],
          benefits: ["Order book dynamics", "Market impact", "Latency optimization"]
        },
        {
          id: 12,
          name: "ALTERNATIVE DATA",
          code: "ALT",
          description: "Work with satellite data, social sentiment, and other non-traditional data sources.",
          unlocked: false,
          level: 0,
          xp: 0,
          maxXp: 500,
          prerequisites: [7, 10],
          benefits: ["Data sourcing", "Feature extraction", "Signal generation"]
        }
      ]
    }
  ];

  const getSkillById = (id: number) => {
    for (const category of skillCategories) {
      const skill = category.skills.find(s => s.id === id);
      if (skill) return skill;
    }
    return null;
  };

  const canUnlockSkill = (skill: any) => {
    return skill.prerequisites.every((prereqId: number) => {
      const prereqSkill = getSkillById(prereqId);
      return prereqSkill && prereqSkill.unlocked && prereqSkill.level >= 2;
    });
  };

  return (
    <section className="py-20 px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12">
          <h2 className="text-2xl font-mono font-bold mb-2 text-primary">
            SKILL PROGRESSION
          </h2>
          <div className="h-px bg-primary/30 w-full mb-8"></div>
          <p className="text-muted-foreground font-mono text-sm">
            Master quantitative finance through structured learning paths. Complete prerequisites to unlock advanced skills.
          </p>
        </div>

        <div className="space-y-8">
          {skillCategories.map((category, categoryIndex) => (
            <div key={category.name}>
              <div className="flex items-center gap-3 mb-6">
                <h3 className={`text-lg font-mono font-bold ${category.color}`}>
                  {category.name}
                </h3>
                <div className="h-px bg-border flex-1"></div>
                <Badge variant="outline" className="border-primary/50 text-primary">
                  {category.skills.filter(s => s.unlocked).length}/{category.skills.length}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.skills.map((skill) => (
                  <Card 
                    key={skill.id} 
                    className={`card-terminal p-4 cursor-pointer transition-all duration-200 ${
                      !skill.unlocked ? 'opacity-60' : ''
                    } ${
                      selectedSkill === skill.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedSkill(selectedSkill === skill.id ? null : skill.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`skill-node ${skill.unlocked ? 'unlocked' : 'locked'}`}>
                          <span className="text-xs font-bold">{skill.code}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-mono text-foreground leading-tight">
                            {skill.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {skill.unlocked ? (
                              <Badge variant="outline" className="border-success/50 text-success text-xs">
                                ACTIVE
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-muted-foreground/50 text-muted-foreground text-xs">
                                LOCKED
                              </Badge>
                            )}
                            {skill.unlocked && (
                              <span className="text-xs text-muted-foreground">
                                LVL {skill.level}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {skill.unlocked && (
                      <div className="ml-12 mb-3">
                        <div className="flex items-center gap-2 text-xs mb-1">
                          <span className="text-muted-foreground">Progress:</span>
                          <span className="text-primary">{skill.xp}/{skill.maxXp} XP</span>
                        </div>
                        <Progress 
                          value={(skill.xp / skill.maxXp) * 100} 
                          className="h-1.5"
                        />
                      </div>
                    )}

                    {!skill.unlocked && skill.prerequisites.length > 0 && (
                      <div className="ml-12 mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Prerequisites:</p>
                        <div className="flex flex-wrap gap-1">
                          {skill.prerequisites.map((prereqId) => {
                            const prereqSkill = getSkillById(prereqId);
                            return (
                              <Badge 
                                key={prereqId}
                                variant="outline" 
                                className={`text-xs ${
                                  prereqSkill && prereqSkill.unlocked && prereqSkill.level >= 2
                                    ? 'border-success/50 text-success'
                                    : 'border-destructive/50 text-destructive'
                                }`}
                              >
                                {prereqSkill?.code}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {!skill.unlocked && canUnlockSkill(skill) && (
                      <div className="ml-12">
                        <Button 
                          size="sm" 
                          className="btn-terminal rounded-none text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle skill unlock logic here
                          }}
                        >
                          UNLOCK SKILL
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Skill Details Modal */}
        {selectedSkill && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <Card className="card-terminal p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              {(() => {
                const skill = getSkillById(selectedSkill);
                if (!skill) return null;
                
                return (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`skill-node ${skill.unlocked ? 'unlocked' : 'locked'}`}>
                          <span className="text-xs font-bold">{skill.code}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-mono text-foreground">{skill.name}</h3>
                          <div className="flex items-center gap-2">
                            {skill.unlocked ? (
                              <Badge className="bg-success">ACTIVE</Badge>
                            ) : (
                              <Badge variant="outline" className="border-muted-foreground/50 text-muted-foreground">
                                LOCKED
                              </Badge>
                            )}
                            {skill.unlocked && (
                              <span className="text-sm text-muted-foreground">Level {skill.level}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-none"
                        onClick={() => setSelectedSkill(null)}
                      >
                        CLOSE
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-mono text-foreground mb-2">DESCRIPTION</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {skill.description}
                        </p>
                      </div>

                      {skill.unlocked && (
                        <div>
                          <h4 className="text-sm font-mono text-foreground mb-2">PROGRESS</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Experience Points</span>
                              <span className="text-primary">{skill.xp}/{skill.maxXp}</span>
                            </div>
                            <Progress value={(skill.xp / skill.maxXp) * 100} className="h-2" />
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-mono text-foreground mb-2">BENEFITS</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {skill.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-1 h-1 bg-primary rounded-full"></div>
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </div>

                      {skill.prerequisites.length > 0 && (
                        <div>
                          <h4 className="text-sm font-mono text-foreground mb-2">PREREQUISITES</h4>
                          <div className="flex flex-wrap gap-2">
                            {skill.prerequisites.map((prereqId) => {
                              const prereqSkill = getSkillById(prereqId);
                              return (
                                <Badge 
                                  key={prereqId}
                                  variant="outline" 
                                  className={`${
                                    prereqSkill && prereqSkill.unlocked && prereqSkill.level >= 2
                                      ? 'border-success/50 text-success'
                                      : 'border-destructive/50 text-destructive'
                                  }`}
                                >
                                  {prereqSkill?.name}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4 pt-4">
                        {skill.unlocked ? (
                          <Button className="btn-terminal rounded-none flex-1">
                            CONTINUE LEARNING
                          </Button>
                        ) : canUnlockSkill(skill) ? (
                          <Button className="btn-terminal rounded-none flex-1">
                            UNLOCK SKILL
                          </Button>
                        ) : (
                          <Button variant="outline" className="rounded-none flex-1" disabled>
                            COMPLETE PREREQUISITES
                          </Button>
                        )}
                        <Button variant="outline" className="rounded-none">
                          VIEW CURRICULUM
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};