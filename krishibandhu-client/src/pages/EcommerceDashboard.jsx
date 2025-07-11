import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBagIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  UserGroupIcon,
  PlusIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useEcommerce } from '../context/EcommerceContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const EcommerceDashboard = () => {
  const { 
    fetchMyProducts, 
    fetchOrders, 
    myProducts, 
    orders, 
    loading 
  } = useEcommerce();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    if (user) {
      fetchMyProducts();
      fetchOrders();
    }
  }, [user, fetchMyProducts, fetchOrders]);

  useEffect(() => {
    // Calculate stats from data
    const activeProducts = myProducts.filter(p => p.isActive).length;
    const pendingOrders = orders.filter(o => 
      ['placed', 'confirmed', 'processing', 'shipped'].includes(o.orderStatus?.current)
    ).length;
    const completedOrders = orders.filter(o => o.orderStatus?.current === 'delivered').length;
    const totalRevenue = orders
      .filter(o => o.paymentDetails?.status === 'completed')
      .reduce((sum, order) => sum + (order.orderSummary?.totalAmount || 0), 0);

    setStats({
      totalProducts: myProducts.length,
      activeProducts,
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      completedOrders
    });
  }, [myProducts, orders]);

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
      day: 'numeric'
    });
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            <h1 className="text-3xl font-bold text-gray-900">E-Commerce Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your products and orders</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/sell"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                <p className="text-sm text-green-600">{stats.activeProducts} active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyRupeeIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
                <p className="text-sm text-gray-500">From {stats.completedOrders} orders</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                <p className="text-sm text-yellow-600">Need attention</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                <p className="text-sm text-purple-600">All time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'products', label: 'My Products' },
                { id: 'orders', label: 'Orders to Fulfill' },
                { id: 'sales', label: 'Sales History' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                  <Link to="/orders" className="text-green-600 hover:text-green-700 text-sm font-medium">
                    View All
                  </Link>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Order #{order.orderId}</p>
                        <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(order.orderStatus?.current)}`}>
                          {order.orderStatus?.current?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatPrice(order.orderSummary?.totalAmount || 0)}</p>
                        <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {orders.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    No orders yet
                  </div>
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
                  <Link to="/sell" className="text-green-600 hover:text-green-700 text-sm font-medium">
                    Add Product
                  </Link>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {myProducts.slice(0, 5).map((product) => (
                  <div key={product._id} className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.images?.[0] ? `http://localhost:5000${product.images[0]}` : '/placeholder-product.jpg'}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 truncate">{product.title}</p>
                        <p className="text-sm text-gray-600">{formatPrice(product.finalPrice || product.price)}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <div className="flex items-center">
                            <EyeIcon className="w-3 h-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{product.views || 0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {myProducts.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    <ShoppingBagIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p>No products listed yet</p>
                    <Link 
                      to="/sell" 
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      List your first product
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">My Products ({myProducts.length})</h2>
                <Link
                  to="/sell"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Product
                </Link>
              </div>
            </div>
            
            {myProducts.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingBagIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
                <p className="text-gray-600 mb-6">Start by listing your first product for sale</p>
                <Link
                  to="/sell"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  List First Product
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {myProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={product.images?.[0] ? `http://localhost:5000${product.images[0]}` : '/placeholder-product.jpg'}
                              alt={product.title}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {product.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(product.createdAt)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(product.finalPrice || product.price)}
                          <div className="text-xs text-gray-500">per {product.unit}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-gray-900'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.views || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/products/${product._id}`}
                              className="text-green-600 hover:text-green-900"
                            >
                              View
                            </Link>
                            <button className="text-blue-600 hover:text-blue-900">
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Orders to Fulfill ({stats.pendingOrders})</h2>
            </div>
            
            {stats.pendingOrders === 0 ? (
              <div className="p-12 text-center">
                <CheckCircleIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-600">No pending orders to fulfill</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders
                  .filter(o => ['placed', 'confirmed', 'processing', 'shipped'].includes(o.orderStatus?.current))
                  .map((order) => (
                    <div key={order._id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-medium text-gray-900">Order #{order.orderId}</p>
                              <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                            </div>
                            
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus?.current)}`}>
                              {order.orderStatus?.current?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                          
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                            <span>Buyer: {order.buyerId?.fullName}</span>
                            <span>•</span>
                            <span>{order.items?.length || 0} items</span>
                            <span>•</span>
                            <span>{formatPrice(order.orderSummary?.totalAmount || 0)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/orders/${order._id}`}
                            className="px-3 py-2 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors duration-200"
                          >
                            View Details
                          </Link>
                          <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                            Update Status
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Sales History</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {orders
                .filter(o => o.orderStatus?.current === 'delivered')
                .map((order) => (
                  <div key={order._id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Order #{order.orderId}</p>
                        <p className="text-sm text-gray-600">
                          Delivered on {formatDate(order.deliveryDetails?.actualDelivery || order.updatedAt)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Buyer: {order.buyerId?.fullName}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatPrice(order.orderSummary?.totalAmount || 0)}</p>
                        <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                        
                        {order.rating?.buyerRating && (
                          <div className="flex items-center mt-1">
                            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {order.rating.buyerRating.rating}/5
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              }
              
              {orders.filter(o => o.orderStatus?.current === 'delivered').length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <TruckIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p>No completed sales yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcommerceDashboard;
