'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from 'sonner';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  savedInternships: string[];
  appliedInternships: string[];
  toggleSave: (internshipId: string) => Promise<void>;
  toggleApplied: (internshipId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  savedInternships: [],
  appliedInternships: [],
  toggleSave: async () => {},
  toggleApplied: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedInternships, setSavedInternships] = useState<string[]>([]);
  const [appliedInternships, setAppliedInternships] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Synchronize saved/applied internships based on authentication status and mode
  useEffect(() => {
    if (!user) {
      setSavedInternships([]);
      setAppliedInternships([]);
      return;
    }

    const isMock = auth.isMock;

    if (!isMock && db) {
      // Real Firebase Firestore subscription
      const userDocRef = doc(db, 'user_max', user.uid);

      // Proactively ensure a document exists in user_max with the user's uid on sign-in
      const ensureUserDoc = async () => {
        try {
          await setDoc(userDocRef, { userId: user.uid }, { merge: true });
        } catch (e) {
          console.error('Error ensuring user document exists in user_max:', e);
        }
      };
      void ensureUserDoc();

      const unsubscribeDoc = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setSavedInternships(data.savedInternships || []);
            setAppliedInternships(data.appliedInternships || []);
          } else {
            setSavedInternships([]);
            setAppliedInternships([]);
          }
        },
        (error) => {
          console.error('Error listening to user preferences:', error);
        }
      );

      return () => unsubscribeDoc();
    } else {
      // Mock / fallback: read from localStorage
      const loadFromLocalStorage = () => {
        try {
          const saved = JSON.parse(localStorage.getItem('saved_internships') || '[]');
          const applied = JSON.parse(localStorage.getItem('applied_internships') || '[]');
          setSavedInternships(saved);
          setAppliedInternships(applied);
        } catch (e) {
          console.error('Error reading localStorage in fallback:', e);
        }
      };

      loadFromLocalStorage();

      // Listen for changes from other components/pages
      const handleSavedChange = () => {
        try {
          const saved = JSON.parse(localStorage.getItem('saved_internships') || '[]');
          setSavedInternships(saved);
        } catch {}
      };

      const handleAppliedChange = () => {
        try {
          const applied = JSON.parse(localStorage.getItem('applied_internships') || '[]');
          setAppliedInternships(applied);
        } catch {}
      };

      window.addEventListener('saved_internships_changed', handleSavedChange);
      window.addEventListener('applied_internships_changed', handleAppliedChange);

      return () => {
        window.removeEventListener('saved_internships_changed', handleSavedChange);
        window.removeEventListener('applied_internships_changed', handleAppliedChange);
      };
    }
  }, [user]);

  const toggleSave = async (internshipId: string) => {
    if (!user) {
      toast.error('You must be signed in to save internships');
      return;
    }

    const isMock = auth.isMock;
    const isSaved = savedInternships.includes(internshipId);
    const updatedSaved = isSaved
      ? savedInternships.filter((id) => id !== internshipId)
      : [...savedInternships, internshipId];

    // Optimistically update local state so UI feels extremely fast & snappy
    setSavedInternships(updatedSaved);

    if (!isMock && db) {
      const userDocRef = doc(db, 'user_max', user.uid);
      try {
        await setDoc(userDocRef, { userId: user.uid, savedInternships: updatedSaved }, { merge: true });
      } catch (error) {
        console.error('Error updating saved internships in Firestore:', error);
        toast.error('Failed to sync saved internship with server');
        // Rollback state if writing fails
        setSavedInternships(savedInternships);
      }
    } else {
      try {
        localStorage.setItem('saved_internships', JSON.stringify(updatedSaved));
        window.dispatchEvent(new Event('saved_internships_changed'));
      } catch (e) {
        console.error('Error writing localStorage in toggleSave:', e);
        // Rollback state if writing fails
        setSavedInternships(savedInternships);
      }
    }
  };

  const toggleApplied = async (internshipId: string) => {
    if (!user) {
      toast.error('You must be signed in to mark internships as applied');
      return;
    }

    const isMock = auth.isMock;
    const isApplied = appliedInternships.includes(internshipId);
    const updatedApplied = isApplied
      ? appliedInternships.filter((id) => id !== internshipId)
      : [...appliedInternships, internshipId];

    // Optimistically update local state
    setAppliedInternships(updatedApplied);

    if (!isMock && db) {
      const userDocRef = doc(db, 'user_max', user.uid);
      try {
        await setDoc(userDocRef, { userId: user.uid, appliedInternships: updatedApplied }, { merge: true });
      } catch (error) {
        console.error('Error updating applied internships in Firestore:', error);
        toast.error('Failed to sync applied internship with server');
        // Rollback state if writing fails
        setAppliedInternships(appliedInternships);
      }
    } else {
      try {
        localStorage.setItem('applied_internships', JSON.stringify(updatedApplied));
        window.dispatchEvent(new Event('applied_internships_changed'));
      } catch (e) {
        console.error('Error writing localStorage in toggleApplied:', e);
        // Rollback state if writing fails
        setAppliedInternships(appliedInternships);
      }
    }
  };

  const signOut = async () => {
    if (auth.isMock) {
      await auth.mockSignOut();
    } else {
      await firebaseSignOut(auth);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        savedInternships,
        appliedInternships,
        toggleSave,
        toggleApplied,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
