import { Payment, Profile, DynamicFinancials } from '../types/database';

/**
 * Calculates dynamic financial metrics based on user's profile and payments.
 * Do not store remaining balance as a database field.
 */
export function calculateFinancials(
  profile: Profile | null,
  payments: Payment[]
): DynamicFinancials {
  const borrowedAmount = profile ? Number(profile.borrowed_amount) : 6000;
  const dailyPayment = profile ? Number(profile.daily_payment) : 100;

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  
  const remainingBalance = Math.max(0, borrowedAmount - totalPaid);

  let rawPercentage = 0;
  if (borrowedAmount > 0) {
    rawPercentage = (totalPaid / borrowedAmount) * 100;
  }

  // Clamp progress between 0% and 100%
  const progressPercentage = Math.min(100, Math.max(0, rawPercentage));

  return {
    borrowedAmount,
    totalPaid,
    remainingBalance,
    progressPercentage,
    dailyPayment,
  };
}

/**
 * Formats a number into Indian Rupee currency format (e.g., ₹6,000)
 */
export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `₹${formatted}`;
}

/**
 * Checks if adding or updating a payment would exceed the total borrowed amount.
 * @param existingPayments list of all current payments for the user
 * @param targetDate YYYY-MM-DD string of the payment being added/edited
 * @param newAmount proposed new amount for target date
 * @param totalBorrowed total borrowed amount
 */
export function canMakePayment(
  existingPayments: Payment[],
  targetDate: string,
  newAmount: number,
  totalBorrowed: number
): { allowed: boolean; maxAllowed: number; currentPaidExcludingTarget: number } {
  // Sum up all payments excluding the one for targetDate (in case of edit)
  const otherPaymentsTotal = existingPayments
    .filter((p) => p.payment_date !== targetDate)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const maxAllowedForThisDate = Math.max(0, totalBorrowed - otherPaymentsTotal);
  const allowed = newAmount <= maxAllowedForThisDate;

  return {
    allowed,
    maxAllowed: maxAllowedForThisDate,
    currentPaidExcludingTarget: otherPaymentsTotal,
  };
}
