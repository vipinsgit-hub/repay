import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Payment } from '../types/database';
import { formatCurrency, canMakePayment } from '../lib/calculations';
import {
  X,
  CheckCircle2,
  Trash2,
  Edit2,
  AlertCircle,
  Calendar as CalendarIcon,
  Loader2,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  date: Date | null;
  payment?: Payment;
  defaultDailyPayment: number;
  existingPayments: Payment[];
  borrowedAmount: number;
  onClose: () => void;
  onSavePayment: (dateStr: string, amount: number) => Promise<{ success: boolean; error: string | null }>;
  onUpdatePayment: (paymentId: string, amount: number) => Promise<{ success: boolean; error: string | null }>;
  onDeletePayment: (paymentId: string) => Promise<{ success: boolean; error: string | null }>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  date,
  payment,
  defaultDailyPayment,
  existingPayments,
  borrowedAmount,
  onClose,
  onSavePayment,
  onUpdatePayment,
  onDeletePayment,
}) => {
  const [amount, setAmount] = useState<number>(defaultDailyPayment);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && date) {
      setErrorMessage(null);
      setConfirmDelete(false);
      setIsEditing(false);
      if (payment) {
        setAmount(payment.amount);
      } else {
        setAmount(defaultDailyPayment);
      }
    }
  }, [isOpen, date, payment, defaultDailyPayment]);

  if (!isOpen || !date) return null;

  const dateStr = format(date, 'yyyy-MM-dd');
  const formattedDateTitle = format(date, 'MMMM d, yyyy');
  const isPaid = !!payment;

  // Validation check
  const { allowed, maxAllowed } = canMakePayment(
    existingPayments,
    dateStr,
    amount,
    borrowedAmount
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (amount <= 0) {
      setErrorMessage('Payment amount must be greater than zero.');
      return;
    }

    if (!allowed) {
      setErrorMessage(
        `This payment exceeds your remaining balance capacity. Maximum allowed for this day is ${formatCurrency(maxAllowed)}.`
      );
      return;
    }

    setLoading(true);
    let res;
    if (isPaid && payment) {
      res = await onUpdatePayment(payment.id, amount);
    } else {
      res = await onSavePayment(dateStr, amount);
    }
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Operation failed. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!payment) return;
    setLoading(true);
    setErrorMessage(null);
    const res = await onDeletePayment(payment.id);
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || 'Failed to remove payment.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-modal w-full max-w-md overflow-hidden transform transition-all text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-blue-950/80 text-primary-600 dark:text-blue-400 border border-primary-100 dark:border-blue-900">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {formattedDateTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isPaid ? 'Payment Recorded' : 'Mark Daily Payment'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isPaid && !isEditing ? (
            /* PAID VIEW MODE */
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center mx-auto mb-2 shadow-subtle">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Paid for this date
                </span>
                <div className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-100 mt-1">
                  {formatCurrency(payment.amount)}
                </div>
              </div>

              {!confirmDelete ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Amount
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/40 font-semibold text-xs text-red-700 dark:text-red-300 hover:bg-red-100/50 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove Payment
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-center space-y-3">
                  <p className="text-xs font-medium text-red-800 dark:text-red-300">
                    Are you sure you want to remove this payment?
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={loading}
                      className="py-1.5 px-3 rounded-lg bg-red-600 dark:bg-red-700 text-white text-xs font-semibold hover:bg-red-700 dark:hover:bg-red-600 flex items-center gap-1"
                    >
                      {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                      Confirm Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* UNPAID / EDIT FORM MODE */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Payment Amount (₹)
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-medium">
                    ₹
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-8 pr-4 py-2.5 text-slate-900 dark:text-white font-bold text-lg focus:border-primary-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-500 focus:ring-offset-0 transition-all"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex justify-between">
                  <span>Daily default target: {formatCurrency(defaultDailyPayment)}</span>
                  <span>Max capacity: {formatCurrency(maxAllowed)}</span>
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {isPaid && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || !allowed}
                  className="w-full py-2.5 px-4 rounded-xl bg-primary-600 dark:bg-blue-600 hover:bg-primary-700 dark:hover:bg-blue-500 text-white text-xs font-bold shadow-subtle transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPaid ? (
                    'Save Updated Amount'
                  ) : (
                    'Mark as Paid'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
