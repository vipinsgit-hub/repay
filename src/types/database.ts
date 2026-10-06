export interface Profile {
  id: string;
  name: string | null;
  borrowed_amount: number;
  daily_payment: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Payment {
  id: string;
  user_id: string;
  payment_date: string; // YYYY-MM-DD format
  amount: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface DynamicFinancials {
  borrowedAmount: number;
  totalPaid: number;
  remainingBalance: number;
  progressPercentage: number;
  dailyPayment: number;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          borrowed_amount: number;
          daily_payment: number;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          name?: string | null;
          borrowed_amount?: number;
          daily_payment?: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          borrowed_amount?: number;
          daily_payment?: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          payment_date: string;
          amount: number;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          payment_date: string;
          amount: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          payment_date?: string;
          amount?: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
