import { createClient } from '@supabase/supabase-js';

// Configurazione Supabase dal file .env
// Supporta sia REACT_APP_* (React) che NEXT_PUBLIC_* (Next.js) per compatibilità
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 
                    process.env.NEXT_PUBLIC_SUPABASE_URL || 
                    '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 
                       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                       '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing!');
  console.error('Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env');
}

// Crea il client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper per ottenere l'utente corrente
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return user;
};

// Helper per ottenere la sessione corrente
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting current session:', error);
    return null;
  }
  return session;
};

// Helper per il logout
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Helper per il login
export const signInWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error('Error signing in:', error);
    throw error;
  }
  
  return data;
};

// Helper per la registrazione
export const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata || {}
    }
  });
  
  if (error) {
    console.error('Error signing up:', error);
    throw error;
  }
  
  return data;
};

// Helper per il reset password
export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
  
  if (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Export del tipo User di Supabase
export type { User } from '@supabase/supabase-js';


