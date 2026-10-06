import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Payment } from '../types/database';

export function usePayments(userId: string | undefined) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    if (!userId) {
      setPayments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      setPayments((data as Payment[]) || []);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError('Unable to fetch payment history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const addPayment = async (payment_date: string, amount: number) => {
    if (!userId) return { success: false, error: 'User not authenticated' };

    try {
      setError(null);
      const { data, error } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          payment_date,
          amount,
        })
        .select('*')
        .single();

      if (error) {
        // Postgres unique constraint code 23505 or duplicate text
        if (
          error.code === '23505' ||
          error.message.toLowerCase().includes('duplicate') ||
          error.message.toLowerCase().includes('unique')
        ) {
          throw new Error('Payment already recorded for this date.');
        }
        throw error;
      }

      setPayments((prev) => [data as Payment, ...prev.filter((p) => p.payment_date !== payment_date)]);
      return { success: true, payment: data as Payment, error: null };
    } catch (err: any) {
      const msg = err.message || 'Failed to record payment.';
      setError(msg);
      return { success: false, payment: null, error: msg };
    }
  };

  const updatePayment = async (paymentId: string, amount: number) => {
    if (!userId) return { success: false, error: 'User not authenticated' };

    try {
      setError(null);
      const { data, error } = await supabase
        .from('payments')
        .update({
          amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentId)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) throw error;

      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? (data as Payment) : p))
      );
      return { success: true, payment: data as Payment, error: null };
    } catch (err: any) {
      const msg = err.message || 'Failed to update payment.';
      setError(msg);
      return { success: false, payment: null, error: msg };
    }
  };

  const deletePayment = async (paymentId: string) => {
    if (!userId) return { success: false, error: 'User not authenticated' };

    try {
      setError(null);
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentId)
        .eq('user_id', userId);

      if (error) throw error;

      setPayments((prev) => prev.filter((p) => p.id !== paymentId));
      return { success: true, error: null };
    } catch (err: any) {
      const msg = err.message || 'Failed to delete payment.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  return {
    payments,
    loading,
    error,
    addPayment,
    updatePayment,
    deletePayment,
    refetchPayments: fetchPayments,
  };
}
