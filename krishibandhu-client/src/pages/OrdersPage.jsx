import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useEcommerce } from '../context/EcommerceContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const OrdersPage = () => {
  const { fetchOrders, orders, loading } = useEcommerce();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [view, setView] = useState('buyer'); // buyer or seller

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchOrders(1, selectedStatus);
  }, [user, selectedStatus, fetchOrders, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'placed':
      case 'confirmed':
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case 'processing':
      case 'ready_to_ship':
        return <TruckIcon className="w-5 h-5 text-blue-600" />;
      case 'shipped':
      case 'out_for_delivery':
        return <TruckIcon className="w-5 h-5 text-purple-600" />;
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case 'returned':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed':
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
      case 'ready_to_ship':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'returned':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'placed', label: 'Placed' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const getOrderProgress = (status) => {
    const steps = [
      'placed',
      'confirmed', 
      'processing',
      'ready_to_ship',
      'shipped',
      'out_for_delivery',
      'delivered'
    ];
    
    const currentIndex = steps.indexOf(status);
    const progress = currentIndex >= 0 ? ((currentIndex + 1) / steps.length) * 100 : 0;
    
    return { progress, steps, currentIndex };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">Track and manage your orders</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setView('buyer')}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  view === 'buyer'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                My Purchases
              </button>
              <button
                onClick={() => setView('seller')}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  view === 'seller'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                My Sales
              </button>
            </div>
            
            <Link
              to="/buy"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedStatus === option.value
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <TruckIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders found</h2>
            <p className="text-gray-600 mb-8">
              {selectedStatus === 'all' 
                ? "You haven't placed any orders yet." 
                : `No orders with status "${selectedStatus}".`}
            </p>
            <Link
              to="/buy"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderProgress = getOrderProgress(order.orderStatus.current);
              
              return (
                <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Order #{order.orderId}
                          </p>
                          <p className="text-sm text-gray-600">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.orderStatus.current)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus.current)}`}>
                            {order.orderStatus.current.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(order.orderSummary.totalAmount)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                        
                        <Link
                          to={`/orders/${order._id}`}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Order Progress */}
                  {order.orderStatus.current !== 'cancelled' && order.orderStatus.current !== 'returned' && (
                    <div className="px-6 py-4 bg-blue-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">Order Progress</span>
                        <span className="text-sm text-blue-700">{Math.round(orderProgress.progress)}% Complete</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${orderProgress.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-blue-700">
                        <span>Placed</span>
                        <span>Processing</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <img
                            src={item.image ? `http://localhost:5000${item.image}` : '/placeholder-product.jpg'}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                          <span className="text-sm text-gray-600">
                            +{order.items.length - 3} more items
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPinIcon className="w-4 h-4" />
                        <span>
                          Delivering to: {order.deliveryAddress.district}, {order.deliveryAddress.state}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <PhoneIcon className="w-4 h-4" />
                        <span>Contact: {order.deliveryAddress.phone}</span>
                      </div>
                      
                      {order.deliveryDetails?.estimatedDelivery && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <ClockIcon className="w-4 h-4" />
                          <span>
                            Expected: {formatDate(order.deliveryDetails.estimatedDelivery)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="capitalize">Payment: {order.paymentDetails.method}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentDetails.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.paymentDetails.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.paymentDetails.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {order.orderStatus.current === 'delivered' && !order.rating?.buyerRating && (
                          <button className="inline-flex items-center px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors duration-200">
                            <StarIcon className="w-4 h-4 mr-1" />
                            Rate Order
                          </button>
                        )}
                        
                        {['placed', 'confirmed', 'processing'].includes(order.orderStatus.current) && (
                          <button className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200">
                            Cancel Order
                          </button>
                        )}
                      </div>
                      
                      <Link
                        to={`/orders/${order._id}`}
                        className="inline-flex items-center px-4 py-2 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors duration-200"
                      >
                        View Details
                        <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
