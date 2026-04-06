import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, AuthUser } from '../types/auth';
import {
  signUp,
  signIn,
  signOut,
  resetPassword,
  getCurrentUser,
  onAuthStateChange,
} from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    }

    checkUser();

    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const newUser = await signUp(email, password);
      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const authUser = await signIn(email, password);
      setUser(authUser);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    await resetPassword(email);
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
