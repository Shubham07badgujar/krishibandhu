import PropTypes from 'prop-types';

const PaginationControl = ({ currentPage, totalPages, onPageChange }) => {
  // Handle previous page click
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Handle next page click
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // If there's only 1 page, don't render pagination
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button 
        onClick={handlePrevious} 
        disabled={currentPage === 1}
        className="px-4 py-2 border border-green-500 rounded-lg bg-white text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>
      
      <div className="flex items-center">
        <span className="px-4 py-2 border border-green-500 rounded-l-lg bg-green-500 text-white font-medium">
          {currentPage}
        </span>
        <span className="mx-2">of</span>
        <span className="px-4 py-2 border border-green-500 rounded-r-lg bg-white text-green-700">
          {totalPages}
        </span>
      </div>
      
      <button 
        onClick={handleNext} 
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-green-500 rounded-lg bg-white text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
      >
        Next
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

PaginationControl.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default PaginationControl;
