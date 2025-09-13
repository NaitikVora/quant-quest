// User Management Types for QuantQuest

// --- Profile Types ---
export interface UserProfile {
  firstName: string;
  lastName: string;
  bio?: string;
  location?: string;
  timezone: string;
  experience: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  tradingStyle: 'Conservative' | 'Moderate' | 'Aggressive';
  favoriteStrategy: string;
  joinDate: Date;
  level: number;
  totalXP: number;
}

// --- Stats Types ---
export interface UserStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  averageReturn: number;
  bestTrade: number;
  worstTrade: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  var95: number;
  cvar95: number;
  totalSimulations: number;
  simulationsCompleted: number;
  averageSimulationTime: number;
  totalPlayTime: number;
  streakDays: number;
  longestStreak: number;
  totalChallenges: number;
  challengesWon: number;
  challengesLost: number;
  challengeWinRate: number;
  currentRank: number;
  highestRank: number;
  rankPoints: number;
  puzzlesCompleted: number;
  puzzlesSolved: number;
  puzzlePoints: number;
  puzzleAccuracy: number;
  currentStreak: number;
  longestPuzzleStreak: number;
}

// --- Skills Types ---
export interface SkillCategory {
  level: number;
  xp: number;
  maxXp: number;
  skills: {
    [skillId: string]: {
      level: number;
      xp: number;
      unlocked: boolean;
      mastered: boolean;
    };
  };
}

export interface UserSkills {
  technicalAnalysis: SkillCategory;
  fundamentalAnalysis: SkillCategory;
  riskManagement: SkillCategory;
  algorithmicTrading: SkillCategory;
  totalSkillPoints: number;
  unlockedSkills: string[];
  skillTreeProgress: number;
}

// --- Achievements Types ---
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Trading' | 'Skills' | 'Challenges' | 'Social' | 'Special';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  points: number;
  unlockedAt: Date;
  progress?: number;
  maxProgress?: number;
}

export interface UserAchievements {
  unlocked: Achievement[];
  totalAchievements: number;
  rareAchievements: number;
  recentUnlocks: Achievement[];
  progress: {
    [achievementId: string]: number;
  };
}

// --- Challenges Types ---
export interface ChallengeSettings {
  initialCapital: number;
  strategy: string;
  riskManagement: string;
  leverage: number;
  stopLoss: number;
  timeLimit: number;
}

export interface Challenge {
  id: string;
  challengerId: string;
  challengerName: string;
  challengerRank: number;
  opponentId: string;
  opponentName: string;
  opponentRank: number;
  status: 'Pending' | 'Accepted' | 'InProgress' | 'Completed' | 'Cancelled';
  simulationId: string;
  crisisId: string;
  createdAt: Date;
  acceptedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  winnerId?: string;
  prize: number;
  settings: ChallengeSettings;
}

export interface ChallengeInvite {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRank: number;
  toUserId: string;
  message?: string;
  createdAt: Date;
  expiresAt: Date;
  challengeSettings: ChallengeSettings;
}

export interface ChallengeResult {
  challengeId: string;
  opponentId: string;
  opponentName: string;
  result: 'Win' | 'Loss' | 'Draw';
  yourReturn: number;
  opponentReturn: number;
  completedAt: Date;
  simulationId: string;
}

export interface UserChallenges {
  activeChallenges: Challenge[];
  pendingInvites: ChallengeInvite[];
  challengeHistory: ChallengeResult[];
  autoAccept: boolean;
  minRankDifference: number;
  maxRankDifference: number;
  preferredStrategies: string[];
  challengeCooldown: number;
}

// --- Leaderboard Types ---
export interface RankHistory {
  date: Date;
  rank: number;
  category: 'Global' | 'Trading' | 'Skills' | 'Challenges' | 'Puzzles';
}

export interface PointsHistory {
  date: Date;
  points: number;
  category: 'Global' | 'Trading' | 'Skills' | 'Challenges' | 'Puzzles';
  source: 'Simulation' | 'Challenge' | 'Puzzle' | 'Achievement' | 'Skill';
}

export interface LeaderboardData {
  globalRank: number;
  globalPoints: number;
  tradingRank: number;
  skillsRank: number;
  challengesRank: number;
  puzzlesRank: number;
  weeklyRank: number;
  monthlyRank: number;
  rankHistory: RankHistory[];
  pointsHistory: PointsHistory[];
}

