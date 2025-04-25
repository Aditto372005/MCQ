import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Ensure environment variables are defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Admin authentication
export const signInAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOutAdmin = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Student responses
export const saveStudentResponse = async (studentResponse: {
  fullName: string;
  schoolName: string;
  answers: Record<string, string>;
  score: number;
  totalQuestions: number;
  timeSpent: number;
}) => {
  const { data, error } = await supabase
    .from('responses')
    .insert([studentResponse])
    .select()
    .throwOnError();
  
  return { data, error };
};

// Get all responses for admin
export const getResponses = async () => {
  const { data, error } = await supabase
    .from('responses')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};
