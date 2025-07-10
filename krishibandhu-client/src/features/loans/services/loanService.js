// Loan API service integrated with backend

import { getAuthToken } from '../../../utils/authUtils';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Function to get available loan types
 * @returns {Promise} Promise that resolves to an array of loan types
 */
export const getLoanTypes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/loans/types`);
    if (!response.ok) throw new Error('Failed to fetch loan types');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching loan types:', error);
    // Fallback to local data if API fails
    return [
      {
        id: 'cropLoan',
        interestRate: 7,
        maxAmount: 300000,
        maxDuration: 12 // months
      },
      {
        id: 'equipmentLoan',
        interestRate: 8.5,
        maxAmount: 1000000,
        maxDuration: 84 // months
      },
      {
        id: 'landLoan',
        interestRate: 9,
        maxAmount: 2500000,
        maxDuration: 180 // months
      }
    ];
  }
};

/**
 * Function to get user's active loans
 * @param {string} userId User ID
 * @returns {Promise} Promise that resolves to an array of user's loans
 */
export const getUserLoans = async (userId) => {
  try {
    // Get token using our utility function
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/api/loans/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch user loans');
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching user loans:', error);
    // Return empty array on error
    return [];
  }
};

/**
 * Function to submit a loan application
 * @param {Object} loanData Loan application data
 * @returns {Promise<Object>} Promise resolving to application status
 */
export const submitLoanApplication = async (loanData) => {
  try {
    // Get token using our utility function
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');      // Handle file uploads if documents are present
    let response;
    
    if (loanData.documents && loanData.documents.length > 0) {
      // Use FormData for file uploads
      const formData = new FormData();
      
      // Add loan data fields to formData
      Object.keys(loanData).forEach(key => {
        if (key !== 'documents') {
          // Special handling for nested objects like address
          if (key === 'address' && typeof loanData[key] === 'object') {
            Object.keys(loanData.address).forEach(addressField => {
              formData.append(`address.${addressField}`, loanData.address[addressField]);
            });
          } else {
            formData.append(key, loanData[key]);
          }
        }
      });
      
      // Add document types mapping to formData
      if (loanData.documentTypes) {
        formData.append('documentTypes', loanData.documentTypes);
      }
        // Add documents to formData
      loanData.documents.forEach((file, index) => {
        // Use the file's documentType if available in the documentTypes mapping
        // or use a default field name with index
        const documentTypes = loanData.documentTypes ? JSON.parse(loanData.documentTypes) : {};
        const fieldname = `document_${index}`;
        formData.append('documents', file);
      });
      
      response = await fetch(`${API_BASE_URL}/api/loans/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
    } else {
      // No files to upload, use regular JSON request
      response = await fetch(`${API_BASE_URL}/api/loans/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(loanData)
      });
    }
    
    if (!response.ok) throw new Error('Failed to submit loan application');
    
    const data = await response.json();
    return {
      success: true,
      applicationId: data.data._id,
      message: data.message || 'Application submitted successfully',
      estimatedProcessingTime: '2-3 business days'
    };
  } catch (error) {
    console.error('Error submitting loan application:', error);
    return {
      success: false,
      message: error.message || 'Failed to submit loan application'
    };
  }
};

/**
 * Function to calculate loan EMI
 * @param {number} principal Loan amount
 * @param {number} interestRate Annual interest rate (%)
 * @param {number} tenure Loan tenure in months
 * @returns {Promise<Object>} Promise resolving to calculated EMI details
 */
export const calculateLoanEMI = async (principal, interestRate, tenure) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/loans/calculate-emi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ principal, interestRate, tenure })
    });
    
    if (!response.ok) throw new Error('Failed to calculate EMI');
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error calculating loan EMI:', error);
    
    // Fallback to client-side calculation if API fails
    const monthlyRate = interestRate / 100 / 12;
    const emi = principal * monthlyRate * 
      Math.pow(1 + monthlyRate, tenure) / 
      (Math.pow(1 + monthlyRate, tenure) - 1);
    
    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - principal;
    
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount)
    };
  }
};

/**
 * Function to make a payment on a loan
 * @param {string} loanId Loan ID
 * @param {number} amount Payment amount
 * @returns {Promise<Object>} Promise resolving to payment status
 */
export const makeLoanPayment = async (loanId, amount) => {
  try {
    // Get token using our utility function
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/api/loans/${loanId}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount })
    });
    
    if (!response.ok) throw new Error('Failed to process payment');
    
    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Payment processed successfully',
      updatedLoan: data.data
    };
  } catch (error) {
    console.error('Error making loan payment:', error);
    return {
      success: false,
      message: error.message || 'Failed to process payment'
    };
  }
};

/**
 * Function to get a specific loan by ID
 * @param {string} loanId Loan ID
 * @returns {Promise<Object>} Promise resolving to loan details
 */
export const getLoanById = async (loanId) => {
  try {
    // Get token using our utility function
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/api/loans/${loanId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch loan details');
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching loan details:', error);
    throw error;
  }
};

/**
 * Function to get all loans for admin (with optional status filter)
 * @param {string} status Optional status filter
 * @returns {Promise<Array>} Promise resolving to array of loans
 */
export const getAllLoans = async (status = '') => {
  try {
    // Get token using our utility function
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');
    
    let url = `${API_BASE_URL}/api/loans`;
    if (status) {
      url += `?status=${status}`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch loans');
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching all loans:', error);
    throw error;
  }
};

/**
 * Function to update loan status (approve/reject)
 * @param {string} loanId Loan ID
 * @param {string} status New status (approved/rejected)
 * @returns {Promise<Object>} Promise resolving to updated loan
 */
export const updateLoanStatus = async (loanId, status) => {
  try {
    // Get token using our utility function
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/api/loans/${loanId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) throw new Error('Failed to update loan status');
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating loan status:', error);
    throw error;
  }
};

/**
 * Function to get document info for a loan
 * @param {string} loanId Loan ID
 * @param {string} documentPath Document path/filename
 * @returns {Promise<Object>} Promise resolving to document info
 */
export const getDocumentInfo = async (loanId, documentPath) => {
  try {
    // Get token using our utility function
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/api/loans/${loanId}/documents/${documentPath}/info`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to get document info');
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error getting document info:', error);
    throw error;
  }
};

/**
 * Function to get the URL for a loan document
 * @param {string} loanId Loan ID
 * @param {string} documentPath Document path/filename
 * @returns {string} URL to access the document
 */
export const getDocumentUrl = (loanId, documentPath) => {
  return `${API_BASE_URL}/api/loans/${loanId}/documents/${documentPath}`;
};

/**
 * Function to fetch a document with authentication token
 * @param {string} loanId Loan ID
 * @param {string} documentPath Document path/filename
 * @returns {Promise<Blob>} Promise resolving to document blob
 */
export const fetchDocumentWithAuth = async (loanId, documentPath) => {
  try {
    // Get token using our utility function
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/api/loans/${loanId}/documents/${documentPath}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch document');
    
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};