// --- Preferences Types ---
export interface UserPreferences {
  theme: 'Dark' | 'Light' | 'Auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    challenges: boolean;
    achievements: boolean;
    leaderboard: boolean;
    dailyPuzzles: boolean;
  };
  privacy: {
    showProfile: boolean;
    showStats: boolean;
    showRank: boolean;
    allowChallenges: boolean;
    showOnlineStatus: boolean;
  };
  game: {
    autoSave: boolean;
    soundEnabled: boolean;
    animationsEnabled: boolean;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
    defaultStrategy: string;
    defaultCapital: number;
  };
}

// --- User Interface ---
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
  isOnline?: boolean;
  profile: UserProfile;
  stats: UserStats;
  skills: UserSkills;
  achievements: UserAchievements;
  challenges: UserChallenges;
  leaderboard: LeaderboardData;
  preferences: UserPreferences;
}

// --- Default User Factory ---
export function getDefaultUser({
  uid,
  email,
  displayName,
  photoURL
}: {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}): User {
  return {
    uid,
    email,
    displayName,
    photoURL,
    createdAt: new Date(),
    lastLoginAt: new Date(),
    isOnline: true,
    profile: {
      firstName: '',
      lastName: '',
      bio: '',
      location: '',
      timezone: 'UTC',
      experience: 'Beginner',
      tradingStyle: 'Conservative',
      favoriteStrategy: '',
      joinDate: new Date(),
      level: 1,
      totalXP: 0
    },
    stats: {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      totalProfit: 0,
      totalLoss: 0,
      netProfit: 0,
      averageReturn: 0,
      bestTrade: 0,
      worstTrade: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      sortinoRatio: 0,
      calmarRatio: 0,
      var95: 0,
      cvar95: 0,
      totalSimulations: 0,
      simulationsCompleted: 0,
      averageSimulationTime: 0,
      totalPlayTime: 0,
      streakDays: 0,
      longestStreak: 0,
      totalChallenges: 0,
      challengesWon: 0,
      challengesLost: 0,
      challengeWinRate: 0,
      currentRank: 0,
      highestRank: 0,
      rankPoints: 0,
      puzzlesCompleted: 0,
      puzzlesSolved: 0,
      puzzlePoints: 0,
      puzzleAccuracy: 0,
      currentStreak: 0,
      longestPuzzleStreak: 0
    },
    skills: {
      technicalAnalysis: { level: 1, xp: 0, maxXp: 100, skills: {} },
      fundamentalAnalysis: { level: 1, xp: 0, maxXp: 100, skills: {} },
      riskManagement: { level: 1, xp: 0, maxXp: 100, skills: {} },
      algorithmicTrading: { level: 1, xp: 0, maxXp: 100, skills: {} },
      totalSkillPoints: 0,
      unlockedSkills: [],
      skillTreeProgress: 0
    },
    achievements: {
      unlocked: [],
      totalAchievements: 0,
      rareAchievements: 0,
      recentUnlocks: [],
      progress: {}
    },
    challenges: {
      activeChallenges: [],
      pendingInvites: [],
      challengeHistory: [],
      autoAccept: false,
      minRankDifference: 0,
      maxRankDifference: 0,
      preferredStrategies: [],
      challengeCooldown: 0
    },
    leaderboard: {
      globalRank: 0,
      globalPoints: 0,
      tradingRank: 0,
      skillsRank: 0,
      challengesRank: 0,
      puzzlesRank: 0,
      weeklyRank: 0,
      monthlyRank: 0,
      rankHistory: [],
      pointsHistory: []
    },
    preferences: {
      theme: 'Light',
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        push: true,
        challenges: true,
        achievements: true,
        leaderboard: true,
        dailyPuzzles: true
      },
      privacy: {
        showProfile: true,
        showStats: true,
        showRank: true,
        allowChallenges: true,
        showOnlineStatus: true
      },
      game: {
        autoSave: true,
        soundEnabled: true,
        animationsEnabled: true,
        difficulty: 'Easy',
        defaultStrategy: '',
        defaultCapital: 10000
      }
    }
  };
}

export interface UserChallenges {
  // Active Challenges
  activeChallenges: Challenge[];
  pendingInvites: ChallengeInvite[];
  challengeHistory: ChallengeResult[];
  
