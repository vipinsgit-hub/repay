import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  showLabel = true,
  size = 'md',
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));
  const formatted = clamped.toFixed(1);

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Repayment Progress</span>
          <span className="font-semibold text-slate-900 dark:text-white">{formatted}%</span>
        </div>
      )}
      <div
        className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${heightClasses[size]} border border-slate-200/70 dark:border-slate-700/70 p-0.5`}
      >
        <div
          className="h-full bg-primary-600 dark:bg-blue-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
