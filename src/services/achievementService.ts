// Achievement System Service
import { Achievement, User, UserStats, UserSkills } from '@/types/user';
import { UserService } from './userService';

export class AchievementService {
  // Achievement Definitions
  private static achievements: Achievement[] = [
    // Trading Achievements
    {
      id: 'first_trade',
      title: 'First Steps',
      description: 'Complete your first simulation',
      icon: '🎯',
      category: 'Trading',
      rarity: 'Common',
      points: 10,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'profitable_trader',
      title: 'Profitable Trader',
      description: 'Achieve a positive return in 10 simulations',
      icon: '💰',
      category: 'Trading',
      rarity: 'Common',
      points: 25,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 10
    },
    {
      id: 'risk_manager',
      title: 'Risk Manager',
      description: 'Keep drawdown below 5% for 5 consecutive simulations',
      icon: '🛡️',
      category: 'Trading',
      rarity: 'Rare',
      points: 50,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 5
    },
    {
      id: 'sharpe_master',
      title: 'Sharpe Master',
      description: 'Achieve a Sharpe ratio above 2.0',
      icon: '📈',
      category: 'Trading',
      rarity: 'Epic',
      points: 100,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'crisis_survivor',
      title: 'Crisis Survivor',
      description: 'Complete all historical crisis simulations',
      icon: '🌪️',
      category: 'Trading',
      rarity: 'Legendary',
      points: 200,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 8
    },

    // Skills Achievements
    {
      id: 'skill_learner',
      title: 'Skill Learner',
      description: 'Unlock your first skill',
      icon: '🎓',
      category: 'Skills',
      rarity: 'Common',
      points: 15,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'technical_analyst',
      title: 'Technical Analyst',
      description: 'Reach level 5 in Technical Analysis',
      icon: '📊',
      category: 'Skills',
      rarity: 'Rare',
      points: 75,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 5
    },
    {
      id: 'fundamental_expert',
      title: 'Fundamental Expert',
      description: 'Reach level 5 in Fundamental Analysis',
      icon: '📋',
      category: 'Skills',
      rarity: 'Rare',
      points: 75,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 5
    },
    {
      id: 'risk_specialist',
      title: 'Risk Specialist',
      description: 'Reach level 5 in Risk Management',
      icon: '⚖️',
      category: 'Skills',
      rarity: 'Rare',
      points: 75,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 5
    },
    {
      id: 'algorithm_master',
      title: 'Algorithm Master',
      description: 'Reach level 5 in Algorithmic Trading',
      icon: '🤖',
      category: 'Skills',
      rarity: 'Rare',
      points: 75,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 5
    },
    {
      id: 'skill_master',
      title: 'Skill Master',
      description: 'Reach level 10 in any skill category',
      icon: '👑',
      category: 'Skills',
      rarity: 'Epic',
      points: 150,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 10
    },

    // Challenge Achievements
    {
      id: 'first_challenge',
      title: 'First Challenge',
      description: 'Participate in your first 1v1 challenge',
      icon: '⚔️',
      category: 'Challenges',
      rarity: 'Common',
      points: 20,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'challenge_warrior',
      title: 'Challenge Warrior',
      description: 'Win 10 1v1 challenges',
      icon: '🏆',
      category: 'Challenges',
      rarity: 'Rare',
      points: 100,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 10
    },
    {
      id: 'undefeated',
      title: 'Undefeated',
      description: 'Win 5 consecutive 1v1 challenges',
      icon: '🥇',
      category: 'Challenges',
      rarity: 'Epic',
      points: 200,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 5
    },
    {
      id: 'challenge_legend',
      title: 'Challenge Legend',
      description: 'Win 50 1v1 challenges',
      icon: '👑',
      category: 'Challenges',
      rarity: 'Legendary',
      points: 500,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 50
    },

    // Social Achievements
    {
      id: 'social_trader',
      title: 'Social Trader',
      description: 'Complete 5 challenges with different opponents',
      icon: '🤝',
      category: 'Social',
      rarity: 'Common',
      points: 30,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 5
    },
    {
      id: 'mentor',
      title: 'Mentor',
      description: 'Help 3 new traders by challenging them',
      icon: '🎓',
      category: 'Social',
      rarity: 'Rare',
      points: 80,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 3
    },

    // Special Achievements
    {
      id: 'early_adopter',
      title: 'Early Adopter',
      description: 'Join QuantQuest in the first month',
      icon: '🚀',
      category: 'Special',
      rarity: 'Legendary',
      points: 300,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'dedicated_trader',
      title: 'Dedicated Trader',
      description: 'Complete simulations for 7 consecutive days',
      icon: '🔥',
      category: 'Special',
      rarity: 'Epic',
      points: 150,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 7
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Achieve 100% win rate in 10 consecutive simulations',
      icon: '💎',
      category: 'Special',
      rarity: 'Legendary',
      points: 400,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 10
    },
    {
      id: 'quant_master',
      title: 'Quant Master',
      description: 'Unlock all achievements',
      icon: '🏅',
      category: 'Special',
      rarity: 'Legendary',
      points: 1000,
      unlockedAt: new Date(),
      progress: 0,
      maxProgress: 1
    }
  ];

