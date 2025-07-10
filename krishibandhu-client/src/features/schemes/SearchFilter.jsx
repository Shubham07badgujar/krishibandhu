import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const SearchFilter = ({ 
  onSearch, 
  onFilterChange, 
  onToggleFilters, 
  onReset,
  showFilters,
  filter,
  search
}) => {
  // Filter options
  const states = [
    "All", "Pan India", "Maharashtra", "Uttar Pradesh", "Bihar", "Rajasthan", 
    "Gujarat", "Tamil Nadu", "Telangana", "Madhya Pradesh", "Karnataka", 
    "Kerala", "Punjab", "North Eastern States"
  ];
    const categories = [
    "All", "Subsidy", "Insurance", "Credit", "Infrastructure", 
    "Extension", "Irrigation", "Marketing", "Crop Loan", "Equipment Loan", "Land Loan"
  ];
  
  const organizations = [
    "All", "Govt. of India", "Ministry of Agriculture", "NABARD", 
    "Indian Council of Agricultural Research", "Ministry of Fisheries, Animal Husbandry & Dairying", 
    "Ministry of Railways", "Ministry of Tribal Affairs"
  ];
    const years = ["All", "2020+", "2015-2019", "2010-2014", "2000-2009", "Before 2000"];
  
  const [useLocalSchemes, setUseLocalSchemes] = useState(false); // Default to fetching from API

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filter.state !== "All" || 
           filter.category !== "All" || 
           filter.launchedBy !== "All" || 
           filter.year !== "All" ||
           search.trim() !== "";
  }, [filter, search]);
  // Handle local schemes toggle
  const handleLocalSchemesChange = (e) => {
    const newValue = e.target.checked;
    setUseLocalSchemes(newValue);
    // Pass this up to parent component
    if (onFilterChange) {
      onFilterChange('useLocalSchemes', newValue);
    }
  };

  // Handle search input
  const handleSearchChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    if (onFilterChange) {
      onFilterChange(field, value);
    }
  };
  return (
    <>
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-green-700">Agricultural Schemes</h2>        <div className="flex space-x-2">
          <button 
            onClick={onToggleFilters} 
            className={`flex items-center ${(hasActiveFilters && !showFilters) ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded-lg transition-colors`}
          >
            <span className="mr-2">{showFilters ? "Hide Filters" : "Advanced Filters"}</span>
            {hasActiveFilters && !showFilters && (
              <span className="flex h-5 w-5 items-center justify-center bg-white text-yellow-600 text-xs font-bold rounded-full">!</span>
            )}
            {!hasActiveFilters && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <button 
            onClick={onReset} 
            className={`${hasActiveFilters ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400 hover:bg-gray-500'} text-white px-4 py-2 rounded-lg transition-colors`}
            disabled={!hasActiveFilters}
          >
            Reset
          </button>
        </div>
      </div>
        {/* Search bar - always visible */}
      <div className={`${search ? 'bg-blue-50 border border-blue-100' : 'bg-white'} p-4 rounded-lg shadow mb-4 transition-colors`}>
        <div className="relative">
          <input
            type="text"
            value={search}
            placeholder="Search schemes by title, description or eligibility..."
            onChange={handleSearchChange}
            className="w-full border border-gray-300 pl-10 pr-10 py-3 rounded-lg focus:ring-green-500 focus:border-green-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {search && (
            <button 
              onClick={() => onSearch('')} 
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        {search && (
          <p className="mt-2 text-sm text-blue-600">Searching for "{search}"</p>
        )}
      </div><div className={`bg-green-50 p-4 rounded-lg shadow mb-6 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
        <h3 className="text-lg font-medium text-green-800 mb-3">Advanced Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select 
              value={filter.state} 
              onChange={(e) => handleFilterChange('state', e.target.value)} 
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              {states.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              value={filter.category}
              onChange={(e) => handleFilterChange('category', e.target.value)} 
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
            <select 
              value={filter.launchedBy}
              onChange={(e) => handleFilterChange('launchedBy', e.target.value)} 
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              {organizations.map(org => <option key={org} value={org}>{org}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Launch Year</label>
            <select 
              value={filter.year}
              onChange={(e) => handleFilterChange('year', e.target.value)} 
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>        </div>
          <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="useLocalSchemes"
            checked={useLocalSchemes}
            onChange={handleLocalSchemesChange}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="useLocalSchemes" className="ml-2 block text-sm text-gray-700 flex items-center">
            {useLocalSchemes ? (
              <span className="flex items-center">
                <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-yellow-100 text-yellow-800 mr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z" clipRule="evenodd" />
                  </svg>
                </span>
                Using local schemes (won't show admin added schemes)
              </span>
            ) : (
              <span className="flex items-center">
                <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-green-100 text-green-800 mr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Using server schemes (includes admin added schemes)
              </span>
            )}
          </label>
        </div>
      </div>
      {hasActiveFilters && (
        <div className="bg-yellow-100 p-4 rounded-lg shadow mb-4">
          <p className="text-yellow-800 text-sm">Filters are active. Adjust or reset filters to see all results.</p>
        </div>
      )}
    </>
  );
};

SearchFilter.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onToggleFilters: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  showFilters: PropTypes.bool.isRequired,
  filter: PropTypes.object.isRequired,
  search: PropTypes.string.isRequired
};

export default SearchFilter;
