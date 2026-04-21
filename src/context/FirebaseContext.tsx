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
  const [currentSchoolId, setCurrentSchoolId] = useState<string | null>(localStorage.getItem('eduFlow_schoolId'));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Attempt to find profile in ANY school (multi-tenant lookup)
        // For SaaS, users usually belong to a school.
        // We'll look for the profile in the last known school or fallback to 'default'
        const schoolId = currentSchoolId || 'default-school';
        const profileRef = doc(db, 'schools', schoolId, 'users', firebaseUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const profileData = profileSnap.data() as UserProfile;
          setProfile(profileData);
          setCurrentSchoolId(profileData.schoolId);
          localStorage.setItem('eduFlow_schoolId', profileData.schoolId);
        } else {
          // New User Flow: Create a default admin profile for the first user of a new "default-school"
          // In a real SaaS, this would involve a registration form
          const newProfile: UserProfile = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'System User',
            email: firebaseUser.email || '',
            role: 'ADMIN',
            schoolId: schoolId
          };
          await setDoc(profileRef, newProfile);
          setProfile(newProfile);
          setCurrentSchoolId(schoolId);
          localStorage.setItem('eduFlow_schoolId', schoolId);
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentSchoolId]);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Force account selection to prevent background blocking issues in some browsers
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
        console.error('Firebase Authentication Error:', error);
      }
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
