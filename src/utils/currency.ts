import { Currency } from '@/i18n';

// Format currency amount / Formater le montant de la devise
export const formatCurrency = (amount: number, currency: Currency): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount * currency.exchangeRate);
};

// Convert amount between currencies / Convertir le montant entre les devises
export const convertCurrency = (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
  const amountInUSD = amount / fromCurrency.exchangeRate;
  return amountInUSD * toCurrency.exchangeRate;
}; 