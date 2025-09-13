// 1v1 Challenge System Service
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Challenge, 
  ChallengeInvite, 
  ChallengeResult, 
  ChallengeSettings, 
  ChallengePreferences,
  User
} from '@/types/user';
import { UserService } from './userService';

export class ChallengeService {
  // Create a new challenge
  static async createChallenge(
    challengerId: string, 
    opponentId: string, 
    settings: ChallengeSettings,
    message?: string
  ): Promise<string> {
    try {
      // Get challenger and opponent data
      const challenger = await UserService.getUser(challengerId);
      const opponent = await UserService.getUser(opponentId);
      
      if (!challenger || !opponent) {
        throw new Error('User not found');
      }

      // Check if opponent allows challenges
      if (!opponent.preferences.privacy.allowChallenges) {
        throw new Error('This user does not allow challenges');
      }

      // Check cooldown
      const now = Date.now();
      if (challenger.challenges.challengeCooldown > now) {
        throw new Error('You are on challenge cooldown');
      }

      // Create challenge document
      const challengeData: Omit<Challenge, 'id'> = {
        challengerId,
        challengerName: challenger.displayName,
        challengerRank: challenger.leaderboard.globalRank,
        opponentId,
        opponentName: opponent.displayName,
        opponentRank: opponent.leaderboard.globalRank,
        status: 'Pending',
        simulationId: '', // Will be set when simulation starts
        crisisId: '', // Will be set when simulation starts
        createdAt: new Date(),
        prize: this.calculatePrize(challenger.leaderboard.globalRank, opponent.leaderboard.globalRank),
        settings
      };

      const challengeRef = doc(collection(db, 'challenges'));
      await setDoc(challengeRef, {
        ...challengeData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Create challenge invite
      const inviteData: Omit<ChallengeInvite, 'id'> = {
        fromUserId: challengerId,
        fromUserName: challenger.displayName,
        fromUserRank: challenger.leaderboard.globalRank,
        toUserId: opponentId,
        message,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        challengeSettings: settings
      };

      const inviteRef = doc(collection(db, 'challengeInvites'));
      await setDoc(inviteRef, {
        ...inviteData,
        createdAt: serverTimestamp(),
        expiresAt: serverTimestamp()
      });

      // Update user's pending invites
      await updateDoc(doc(db, 'users', opponentId), {
        'challenges.pendingInvites': arrayUnion({
          id: inviteRef.id,
          ...inviteData
        }),
        updatedAt: serverTimestamp()
      });

      // Set cooldown for challenger
      await updateDoc(doc(db, 'users', challengerId), {
        'challenges.challengeCooldown': now + (5 * 60 * 1000), // 5 minutes
        updatedAt: serverTimestamp()
      });

      return challengeRef.id;
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }
  }

  // Find a suitable opponent for matchmaking
  static async findOpponent(userId: string, preferences: ChallengePreferences): Promise<User | null> {
    try {
      const user = await UserService.getUser(userId);
      if (!user) return null;

      const userRank = user.leaderboard.globalRank;
      const minRank = Math.max(1, userRank - preferences.maxRankDifference);
      const maxRank = userRank + preferences.maxRankDifference;

      // Query for suitable opponents
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('leaderboard.globalRank', '>=', minRank),
        where('leaderboard.globalRank', '<=', maxRank),
        where('preferences.privacy.allowChallenges', '==', true),
        where('isOnline', '==', true),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      const candidates = querySnapshot.docs
        .map(doc => UserService.convertFirestoreUser(doc.data()))
        .filter(candidate => 
          candidate.uid !== userId && 
          !candidate.challenges.activeChallenges.some(challenge => 
            challenge.status === 'Pending' || challenge.status === 'InProgress'
          )
        );

      if (candidates.length === 0) return null;

      // Sort by rank difference (closer ranks preferred)
      candidates.sort((a, b) => {
        const aDiff = Math.abs(a.leaderboard.globalRank - userRank);
        const bDiff = Math.abs(b.leaderboard.globalRank - userRank);
        return aDiff - bDiff;
      });

      return candidates[0];
    } catch (error) {
      console.error('Error finding opponent:', error);
      throw error;
    }
  }

  // Accept a challenge
  static async acceptChallenge(challengeId: string, userId: string): Promise<void> {
    try {
      const challengeRef = doc(db, 'challenges', challengeId);
      const challengeDoc = await getDoc(challengeRef);
      
      if (!challengeDoc.exists()) {
        throw new Error('Challenge not found');
      }

      const challenge = challengeDoc.data() as Challenge;
      
      if (challenge.opponentId !== userId) {
        throw new Error('You are not the intended opponent');
      }

      if (challenge.status !== 'Pending') {
        throw new Error('Challenge is no longer pending');
      }

      // Update challenge status
      await updateDoc(challengeRef, {
        status: 'Accepted',
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Remove from pending invites
      await updateDoc(doc(db, 'users', userId), {
        'challenges.pendingInvites': arrayRemove(challengeId),
        'challenges.activeChallenges': arrayUnion(challengeId),
        updatedAt: serverTimestamp()
      });

      // Add to challenger's active challenges
      await updateDoc(doc(db, 'users', challenge.challengerId), {
        'challenges.activeChallenges': arrayUnion(challengeId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error accepting challenge:', error);
      throw error;
    }
  }

  // Decline a challenge
  static async declineChallenge(challengeId: string, userId: string): Promise<void> {
    try {
      const challengeRef = doc(db, 'challenges', challengeId);
      const challengeDoc = await getDoc(challengeRef);
      
      if (!challengeDoc.exists()) {
        throw new Error('Challenge not found');
      }

      const challenge = challengeDoc.data() as Challenge;
      
      if (challenge.opponentId !== userId) {
        throw new Error('You are not the intended opponent');
      }

      // Update challenge status
      await updateDoc(challengeRef, {
        status: 'Cancelled',
        updatedAt: serverTimestamp()
      });

      // Remove from pending invites
      await updateDoc(doc(db, 'users', userId), {
        'challenges.pendingInvites': arrayRemove(challengeId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error declining challenge:', error);
      throw error;
    }
  }

  // Start a challenge simulation
  static async startChallenge(challengeId: string, simulationId: string, crisisId: string): Promise<void> {
    try {
      const challengeRef = doc(db, 'challenges', challengeId);
      await updateDoc(challengeRef, {
        status: 'InProgress',
        simulationId,
        crisisId,
        startedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error starting challenge:', error);
      throw error;
    }
  }

  // Complete a challenge
  static async completeChallenge(
    challengeId: string, 
    results: {
      challengerReturn: number;
      opponentReturn: number;
      simulationData: any;
    }
  ): Promise<void> {
    try {
      const challengeRef = doc(db, 'challenges', challengeId);
      const challengeDoc = await getDoc(challengeRef);
      
      if (!challengeDoc.exists()) {
        throw new Error('Challenge not found');
      }

      const challenge = challengeDoc.data() as Challenge;
      
      // Determine winner
      let winnerId: string;
      if (results.challengerReturn > results.opponentReturn) {
        winnerId = challenge.challengerId;
      } else if (results.opponentReturn > results.challengerReturn) {
        winnerId = challenge.opponentId;
      } else {
        winnerId = ''; // Draw
      }

      // Update challenge
      await updateDoc(challengeRef, {
        status: 'Completed',
        winnerId,
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update user stats
      const challengerResult: ChallengeResult = {
        challengeId,
        opponentId: challenge.opponentId,
        opponentName: challenge.opponentName,
        result: winnerId === challenge.challengerId ? 'Win' : winnerId === challenge.opponentId ? 'Loss' : 'Draw',
        yourReturn: results.challengerReturn,
        opponentReturn: results.opponentReturn,
        completedAt: new Date(),
        simulationId: challenge.simulationId
      };

      const opponentResult: ChallengeResult = {
        challengeId,
        opponentId: challenge.challengerId,
        opponentName: challenge.challengerName,
        result: winnerId === challenge.opponentId ? 'Win' : winnerId === challenge.challengerId ? 'Loss' : 'Draw',
        yourReturn: results.opponentReturn,
        opponentReturn: results.challengerReturn,
        completedAt: new Date(),
        simulationId: challenge.simulationId
      };

      // Update challenger stats
      await updateDoc(doc(db, 'users', challenge.challengerId), {
        'stats.totalChallenges': increment(1),
        'stats.challengesWon': winnerId === challenge.challengerId ? increment(1) : increment(0),
        'stats.challengesLost': winnerId === challenge.opponentId ? increment(1) : increment(0),
        'challenges.activeChallenges': arrayRemove(challengeId),
        'challenges.challengeHistory': arrayUnion(challengerResult),
        updatedAt: serverTimestamp()
      });

      // Update opponent stats
      await updateDoc(doc(db, 'users', challenge.opponentId), {
        'stats.totalChallenges': increment(1),
        'stats.challengesWon': winnerId === challenge.opponentId ? increment(1) : increment(0),
        'stats.challengesLost': winnerId === challenge.challengerId ? increment(1) : increment(0),
        'challenges.activeChallenges': arrayRemove(challengeId),
        'challenges.challengeHistory': arrayUnion(opponentResult),
        updatedAt: serverTimestamp()
      });

      // Update leaderboard rankings
      await this.updateRankings(challenge.challengerId, challengerResult.result);
      await this.updateRankings(challenge.opponentId, opponentResult.result);
    } catch (error) {
      console.error('Error completing challenge:', error);
      throw error;
    }
  }

  // Get user's active challenges
  static async getActiveChallenges(userId: string): Promise<Challenge[]> {
    try {
      const challengesRef = collection(db, 'challenges');
      const q = query(
        challengesRef,
        where('challengerId', '==', userId),
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

  // Get user's pending invites
  static async getPendingInvites(userId: string): Promise<ChallengeInvite[]> {
    try {
      const invitesRef = collection(db, 'challengeInvites');
      const q = query(
        invitesRef,
        where('toUserId', '==', userId),
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

  // Get user's challenge history
  static async getChallengeHistory(userId: string, limitCount: number = 50): Promise<ChallengeResult[]> {
    try {
      const user = await UserService.getUser(userId);
      if (!user) return [];

      return user.challenges.challengeHistory
        .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
        .slice(0, limitCount);
    } catch (error) {
      console.error('Error fetching challenge history:', error);
      throw error;
    }
  }

  // Calculate challenge prize based on rank difference
  private static calculatePrize(challengerRank: number, opponentRank: number): number {
    const rankDifference = Math.abs(challengerRank - opponentRank);
    const basePrize = 100;
    
    // Higher rank difference = higher prize
    const multiplier = 1 + (rankDifference / 1000);
    return Math.round(basePrize * multiplier);
  }

  // Update user rankings after challenge
  private static async updateRankings(userId: string, result: 'Win' | 'Loss' | 'Draw'): Promise<void> {
    try {
      const user = await UserService.getUser(userId);
      if (!user) return;

      let pointsChange = 0;
      switch (result) {
        case 'Win':
          pointsChange = 25;
          break;
        case 'Loss':
          pointsChange = -15;
          break;
        case 'Draw':
          pointsChange = 5;
          break;
      }

      const newPoints = Math.max(0, user.leaderboard.globalPoints + pointsChange);
      
      await UserService.updateLeaderboard(userId, {
        globalPoints: newPoints
      });

      await UserService.addPointsHistory(userId, 'Global', pointsChange, 'Challenge');
    } catch (error) {
      console.error('Error updating rankings:', error);
      throw error;
    }
  }

  // Get challenge statistics
  static async getChallengeStats(userId: string): Promise<{
    totalChallenges: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
    currentStreak: number;
    longestStreak: number;
    averageReturn: number;
    bestReturn: number;
    worstReturn: number;
  }> {
    try {
      const user = await UserService.getUser(userId);
      if (!user) {
        return {
          totalChallenges: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          winRate: 0,
          currentStreak: 0,
          longestStreak: 0,
          averageReturn: 0,
          bestReturn: 0,
          worstReturn: 0
        };
      }

      const history = user.challenges.challengeHistory;
      const wins = history.filter(r => r.result === 'Win').length;
      const losses = history.filter(r => r.result === 'Loss').length;
      const draws = history.filter(r => r.result === 'Draw').length;
      const totalChallenges = history.length;
      const winRate = totalChallenges > 0 ? (wins / totalChallenges) * 100 : 0;

      const returns = history.map(r => r.yourReturn);
      const averageReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
      const bestReturn = returns.length > 0 ? Math.max(...returns) : 0;
      const worstReturn = returns.length > 0 ? Math.min(...returns) : 0;

      // Calculate current streak
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      let lastResult = '';

      for (let i = history.length - 1; i >= 0; i--) {
        const result = history[i].result;
        if (i === history.length - 1) {
          lastResult = result;
          tempStreak = 1;
        } else if (result === lastResult) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          if (i === history.length - 1) {
            currentStreak = tempStreak;
          }
          tempStreak = 1;
          lastResult = result;
        }
      }

      longestStreak = Math.max(longestStreak, tempStreak);
      if (history.length > 0) {
        currentStreak = tempStreak;
      }

      return {
        totalChallenges,
        wins,
        losses,
        draws,
        winRate,
        currentStreak,
        longestStreak,
        averageReturn,
        bestReturn,
        worstReturn
      };
    } catch (error) {
      console.error('Error getting challenge stats:', error);
      throw error;
    }
  }
}
