import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import LoanManagement from '../components/LoanManagement';

const AdminLoanDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Loan Dashboard</h1>
        <div className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm">
          {user?.email}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800">Loan Applications Management</h2>
        </div>
        <p className="text-gray-600 mb-2">
          Review and process loan applications from farmers. You can approve or reject applications based on their documentation and eligibility.
        </p>
      </div>

      <LoanManagement />
    </div>
  );
};

export default AdminLoanDashboard;
