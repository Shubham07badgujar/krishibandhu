import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEcommerce } from '../../context/EcommerceContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

const CartPage = () => {
  const { cart, loading, error, getCart, updateCartItem, removeFromCart, clearCart } = useEcommerce();
  const { user } = useAuth();
  const [processingItem, setProcessingItem] = useState(null);

  useEffect(() => {
    if (user) {
      getCart();
    }
  }, [user]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setProcessingItem(productId);
    try {
      await updateCartItem(productId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setProcessingItem(null);
    }
  };

  const handleRemoveItem = async (productId) => {
    setProcessingItem(productId);
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setProcessingItem(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => getCart()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet
            </p>
            <div className="space-x-4">
              <Link
                to="/buy"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Shop Farming Essentials
              </Link>
              <Link
                to="/sell-products"
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Shop from Farmers
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Cart Items ({cart.summary.totalItems})
                </h2>
                
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center space-x-4 border-b border-gray-200 pb-6"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={`http://localhost:5000${item.images[0]}`}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.finalPrice)} per {item.unit}
                        </p>
                        {item.seller && (
                          <p className="text-xs text-gray-400">
                            Sold by: {item.seller.name}
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1 || processingItem === item.productId}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        
                        <span className="w-12 text-center font-medium">
                          {processingItem === item.productId ? (
                            <LoadingSpinner size="small" />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock || processingItem === item.productId}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.itemTotal)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-500">
                            {item.quantity} × {formatPrice(item.finalPrice)}
                          </p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        disabled={processingItem === item.productId}
                        className="text-red-600 hover:text-red-700 p-2 disabled:opacity-50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(cart.summary.subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="font-medium">
                    {cart.summary.deliveryCharges === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatPrice(cart.summary.deliveryCharges)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (5%)</span>
                  <span className="font-medium">{formatPrice(cart.summary.taxes)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(cart.summary.total)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  // Navigate to checkout
                  window.location.href = '/checkout';
                }}
                className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                <Link
                  to="/buy"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293L10 7.586a1 1 0 00.707.293h2.586a1 1 0 01.707.293L16.707 10.293A1 1 0 0017.414 11H19a2 2 0 110 4H5a2 2 0 01-2-2V6a2 2 0 012-2zm14 0V9a2 2 0 01-2 2h-1M5 8V9a2 2 0 002 2h1m0 0v5a2 2 0 002 2h6a2 2 0 002-2v-5m-6 0h2m-2 0v-2a1 1 0 011-1h0a1 1 0 011 1v2m-2 0V7a1 1 0 011-1h0a1 1 0 011 1v2" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Free delivery on orders above ₹500
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Usually delivered in 2-3 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
