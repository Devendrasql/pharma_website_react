// import { useState, useEffect } from 'react';
// import { User } from '@supabase/supabase-js';
// import { supabase } from '../lib/supabase';

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Get initial session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user ?? null);
//         setLoading(false);
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, []);

//   const signUp = async (email: string, password: string) => {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//     });
//     return { data, error };
//   };

//   const signIn = async (email: string, password: string) => {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
//     return { data, error };
//   };

//   const signOut = async () => {
//     const { error } = await supabase.auth.signOut();
//     return { error };
//   };

//   return {
//     user,
//     loading,
//     signUp,
//     signIn,
//     signOut,
//   };
// };

// src/hooks/useAuth.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient'; // Import your Supabase client

interface AuthContextType {
  user: any | null; // Supabase user object type
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to get the current user session
    const getSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user || null);
      } catch (error: any) {
        console.error("Error getting session:", error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession(); // Call once on component mount

    // Listen for auth state changes (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false); // Ensure loading is false after any auth state change
      }
    );

    // Cleanup the listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // User state will be updated by the onAuthStateChange listener
      alert("Login Successful!");
    } catch (error: any) {
      alert(`Login failed: ${error.message}`);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      // User state will be updated by the onAuthStateChange listener
      alert("Signup Successful! Please check your email for confirmation (if email confirmation is enabled in Supabase).");
    } catch (error: any) {
      alert(`Signup failed: ${error.message}`);
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // User state will be updated by the onAuthStateChange listener
      alert("Logged out!");
    } catch (error: any) {
      alert(`Logout failed: ${error.message}`);
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = { user, loading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only after initial auth check */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
