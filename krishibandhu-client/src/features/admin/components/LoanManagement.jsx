import React, { useState, useEffect } from 'react';
import { getAllLoans, updateLoanStatus } from '../../loans/services/loanService';
import DocumentPreview from '../../loans/components/DocumentPreview';

const LoanManagement = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');  const [selectedLoan, setSelectedLoan] = useState(null);
  const [processingLoanId, setProcessingLoanId] = useState(null);
  const [statusUpdateResult, setStatusUpdateResult] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, [activeTab]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const data = await getAllLoans(activeTab);
      setLoans(data);
    } catch (err) {
      console.error('Error fetching loans:', err);
      setError('Failed to load loan applications');
    } finally {
      setLoading(false);
    }
  };
  const handleViewDetails = (loan) => {
    setSelectedLoan(loan);
    setSelectedDocument(null);
  };

  const handleCloseDetails = () => {
    setSelectedLoan(null);
    setStatusUpdateResult(null);
    setSelectedDocument(null);
  };
    const handleViewDocument = (doc) => {
    // Add the loan ID to the document object
    setSelectedDocument({
      ...doc,
      loanId: selectedLoan._id
    });
  };

  const handleStatusUpdate = async (loanId, status) => {
    try {
      setProcessingLoanId(loanId);
      const result = await updateLoanStatus(loanId, status);
      
      setStatusUpdateResult({
        success: true,
        message: `Loan ${status === 'approved' ? 'approved' : 'rejected'} successfully`
      });
      
      // Refresh the list
      fetchLoans();
    } catch (err) {
      console.error('Error updating loan status:', err);
      setStatusUpdateResult({
        success: false,
        message: 'Failed to update loan status'
      });
    } finally {
      setProcessingLoanId(null);
    }
  };

  const renderStatusBadge = (status) => {
    const badgeColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      active: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColors[status] || 'bg-gray-100'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getDocumentTypeLabel = (docType) => {
    const typeLabels = {
      aadharCard: 'Aadhar Card',
      panCard: 'PAN Card',
      bankStatement: 'Bank Statement',
      landDocument: 'Land Document',
      incomeProof: 'Income Proof',
      bankPassbook: 'Bank Passbook',
      addressProof: 'Address Proof',
      other: 'Other Document'
    };
    return typeLabels[docType] || 'Other';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Loan Applications Management</h2>
      
      {/* Status Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex -mb-px">
          <button
            className={`py-2 px-4 text-center ${
              activeTab === 'pending'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-600 hover:text-green-500'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Applications
          </button>
          <button
            className={`py-2 px-4 text-center ${
              activeTab === 'active'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-600 hover:text-green-500'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Active Loans
          </button>
          <button
            className={`py-2 px-4 text-center ${
              activeTab === 'rejected'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-600 hover:text-green-500'
            }`}
            onClick={() => setActiveTab('rejected')}
          >
            Rejected Applications
          </button>
        </div>
      </div>

      {/* Loan Applications List */}
      {loans.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No loan applications found in this category</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Farmer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount (₹)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied On
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{loan._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {loan.userId?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {loan.type === 'cropLoan' ? 'Crop Loan' : 
                     loan.type === 'equipmentLoan' ? 'Equipment Loan' : 
                     loan.type === 'landLoan' ? 'Land Loan' : loan.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {loan.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(loan.applicationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {renderStatusBadge(loan.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(loan)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Loan Details Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold">Loan Application Details</h3>
              <button onClick={handleCloseDetails} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {statusUpdateResult && (
              <div className={`m-4 p-3 rounded ${statusUpdateResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {statusUpdateResult.message}
              </div>
            )}
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Application ID</p>
                  <p>{selectedLoan._id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p>{renderStatusBadge(selectedLoan.status)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Farmer Name</p>
                  <p>{selectedLoan.userId?.name || selectedLoan.fullName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  <p>{selectedLoan.userId?.email || selectedLoan.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Loan Type</p>
                  <p>{selectedLoan.type === 'cropLoan' ? 'Crop Loan' : 
                     selectedLoan.type === 'equipmentLoan' ? 'Equipment Loan' : 
                     selectedLoan.type === 'landLoan' ? 'Land Loan' : selectedLoan.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount Requested</p>
                  <p>₹{selectedLoan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                  <p>{selectedLoan.interestRate}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tenure</p>
                  <p>{selectedLoan.tenure} months</p>
                </div>
                {selectedLoan.landArea && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Land Area</p>
                    <p>{selectedLoan.landArea} acres</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">EMI</p>
                  <p>₹{selectedLoan.emi.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Application Date</p>
                  <p>{new Date(selectedLoan.applicationDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Purpose */}
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Purpose</p>
                <p className="mt-1 bg-gray-50 p-3 rounded">{selectedLoan.purpose}</p>
              </div>
              
              {/* Address information if available */}
              {selectedLoan.address && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <div className="mt-1 bg-gray-50 p-3 rounded">
                    {selectedLoan.address.street && <p>{selectedLoan.address.street}</p>}
                    {selectedLoan.address.village && <p>{selectedLoan.address.village}</p>}
                    <p>
                      {selectedLoan.address.district && `${selectedLoan.address.district}, `}
                      {selectedLoan.address.state && `${selectedLoan.address.state} `}
                      {selectedLoan.address.pincode && selectedLoan.address.pincode}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Notes if available */}
              {selectedLoan.notes && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Additional Notes</p>
                  <p className="mt-1 bg-gray-50 p-3 rounded">{selectedLoan.notes}</p>
                </div>
              )}
              
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500 mb-2">Documents</p>
                {selectedLoan.documents && selectedLoan.documents.length > 0 ? (
                  <div>
                    <div className="bg-gray-50 p-3 rounded mb-4">
                      <ul className="space-y-2">
                        {selectedLoan.documents.map((doc, index) => (
                          <li key={index} className="flex flex-col">
                            <button 
                              onClick={() => handleViewDocument(doc)}
                              className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md w-full"
                            >
                              {/* Icon based on document type */}
                              {doc.type && doc.type.includes('image') ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              ) : doc.type && doc.type.includes('pdf') ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              )}
                              <div className="flex flex-col text-left mr-auto">
                                <span className="font-medium">{doc.name}</span>
                                <div className="flex items-center">
                                  {doc.documentType && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded mr-2">
                                      {getDocumentTypeLabel(doc.documentType)}
                                    </span>
                                  )}
                                  {doc.size && (
                                    <span className="text-xs text-gray-500">
                                      {(doc.size / 1024).toFixed(1)} KB
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="ml-2 text-xs text-blue-500">View</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Document preview */}
                    {selectedDocument && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Document Preview</h4>
                        <DocumentPreview document={selectedDocument} />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No documents uploaded</p>
                )}
              </div>
              
              {selectedLoan.status === 'pending' && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => handleStatusUpdate(selectedLoan._id, 'rejected')}
                    disabled={processingLoanId === selectedLoan._id}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                  >
                    {processingLoanId === selectedLoan._id ? 'Processing...' : 'Reject Application'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedLoan._id, 'approved')}
                    disabled={processingLoanId === selectedLoan._id}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {processingLoanId === selectedLoan._id ? 'Processing...' : 'Approve Loan'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanManagement;
