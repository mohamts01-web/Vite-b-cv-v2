export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
