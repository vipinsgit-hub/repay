import React from 'react';
import { formatCurrency } from '../lib/calculations';
import { DynamicFinancials } from '../types/database';
import { ProgressBar } from './ProgressBar';
import { CheckCircle2 } from 'lucide-react';

interface BalanceHeroProps {
  financials: DynamicFinancials;
}

export const BalanceHero: React.FC<BalanceHeroProps> = ({ financials }) => {
  const { borrowedAmount, totalPaid, remainingBalance, progressPercentage } =
    financials;

  const isFullyPaid = remainingBalance === 0 && borrowedAmount > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-card relative overflow-hidden transition-colors duration-200">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-blue-500 to-indigo-600 dark:from-blue-500 dark:via-indigo-500 dark:to-sky-400" />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Remaining Balance
            </span>
            {isFullyPaid && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> Fully Repaid
              </span>
            )}
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {formatCurrency(remainingBalance)}
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">
            Repayment Status
          </div>
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center sm:justify-end gap-1">
            <span>{formatCurrency(totalPaid)}</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">of</span>
            <span>{formatCurrency(borrowedAmount)}</span>
            <span className="text-slate-400 dark:text-slate-500">repaid</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <ProgressBar percentage={progressPercentage} size="lg" />
      </div>
    </div>
  );
};
