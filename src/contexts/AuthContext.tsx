import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, SignUpData, SignInData, UserUpdateData, AuthUser, getDefaultUser } from '@/types/user';
import { UserService } from '@/services/userService';

interface AuthContextType {
  // Authentication State
  user: User | null;
  authUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  
  // Authentication Methods
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  
  // User Management
  updateUser: (data: UserUpdateData) => Promise<void>;
  refreshUser: () => Promise<void>;
  
  // Utility Methods
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export useAuth hook separately to avoid HMR issues
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firebaseAvailable, setFirebaseAvailable] = useState(!!auth && !!db);

  // Create default user data
  const createDefaultUserData = (firebaseUser: FirebaseUser, signUpData: SignUpData): User => {
    const now = new Date();
    
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: signUpData.displayName,
      photoURL: firebaseUser.photoURL || null,
      createdAt: now,
      lastLoginAt: now,
      isOnline: true,
      
      profile: {
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        bio: '',
        location: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        experience: 'Beginner',
        tradingStyle: 'Conservative',
        favoriteStrategy: 'Buy & Hold',
        joinDate: now,
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
        currentRank: 1000,
        highestRank: 1000,
        rankPoints: 1000,
        puzzlesCompleted: 0,
        puzzlesSolved: 0,
        puzzleAccuracy: 0,
        currentStreak: 0,
        longestPuzzleStreak: 0
      },
      
      skills: {
        technicalAnalysis: {
          level: 1,
          xp: 0,
          maxXp: 100,
          skills: {}
        },
        fundamentalAnalysis: {
          level: 1,
          xp: 0,
          maxXp: 100,
          skills: {}
        },
        riskManagement: {
          level: 1,
          xp: 0,
          maxXp: 100,
          skills: {}
        },
        algorithmicTrading: {
          level: 1,
          xp: 0,
          maxXp: 100,
          skills: {}
        },
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
        minRankDifference: 50,
        maxRankDifference: 200,
        preferredStrategies: ['Buy & Hold'],
        challengeCooldown: 0
      },
      
      leaderboard: {
        globalRank: 1000,
        globalPoints: 1000,
        tradingRank: 1000,
        skillsRank: 1000,
        challengesRank: 1000,
        puzzlesRank: 1000,
        weeklyRank: 1000,
        monthlyRank: 1000,
        rankHistory: [],
        pointsHistory: []
      },
      
      preferences: {
        theme: 'Dark',
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
          difficulty: 'Medium',
          defaultStrategy: 'Buy & Hold',
          defaultCapital: 100000
        }
      }
    };
  };

  // Fetch user data from Firestore
  const fetchUserData = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      if (!firebaseUser) return null;
      // Use the robust backend service to always get or create user data
      return await UserService.getOrCreateUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'User',
        photoURL: firebaseUser.photoURL || undefined
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Helper function to clean data for Firestore (remove undefined values)
  const cleanDataForFirestore = (data: any): any => {
    const cleaned = { ...data };
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === undefined) {
        delete cleaned[key];
      } else if (typeof cleaned[key] === 'object' && cleaned[key] !== null) {
        cleaned[key] = cleanDataForFirestore(cleaned[key]);
      }
    });
    return cleaned;
  };

  // Save user data to Firestore
  const saveUserData = async (userData: User): Promise<void> => {
    try {
      const userRef = doc(db, 'users', userData.uid);
      const cleanedData = cleanDataForFirestore({
        ...userData,
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      await setDoc(userRef, cleanedData, { merge: true });
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  };

  // Sign up new user
  const signUp = async (data: SignUpData): Promise<void> => {
    if (!firebaseAvailable) {
      throw new Error('Firebase authentication is not available. Please check your configuration.');
    }
    
    try {
      setError(null);
      setLoading(true);
      
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      // Update Firebase profile
      await updateProfile(firebaseUser, {
        displayName: data.displayName
      });
      
      // Create user document in Firestore
      const userData = createDefaultUserData(firebaseUser, data);
      await saveUserData(userData);
      
      setUser(userData);
      setAuthUser(firebaseUser);
      
      // Send verification email
      await sendEmailVerification(firebaseUser);
      
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in existing user
  const signIn = async (data: SignInData): Promise<void> => {
    if (!firebaseAvailable) {
      throw new Error('Firebase authentication is not available. Please check your configuration.');
    }
    
    try {
      setError(null);
      setLoading(true);
      const { user: firebaseUser } = await signInWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      // Fetch or create user data (guaranteed by getOrCreateUser)
      const userData = await fetchUserData(firebaseUser);
      // Defensive: fallback to getDefaultUser if somehow null (should never happen)
      const safeUserData = userData ?? getDefaultUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'User',
        photoURL: firebaseUser.photoURL || undefined
      });
      // Update last login
      safeUserData.lastLoginAt = new Date();
      safeUserData.isOnline = true;
      await saveUserData(safeUserData);
      setUser(safeUserData);
      setAuthUser(firebaseUser);
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out user
  const signOutUser = async (): Promise<void> => {
    if (!firebaseAvailable) {
      setUser(null);
      setAuthUser(null);
      return;
    }
    
    try {
      setError(null);
      
      // Update user online status
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          isOnline: false,
          lastLoginAt: serverTimestamp()
        });
      }
      
      await signOut(auth);
      setUser(null);
      setAuthUser(null);
      
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    if (!firebaseAvailable) {
      throw new Error('Firebase authentication is not available. Please check your configuration.');
    }
    
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Send verification email
  const sendVerificationEmail = async (): Promise<void> => {
    if (!firebaseAvailable) {
      throw new Error('Firebase authentication is not available. Please check your configuration.');
    }
    
    try {
      setError(null);
      if (authUser) {
        await sendEmailVerification(authUser);
      }
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Update user data
  const updateUser = async (data: UserUpdateData): Promise<void> => {
    if (!firebaseAvailable) {
      throw new Error('Firebase authentication is not available. Please check your configuration.');
    }
    
    try {
      setError(null);
      if (!user) throw new Error('No user logged in');
      
      const updatedUser: User = { 
        ...user, 
        ...data,
        profile: data.profile ? { ...user.profile, ...data.profile } : user.profile,
        preferences: data.preferences ? { ...user.preferences, ...data.preferences } : user.preferences
      };
      
      // Update Firebase profile if needed
      if (data.displayName || data.photoURL) {
        const profileUpdate: any = {};
        if (data.displayName) profileUpdate.displayName = data.displayName;
        if (data.photoURL !== undefined) profileUpdate.photoURL = data.photoURL;
        
        await updateProfile(authUser!, profileUpdate);
      }
      
      // Save to Firestore
      await saveUserData(updatedUser);
      setUser(updatedUser);
      
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    if (!firebaseAvailable || !authUser) {
      return;
    }
    
    const userData = await fetchUserData(authUser);
    if (userData) {
      setUser(userData);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Listen for auth state changes
  useEffect(() => {
    if (!firebaseAvailable) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[AuthContext] onAuthStateChanged:', firebaseUser);
      try {
        setLoading(true);
        if (firebaseUser) {
          const userData = await fetchUserData(firebaseUser);
          if (userData) {
            setUser(userData);
            setAuthUser(firebaseUser);
          } else {
            // Defensive: never set user to null if firebaseUser exists
            setUser(getDefaultUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'User',
              photoURL: firebaseUser.photoURL || undefined
            }));
            setAuthUser(firebaseUser);
          }
        } else {
          setUser(null);
          setAuthUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [firebaseAvailable]);

  const value: AuthContextType = {
    user,
    authUser,
    loading,
    error,
    signUp,
    signIn,
    signOut: signOutUser,
    resetPassword,
    sendVerificationEmail,
    updateUser,
    refreshUser,
    clearError
  };



  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
