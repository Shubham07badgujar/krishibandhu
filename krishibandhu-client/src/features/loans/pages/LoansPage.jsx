import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import LoanCard from '../components/LoanCard';
import LoanCalculator from '../components/LoanCalculator';
import LoanApplicationForm from '../components/LoanApplicationForm';
import { getUserLoans } from '../services/loanService';

const LoansPage = () => {  const { t } = useTranslation();
  const { user } = useAuth();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState(null);
  const [activeTab, setActiveTab] = useState('availableLoans');
  const [userLoans, setUserLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Only fetch loans if user is logged in and my loans tab is active
    if (user && activeTab === 'myLoans') {
      fetchUserLoans();
    }
  }, [user, activeTab]);
  
  const fetchUserLoans = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // In production, we would call the actual API
      // const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/loans/user/${user._id}`);
      // const data = await response.json();
      
      // Using the mock service for now
      const data = await getUserLoans(user._id);
      setUserLoans(data);
    } catch (err) {
      console.error('Error fetching user loans:', err);
      setError(t('error.general'));
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoanCardClick = (loanType) => {
    setSelectedLoanType(loanType);
    setShowApplicationForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 md:px-8">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">{t('loans.title')}</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">{t('loans.description')}</p>
      </section>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <LoanApplicationForm 
              loanType={selectedLoanType} 
              onClose={() => setShowApplicationForm(false)} 
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        {user && (
          <div className="mb-8">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-6 py-3 font-medium text-base ${activeTab === 'availableLoans' ? 'text-green-700 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-700'}`}
                onClick={() => setActiveTab('availableLoans')}
              >
                {t('loans.availableLoans')}
              </button>
              <button
                className={`px-6 py-3 font-medium text-base ${activeTab === 'myLoans' ? 'text-green-700 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-700'}`}
                onClick={() => setActiveTab('myLoans')}
              >
                {t('loans.myLoans')}
              </button>
              <button
                className={`px-6 py-3 font-medium text-base ${activeTab === 'calculator' ? 'text-green-700 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-700'}`}
                onClick={() => setActiveTab('calculator')}
              >
                {t('loans.calculator')}
              </button>
            </div>
          </div>
        )}

        {/* Available Loans */}
        {(activeTab === 'availableLoans' || !user) && (
          <>            {/* Loan Types */}
            <section className="mb-12">              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-800">{t('loans.availableLoans')}</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                    <span className="text-sm text-gray-600">{t('loans.types.cropLoan.title')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                    <span className="text-sm text-gray-600">{t('loans.types.equipmentLoan.title')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-1"></span>
                    <span className="text-sm text-gray-600">{t('loans.types.landLoan.title')}</span>
                  </div>
                </div>
              </div><div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <LoanCard type="cropLoan" onClick={() => handleLoanCardClick('cropLoan')} />
                <LoanCard type="equipmentLoan" onClick={() => handleLoanCardClick('equipmentLoan')} />
                <LoanCard type="landLoan" onClick={() => handleLoanCardClick('landLoan')} />
              </div>
            </section>

            {/* Application Process */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-green-800 mb-6">{t('loans.howToApply')}</h2>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                        <span className="text-lg font-bold text-green-600">{step}</span>
                      </div>
                      <p className="text-center">{t(`loans.process.step${step}`)}</p>
                      {step < 4 && <div className="hidden md:block absolute right-0 top-1/2 w-8 border-t-2 border-green-200"></div>}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Documentation Requirements */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-green-800 mb-6">{t('loans.requirements.title')}</h2>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('loans.requirements.identity')}
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('loans.requirements.address')}
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('loans.requirements.land')}
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('loans.requirements.income')}
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('loans.requirements.photo')}
                  </li>
                </ul>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-green-800 mb-6">{t('loans.faq.title')}</h2>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg text-green-800 mb-2">{t('loans.faq.q1')}</h3>
                    <p className="text-gray-700">{t('loans.faq.a1')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-green-800 mb-2">{t('loans.faq.q2')}</h3>
                    <p className="text-gray-700">{t('loans.faq.a2')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-green-800 mb-2">{t('loans.faq.q3')}</h3>
                    <p className="text-gray-700">{t('loans.faq.a3')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-green-800 mb-2">{t('loans.faq.q4')}</h3>
                    <p className="text-gray-700">{t('loans.faq.a4')}</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}        {/* My Loans (only for logged-in users) */}
        {user && activeTab === 'myLoans' && (
          <section>
            <h2 className="text-2xl font-bold text-green-800 mb-6">{t('loans.myLoans')}</h2>
            
            {loading && (
              <div className="bg-white rounded-xl p-8 shadow-md text-center">
                <div className="w-16 h-16 mx-auto flex items-center justify-center mb-4">
                  <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-gray-600">Loading your loans...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-white rounded-xl p-8 shadow-md">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Loans</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <button
                    onClick={fetchUserLoans}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            
            {!loading && !error && userLoans.length > 0 && (
              <div className="space-y-4">
                {userLoans.map((loan) => (
                  <div key={loan.id} className="bg-white rounded-xl p-6 shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-green-800">
                        {t(`loans.types.${loan.type}.title`)}
                      </h3>
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                        {loan.status === 'active' ? 'Active' : 'Completed'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Loan Amount</p>
                        <p className="font-semibold">₹{loan.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Monthly EMI</p>
                        <p className="font-semibold">₹{loan.emi.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Disbursed Date</p>
                        <p className="font-semibold">{new Date(loan.disbursedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Next Due Date</p>
                        <p className="font-semibold">{new Date(loan.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Remaining Amount</p>
                          <p className="font-semibold">₹{loan.remainingAmount.toLocaleString()}</p>
                        </div>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && !error && userLoans.length === 0 && (
              <div className="bg-white rounded-xl p-8 shadow-md text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">{t('loans.noLoans')}</h3>
                <p className="text-gray-600 mb-6">{t('loans.applyForLoan')}</p>
                <button
                  onClick={() => {
                    setSelectedLoanType('cropLoan');
                    setShowApplicationForm(true);
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  {t('loans.applyNow')}
                </button>
              </div>
            )}
          </section>
        )}

        {/* Loan Calculator (only for logged-in users) */}
        {user && activeTab === 'calculator' && (
          <section>
            <h2 className="text-2xl font-bold text-green-800 mb-6">{t('loans.calculator')}</h2>
            <LoanCalculator />
          </section>
        )}

        {/* CTA for non-logged in users */}
        {!user && (
          <section className="mt-12 bg-green-600 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg mb-6">Sign up or login to apply for loans and manage your applications.</p>
            <div className="space-x-4">
              <a href="/login" className="bg-white text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition duration-200">
                Login
              </a>
              <a href="/register" className="bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition duration-200">
                Register
              </a>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default LoansPage;
