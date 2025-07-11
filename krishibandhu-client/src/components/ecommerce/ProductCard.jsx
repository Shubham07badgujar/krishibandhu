import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, className = '' }) => {
  const {
    _id,
    title,
    price,
    finalPrice,
    images,
    category,
    type,
    unit,
    stock,
    sellerId,
    location,
    rating,
    discount
  } = product;

  const hasDiscount = discount && discount.percentage > 0 && 
    discount.validTill && new Date(discount.validTill) > new Date();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${className}`}>
      <Link to={`/product/${_id}`} className="block">
        {/* Image Section */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {images && images.length > 0 ? (
            <img
              src={`http://localhost:5000${images[0]}`}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = '/placeholder-product.jpg'; // Add a placeholder image
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              type === 'buy' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {type === 'buy' ? 'For Sale' : 'Farmer Selling'}
            </span>
          </div>

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 right-2">
              <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full">
                {discount.percentage}% OFF
              </span>
            </div>
          )}

          {/* Stock Status */}
          {stock <= 5 && stock > 0 && (
            <div className="absolute bottom-2 left-2">
              <span className="bg-orange-500 text-white px-2 py-1 text-xs font-medium rounded">
                Only {stock} left
              </span>
            </div>
          )}

          {stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 font-bold rounded">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-green-600 transition-colors">
            {title}
          </h3>

          {/* Category */}
          <p className="text-sm text-gray-500 mb-2 capitalize">
            {category.replace(/-/g, ' ')}
          </p>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-green-600">
                {formatPrice(finalPrice)}
              </span>
              {hasDiscount && price !== finalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(price)}
                </span>
              )}
              <span className="text-sm text-gray-500">/{unit}</span>
            </div>
          </div>

          {/* Seller Info */}
          {sellerId && (
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>
                {sellerId.name} • {location?.district || sellerId.district}
                {location?.state || sellerId.state ? `, ${location?.state || sellerId.state}` : ''}
              </span>
            </div>
          )}

          {/* Rating */}
          {rating && rating.count > 0 && (
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating.average) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600">
                  {rating.average.toFixed(1)} ({rating.count})
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        {stock > 0 ? (
          <button
            onClick={handleAddToCart}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6.5-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m6.5 0V8a2 2 0 00-2-2H9a2 2 0 00-2 2v5.5" />
            </svg>
            <span>Add to Cart</span>
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 font-medium py-2 px-4 rounded-lg cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
