import { useEffect, useState, useCallback } from "react";
import SchemeCard from "./EnhancedSchemeCard";
import SearchFilter from "./SearchFilter";
import PaginationControl from "./PaginationControl";
import SchemeInfoSection from "./SchemeInfoSection";
import FeatureShowcase from "./FeatureShowcase";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function SchemesPageNew() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [filter, setFilter] = useState({ state: "All", category: "All", launchedBy: "All", year: "All" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(9); // Number of schemes per page
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchemes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch from API
      const params = new URLSearchParams();
      if (filter.state !== "All") params.append("state", filter.state);
      if (filter.category !== "All") params.append("category", filter.category);
      if (filter.launchedBy !== "All") params.append("launchedBy", filter.launchedBy);
      if (filter.year !== "All") params.append("year", filter.year);
      if (search) params.append("search", search);
      params.append("page", page.toString());
      params.append("limit", itemsPerPage.toString());
      
      const apiUrl = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/schemes?${params.toString()}`;
      console.log("Fetching schemes from API:", apiUrl);
      
      const res = await fetch(apiUrl);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch schemes: ${res.status} ${res.statusText}`);
      }
        
      const data = await res.json();
      console.log("API response:", data);
      
      if (data.schemes && data.schemes.length > 0) {
        console.log(`Received ${data.schemes.length} schemes from database`);
        
        // Map the data to ensure it has all the required fields
        const formattedSchemes = data.schemes.map(scheme => ({
          _id: scheme._id,
          title: scheme.title || "Untitled Scheme",
          description: scheme.description || "No description available",
          category: scheme.category || "Other",
          state: scheme.state || "Pan India",
          eligibility: scheme.eligibility || "Contact department for eligibility criteria",
          link: scheme.link || "#",
          launchedBy: scheme.launchedBy || "Government",
          year: scheme.year || new Date().getFullYear()
        }));
        
        setSchemes(formattedSchemes);
        setTotalPages(data.totalPages || 1);
      } else {
        console.log("API returned no schemes:", data);
        setError("No schemes found in the database. Please try different filters or check back later.");
        setSchemes([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching schemes:", error);
      setError("Failed to load schemes from database. Please try again later.");
      setSchemes([]);
      setTotalPages(1);
    }
    setLoading(false);
  }, [filter, search, page, itemsPerPage]);

  // Effect to fetch schemes when dependencies change
  useEffect(() => {
    fetchSchemes();
  }, [fetchSchemes]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilter(prev => ({ ...prev, [field]: value }));
    setPage(1); // Reset to first page after filter change
  };

  // Handle search input changes
  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1); // Reset to first page after search
  };

  // Handle toggle filters
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Reset all filters and search
  const resetFilters = () => {
    setFilter({ state: "All", category: "All", launchedBy: "All", year: "All" });
    setSearch("");
    setPage(1);
  };

  // Handle manual page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Admin link for admin users */}
      {user?.role === 'admin' && (
        <div className="mb-6 flex justify-end">
          <Link 
            to="/admin/schemes" 
            className="flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-md border border-amber-200 hover:bg-amber-200 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.413 48.413 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.413 48.413 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m5.8 4.5v9.75m0-9.75h-5.8m5.8 0c1.012 0 1.867.668 2.15 1.586" />
            </svg>
            Admin Dashboard
          </Link>
        </div>
      )}
      
      {/* Database Schemes Indicator */}
      <div className="p-3 mb-4 rounded-lg flex justify-between items-center bg-blue-50 border border-blue-200">
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full mr-2 bg-blue-100 text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </span>
          <div>
            <p className="font-medium">Agricultural Schemes Database</p>
            <p className="text-xs text-gray-600">
              Showing all schemes from the KrishiBandhu database
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={() => fetchSchemes()}
            className="px-3 py-1.5 rounded text-sm font-medium bg-green-500 hover:bg-green-600 text-white"
          >
            Refresh Now
          </button>
        </div>
      </div>
      
      {/* Search and Filter controls */}
      <SearchFilter 
        onSearch={handleSearchChange}
        onFilterChange={handleFilterChange}
        onToggleFilters={handleToggleFilters}
        onReset={resetFilters}
        showFilters={showFilters}
        filter={filter}
        search={search}
      />
      
      {/* Error message if there is one */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Scheme source information */}
      {!loading && schemes.length > 0 && (
        <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-100">
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full mr-2 bg-green-100 text-green-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">
                  Showing Database Schemes
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                  {schemes.length} schemes found
                </span>
              </div>
              <p className="text-xs text-gray-600">
                These include schemes added by administrators through the admin dashboard.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading spinner */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <span className="ml-3 text-green-600 font-medium">Loading schemes...</span>
        </div>
      ) : schemes.length > 0 ? (
        <>
          {/* Schemes grid */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {schemes.map(scheme => <SchemeCard key={scheme._id} scheme={scheme} />)}
          </div>

          {/* Pagination component */}
          <PaginationControl 
            currentPage={page} 
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                No schemes found with the current filters. Try adjusting your search criteria.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Feature Showcase section */}
      <FeatureShowcase />
      
      {/* Info section */}
      <SchemeInfoSection language={i18n.language} />
    </div>
  );
}

export default SchemesPageNew;
