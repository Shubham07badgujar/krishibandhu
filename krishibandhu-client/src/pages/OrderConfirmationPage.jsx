import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orders = location.state?.orders || [];

  React.useEffect(() => {
    if (!orders.length) {
      navigate('/cart');
    }
  }, [orders, navigate]);

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
      month: 'long',
      day: 'numeric'
    });
  };

  const totalAmount = orders.reduce((sum, order) => sum + (order.orderSummary?.totalAmount || 0), 0);
  const totalItems = orders.reduce((sum, order) => sum + (order.items?.length || 0), 0);

  if (!orders.length) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. Your items are being processed.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b border-green-200">
            <h2 className="text-xl font-semibold text-green-900">Order Summary</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">{orders.length}</div>
                <div className="text-sm text-gray-600">Order{orders.length > 1 ? 's' : ''} Placed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{totalItems}</div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{formatPrice(totalAmount)}</div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Orders */}
        <div className="space-y-6 mb-8">
          {orders.map((order, index) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.orderId}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Seller: {order.sellerId?.fullName || 'Unknown'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {formatPrice(order.orderSummary?.totalAmount || 0)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.items?.length || 0} items
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <h4 className="font-medium text-gray-900 mb-3">Items Ordered:</h4>
                <div className="space-y-3">
                  {order.items?.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image ? `http://localhost:5000${item.image}` : '/placeholder-product.jpg'}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {formatPrice(item.totalPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4" />
                    <span>Expected delivery: {formatDate(order.deliveryDetails?.estimatedDelivery)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CreditCardIcon className="w-4 h-4" />
                    <span>Payment: {order.paymentDetails?.method?.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-200">
            <h2 className="text-xl font-semibold text-blue-900">Delivery Information</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Delivery Address</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">{orders[0]?.deliveryAddress?.fullName}</p>
                  <p>{orders[0]?.deliveryAddress?.phone}</p>
                  <p>{orders[0]?.deliveryAddress?.addressLine1}</p>
                  {orders[0]?.deliveryAddress?.addressLine2 && (
                    <p>{orders[0]?.deliveryAddress?.addressLine2}</p>
                  )}
                  <p>
                    {[
                      orders[0]?.deliveryAddress?.village,
                      orders[0]?.deliveryAddress?.district,
                      orders[0]?.deliveryAddress?.state,
                      orders[0]?.deliveryAddress?.pincode
                    ].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">What's Next?</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order Confirmed</p>
                      <p className="text-xs text-gray-600">Your order has been placed successfully</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ClockIcon className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Processing</p>
                      <p className="text-xs text-gray-600">Seller will prepare your items</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <TruckIcon className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Shipping</p>
                      <p className="text-xs text-gray-600">Your order will be shipped</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPinIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Delivery</p>
                      <p className="text-xs text-gray-600">Delivered to your address</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <TruckIcon className="w-5 h-5 mr-2" />
            Track Your Orders
          </Link>
          
          <Link
            to="/buy"
            className="flex items-center justify-center px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Support Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-blue-700 mb-4">
              Our support team is here to help you with any questions about your order.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-blue-700">
              <div className="flex items-center">
                <PhoneIcon className="w-4 h-4 mr-1" />
                <span>+91-XXXX-XXXXXX</span>
              </div>
              <span>•</span>
              <span>support@krishibandhu.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
