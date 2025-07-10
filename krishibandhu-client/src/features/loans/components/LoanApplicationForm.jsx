import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { submitLoanApplication } from '../services/loanService';
import DocumentUploader from './DocumentUploader';

const LoanApplicationForm = ({ loanType, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: loanType || 'cropLoan',
    purpose: '',
    amount: '',
    tenure: '',
    interestRate: loanType === 'cropLoan' ? 7 : loanType === 'equipmentLoan' ? 8.5 : 9,
    landArea: '',
    income: '',
    fullName: user?.name || '',
    email: user?.email || '',
    documents: null,
    documentTypes: {},
    address: {
      street: '',
      village: '',
      district: '',
      state: '',
      pincode: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [applicationResult, setApplicationResult] = useState(null);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle address fields separately
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleFileChange = (files, documentTypes) => {
    setFormData(prev => ({ 
      ...prev, 
      documents: files,
      documentTypes: documentTypes
    }));
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate form data
    if (!formData.amount || !formData.tenure || !formData.purpose || !formData.landArea) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    if (!formData.address || !formData.address.district || !formData.address.state || !formData.address.pincode) {
      setError('Please fill in all required address fields');
      setLoading(false);
      return;
    }
    
    // Make documents optional for now for testing submission
    // if (!formData.documents || formData.documents.length === 0) {
    //   setError('Please upload at least one document');
    //   setLoading(false);
    //   return;
    // }
    
  try {
      // Check if user is logged in
      if (!user || !user._id) {
        setError('You must be logged in to apply for a loan');
        setLoading(false);
        return;
      }

      // Prepare data for submission
      const loanData = {
        type: formData.type,
        purpose: formData.purpose,
        amount: Number(formData.amount),
        tenure: Number(formData.tenure),
        interestRate: formData.interestRate,
        landArea: formData.landArea,
        income: formData.income || 0,
        fullName: formData.fullName,
        email: formData.email,
        address: formData.address,
        documents: formData.documents,
        documentTypes: JSON.stringify(formData.documentTypes || {})
      };
      
      console.log('Submitting loan application:', loanData);
      
      // Submit to API
      const result = await submitLoanApplication(loanData);
      
      if (result.success) {
        setApplicationResult(result);
        setSuccess(true);
      } else {
        setError(result.message || t('error.general'));
        console.error('Loan submission failed:', result.message);
      }
    } catch (err) {
      console.error('Error submitting loan application:', err);
      setError(t('error.general'));
    } finally {
      setLoading(false);
    }
  };
  // Display success message after form submission
  if (success) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Application Submitted!</h3>
          <div className="text-gray-600 mb-4">
            <p>Your loan application has been successfully submitted.</p>
            <p className="mt-2">Application ID: <span className="font-semibold">{applicationResult?.applicationId}</span></p>
            <p className="mt-3">Our team will review it and contact you within 2-3 business days.</p>
          </div>
          <div className="bg-green-50 p-4 rounded-md mb-6 inline-block">
            <p className="text-green-800 font-medium">Keep this application ID for future reference</p>
          </div>
          <button
            onClick={onClose}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-green-800 mb-4">
        {t('loans.applyNow')} - {t(`loans.types.${formData.type}.title`)}
      </h3>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Personal Information */}
          <h4 className="text-md font-semibold text-gray-700 border-b pb-2 mb-3">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Income (₹)
              </label>
              <input
                type="number"
                name="income"
                value={formData.income}
                onChange={handleInputChange}
                placeholder="Enter annual income"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          {/* Address Information */}
          <h4 className="text-md font-semibold text-gray-700 border-b pb-2 mb-3 mt-6">Address Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                placeholder="Enter street address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Village/Town
              </label>
              <input
                type="text"
                name="address.village"
                value={formData.address.village}
                onChange={handleInputChange}
                placeholder="Enter village or town"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.district"
                value={formData.address.district}
                onChange={handleInputChange}
                placeholder="Enter district"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                placeholder="Enter state"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleInputChange}
                placeholder="Enter pincode"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          {/* Loan Information */}
          <h4 className="text-md font-semibold text-gray-700 border-b pb-2 mb-3 mt-6">Loan Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="cropLoan">{t('loans.types.cropLoan.title')}</option>
                <option value="equipmentLoan">{t('loans.types.equipmentLoan.title')}</option>
                <option value="landLoan">{t('loans.types.landLoan.title')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter loan amount"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan Duration (months) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="tenure"
                value={formData.tenure}
                onChange={handleInputChange}
                placeholder="Enter loan duration"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Land Area (acres) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="landArea"
                value={formData.landArea}
                onChange={handleInputChange}
                placeholder="Enter land area"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose of Loan <span className="text-red-500">*</span>
            </label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="Describe why you need this loan"
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />          </div>
          
          {/* Document Upload Section */}
          <h4 className="text-md font-semibold text-gray-700 border-b pb-2 mb-3 mt-6">Required Documents</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Documents <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">Please upload all required documents: Aadhar Card, PAN Card, Bank Statement, Bank Passbook, Land Documents, Address Proof</p>
            <DocumentUploader 
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-3 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanApplicationForm;
