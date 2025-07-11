import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import { useEcommerce } from '../../context/EcommerceContext';
import LoadingSpinner from '../LoadingSpinner';
import Pagination from './Pagination';

const ProductList = ({ type = '', initialCategory = '', showFilters = true }) => {
  const {
    products,
    loading,
    error,
    pagination,
    filters,
    getProducts,
    addToCart,
    setFilters,
    clearError
  } = useEcommerce();

  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    // Set initial filters if provided
    if (type && filters.type !== type) {
      setFilters({ type });
    }
    if (initialCategory && filters.category !== initialCategory) {
      setFilters({ category: initialCategory });
    }
  }, [type, initialCategory]);

  useEffect(() => {
    loadProducts();
  }, [filters, currentPage]);

  const loadProducts = async () => {
    try {
      await getProducts(filters, currentPage);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
      // Show success message or toast
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              clearError();
              loadProducts();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {type === 'buy' ? 'Buy Farming Essentials' : 
               type === 'sell' ? 'Fresh from Farmers' : 
               'All Products'}
            </h1>
            <p className="text-gray-600 mt-1">
              {pagination.totalProducts} products found
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          {showFilters && (
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden bg-white border border-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              <span>Filters</span>
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className={`lg:w-64 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                type={type}
              />
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="large" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌾</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={() => {
                    setFilters({ 
                      type: type || '',
                      category: '',
                      search: '',
                      minPrice: '',
                      maxPrice: '',
                      location: '',
                      sortBy: 'createdAt',
                      sortOrder: 'desc'
                    });
                    setCurrentPage(1);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    className="flex justify-center"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
