import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import RemovableSchemeCard from "./RemovableSchemeCard";
import { Link } from "react-router-dom";
import SchemeCard from "./EnhancedSchemeCard";

const SavedSchemesPage = () => {
  const { user } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedSchemes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/schemes/saved`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch saved schemes");
        }
        
        const data = await response.json();
        setSchemes(data);
      } catch (error) {
        console.error("Error fetching saved schemes:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedSchemes();
  }, [user]);

  const removeSavedScheme = async (schemeId) => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/schemes/saved/${schemeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      // Remove from local state
      setSchemes(schemes.filter(scheme => scheme._id !== schemeId));
    } catch (error) {
      console.error("Error removing saved scheme:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-700">
          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Saved Schemes
          </span>
        </h2>
        <Link 
          to="/schemes" 
          className="text-green-600 hover:text-green-800 flex items-center text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to All Schemes
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <span className="ml-3 text-green-600 font-medium">Loading saved schemes...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 my-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading saved schemes: {error}
              </p>
            </div>
          </div>
        </div>
      ) : schemes.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {schemes.map(scheme => <RemovableSchemeCard key={scheme._id} scheme={scheme} onRemove={(id) => removeSavedScheme(id)} />)}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">No saved schemes found</h3>
          <p className="text-yellow-700 mb-4">
            You haven't saved any schemes yet. Browse through available schemes and save ones you're interested in.
          </p>
          <Link to="/schemes" className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            Explore Schemes
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedSchemesPage;
