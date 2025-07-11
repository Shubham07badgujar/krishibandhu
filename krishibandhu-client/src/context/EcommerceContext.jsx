import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const EcommerceContext = createContext();

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_PRODUCT: 'SET_PRODUCT',
  SET_CART: 'SET_CART',
  SET_CART_COUNT: 'SET_CART_COUNT',
  SET_ORDERS: 'SET_ORDERS',
  SET_ORDER: 'SET_ORDER',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_FILTERS: 'SET_FILTERS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_TO_CART_SUCCESS: 'ADD_TO_CART_SUCCESS',
  REMOVE_FROM_CART_SUCCESS: 'REMOVE_FROM_CART_SUCCESS',
  UPDATE_CART_SUCCESS: 'UPDATE_CART_SUCCESS'
};

// Initial state
const initialState = {
  loading: false,
  products: [],
  product: null,
  cart: { items: [], summary: {} },
  cartCount: 0,
  orders: [],
  order: null,
  categories: [],
  filters: {
    type: '',
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  },
  error: null
};

// Reducer function
const ecommerceReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_PRODUCTS:
      return { 
        ...state, 
        products: action.payload.products,
        pagination: action.payload.pagination,
        loading: false 
      };
    
    case ActionTypes.SET_PRODUCT:
      return { ...state, product: action.payload, loading: false };
    
    case ActionTypes.SET_CART:
      return { ...state, cart: action.payload, loading: false };
    
    case ActionTypes.SET_CART_COUNT:
      return { ...state, cartCount: action.payload };
    
    case ActionTypes.SET_ORDERS:
      return { ...state, orders: action.payload, loading: false };
    
    case ActionTypes.SET_ORDER:
      return { ...state, order: action.payload, loading: false };
    
    case ActionTypes.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    
    case ActionTypes.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ActionTypes.ADD_TO_CART_SUCCESS:
      return { 
        ...state, 
        cartCount: state.cartCount + action.payload.quantity,
        loading: false 
      };
    
    case ActionTypes.REMOVE_FROM_CART_SUCCESS:
      return { ...state, loading: false };
    
    case ActionTypes.UPDATE_CART_SUCCESS:
      return { ...state, loading: false };
    
    default:
      return state;
  }
};

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

export const EcommerceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ecommerceReducer, initialState);
  const { user, token } = useAuth();

  // Set auth token for API requests
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load cart count on user login
  useEffect(() => {
    if (user && token) {
      getCartCount();
    }
  }, [user, token]);

  // API functions
  const setLoading = (loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  // Products
  const getProducts = async (filters = {}, page = 1, limit = 12) => {
    try {
      setLoading(true);
      clearError();
      
      const params = { ...filters, page, limit };
      const response = await api.get('/products', { params });
      
      dispatch({ 
        type: ActionTypes.SET_PRODUCTS, 
        payload: response.data.data 
      });
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch products');
      throw error;
    }
  };

  const getProductById = async (id) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.get(`/products/${id}`);
      dispatch({ type: ActionTypes.SET_PRODUCT, payload: response.data.data });
      
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch product');
      throw error;
    }
  };

  const addProduct = async (productData) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.post('/products', productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add product');
      throw error;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.put(`/products/${id}`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update product');
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.delete(`/products/${id}`);
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete product');
      throw error;
    }
  };

  const getMyProducts = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.get('/products/my/products', {
        params: { page, limit }
      });
      
      setLoading(false);
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch your products');
      throw error;
    }
  };

  const getCategories = async (type = '') => {
    try {
      const response = await api.get('/products/categories', {
        params: type ? { type } : {}
      });
      
      dispatch({ type: ActionTypes.SET_CATEGORIES, payload: response.data.data });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Cart functions
  const getCart = async () => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.get('/cart');
      dispatch({ type: ActionTypes.SET_CART, payload: response.data.data });
      
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch cart');
      throw error;
    }
  };

  const addToCart = async (productId, quantity = 1, selectedVariant = {}) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.post('/cart/add', {
        productId,
        quantity,
        selectedVariant
      });
      
      dispatch({ 
        type: ActionTypes.ADD_TO_CART_SUCCESS, 
        payload: { quantity } 
      });
      
      // Update cart count
      await getCartCount();
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add item to cart');
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.put('/cart/update', {
        productId,
        quantity
      });
      
      dispatch({ type: ActionTypes.UPDATE_CART_SUCCESS });
      
      // Refresh cart and count
      await getCart();
      await getCartCount();
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update cart');
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.delete(`/cart/remove/${productId}`);
      
      dispatch({ type: ActionTypes.REMOVE_FROM_CART_SUCCESS });
      
      // Refresh cart and count
      await getCart();
      await getCartCount();
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to remove item from cart');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.delete('/cart/clear');
      
      dispatch({ type: ActionTypes.SET_CART, payload: { items: [], summary: {} } });
      dispatch({ type: ActionTypes.SET_CART_COUNT, payload: 0 });
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to clear cart');
      throw error;
    }
  };

  const getCartCount = async () => {
    try {
      const response = await api.get('/cart/count');
      dispatch({ 
        type: ActionTypes.SET_CART_COUNT, 
        payload: response.data.data.count 
      });
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  };

  // Orders
  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.post('/orders', orderData);
      
      // Clear cart after successful order
      dispatch({ type: ActionTypes.SET_CART, payload: { items: [], summary: {} } });
      dispatch({ type: ActionTypes.SET_CART_COUNT, payload: 0 });
      
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create order');
      throw error;
    }
  };

  const getOrders = async (role = 'buyer', page = 1, limit = 10) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.get('/orders', {
        params: { role, page, limit }
      });
      
      dispatch({ type: ActionTypes.SET_ORDERS, payload: response.data.data.orders });
      setLoading(false);
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch orders');
      throw error;
    }
  };

  const getOrderById = async (orderId) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.get(`/orders/${orderId}`);
      dispatch({ type: ActionTypes.SET_ORDER, payload: response.data.data });
      
      return response.data.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch order');
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, status, note = '', trackingNumber = '') => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.put(`/orders/${orderId}/status`, {
        status,
        note,
        trackingNumber
      });
      
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update order status');
      throw error;
    }
  };

  const processPayment = async (orderId, paymentData) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.post(`/orders/${orderId}/payment`, paymentData);
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Payment failed');
      throw error;
    }
  };

  const cancelOrder = async (orderId, reason = '') => {
    try {
      setLoading(true);
      clearError();
      
      const response = await api.put(`/orders/${orderId}/cancel`, { reason });
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cancel order');
      throw error;
    }
  };

  // Filter functions
  const setFilters = (filters) => {
    dispatch({ type: ActionTypes.SET_FILTERS, payload: filters });
  };

  const resetFilters = () => {
    dispatch({ type: ActionTypes.SET_FILTERS, payload: initialState.filters });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    clearError,
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getMyProducts,
    getCategories,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount,
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    processPayment,
    cancelOrder,
    setFilters,
    resetFilters
  };

  return (
    <EcommerceContext.Provider value={value}>
      {children}
    </EcommerceContext.Provider>
  );
};

export const useEcommerce = () => {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce must be used within an EcommerceProvider');
  }
  return context;
};

export default EcommerceContext;
