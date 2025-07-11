import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showInfo = true,
  className = '' 
}) => {
  const getVisiblePages = () => {
    const visiblePages = [];
    const totalVisible = 5; // Show 5 page numbers at most
    
    let start = Math.max(1, currentPage - Math.floor(totalVisible / 2));
    let end = Math.min(totalPages, start + totalVisible - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < totalVisible) {
      start = Math.max(1, end - totalVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }
    
    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${className}`}>
      {/* Page Info */}
      {showInfo && (
        <div className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </div>
      )}

      {/* Pagination Buttons */}
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* First Page */}
        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="px-2 py-2 text-sm text-gray-400">...</span>
            )}
          </>
        )}

        {/* Visible Page Numbers */}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Last Page */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-2 py-2 text-sm text-gray-400">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