  // Check and unlock achievements
  static async checkAchievements(user: User, context: {
    simulationResult?: any;
    challengeResult?: any;
    skillUpdate?: any;
  }): Promise<Achievement[]> {
    const unlockedAchievements: Achievement[] = [];
    const userAchievements = user.achievements.unlocked.map(a => a.id);

    for (const achievement of this.achievements) {
      // Skip if already unlocked
      if (userAchievements.includes(achievement.id)) {
        continue;
      }

      let shouldUnlock = false;
      let progress = 0;

      switch (achievement.id) {
        case 'first_trade':
          if (context.simulationResult && user.stats.totalSimulations >= 1) {
            shouldUnlock = true;
            progress = 1;
          }
          break;

        case 'profitable_trader':
          if (context.simulationResult && context.simulationResult.totalReturn > 0) {
            progress = user.stats.totalSimulations;
            if (progress >= 10) {
              shouldUnlock = true;
            }
          }
          break;

        case 'risk_manager':
          if (context.simulationResult && context.simulationResult.maxDrawdown < 5) {
            progress = user.stats.streakDays || 0;
            if (progress >= 5) {
              shouldUnlock = true;
            }
          }
          break;

        case 'sharpe_master':
          if (context.simulationResult && context.simulationResult.sharpeRatio >= 2.0) {
            shouldUnlock = true;
            progress = 1;
          }
          break;

        case 'crisis_survivor':
          // This would need to track which crises have been completed
          progress = user.stats.totalSimulations;
          if (progress >= 8) {
            shouldUnlock = true;
          }
          break;

        case 'skill_learner':
          if (context.skillUpdate && user.skills.unlockedSkills.length >= 1) {
            shouldUnlock = true;
            progress = 1;
          }
          break;

        case 'technical_analyst':
          if (user.skills.technicalAnalysis.level >= 5) {
            shouldUnlock = true;
            progress = user.skills.technicalAnalysis.level;
          }
          break;

        case 'fundamental_expert':
          if (user.skills.fundamentalAnalysis.level >= 5) {
            shouldUnlock = true;
            progress = user.skills.fundamentalAnalysis.level;
          }
          break;

        case 'risk_specialist':
          if (user.skills.riskManagement.level >= 5) {
            shouldUnlock = true;
            progress = user.skills.riskManagement.level;
          }
          break;

        case 'algorithm_master':
          if (user.skills.algorithmicTrading.level >= 5) {
            shouldUnlock = true;
            progress = user.skills.algorithmicTrading.level;
          }
          break;

        case 'skill_master':
          const maxLevel = Math.max(
            user.skills.technicalAnalysis.level,
            user.skills.fundamentalAnalysis.level,
            user.skills.riskManagement.level,
            user.skills.algorithmicTrading.level
          );
          if (maxLevel >= 10) {
            shouldUnlock = true;
            progress = maxLevel;
          }
          break;

        case 'first_challenge':
          if (context.challengeResult && user.stats.totalChallenges >= 1) {
            shouldUnlock = true;
            progress = 1;
          }
          break;

        case 'challenge_warrior':
          if (user.stats.challengesWon >= 10) {
            shouldUnlock = true;
            progress = user.stats.challengesWon;
          }
          break;

        case 'undefeated':
          // This would need to track consecutive wins
          if (user.stats.challengesWon >= 5) {
            shouldUnlock = true;
            progress = 5;
          }
          break;

        case 'challenge_legend':
          if (user.stats.challengesWon >= 50) {
            shouldUnlock = true;
            progress = user.stats.challengesWon;
          }
          break;

        case 'social_trader':
          // This would need to track unique opponents
          if (user.stats.totalChallenges >= 5) {
            shouldUnlock = true;
            progress = 5;
          }
          break;

        case 'mentor':
          // This would need to track challenges with new traders
          if (user.stats.totalChallenges >= 3) {
            shouldUnlock = true;
            progress = 3;
          }
          break;

        case 'early_adopter':
          const joinDate = new Date(user.profile.joinDate);
          const firstMonth = new Date('2024-01-01'); // Adjust based on launch date
          if (joinDate <= firstMonth) {
            shouldUnlock = true;
            progress = 1;
          }
          break;

        case 'dedicated_trader':
          if (user.stats.streakDays >= 7) {
            shouldUnlock = true;
            progress = user.stats.streakDays;
          }
          break;

        case 'perfectionist':
          if (user.stats.winRate >= 100 && user.stats.totalSimulations >= 10) {
            shouldUnlock = true;
            progress = 10;
          }
          break;

        case 'quant_master':
          if (user.achievements.totalAchievements >= this.achievements.length - 1) {
            shouldUnlock = true;
            progress = 1;
          }
          break;
      }

      if (shouldUnlock) {
        const unlockedAchievement: Achievement = {
          ...achievement,
          unlockedAt: new Date(),
          progress
        };
        unlockedAchievements.push(unlockedAchievement);
        
        // Add to user's achievements
        await UserService.addAchievement(user.uid, unlockedAchievement);
      } else if (progress > 0) {
        // Update progress even if not unlocked
        await UserService.updateAchievementProgress(user.uid, achievement.id, progress);
      }
    }

    return unlockedAchievements;
  }

