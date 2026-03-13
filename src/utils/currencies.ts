/**
 * Formats a number as INR currency.
 * The amount is now expected to be in INR already.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const convertToINR = (amount: number): number => {
  return amount;
};
