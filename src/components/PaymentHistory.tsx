import React from 'react';
import { format, parseISO } from 'date-fns';
import { Payment } from '../types/database';
import { formatCurrency } from '../lib/calculations';
import { CheckCircle2, History, Trash2 } from 'lucide-react';

interface PaymentHistoryProps {
  payments: Payment[];
  onDeletePayment: (paymentId: string) => void;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  payments,
  onDeletePayment,
}) => {
  // Show most recent 10 payments
  const recentPayments = payments.slice(0, 10);

  if (recentPayments.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center shadow-card transition-colors duration-200">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-2.5">
          <History className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No payment history yet</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Select any date on the calendar page to record your repayments.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-card transition-colors duration-200">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <History className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Recent Payments
          </h3>
        </div>
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          Showing last {recentPayments.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {recentPayments.map((p) => {
          // Parse YYYY-MM-DD
          const parsedDate = parseISO(p.payment_date);
          const formattedDate = format(parsedDate, 'MMM d, yyyy');

          return (
            <div
              key={p.id}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800/80">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {formattedDate}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/80">
                    Paid
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {formatCurrency(p.amount)}
                </span>
                <button
                  onClick={() => onDeletePayment(p.id)}
                  className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded"
                  title="Delete payment entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
