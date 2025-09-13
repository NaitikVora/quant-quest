// User Database Service
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  User, 
  UserUpdateData, 
  UserStats, 
  UserSkills, 
  Achievement, 
  LeaderboardData,
  Challenge,
  ChallengeInvite,
  ChallengeResult,
  getDefaultUser
} from '@/types/user';

export class UserService {
  // User CRUD Operations

  /**
   * Create a user document in Firestore. If userData is not provided, use getDefaultUser.
   */
  static async createUser(userData: User): Promise<void> {
    try {
      const userRef = doc(db, 'users', userData.uid);
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Get user data from Firestore. If not found, create it with default values and return the new user.
   */
  static async getOrCreateUser({
    uid,
    email,
    displayName,
    photoURL
  }: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
  }): Promise<User> {
    // Try to get user
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return this.convertFirestoreUser(userData);
    }
    // If not found, create with defaults
    const defaultUser = getDefaultUser({ uid, email, displayName, photoURL });
    await this.createUser(defaultUser);
    return defaultUser;
  }

  static async getUser(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return this.convertFirestoreUser(userData);
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  static async updateUser(uid: string, data: UserUpdateData): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteUser(uid: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Stats Management
  static async updateUserStats(uid: string, stats: Partial<UserStats>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        'stats': stats,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }

  static async addSimulationResult(uid: string, result: {
    totalReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
    totalTrades: number;
    winRate: number;
  }): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentStats = userData.stats || {};
        
        const newStats = {
          totalSimulations: (currentStats.totalSimulations || 0) + 1,
          simulationsCompleted: (currentStats.simulationsCompleted || 0) + 1,
          totalTrades: (currentStats.totalTrades || 0) + result.totalTrades,
          winningTrades: (currentStats.winningTrades || 0) + Math.round(result.totalTrades * result.winRate / 100),
          losingTrades: (currentStats.losingTrades || 0) + Math.round(result.totalTrades * (100 - result.winRate) / 100),
          netProfit: (currentStats.netProfit || 0) + result.totalReturn,
          bestTrade: Math.max(currentStats.bestTrade || 0, result.totalReturn),
          worstTrade: Math.min(currentStats.worstTrade || 0, result.totalReturn),
          maxDrawdown: Math.max(currentStats.maxDrawdown || 0, result.maxDrawdown),
          sharpeRatio: result.sharpeRatio,
          updatedAt: serverTimestamp()
        };

        // Calculate new win rate
        newStats.winRate = (newStats.winningTrades / newStats.totalTrades) * 100;
        
        // Calculate new average return
        newStats.averageReturn = newStats.netProfit / newStats.totalSimulations;

        await updateDoc(userRef, {
          stats: newStats,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error adding simulation result:', error);
      throw error;
    }
  }

  // Skills Management
  static async updateUserSkills(uid: string, skills: Partial<UserSkills>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        'skills': skills,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user skills:', error);
      throw error;
    }
  }

  static async addSkillXP(uid: string, category: string, skillId: string, xp: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentSkills = userData.skills || {};
        const categorySkills = currentSkills[category] || { level: 1, xp: 0, maxXp: 100, skills: {} };
        
        const newXP = categorySkills.xp + xp;
        const newLevel = Math.floor(newXP / 100) + 1;
        const newMaxXP = newLevel * 100;
        
        const updatedSkills = {
          ...currentSkills,
          [category]: {
            ...categorySkills,
            level: newLevel,
            xp: newXP,
            maxXp: newMaxXP,
            skills: {
              ...categorySkills.skills,
              [skillId]: {
                ...categorySkills.skills[skillId],
                xp: (categorySkills.skills[skillId]?.xp || 0) + xp,
                level: Math.floor((categorySkills.skills[skillId]?.xp || 0) + xp / 50) + 1,
                unlocked: true
              }
            }
          },
          totalSkillPoints: (currentSkills.totalSkillPoints || 0) + xp
        };

        await updateDoc(userRef, {
          skills: updatedSkills,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error adding skill XP:', error);
      throw error;
    }
  }

  // Achievements Management
  static async addAchievement(uid: string, achievement: Achievement): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        'achievements.unlocked': arrayUnion(achievement),
        'achievements.totalAchievements': increment(1),
        'achievements.rareAchievements': achievement.rarity !== 'Common' ? increment(1) : increment(0),
        'achievements.recentUnlocks': arrayUnion(achievement),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding achievement:', error);
      throw error;
    }
  }

