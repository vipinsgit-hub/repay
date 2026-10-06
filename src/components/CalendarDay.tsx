import React from 'react';
import { format, isToday, isSameMonth } from 'date-fns';
import { Check } from 'lucide-react';
import { Payment } from '../types/database';
import { formatCurrency } from '../lib/calculations';

interface CalendarDayProps {
  date: Date;
  currentMonth: Date;
  payment?: Payment;
  defaultDailyPayment: number;
  onClick: (date: Date, payment?: Payment) => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  currentMonth,
  payment,
  defaultDailyPayment,
  onClick,
}) => {
  const dayNumber = format(date, 'd');
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isTodayDate = isToday(date);
  const isPaid = !!payment;

  return (
    <button
      type="button"
      onClick={() => onClick(date, payment)}
      disabled={!isCurrentMonth}
      className={`
        relative group text-left min-h-[58px] sm:min-h-[84px] p-1 sm:p-2.5 rounded-lg sm:rounded-xl border transition-all duration-150 flex flex-col justify-between select-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900
        ${!isCurrentMonth ? 'opacity-30 dark:opacity-20 bg-slate-50/40 dark:bg-slate-950 border-slate-100 dark:border-slate-800/50 cursor-default pointer-events-none' : 'cursor-pointer'}
        ${
          isPaid
            ? 'bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/80 shadow-subtle'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
        }
        ${isTodayDate && !isPaid ? 'ring-2 ring-primary-500 dark:ring-blue-500 ring-offset-1 border-primary-500 dark:border-blue-500' : ''}
      `}
    >
      {/* Header: Day number & Compact Non-overlapping Today Badge */}
      <div className="flex items-center justify-between w-full min-w-0 gap-0.5">
        <span
          className={`
            text-[11px] sm:text-sm font-bold tracking-tight inline-flex items-center justify-center rounded px-1 py-0.2 sm:px-1.5 sm:py-0.5 shrink-0
            ${
              isTodayDate
                ? isPaid
                  ? 'bg-emerald-600 text-white font-black'
                  : 'bg-primary-600 dark:bg-blue-600 text-white font-black'
                : isPaid
                ? 'text-emerald-900 dark:text-emerald-200 font-semibold'
                : 'text-slate-700 dark:text-slate-300'
            }
          `}
        >
          {dayNumber}
        </span>

        {isTodayDate && (
          <span className="text-[8px] sm:text-[10px] font-extrabold uppercase tracking-tight px-1 py-0.2 sm:px-1.5 sm:py-0.2 bg-primary-100 dark:bg-blue-950 text-primary-800 dark:text-blue-300 rounded border border-primary-200/80 dark:border-blue-800 shrink-0 truncate">
            TODAY
          </span>
        )}
      </div>

      {/* Body: Payment Status & Amount */}
      <div className="mt-auto flex flex-col justify-end min-w-0">
        {isPaid ? (
          <div>
            <div className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-300 leading-tight">
              <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center shrink-0">
                <Check className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 stroke-[3]" />
              </span>
              <span className="truncate">Paid</span>
            </div>
            <div className="text-[10px] sm:text-sm font-bold text-emerald-900 dark:text-emerald-100 mt-0.5 leading-tight truncate">
              {formatCurrency(payment.amount)}
            </div>
          </div>
        ) : (
          <div>
            <span className="text-[8.5px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 block leading-tight truncate">
              Unpaid
            </span>
            <span className="text-[9.5px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 leading-tight truncate">
              {formatCurrency(defaultDailyPayment)}
            </span>
          </div>
        )}
      </div>
    </button>
  );
};
