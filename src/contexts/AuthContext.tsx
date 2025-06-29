import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_member: boolean;
  created_at: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  joinClub: (passcode: string) => Promise<boolean>;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MEMBER_PASSCODE = 'ENTER_THE_HEX';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    setIsLoading(false);
    return !error;
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    if (userData.password !== userData.confirmPassword) {
      return false;
    }

    setIsLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
        }
      }
    });
    
    setIsLoading(false);
    return !error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const joinClub = async (passcode: string): Promise<boolean> => {
    if (!user || !profile || passcode !== MEMBER_PASSCODE) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_member: true })
        .eq('id', user.id);

      if (error) throw error;
      
      setProfile({ ...profile, is_member: true });
      return true;
    } catch (error) {
      console.error('Error joining club:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      joinClub
    }}>
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
