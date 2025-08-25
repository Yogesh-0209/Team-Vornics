import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calculator, 
  DollarSign, 
  RefreshCcw,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getExchangeRate } from '../../services/currencyService';
import { ProcessedFile } from '../../types/dashboard';
import { useNavigate } from 'react-router-dom';

interface CalculationResult {
  type: 'Demurrage' | 'Despatch';
  amount: number;
  currency: string;
  convertedAmount?: number;
  convertedCurrency?: string;
}

interface DemurrageCalculatorProps {
  selectedFile: ProcessedFile | null;
}

export function DemurrageCalculator({ selectedFile }: DemurrageCalculatorProps) {
  const navigate = useNavigate();
  const [dailyRate, setDailyRate] = useState<number | ''>('');
  const [allowedTimeDays, setAllowedTimeDays] = useState<number | ''>('');
  const [usedTimeDays, setUsedTimeDays] = useState<number | ''>('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState<number | ''>(''); // Now an input field
  const [isLoadingExchangeRate, setIsLoadingExchangeRate] = useState(false);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const supportedCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'SGD', 'CNY', 'INR'];

  // Automatically populate used time from selected file
  useEffect(() => {
    if (selectedFile && selectedFile.extractedData && selectedFile.extractedData.events) {
      const totalDurationHours = selectedFile.extractedData.events.reduce((sum, event) => sum + event.duration, 0);
      setUsedTimeDays(parseFloat((totalDurationHours / 24).toFixed(2))); // Convert hours to days
      toast.success(`Used Time (Days) automatically populated from "${selectedFile.name}"`);
    } else {
      setUsedTimeDays('');
    }
  }, [selectedFile]);

  const fetchExchangeRate = useCallback(async () => {
    if (fromCurrency === toCurrency) {
      setExchangeRate(1);
      return;
    }
    setIsLoadingExchangeRate(true);
    try {
      const rate = await getExchangeRate(fromCurrency, toCurrency);
      setExchangeRate(parseFloat(rate.toFixed(4)));
      toast.success(`Exchange rate fetched: 1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`);
    } catch (err) {
      toast.error('Failed to fetch exchange rate. Using default 1.0.');
      setExchangeRate(1.0); // Fallback to 1.0 on error
    } finally {
      setIsLoadingExchangeRate(false);
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    if (dailyRate === '' || isNaN(Number(dailyRate)) || Number(dailyRate) < 0) {
      newErrors.dailyRate = 'Valid daily rate is required';
    }
    if (allowedTimeDays === '' || isNaN(Number(allowedTimeDays)) || Number(allowedTimeDays) < 0) {
      newErrors.allowedTimeDays = 'Valid allowed time is required (days)';
    }
    if (usedTimeDays === '' || isNaN(Number(usedTimeDays)) || Number(usedTimeDays) < 0) {
      newErrors.usedTimeDays = 'Valid used time is required (days)';
    }
    if (exchangeRate === '' || isNaN(Number(exchangeRate)) || Number(exchangeRate) <= 0) {
      newErrors.exchangeRate = 'Valid exchange rate is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDemurrage = () => {
    if (!validateInputs()) {
      setCalculationResult(null);
      return;
    }

    const allowed = Number(allowedTimeDays);
    const used = Number(usedTimeDays);
    const rate = Number(dailyRate);
    const currentExchangeRate = Number(exchangeRate);

    const excessTime = used - allowed;
    let calculatedAmount = 0;
    let resultType: 'Demurrage' | 'Despatch';

    if (excessTime > 0) {
      calculatedAmount = excessTime * rate;
      resultType = 'Demurrage';
    } else {
      calculatedAmount = Math.abs(excessTime) * rate;
      resultType = 'Despatch';
    }

    const convertedAmount = calculatedAmount * currentExchangeRate;

    setCalculationResult({
      type: resultType,
      amount: parseFloat(calculatedAmount.toFixed(2)),
      currency: fromCurrency,
      convertedAmount: parseFloat(convertedAmount.toFixed(2)),
      convertedCurrency: toCurrency,
    });
    toast.success('Demurrage/Despatch calculated!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : Number(value);

    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change

    if (name === 'dailyRate') setDailyRate(numValue);
    else if (name === 'allowedTimeDays') setAllowedTimeDays(numValue);
    else if (name === 'usedTimeDays') setUsedTimeDays(numValue);
    else if (name === 'fromCurrency') setFromCurrency(value);
    else if (name === 'toCurrency') setToCurrency(value);
    else if (name === 'exchangeRate') setExchangeRate(numValue);
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Demurrage Calculator</h2>
      </div>

      {selectedFile && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-center gap-3 mb-6">
          <FileText className="w-5 h-5" />
          <p className="text-sm font-medium">
            "Used Time (Days)" automatically populated from: <span className="font-semibold">{selectedFile.name}</span>
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Daily Rate */}
        <div>
          <label htmlFor="dailyRate" className="block text-gray-700 font-medium mb-2">Daily Rate</label>
          <input
            type="number"
            id="dailyRate"
            name="dailyRate"
            value={dailyRate}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.dailyRate ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="Enter daily rate"
            min="0"
          />
          {errors.dailyRate && <p className="text-red-600 text-sm mt-1">{errors.dailyRate}</p>}
        </div>

        {/* Allowed Time (Days) */}
        <div>
          <label htmlFor="allowedTimeDays" className="block text-gray-700 font-medium mb-2">Allowed Time (Days)</label>
          <input
            type="number"
            id="allowedTimeDays"
            name="allowedTimeDays"
            value={allowedTimeDays}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.allowedTimeDays ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="Enter allowed time"
            min="0"
          />
          {errors.allowedTimeDays && <p className="text-red-600 text-sm mt-1">{errors.allowedTimeDays}</p>}
        </div>

        {/* Used Time (Days) */}
        <div>
          <label htmlFor="usedTimeDays" className="block text-gray-700 font-medium mb-2">Used Time (Days)</label>
          <input
            type="number"
            id="usedTimeDays"
            name="usedTimeDays"
            value={usedTimeDays}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.usedTimeDays ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="Enter used time"
            min="0"
            readOnly={!!selectedFile} // Make read-only if file is selected
          />
          {errors.usedTimeDays && <p className="text-red-600 text-sm mt-1">{errors.usedTimeDays}</p>}
        </div>

        {/* From Currency */}
        <div>
          <label htmlFor="fromCurrency" className="block text-gray-700 font-medium mb-2">From Currency</label>
          <div className="relative">
            <select
              id="fromCurrency"
              name="fromCurrency"
              value={fromCurrency}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-200"
            >
              {supportedCurrencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronUp className="w-4 h-4" />
              <ChevronDown className="w-4 h-4 -ml-1" />
            </div>
          </div>
        </div>

        {/* To Currency */}
        <div>
          <label htmlFor="toCurrency" className="block text-gray-700 font-medium mb-2">To Currency</label>
          <div className="relative">
            <select
              id="toCurrency"
              name="toCurrency"
              value={toCurrency}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-200"
            >
              {supportedCurrencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronUp className="w-4 h-4" />
              <ChevronDown className="w-4 h-4 -ml-1" />
            </div>
          </div>
        </div>

        {/* Exchange Rate */}
        <div>
          <label htmlFor="exchangeRate" className="block text-gray-700 font-medium mb-2">Exchange Rate</label>
          <div className="relative">
            <input
              type="number"
              id="exchangeRate"
              name="exchangeRate"
              value={exchangeRate}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.exchangeRate ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="Enter exchange rate"
              min="0"
              step="0.0001"
            />
            <button
              onClick={fetchExchangeRate}
              disabled={isLoadingExchangeRate}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh Exchange Rate"
            >
              {isLoadingExchangeRate ? (
                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <RefreshCcw className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.exchangeRate && <p className="text-red-600 text-sm mt-1">{errors.exchangeRate}</p>}
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={calculateDemurrage}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          Calculate
        </button>
      </div>

      {calculationResult && (
        <div className={`mt-8 p-6 rounded-xl border ${
          calculationResult.type === 'Demurrage' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
        }`}>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Results</h3>
          <div className="flex items-center gap-3 mb-4">
            {calculationResult.type === 'Demurrage' ? (
              <XCircle className="w-6 h-6 text-red-600" />
            ) : (
              <CheckCircle className="w-6 h-6 text-green-600" />
            )}
            <p className={`text-2xl font-bold ${
              calculationResult.type === 'Demurrage' ? 'text-red-600' : 'text-green-600'
            }`}>
              {calculationResult.type}: {calculationResult.amount.toLocaleString()} {calculationResult.currency}
            </p>
          </div>
          {calculationResult.convertedAmount !== undefined && (
            <p className="text-lg text-gray-700">
              Converted Amount: {calculationResult.convertedAmount.toLocaleString()} {calculationResult.convertedCurrency}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Note: This is a simplified calculation. Real-world laytime calculations may involve complex rules, exceptions, and specific charter party clauses.
          </p>
        </div>
      )}

      {selectedFile && selectedFile.extractedData.events.some(event => event.anomalies && event.anomalies.length > 0) && (
        <div className="bg-amber-50 rounded-xl shadow-lg p-6 border border-amber-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <h3 className="text-xl font-bold text-amber-900">Anomalies Detected in File</h3>
          </div>
          <p className="text-amber-800 mb-4">
            The selected file "{selectedFile.name}" contains events with potential anomalies. Review the details below and in the Results tab.
          </p>
          <ul className="list-disc list-inside text-amber-800 space-y-2">
            {selectedFile.extractedData.events.filter(event => event.anomalies && event.anomalies.length > 0).map((event, index) => (
              <li key={index} className="text-sm">
                <span className="font-semibold">{event.eventType} ({event.startTime}):</span>
                <ul className="list-disc list-inside ml-4 text-xs">
                  {event.anomalies?.map((anomaly, aIndex) => (
                    <li key={aIndex}>{anomaly}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Understanding Laytime & Demurrage</h3>
        <p className="text-gray-600 mb-4">
          **Laytime** is the period of time agreed between the shipowner and the charterer during which the owner will make the vessel available for loading or discharging without payment additional to the freight.
        </p>
        <p className="text-gray-600 mb-4">
          **Demurrage** is the sum payable to the shipowner by the charterer for the detention of the vessel beyond the laytime. It is essentially a penalty for delay.
        </p>
        <p className="text-gray-600">
          **Despatch** is the reverse of demurrage; it is a sum payable by the shipowner to the charterer if the vessel completes loading or discharging before the allowed laytime expires.
        </p>
      </div>
    </div>
  );
}