  static async updateAchievementProgress(uid: string, achievementId: string, progress: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        [`achievements.progress.${achievementId}`]: progress,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating achievement progress:', error);
      throw error;
    }
  }

  // Leaderboard Management
  static async updateLeaderboard(uid: string, data: Partial<LeaderboardData>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        'leaderboard': data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating leaderboard:', error);
      throw error;
    }
  }

  static async addRankHistory(uid: string, category: string, rank: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        'leaderboard.rankHistory': arrayUnion({
          date: serverTimestamp(),
          category,
          rank
        }),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding rank history:', error);
      throw error;
    }
  }

  static async addPointsHistory(uid: string, category: string, points: number, source: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        'leaderboard.pointsHistory': arrayUnion({
          date: serverTimestamp(),
          category,
          points,
          source
        }),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding points history:', error);
      throw error;
    }
  }

  // Challenge Management
  static async createChallenge(challenge: Omit<Challenge, 'id'>): Promise<string> {
    try {
      const challengesRef = collection(db, 'challenges');
      const docRef = await setDoc(doc(challengesRef), {
        ...challenge,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }
  }

  static async getActiveChallenges(uid: string): Promise<Challenge[]> {
    try {
      const challengesRef = collection(db, 'challenges');
      const q = query(
        challengesRef,
        where('challengerId', '==', uid),
        where('status', 'in', ['Pending', 'Accepted', 'InProgress'])
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Challenge));
    } catch (error) {
      console.error('Error fetching active challenges:', error);
      throw error;
    }
  }

  static async getPendingInvites(uid: string): Promise<ChallengeInvite[]> {
    try {
      const invitesRef = collection(db, 'challengeInvites');
      const q = query(
        invitesRef,
        where('toUserId', '==', uid),
        where('expiresAt', '>', new Date()),
        orderBy('expiresAt', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ChallengeInvite));
    } catch (error) {
      console.error('Error fetching pending invites:', error);
      throw error;
    }
  }

  // Leaderboard Queries
  static async getGlobalLeaderboard(limitCount: number = 100): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        orderBy('leaderboard.globalPoints', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => this.convertFirestoreUser(doc.data()));
    } catch (error) {
      console.error('Error fetching global leaderboard:', error);
      throw error;
    }
  }

  static async getTradingLeaderboard(limitCount: number = 100): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        orderBy('stats.netProfit', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => this.convertFirestoreUser(doc.data()));
    } catch (error) {
      console.error('Error fetching trading leaderboard:', error);
      throw error;
    }
  }

  static async getSkillsLeaderboard(limitCount: number = 100): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        orderBy('skills.totalSkillPoints', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => this.convertFirestoreUser(doc.data()));
    } catch (error) {
      console.error('Error fetching skills leaderboard:', error);
      throw error;
    }
  }

  // Utility Methods
  private static convertFirestoreUser(userData: any): User {
    return {
      ...userData,
      createdAt: userData.createdAt?.toDate() || new Date(),
      lastLoginAt: userData.lastLoginAt?.toDate() || new Date(),
      profile: {
        ...userData.profile,
        joinDate: userData.profile?.joinDate?.toDate() || new Date()
      },
      achievements: {
        ...userData.achievements,
        unlocked: userData.achievements?.unlocked?.map((achievement: any) => ({
          ...achievement,
          unlockedAt: achievement.unlockedAt?.toDate() || new Date()
        })) || []
      },
      challenges: {
        ...userData.challenges,
        activeChallenges: userData.challenges?.activeChallenges?.map((challenge: any) => ({
          ...challenge,
          createdAt: challenge.createdAt?.toDate() || new Date(),
          acceptedAt: challenge.acceptedAt?.toDate(),
          startedAt: challenge.startedAt?.toDate(),
          completedAt: challenge.completedAt?.toDate()
        })) || [],
        pendingInvites: userData.challenges?.pendingInvites?.map((invite: any) => ({
          ...invite,
          createdAt: invite.createdAt?.toDate() || new Date(),
          expiresAt: invite.expiresAt?.toDate() || new Date()
        })) || [],
        challengeHistory: userData.challenges?.challengeHistory?.map((result: any) => ({
          ...result,
          completedAt: result.completedAt?.toDate() || new Date()
        })) || []
      },
      leaderboard: {
        ...userData.leaderboard,
        rankHistory: userData.leaderboard?.rankHistory?.map((history: any) => ({
          ...history,
          date: history.date?.toDate() || new Date()
        })) || [],
        pointsHistory: userData.leaderboard?.pointsHistory?.map((history: any) => ({
          ...history,
          date: history.date?.toDate() || new Date()
        })) || []
      }
    } as User;
  }

  // User Search
  static async searchUsers(query: string, limitCount: number = 20): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('displayName', '>=', query),
        where('displayName', '<=', query + '\uf8ff'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => this.convertFirestoreUser(doc.data()));
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Online Status Management
  static async setOnlineStatus(uid: string, isOnline: boolean): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        isOnline,
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating online status:', error);
      throw error;
    }
  }
}
