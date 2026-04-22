import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'GUARDIAN';
  schoolId: string;
}

interface FirebaseContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  currentSchoolId: string | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [currentSchoolId, setCurrentSchoolId] = useState<string | null>(localStorage.getItem('eduFlow_schoolId'));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // High-Resilience Profile Strategy
        const schoolId = currentSchoolId || 'default-school';
        const profileRef = doc(db, 'schools', schoolId, 'users', firebaseUser.uid);
        
        let retryCount = 0;
        const maxRetries = 3;
        
        const fetchProfile = async () => {
          try {
            const profileSnap = await getDoc(profileRef);
            if (profileSnap.exists()) {
              const profileData = profileSnap.data() as UserProfile;
              setProfile(profileData);
              setCurrentSchoolId(profileData.schoolId);
              localStorage.setItem('eduFlow_schoolId', profileData.schoolId);
            } else {
              // New User Flow
              const newProfile: UserProfile & { createdAt: string } = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'System User',
                email: firebaseUser.email || '',
                role: 'ADMIN',
                schoolId: schoolId,
                createdAt: new Date().toISOString()
              };
              await setDoc(profileRef, newProfile);
              setProfile(newProfile as UserProfile);
              setCurrentSchoolId(schoolId);
              localStorage.setItem('eduFlow_schoolId', schoolId);
            }
          } catch (error: any) {
            const errorMsg = error.message || String(error);
            console.error(`[FirebaseContext] Profile sync error (Attempt ${retryCount + 1}):`, errorMsg);
            if (retryCount < maxRetries && (errorMsg.includes('offline') || error.code === 'unavailable')) {
              retryCount++;
              setTimeout(fetchProfile, 2000 * retryCount);
            } else {
              // Final fallback
              setIsLoading(false);
            }
          }
        };

        await fetchProfile();
      } else {
        setProfile(null);
      }
      setIsLoading(false);
      setIsAuthenticating(false);
    });

    return () => unsubscribe();
  }, [currentSchoolId]);

  const login = async () => {
    if (isAuthenticating) {
      console.warn('Authentication already in progress.');
      return;
    }

    try {
      setIsAuthenticating(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.warn('Authentication cancelled: The sign-in popup was closed before completion.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.warn('Authentication cancelled: A new popup request superseded an active one.');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Please enable popups for this site to sign in, or open the app in a new tab.');
      } else {
        console.error('Firebase Authentication Error:', error.message || String(error));
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('eduFlow_schoolId');
    setCurrentSchoolId(null);
  };

  return (
    <FirebaseContext.Provider value={{ user, profile, isLoading, login, logout, currentSchoolId }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
