import { collection, doc, getDoc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/types/user';

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  points: number;
  date: string; // YYYY-MM-DD
}

export const QuizService = {
  // Fetch all quizzes for today
  async getTodaysQuizzes(): Promise<Quiz[]> {
    const today = new Date().toISOString().slice(0, 10);
    const quizzesCol = collection(db, 'dailyPuzzles');
    const querySnapshot = await getDocs(quizzesCol);
    // Filter quizzes where id or date matches today
    const quizzes: Quiz[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.date === today || docSnap.id.startsWith(today)) {
        quizzes.push({ id: docSnap.id, ...data } as Quiz);
      }
    });
    // Sort by id for consistent order
    quizzes.sort((a, b) => a.id.localeCompare(b.id));
    return quizzes;
  },
  // Fetch today's quiz
  async getTodaysQuiz(): Promise<Quiz | null> {
    const today = new Date().toISOString().slice(0, 10);
    const quizRef = doc(db, 'dailyPuzzles', today);
    const quizSnap = await getDoc(quizRef);
    if (quizSnap.exists()) {
      return { id: quizSnap.id, ...quizSnap.data() } as Quiz;
    }
    return null;
  },

  // Submit answer and update user points if correct
  async submitAnswer({
    user,
    quizId,
    selectedOption
  }: {
    user: User;
    quizId: string;
    selectedOption: number;
  }): Promise<{ correct: boolean; pointsAwarded: number }> {
    const quizRef = doc(db, 'dailyPuzzles', quizId);
    const quizSnap = await getDoc(quizRef);
    if (!quizSnap.exists()) return { correct: false, pointsAwarded: 0 };
    const quiz = quizSnap.data() as Quiz;
    const correct = quiz.correctOption === selectedOption;
    let pointsAwarded = 0;
    if (correct) {
      pointsAwarded = quiz.points;
      // Update user puzzle points
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          stats: {
            puzzlesSolved: (user.stats.puzzlesSolved || 0) + 1,
            puzzlePoints: (user.stats.puzzlePoints || 0) + pointsAwarded,
            lastPuzzleDate: serverTimestamp(),
          },
        },
        { merge: true }
      );
    }
    return { correct, pointsAwarded };
  },

  // (Optional) Fetch quiz history for leaderboard or streaks
  async getQuizHistory(userId: string) {
    // ...implement as needed
  },
};
