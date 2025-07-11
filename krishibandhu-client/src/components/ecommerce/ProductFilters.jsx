import React, { useState, useEffect } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';

const ProductFilters = ({ filters, onFilterChange, type = '' }) => {
  const { categories, getCategories } = useEcommerce();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    // Load categories based on type
    getCategories(type);
  }, [type]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (minPrice, maxPrice) => {
    const newFilters = { ...localFilters, minPrice, maxPrice };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      type: type || '',
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const categoryOptions = [
    { value: 'seeds', label: 'Seeds' },
    { value: 'fertilizers', label: 'Fertilizers' },
    { value: 'pesticides', label: 'Pesticides' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'saplings', label: 'Saplings' },
    { value: 'crops', label: 'Crops' },
    { value: 'organic-products', label: 'Organic Products' },
    { value: 'used-equipment', label: 'Used Equipment' },
    { value: 'other', label: 'Other' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'title', label: 'Name: A to Z' },
    { value: 'views', label: 'Most Popular' }
  ];

  const priceRanges = [
    { min: '', max: '', label: 'Any Price' },
    { min: '0', max: '500', label: 'Under ₹500' },
    { min: '500', max: '1000', label: '₹500 - ₹1,000' },
    { min: '1000', max: '5000', label: '₹1,000 - ₹5,000' },
    { min: '5000', max: '10000', label: '₹5,000 - ₹10,000' },
    { min: '10000', max: '', label: 'Above ₹10,000' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <div className="relative">
            <input
              type="text"
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by name, description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={localFilters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  checked={
                    localFilters.minPrice === range.min && 
                    localFilters.maxPrice === range.max
                  }
                  onChange={() => handlePriceRangeChange(range.min, range.max)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>

          {/* Custom Price Range */}
          <div className="mt-3 space-y-2">
            <label className="block text-xs font-medium text-gray-600">
              Custom Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max"
                value={localFilters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={localFilters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            placeholder="City, District, State"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Find products near you
          </p>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={`${localFilters.sortBy || 'createdAt'}${localFilters.sortOrder === 'asc' ? '-asc' : ''}`}
            onChange={(e) => {
              const value = e.target.value;
              if (value.endsWith('-asc')) {
                const sortBy = value.replace('-asc', '');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', 'asc');
              } else if (value === 'price-desc') {
                handleFilterChange('sortBy', 'price');
                handleFilterChange('sortOrder', 'desc');
              } else {
                handleFilterChange('sortBy', value);
                handleFilterChange('sortOrder', 'desc');
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Product Type (if not already filtered) */}
        {!type && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value=""
                  checked={!localFilters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">All Products</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="buy"
                  checked={localFilters.type === 'buy'}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Farming Essentials</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="sell"
                  checked={localFilters.type === 'sell'}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">From Farmers</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
