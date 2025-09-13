import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CommunityQuestion {
  id?: string;
  question: string;
  options: string[];
  correctOption: number;
  contributedBy: string;
  userId: string;
  createdAt?: any;
}

export const CommunityService = {
  async addQuestion(data: CommunityQuestion): Promise<{ points: number }> {
    // Award random points for gamification
    const points = Math.floor(Math.random() * 21) + 30; // 30-50 points
    await addDoc(collection(db, 'communityQuestions'), {
      ...data,
      createdAt: serverTimestamp(),
      points
    });
    // Update leaderboard: count contributions, not points
    const leaderboardRef = doc(db, 'communityLeaderboard', data.userId);
    await updateDoc(leaderboardRef, {
      contributedBy: data.contributedBy,
      userId: data.userId,
      contributions: increment(1)
    }).catch(async () => {
      // If doc doesn't exist, create it
      await setDoc(leaderboardRef, {
        contributedBy: data.contributedBy,
        userId: data.userId,
        contributions: 1
      });
    });
    return { points };
  },
  async getAllQuestions(): Promise<CommunityQuestion[]> {
    const q = query(collection(db, 'communityQuestions'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityQuestion));
  },
  async getLeaderboard(): Promise<any[]> {
    const q = query(collection(db, 'communityLeaderboard'), orderBy('contributions', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data());
  }
};
