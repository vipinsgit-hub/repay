import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Payment } from '../types/database';
import { CalendarDay } from './CalendarDay';

interface CalendarProps {
  payments: Payment[];
  defaultDailyPayment: number;
  onDayClick: (date: Date, payment?: Payment) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  payments,
  defaultDailyPayment,
  onDayClick,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  // Generate calendar days for current month grid (Week starts on Monday = 1)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Map payments by YYYY-MM-DD for fast lookup
  const paymentMap = new Map<string, Payment>();
  payments.forEach((p) => {
    paymentMap.set(p.payment_date, p);
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 sm:p-6 shadow-card transition-colors duration-200 w-full overflow-hidden">
      {/* Calendar Header / Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0">
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 leading-tight">
              Click any date to record or update a repayment
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          <button
            onClick={handleToday}
            className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            Today
          </button>
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-0.5">
            <button
              onClick={handlePrevMonth}
              className="p-1 sm:p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"
              title="Previous Month"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 sm:p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"
              title="Next Month"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1.5 sm:mb-2 text-center">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-[10px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider text-slate-400 dark:text-slate-500 py-0.5 truncate"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((date) => {
          const formattedDateStr = format(date, 'yyyy-MM-dd');
          const payment = paymentMap.get(formattedDateStr);

          return (
            <CalendarDay
              key={formattedDateStr}
              date={date}
              currentMonth={currentMonth}
              payment={payment}
              defaultDailyPayment={defaultDailyPayment}
              onClick={onDayClick}
            />
          );
        })}
      </div>
    </div>
  );
};
