import { useState } from "react";
import PropTypes from 'prop-types';
import { useAuth } from "../../context/AuthContext";

const RemovableSchemeCard = ({ scheme, onRemove }) => {
  const { user } = useAuth();
  const [isRemoving, setIsRemoving] = useState(false);
  
  // Handle visit website button
  const handleVisitWebsite = () => {
    if (scheme.link) {
      window.open(scheme.link, '_blank');
    }
  };
  
  // Handle remove from saved
  const handleRemove = async () => {
    if (!user) return;
    
    try {
      setIsRemoving(true);
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/schemes/saved/${scheme._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      if (onRemove) {
        onRemove(scheme._id);
      }
    } catch (error) {
      console.error("Error removing scheme:", error);
      alert("Failed to remove scheme. Please try again.");
    } finally {
      setIsRemoving(false);
    }
  };
  
  return (
    <div className="bg-white p-5 shadow-md border border-gray-100 rounded-lg hover:shadow-lg transition-shadow duration-300 h-full flex flex-col relative">
      {/* Remove button */}
      <button 
        onClick={handleRemove}
        disabled={isRemoving}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
        title="Remove from saved"
      >
        {isRemoving ? (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-green-700 leading-tight">{scheme.title}</h3>
        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
          {scheme.category}
        </span>
      </div>
      
      <p className="text-sm text-gray-700 mb-3 flex-grow">{scheme.description}</p>
      
      <div className="border-t border-gray-100 pt-3 mt-2">
        <p className="text-xs text-gray-600 mb-1.5">
          <span className="font-semibold">Eligibility:</span> {scheme.eligibility}
        </p>
        
        <div className="flex flex-wrap gap-4 mb-3 text-xs text-gray-600">
          {scheme.launchedBy && (
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-semibold">Organization:</span> {scheme.launchedBy}
            </p>
          )}
          
          {scheme.year && (
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">Year:</span> {scheme.year}
            </p>
          )}

          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-semibold">State:</span> {scheme.state}
          </p>
        </div>
      </div>
      
      {scheme.link && (
        <button 
          onClick={handleVisitWebsite} 
          className="mt-auto bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
        >
          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Visit Website
        </button>
      )}
    </div>
  );
};

RemovableSchemeCard.propTypes = {
  scheme: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default RemovableSchemeCard;
