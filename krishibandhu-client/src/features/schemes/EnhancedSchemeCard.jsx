import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import PropTypes from 'prop-types';

const EnhancedSchemeCard = ({ scheme }) => {
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false); // For showing more details

    // Handle saving scheme
    const handleSave = async () => {
        if (!user) {
            alert("Please login to save schemes");
            return;
        }

        try {
            setError(null);
            setIsSaving(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/schemes/save/${scheme._id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to save scheme: ${response.status}`);
            }
            
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        } catch (error) {
            console.error("Error saving scheme:", error);
            setError("Failed to save. Please try again.");
            setTimeout(() => setError(null), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle visiting website
    const handleVisitWebsite = () => {
        if (scheme.link) {
            window.open(scheme.link, '_blank');
        }
    };
    
    // Toggle expanded state to show more details
    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };
    
    return (
      <div className="bg-white p-5 shadow-md border border-gray-100 rounded-lg hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-green-700 leading-tight line-clamp-2 mb-1">{scheme.title}</h3>
            <div className="flex flex-wrap items-center text-xs text-gray-500 gap-2">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {scheme.state}
              </span>
              {scheme.year && (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {scheme.year}
                </span>
              )}
            </div>
          </div>
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
            {scheme.category}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-700 mb-3 flex-grow">
          {scheme.description}
        </p>
        
        {/* Details */}
        <div className="border-t border-gray-100 pt-3 mt-2">
          <div className="mb-3">
            <p className="text-xs text-gray-700 mb-1 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>
                <span className="font-semibold">Eligibility:</span> {scheme.eligibility}
              </span>
            </p>
          </div>
          
          {scheme.launchedBy && (
            <p className="flex items-center text-xs text-gray-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-semibold">Organization:</span> {scheme.launchedBy}
            </p>
          )}
          
          {/* Show more details button */}
          <button 
            onClick={toggleExpanded}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center mt-1"
          >
            {isExpanded ? 'Show less' : 'Show more'}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ml-1 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Expanded details */}
          {isExpanded && (
            <div className="mt-3 pt-2 border-t border-dashed border-gray-100 text-xs text-gray-600">
              <h4 className="font-semibold text-green-700 mb-1">Additional Scheme Details:</h4>
              <ul className="space-y-1.5">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Scheme ID: {scheme._id}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>For farmers in {scheme.state}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Category: {scheme.category} support</span>
                </li>
                {scheme.link && (
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Official website available</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-2 border-red-400 p-2 mb-2 text-xs text-red-600">
            {error}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex gap-2 mt-auto pt-3">
          <button 
            onClick={handleSave} 
            disabled={isSaving || isSaved}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex-1 flex justify-center items-center transition-all ${
              isSaved 
                ? "bg-green-100 text-green-800 border border-green-300" 
                : "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300"
            }`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : isSaved ? (
              <>
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save Scheme
              </>
            )}
          </button>
          
          {scheme.link && (
            <button 
              onClick={handleVisitWebsite} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex-1 transition-colors flex items-center justify-center"
            >
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visit Website
            </button>
          )}
        </div>
      </div>
    );
  };
  
  EnhancedSchemeCard.propTypes = {
    scheme: PropTypes.object.isRequired
  };
  
  export default EnhancedSchemeCard;