  // Challenge Settings
  autoAccept: boolean;
  minRankDifference: number;
  maxRankDifference: number;
  preferredStrategies: string[];
  challengeCooldown: number;
}

export interface Challenge {
  id: string;
  challengerId: string;
  challengerName: string;
  challengerRank: number;
  opponentId: string;
  opponentName: string;
  opponentRank: number;
  status: 'Pending' | 'Accepted' | 'InProgress' | 'Completed' | 'Cancelled';
  simulationId: string;
  crisisId: string;
  createdAt: Date;
  acceptedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  winnerId?: string;
  prize: number;
  settings: ChallengeSettings;
}

export interface ChallengeInvite {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRank: number;
  toUserId: string;
  message?: string;
  createdAt: Date;
  expiresAt: Date;
  challengeSettings: ChallengeSettings;
}

export interface ChallengeSettings {
  initialCapital: number;
  strategy: string;
  riskManagement: string;
  leverage: number;
  stopLoss: number;
  timeLimit: number; // in minutes
}

export interface ChallengeResult {
  challengeId: string;
  opponentId: string;
  opponentName: string;
  result: 'Win' | 'Loss' | 'Draw';
  yourReturn: number;
  opponentReturn: number;
  completedAt: Date;
  simulationId: string;
}

export interface LeaderboardData {
  // Global Rankings
  globalRank: number;
  globalPoints: number;
  
  // Category Rankings
  tradingRank: number;
  skillsRank: number;
  challengesRank: number;
  puzzlesRank: number;
  
  // Weekly/Monthly Rankings
  weeklyRank: number;
  monthlyRank: number;
  
  // Historical Data
  rankHistory: RankHistory[];
  pointsHistory: PointsHistory[];
}

export interface RankHistory {
  date: Date;
  rank: number;
  category: 'Global' | 'Trading' | 'Skills' | 'Challenges' | 'Puzzles';
}

export interface PointsHistory {
  date: Date;
  points: number;
  category: 'Global' | 'Trading' | 'Skills' | 'Challenges' | 'Puzzles';
  source: 'Simulation' | 'Challenge' | 'Puzzle' | 'Achievement' | 'Skill';
}

export interface UserPreferences {
  // UI Preferences
  theme: 'Dark' | 'Light' | 'Auto';
  language: string;
  timezone: string;
  
  // Notification Settings
  notifications: {
    email: boolean;
    push: boolean;
    challenges: boolean;
    achievements: boolean;
    leaderboard: boolean;
    dailyPuzzles: boolean;
  };
  
  // Privacy Settings
  privacy: {
    showProfile: boolean;
    showStats: boolean;
    showRank: boolean;
    allowChallenges: boolean;
    showOnlineStatus: boolean;
  };
  
  // Game Settings
  game: {
    autoSave: boolean;
    soundEnabled: boolean;
    animationsEnabled: boolean;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
    defaultStrategy: string;
    defaultCapital: number;
  };
}

// Authentication Types
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  firstName: string;
  lastName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UserUpdateData {
  displayName?: string;
  photoURL?: string;
  profile?: Partial<UserProfile>;
  preferences?: Partial<UserPreferences>;
}

// Database Operations
export interface UserDatabase {
  createUser(userData: SignUpData): Promise<User>;
  getUser(uid: string): Promise<User | null>;
  updateUser(uid: string, data: UserUpdateData): Promise<void>;
  deleteUser(uid: string): Promise<void>;
  updateUserStats(uid: string, stats: Partial<UserStats>): Promise<void>;
  updateUserSkills(uid: string, skills: Partial<UserSkills>): Promise<void>;
  addAchievement(uid: string, achievement: Achievement): Promise<void>;
  updateLeaderboard(uid: string, data: Partial<LeaderboardData>): Promise<void>;
}

// Challenge System Types
export interface ChallengeMatchmaking {
  findOpponent(userId: string, preferences: ChallengePreferences): Promise<string | null>;
  createChallenge(challenge: Omit<Challenge, 'id'>): Promise<Challenge>;
  acceptChallenge(challengeId: string, userId: string): Promise<void>;
  completeChallenge(challengeId: string, results: ChallengeResults): Promise<void>;
}

export interface ChallengePreferences {
  minRank: number;
  maxRank: number;
  preferredStrategies: string[];
  timeLimit: number;
}

export interface ChallengeResults {
  challengerReturn: number;
  opponentReturn: number;
  simulationData: any;
}
