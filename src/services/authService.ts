import { supabase } from '../lib/supabase';
import { AuthUser } from '../types/auth';

export async function signUp(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error('Sign up failed');

  return {
    id: data.user.id,
    email: data.user.email || '',
    created_at: data.user.created_at || new Date().toISOString(),
  };
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error('Sign in failed');

  return {
    id: data.user.id,
    email: data.user.email || '',
    created_at: data.user.created_at || new Date().toISOString(),
  };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Get user error:', error);
    return null;
  }

  if (!user) return null;

  return {
    id: user.id,
    email: user.email || '',
    created_at: user.created_at || new Date().toISOString(),
  };
}

export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
}

export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        created_at: session.user.created_at || new Date().toISOString(),
      });
    } else {
      callback(null);
    }
  });

  return data?.subscription.unsubscribe;
}
