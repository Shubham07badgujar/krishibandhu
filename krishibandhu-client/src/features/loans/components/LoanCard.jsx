import React from 'react';
import { useTranslation } from 'react-i18next';

const LoanCard = ({ type, onClick }) => {
  const { t } = useTranslation();
  
  // Get the loan type data from translations
  const loanData = t(`loans.types.${type}`, {}, { returnObjects: true });
    // Define icons based on loan type
  const icons = {
    cropLoan: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
      </svg>
    ),
    equipmentLoan: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    landLoan: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-amber-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
      </svg>
    )
  };
  return (
    <div 
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
      onClick={onClick}
    >
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
        type === 'cropLoan' ? 'bg-green-100' :
        type === 'equipmentLoan' ? 'bg-blue-100' :
        type === 'landLoan' ? 'bg-amber-100' : 'bg-green-100'
      }`}>
        {icons[type] || (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
          </svg>
        )}
      </div><div className="mb-2 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-green-800">{loanData.title}</h3>
        <span className={`inline-block ${
          type === 'cropLoan' ? 'bg-green-100 text-green-800' : 
          type === 'equipmentLoan' ? 'bg-blue-100 text-blue-800' : 
          type === 'landLoan' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
        } text-xs font-medium px-2.5 py-0.5 rounded-full`}>
          {type === 'cropLoan' ? 'Crop Loan' : 
           type === 'equipmentLoan' ? 'Equipment Loan' : 
           type === 'landLoan' ? 'Land Loan' : type}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{loanData.description}</p>
      <div className="mt-auto space-y-2">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Interest Rate</p>
              <p className="text-green-700 font-medium">{loanData.interestRate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-gray-700">{loanData.duration}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Maximum Amount</p>
              <p className="text-gray-700 font-medium">{loanData.maxAmount}</p>
            </div>
          </div>
        </div>        <button className={`mt-3 text-white px-4 py-2 rounded-md transition-colors w-full ${
          type === 'cropLoan' ? 'bg-green-600 hover:bg-green-700' :
          type === 'equipmentLoan' ? 'bg-blue-600 hover:bg-blue-700' :
          type === 'landLoan' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'
        }`}>
          {t("loans.applyNow")}
        </button>
      </div>
    </div>
  );
};

export default LoanCard;
