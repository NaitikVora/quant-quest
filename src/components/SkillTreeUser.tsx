import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserService } from "@/services/userService";
import { AchievementService } from "@/services/achievementService";
import { User, UserSkills } from "@/types/user";
import SkillTutorialModal from "./SkillTutorialModal";

export const SkillTreeUser = () => {
  const { user, refreshUser } = useAuth();
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [userSkills, setUserSkills] = useState<UserSkills | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialSkill, setTutorialSkill] = useState<any>(null);
  const [userAuraPoints, setUserAuraPoints] = useState(0);


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

  const handleUnlockSkill = (skill: any) => {
    setTutorialSkill(skill);
    setShowTutorial(true);
  };

  const handleTutorialComplete = (auraPoints: number) => {
    setUserAuraPoints(userAuraPoints + auraPoints);
    setShowTutorial(false);
    setTutorialSkill(null);
    
    // Add XP to the skill
    if (tutorialSkill) {
      const category = skillCategories.find(cat => 
        cat.skills.some(s => s.id === tutorialSkill.id)
      );
      if (category) {
        addSkillXP(category.categoryKey, tutorialSkill.id.toString(), 100);
      }
    }
  };

  const handleTutorialBack = () => {
    setShowTutorial(false);
    setTutorialSkill(null);
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
      categoryKey: "technicalAnalysis",
      skills: [
        {
          id: 1,
          name: "STATISTICS & PROBABILITY",
          code: "STAT",
          description: "Master statistical concepts, distributions, hypothesis testing, and probability theory essential for quantitative analysis.",
          benefits: ["Confidence intervals", "Hypothesis testing", "Statistical modeling"]
        },
        {
          id: 2,
          name: "MATHEMATICAL FINANCE",
          code: "MATH",
          description: "Learn calculus, linear algebra, and mathematical concepts specific to financial modeling and derivatives pricing.",
          benefits: ["Stochastic calculus", "Differential equations", "Linear algebra"]
        },
        {
          id: 3,
          name: "PROGRAMMING FUNDAMENTALS",
          code: "PROG",
          description: "Develop coding skills in Python/R for data analysis, backtesting, and algorithmic trading implementation.",
          benefits: ["Python/R proficiency", "Data structures", "Algorithm design"]
        }
      ]
    },
    {
      name: "ANALYSIS",
      color: "text-accent",
      categoryKey: "fundamentalAnalysis",
      skills: [
        {
          id: 4,
          name: "TECHNICAL ANALYSIS",
          code: "TECH",
          description: "Learn chart patterns, indicators, and technical analysis methods for market timing and entry/exit signals.",
          benefits: ["Chart patterns", "Technical indicators", "Market timing"]
        },
        {
          id: 5,
          name: "FUNDAMENTAL ANALYSIS",
          code: "FUND",
          description: "Analyze financial statements, economic indicators, and company fundamentals for investment decisions.",
          benefits: ["Financial statements", "Economic indicators", "Valuation models"]
        },
        {
          id: 6,
          name: "RISK MANAGEMENT",
          code: "RISK",
          description: "Master portfolio risk assessment, position sizing, and risk mitigation strategies.",
          benefits: ["Portfolio risk", "Position sizing", "Risk mitigation"]
        }
      ]
    },
    {
      name: "TRADING",
      color: "text-success",
      categoryKey: "riskManagement",
      skills: [
        {
          id: 7,
          name: "ALGORITHMIC TRADING",
          code: "ALGO",
          description: "Develop and implement automated trading strategies using quantitative models and algorithms.",
          benefits: ["Strategy development", "Backtesting", "Execution algorithms"]
        },
        {
          id: 8,
          name: "DERIVATIVES TRADING",
          code: "DERIV",
          description: "Trade options, futures, and other derivative instruments with advanced pricing models.",
          benefits: ["Options pricing", "Futures trading", "Hedging strategies"]
        },
        {
          id: 9,
          name: "HIGH-FREQUENCY TRADING",
          code: "HFT",
          description: "Understand low-latency trading, market microstructure, and high-frequency strategies.",
          benefits: ["Low latency", "Market microstructure", "HFT strategies"]
        }
      ]
    },
    {
      name: "ADVANCED",
      color: "text-warning",
      categoryKey: "algorithmicTrading",
      skills: [
        {
          id: 10,
          name: "QUANTITATIVE RESEARCH",
          code: "RES",
          description: "Conduct rigorous quantitative research, hypothesis testing, and strategy development.",
          benefits: ["Research methodology", "Strategy validation", "Performance attribution"]
        },
        {
          id: 11,
          name: "MARKET MICROSTRUCTURE",
          code: "MICRO",
          description: "Understand order flow, market making, and high-frequency trading concepts.",
          benefits: ["Order book dynamics", "Market impact", "Latency optimization"]
        },
        {
          id: 12,
          name: "ALTERNATIVE DATA",
          code: "ALT",
          description: "Work with satellite data, social sentiment, and other non-traditional data sources.",
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
    // For now, allow unlocking any skill if user is logged in
    return user !== null;
  };

  if (!user) {
    return (
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-2xl font-mono font-bold mb-4 text-primary">
              SKILL PROGRESSION
            </h2>
            <p className="text-muted-foreground mb-8">
              Sign in to track your skill progression and unlock achievements.
            </p>
            <Button className="btn-terminal">
              Sign In to Continue
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-mono font-bold mb-2 text-primary">
                SKILL PROGRESSION
              </h2>
              <div className="h-px bg-primary/30 w-full mb-4"></div>
              <p className="text-muted-foreground font-mono text-sm">
                Master quantitative finance through structured learning paths. Complete prerequisites to unlock advanced skills.
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground font-mono">Aura Points</div>
              <div className="text-2xl font-mono font-bold text-accent">{userAuraPoints}</div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {skillCategories.map((category, categoryIndex) => {
            const categoryProgress = userSkills?.[category.categoryKey as keyof UserSkills];
            const unlockedCount = categoryProgress?.skills ? 
              Object.values(categoryProgress.skills).filter(skill => skill.unlocked).length : 0;
            
            return (
              <div key={category.name}>
                <div className="flex items-center gap-3 mb-6">
                  <h3 className={`text-lg font-mono font-bold ${category.color}`}>
                    {category.name}
                  </h3>
                  <div className="h-px bg-border flex-1"></div>
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    {unlockedCount}/{category.skills.length}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.skills.map((skill) => {
                    const userProgress = getSkillProgress(category.categoryKey, skill.id.toString());
                    const isUnlocked = userProgress.unlocked;
                    const canUnlock = !isUnlocked && canUnlockSkill(skill);
                    
                    return (
                      <Card 
                        key={skill.id} 
                        className={`card-terminal p-4 cursor-pointer transition-all duration-200 ${
                          !isUnlocked ? 'opacity-60' : ''
                        } ${
                          selectedSkill === skill.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedSkill(selectedSkill === skill.id ? null : skill.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`skill-node ${isUnlocked ? 'unlocked' : 'locked'}`}>
                              <span className="text-xs font-bold">{skill.code}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-mono text-foreground leading-tight">
                                {skill.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                {isUnlocked ? (
                                  <Badge variant="outline" className="border-success/50 text-success text-xs">
                                    ACTIVE
                                  </Badge>
                                ) : canUnlock ? (
                                  <Badge variant="outline" className="border-accent/50 text-accent text-xs">
                                    AVAILABLE
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="border-muted-foreground/50 text-muted-foreground text-xs">
                                    LOCKED
                                  </Badge>
                                )}
                                {isUnlocked && (
                                  <span className="text-xs text-muted-foreground">
                                    LVL {userProgress.level}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {isUnlocked && (
                          <div className="ml-12 mb-3">
                            <div className="flex items-center gap-2 text-xs mb-1">
                              <span className="text-muted-foreground">Progress:</span>
                              <span className="text-primary">{userProgress.xp}/{userProgress.maxXp} XP</span>
                            </div>
                            <Progress 
                              value={(userProgress.xp / userProgress.maxXp) * 100} 
                              className="h-1.5"
                            />
                          </div>
                        )}

                        {canUnlock && (
                          <div className="mt-3">
                            <Button 
                              size="sm" 
                              className="w-full btn-terminal text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnlockSkill(skill);
                              }}
                              disabled={loading}
                            >
                              {loading ? 'Unlocking...' : 'Start Tutorial'}
                            </Button>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Skill Details Modal */}
        {selectedSkill && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="card-terminal max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden">
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-mono font-bold text-primary">
                    SKILL DETAILS
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedSkill(null)}
                  >
                    ✕
                  </Button>
                </div>
                {/* Scrollable content area below progress bar */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {(() => {
                    const skill = getSkillById(selectedSkill);
                    if (!skill) return null;
                    const category = skillCategories.find(cat => 
                      cat.skills.some(s => s.id === selectedSkill)
                    );
                    const userProgress = category ? 
                      getSkillProgress(category.categoryKey, skill.id.toString()) : 
                      { level: 1, xp: 0, maxXp: 100, unlocked: false };
                    return (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-lg font-mono font-bold text-foreground mb-2">
                            {skill.name}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {skill.description}
                          </p>
                        </div>
                        {userProgress.unlocked && (
                          <div>
                            <h5 className="font-mono font-semibold text-foreground mb-2">
                              PROGRESS
                            </h5>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Level {userProgress.level}</span>
                                <span>{userProgress.xp}/{userProgress.maxXp} XP</span>
                              </div>
                              <Progress 
                                value={(userProgress.xp / userProgress.maxXp) * 100} 
                                className="h-2"
                              />
                            </div>
                          </div>
                        )}
                        <div>
                          <h5 className="font-mono font-semibold text-foreground mb-2">
                            BENEFITS
                          </h5>
                          <ul className="space-y-1">
                            {skill.benefits.map((benefit, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="text-primary">•</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Tutorial Modal */}
      {showTutorial && tutorialSkill && (
        <SkillTutorialModal
          skill={tutorialSkill}
          onComplete={handleTutorialComplete}
          onClose={handleTutorialBack}
        />
      )}
    </section>
  );
};
