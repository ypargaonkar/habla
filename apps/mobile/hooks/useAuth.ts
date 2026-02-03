import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  currentLevel: string;
  learningGoal: string;
  dailyGoalMinutes: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    await api.init();
    const result = await api.getMe();

    if (result.success && result.data) {
      setUser(result.data.user);
    }

    setIsLoading(false);
  }

  async function login(email: string, password: string) {
    const result = await api.login(email, password);

    if (result.success && result.data) {
      setUser(result.data.user);
      return { success: true };
    }

    return { success: false, error: result.error || 'Login failed' };
  }

  async function signup(email: string, password: string, name: string) {
    const result = await api.signup(email, password, name);

    if (result.success && result.data) {
      setUser(result.data.user);
      return { success: true };
    }

    return { success: false, error: result.error || 'Signup failed' };
  }

  async function logout() {
    await api.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
