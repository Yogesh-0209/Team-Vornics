import toast from 'react-hot-toast';

// Mock exchange rates for demonstration purposes
// In a real application, this would fetch data from a reliable API (e.g., Open Exchange Rates, Fixer.io)
const MOCK_EXCHANGE_RATES: { [key: string]: { [key: string]: number } } = {
  'USD': { 'EUR': 0.92, 'GBP': 0.79, 'JPY': 156.80, 'CAD': 1.37, 'AUD': 1.51, 'SGD': 1.35, 'CNY': 7.25, 'INR': 83.50, 'USD': 1.0 },
  'EUR': { 'USD': 1.08, 'GBP': 0.86, 'JPY': 170.00, 'CAD': 1.48, 'AUD': 1.64, 'SGD': 1.47, 'CNY': 7.87, 'INR': 90.60, 'EUR': 1.0 },
  'GBP': { 'USD': 1.27, 'EUR': 1.16, 'JPY': 198.00, 'CAD': 1.73, 'AUD': 1.91, 'SGD': 1.71, 'CNY': 9.15, 'INR': 105.50, 'GBP': 1.0 },
  'JPY': { 'USD': 0.0064, 'EUR': 0.0059, 'GBP': 0.0051, 'CAD': 0.0087, 'AUD': 0.0096, 'SGD': 0.0086, 'CNY': 0.046, 'INR': 0.53, 'JPY': 1.0 },
  'CAD': { 'USD': 0.73, 'EUR': 0.67, 'GBP': 0.58, 'JPY': 114.00, 'AUD': 1.10, 'SGD': 0.98, 'CNY': 5.28, 'INR': 60.90, 'CAD': 1.0 },
  'AUD': { 'USD': 0.66, 'EUR': 0.61, 'GBP': 0.52, 'JPY': 104.00, 'CAD': 0.91, 'SGD': 0.89, 'CNY': 4.80, 'INR': 55.30, 'AUD': 1.0 },
  'SGD': { 'USD': 0.74, 'EUR': 0.68, 'GBP': 0.58, 'JPY': 116.00, 'CAD': 1.02, 'AUD': 1.12, 'CNY': 5.37, 'INR': 61.90, 'SGD': 1.0 },
  'CNY': { 'USD': 0.13, 'EUR': 0.12, 'GBP': 0.11, 'JPY': 21.60, 'CAD': 0.19, 'AUD': 0.21, 'SGD': 0.18, 'INR': 11.50, 'CNY': 1.0 },
  'INR': { 'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095, 'JPY': 1.88, 'CAD': 0.016, 'AUD': 0.018, 'SGD': 0.016, 'CNY': 0.087, 'INR': 1.0 }
};

export async function getExchangeRate(baseCurrency: string, targetCurrency: string): Promise<number> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (baseCurrency === targetCurrency) {
        resolve(1.0);
        return;
      }

      const rate = MOCK_EXCHANGE_RATES[baseCurrency]?.[targetCurrency];
      if (rate) {
        resolve(rate);
      } else {
        toast.error(`No direct exchange rate found for ${baseCurrency} to ${targetCurrency}.`);
        reject(new Error('Exchange rate not found'));
      }
    }, 500); // Simulate network delay
  });
}
