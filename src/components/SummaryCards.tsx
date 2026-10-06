import React from 'react';
import { formatCurrency } from '../lib/calculations';
import { DynamicFinancials } from '../types/database';
import { Banknote, CalendarDays, CheckCircle } from 'lucide-react';

interface SummaryCardsProps {
  financials: DynamicFinancials;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ financials }) => {
  const { borrowedAmount, totalPaid, remainingBalance, dailyPayment } = financials;

  // Calculate estimated days left at current daily payment rate
  const daysRemaining =
    dailyPayment > 0 ? Math.ceil(remainingBalance / dailyPayment) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Borrowed Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-card hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Total Borrowed
          </span>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
            <Banknote className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(borrowedAmount)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Initial loan amount
          </p>
        </div>
      </div>

      {/* Total Paid Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-card hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Total Paid
          </span>
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/80">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(totalPaid)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sum of recorded payments
          </p>
        </div>
      </div>

      {/* Daily Rate & Days Left Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-card hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Daily Target
          </span>
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/80">
            <CalendarDays className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(dailyPayment)}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">
              / day
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {remainingBalance === 0
              ? 'Loan is completely paid off!'
              : `~${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining at current pace`}
          </p>
        </div>
      </div>
    </div>
  );
};