  // Get all available achievements
  static getAllAchievements(): Achievement[] {
    return this.achievements;
  }

  // Get achievements by category
  static getAchievementsByCategory(category: string): Achievement[] {
    return this.achievements.filter(a => a.category === category);
  }

  // Get achievements by rarity
  static getAchievementsByRarity(rarity: string): Achievement[] {
    return this.achievements.filter(a => a.rarity === rarity);
  }

  // Get user's achievement progress
  static getUserAchievementProgress(user: User, achievementId: string): number {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement) return 0;

    const userProgress = user.achievements.progress[achievementId] || 0;
    return Math.min(userProgress, achievement.maxProgress);
  }

  // Get achievement completion percentage
  static getAchievementCompletionPercentage(user: User, achievementId: string): number {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement) return 0;

    const progress = this.getUserAchievementProgress(user, achievementId);
    return (progress / achievement.maxProgress) * 100;
  }

  // Get user's achievement statistics
  static getUserAchievementStats(user: User): {
    total: number;
    unlocked: number;
    completionRate: number;
    byCategory: Record<string, { total: number; unlocked: number }>;
    byRarity: Record<string, { total: number; unlocked: number }>;
  } {
    const total = this.achievements.length;
    const unlocked = user.achievements.unlocked.length;
    const completionRate = (unlocked / total) * 100;

    const byCategory: Record<string, { total: number; unlocked: number }> = {};
    const byRarity: Record<string, { total: number; unlocked: number }> = {};

    // Initialize counters
    this.achievements.forEach(achievement => {
      byCategory[achievement.category] = byCategory[achievement.category] || { total: 0, unlocked: 0 };
      byRarity[achievement.rarity] = byRarity[achievement.rarity] || { total: 0, unlocked: 0 };
      
      byCategory[achievement.category].total++;
      byRarity[achievement.rarity].total++;
    });

    // Count unlocked achievements
    user.achievements.unlocked.forEach(achievement => {
      byCategory[achievement.category].unlocked++;
      byRarity[achievement.rarity].unlocked++;
    });

    return {
      total,
      unlocked,
      completionRate,
      byCategory,
      byRarity
    };
  }
}
