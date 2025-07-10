import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { calculateLoanEMI } from '../services/loanService';

const LoanCalculator = () => {
  const { t } = useTranslation();
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(7);
  const [loanTerm, setLoanTerm] = useState(12); // in months
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Use a debounce to avoid too many API calls
    const handler = setTimeout(() => {
      calculateLoan();
    }, 500);

    return () => clearTimeout(handler);
  }, [loanAmount, interestRate, loanTerm]);

  const calculateLoan = async () => {
    try {
      setLoading(true);
      
      // Call the API service to calculate
      const result = await calculateLoanEMI(loanAmount, interestRate, loanTerm);
      
      setEmi(result.emi);
      setTotalInterest(result.totalInterest);
      setTotalAmount(result.totalAmount);
    } catch (error) {
      console.error('Error calculating loan:', error);
      
      // Fallback to client-side calculation if API fails
      const monthlyInterestRate = interestRate / 100 / 12;
      const emiValue = loanAmount * monthlyInterestRate * 
        Math.pow(1 + monthlyInterestRate, loanTerm) / 
        (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);
      
      const totalPayment = emiValue * loanTerm;
      const totalInterestPayment = totalPayment - loanAmount;
      
      setEmi(emiValue);
      setTotalInterest(totalInterestPayment);
      setTotalAmount(totalPayment);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-xl font-semibold text-green-800 mb-4">{t('loans.calculator')}</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Amount (₹)
          </label>
          <input
            type="range"
            min="10000"
            max="2500000"
            step="10000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">₹10,000</span>
            <span className="text-sm font-medium">₹{loanAmount.toLocaleString()}</span>
            <span className="text-xs text-gray-500">₹25,00,000</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interest Rate (%)
          </label>
          <input
            type="range"
            min="5"
            max="15"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">5%</span>
            <span className="text-sm font-medium">{interestRate}%</span>
            <span className="text-xs text-gray-500">15%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Term (Months)
          </label>
          <input
            type="range"
            min="3"
            max="180"
            step="1"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">3 months</span>
            <span className="text-sm font-medium">{loanTerm} months</span>
            <span className="text-xs text-gray-500">180 months</span>
          </div>
        </div>
      </div>      <div className="mt-6 bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-800 mb-3">Loan Summary</h4>
        {loading ? (
          <div className="flex justify-center py-3">
            <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly EMI:</span>
              <span className="font-semibold">₹{Math.round(emi).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Interest:</span>
              <span className="font-semibold">₹{Math.round(totalInterest).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-green-200 pt-2">
              <span className="text-gray-600">Total Amount to Pay:</span>
              <span className="font-semibold">₹{Math.round(totalAmount).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;
