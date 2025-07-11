import React from 'react';
import ProductList from '../components/ecommerce/ProductList';

const SellProductsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Fresh from Farmers
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Direct from farm to your doorstep - Fresh crops, organic products, and more
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Farm Fresh</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Direct from Farmers</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Fair Prices</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Categories */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {[
            { key: 'crops', name: 'Fresh Crops', icon: '🥬', color: 'bg-green-100 text-green-700' },
            { key: 'organic-products', name: 'Organic Products', icon: '🌿', color: 'bg-emerald-100 text-emerald-700' },
            { key: 'seeds', name: 'Seeds', icon: '🌱', color: 'bg-yellow-100 text-yellow-700' },
            { key: 'used-equipment', name: 'Used Equipment', icon: '🔧', color: 'bg-blue-100 text-blue-700' },
            { key: 'fertilizers', name: 'Excess Fertilizers', icon: '🧪', color: 'bg-purple-100 text-purple-700' },
            { key: 'other', name: 'Others', icon: '📦', color: 'bg-orange-100 text-orange-700' }
          ].map((category) => (
            <button
              key={category.key}
              onClick={() => {
                const element = document.getElementById('products-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
                // Here you can trigger category filter
              }}
              className={`${category.color} p-4 rounded-lg text-center hover:scale-105 transition-transform duration-200`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-sm font-medium">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div id="products-section">
        <ProductList type="sell" showFilters={true} />
      </div>
    </div>
  );
};

export default SellProductsPage;
