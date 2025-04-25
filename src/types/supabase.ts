export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      responses: {
        Row: {
          id: number
          created_at: string
          fullName: string
          schoolName: string
          answers: Json
          score: number
          totalQuestions: number
          timeSpent: number
        }
        Insert: {
          id?: number
          created_at?: string
          fullName: string
          schoolName: string
          answers: Json
          score: number
          totalQuestions: number
          timeSpent: number
        }
        Update: {
          id?: number
          created_at?: string
          fullName?: string
          schoolName?: string
          answers?: Json
          score?: number
          totalQuestions?: number
          timeSpent?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}