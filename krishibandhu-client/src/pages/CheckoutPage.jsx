import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCardIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { useEcommerce } from '../context/EcommerceContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const CheckoutPage = () => {
  const { cart, createOrder, fetchCart } = useEcommerce();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review

  // Form states
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: user?.fullName || '',
    phone: user?.phoneNumber || '',
    email: user?.email || '',
    addressLine1: '',
    addressLine2: '',
    village: '',
    district: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  const [paymentDetails, setPaymentDetails] = useState({
    method: 'cod', // cod, upi, razorpay, bank_transfer
    upiId: '',
    transactionId: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!cart?.items?.length) {
      navigate('/cart');
      return;
    }

    fetchCart();
  }, [user, cart?.items?.length, navigate, fetchCart]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateTotals = () => {
    const subtotal = cart?.items?.reduce((total, item) => {
      return total + (item.productId?.finalPrice || item.productId?.price || 0) * item.quantity;
    }, 0) || 0;
    
    const deliveryCharges = subtotal > 500 ? 0 : 50;
    const taxes = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryCharges + taxes;
    
    return { subtotal, deliveryCharges, taxes, total };
  };

  const validateAddress = () => {
    const newErrors = {};
    
    if (!deliveryAddress.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!deliveryAddress.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!deliveryAddress.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!deliveryAddress.district.trim()) newErrors.district = 'District is required';
    if (!deliveryAddress.state.trim()) newErrors.state = 'State is required';
    if (!deliveryAddress.pincode.trim()) newErrors.pincode = 'Pincode is required';
    
    // Validate phone number
    if (deliveryAddress.phone && !/^[6-9]\d{9}$/.test(deliveryAddress.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Validate pincode
    if (deliveryAddress.pincode && !/^\d{6}$/.test(deliveryAddress.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    
    if (paymentDetails.method === 'upi' && !paymentDetails.upiId.trim()) {
      newErrors.upiId = 'UPI ID is required for UPI payment';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateAddress()) {
      setStep(2);
    } else if (step === 2 && validatePayment()) {
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress() || !validatePayment()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    
    try {
      const totals = calculateTotals();
      
      const orderData = {
        cartItems: cart.items.map(item => ({
          productId: item.productId._id,
          title: item.productId.title,
          quantity: item.quantity,
          price: item.productId.finalPrice || item.productId.price
        })),
        deliveryAddress,
        paymentDetails,
        orderSummary: {
          subtotal: totals.subtotal,
          deliveryCharges: totals.deliveryCharges,
          taxes: totals.taxes,
          discount: 0,
          totalAmount: totals.total
        }
      };

      const orders = await createOrder(orderData);
      
      // Navigate to order confirmation
      navigate('/order-confirmation', { 
        state: { orders: Array.isArray(orders) ? orders : [orders] }
      });
      
    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

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
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-1">Complete your order</p>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Cart
          </button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { number: 1, title: 'Delivery Address', icon: MapPinIcon },
              { number: 2, title: 'Payment Method', icon: CreditCardIcon },
              { number: 3, title: 'Review Order', icon: CheckCircleIcon }
            ].map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= stepItem.number
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {step > stepItem.number ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <stepItem.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step >= stepItem.number ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {stepItem.title}
                </span>
                {index < 2 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    step > stepItem.number ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Delivery Address */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Address</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.fullName}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, fullName: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={deliveryAddress.phone}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={deliveryAddress.email}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.addressLine1}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, addressLine1: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="House no., Building name, Street"
                    />
                    {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.addressLine2}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, addressLine2: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Area, Colony (Optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Village/City
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.village}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, village: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Village or City name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.district}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, district: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.district ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="District"
                    />
                    {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.state}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="State"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.pincode}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, pincode: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.pincode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="6-digit pincode"
                    />
                    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landmark
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.landmark}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, landmark: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Nearby landmark (Optional)"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                
                <div className="space-y-4">
                  {/* Cash on Delivery */}
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                    paymentDetails.method === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`} onClick={() => setPaymentDetails({...paymentDetails, method: 'cod'})}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentDetails.method === 'cod'}
                        onChange={() => setPaymentDetails({...paymentDetails, method: 'cod'})}
                        className="mr-3"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
                        <p className="text-sm text-gray-600">Pay when your order is delivered</p>
                      </div>
                    </div>
                  </div>

                  {/* UPI Payment */}
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                    paymentDetails.method === 'upi' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`} onClick={() => setPaymentDetails({...paymentDetails, method: 'upi'})}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentDetails.method === 'upi'}
                        onChange={() => setPaymentDetails({...paymentDetails, method: 'upi'})}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">UPI Payment</h3>
                        <p className="text-sm text-gray-600">Pay instantly using UPI ID</p>
                        
                        {paymentDetails.method === 'upi' && (
                          <div className="mt-3">
                            <input
                              type="text"
                              placeholder="Enter your UPI ID (e.g., user@paytm)"
                              value={paymentDetails.upiId}
                              onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                errors.upiId ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors.upiId && <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Online Payment */}
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                    paymentDetails.method === 'razorpay' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`} onClick={() => setPaymentDetails({...paymentDetails, method: 'razorpay'})}>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="razorpay"
                        checked={paymentDetails.method === 'razorpay'}
                        onChange={() => setPaymentDetails({...paymentDetails, method: 'razorpay'})}
                        className="mr-3"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">Online Payment</h3>
                        <p className="text-sm text-gray-600">Credit/Debit Card, Net Banking, Wallets</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Order Items */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
                  
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.productId?.images?.[0] ? `http://localhost:5000${item.productId.images[0]}` : '/placeholder-product.jpg'}
                          alt={item.productId?.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.productId?.title}</h3>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">
                            {formatPrice(item.productId?.finalPrice || item.productId?.price)} per {item.productId?.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice((item.productId?.finalPrice || item.productId?.price) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
                  <div className="text-gray-700">
                    <p className="font-medium">{deliveryAddress.fullName}</p>
                    <p>{deliveryAddress.phone}</p>
                    <p>{deliveryAddress.addressLine1}</p>
                    {deliveryAddress.addressLine2 && <p>{deliveryAddress.addressLine2}</p>}
                    <p>
                      {[deliveryAddress.village, deliveryAddress.district, deliveryAddress.state, deliveryAddress.pincode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    {deliveryAddress.landmark && <p>Landmark: {deliveryAddress.landmark}</p>}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                  <div className="text-gray-700">
                    {paymentDetails.method === 'cod' && <p>Cash on Delivery</p>}
                    {paymentDetails.method === 'upi' && <p>UPI Payment - {paymentDetails.upiId}</p>}
                    {paymentDetails.method === 'razorpay' && <p>Online Payment (Razorpay)</p>}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-8">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart?.items?.length || 0} items)</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className={totals.deliveryCharges === 0 ? 'text-green-600 font-medium' : ''}>
                    {totals.deliveryCharges === 0 ? 'FREE' : formatPrice(totals.deliveryCharges)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Taxes & Fees</span>
                  <span>{formatPrice(totals.taxes)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatPrice(totals.total)}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <TruckIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Estimated delivery: 3-5 business days
                    </span>
                  </div>
                </div>

                {paymentDetails.method === 'cod' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-yellow-800">
                      <ExclamationTriangleIcon className="w-5 h-5" />
                      <span className="text-sm">
                        Cash on Delivery selected. Pay {formatPrice(totals.total)} on delivery.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
