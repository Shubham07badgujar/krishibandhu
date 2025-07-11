const Product = require("../models/Product");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const mongoose = require("mongoose");

// =====================
// PRODUCT CONTROLLERS
// =====================

// Get all products with filters
const getProducts = async (req, res) => {
  try {
    const { 
      type, 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      location, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1, 
      limit = 12 
    } = req.query;

    // Build filter object
    const filter = { isActive: true, isApproved: true };
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (location) {
      filter.$or = [
        { "location.district": new RegExp(location, 'i') },
        { "location.state": new RegExp(location, 'i') },
        { "location.village": new RegExp(location, 'i') }
      ];
    }
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .populate('sellerId', 'fullName phoneNumber location avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalProducts,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(id)
      .populate('sellerId', 'fullName phoneNumber location avatar email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Increment view count
    await Product.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      sellerId: req.user.id,
      images: req.files ? req.files.map(file => file.path) : []
    };

    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'type', 'price', 'stock', 'unit'];
    const missingFields = requiredFields.filter(field => !productData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    if (productData.images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required"
      });
    }

    const newProduct = new Product(productData);
    await newProduct.save();

    const populatedProduct = await Product.findById(newProduct._id)
      .populate('sellerId', 'fullName phoneNumber location');

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: populatedProduct
    });

  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check if user owns the product
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product"
      });
    }

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('sellerId', 'fullName phoneNumber location');

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });

  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check if user owns the product
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product"
      });
    }

    // Soft delete by setting isActive to false
    await Product.findByIdAndUpdate(id, { isActive: false });

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message
    });
  }
};

// Get user's products (for sellers)
const getMyProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;
    
    const filter = { sellerId: req.user.id };
    if (status !== 'all') {
      filter.isActive = status === 'active';
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalProducts,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error("Get my products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your products",
      error: error.message
    });
  }
};

// =====================
// CART CONTROLLERS
// =====================

// Get user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate({
        path: 'items.productId',
        select: 'title price images stock unit sellerId isActive',
        populate: {
          path: 'sellerId',
          select: 'fullName'
        }
      });

    if (!cart) {
      return res.json({
        success: true,
        data: { items: [], totalItems: 0, totalAmount: 0 }
      });
    }

    // Filter out inactive products and calculate totals
    const activeItems = cart.items.filter(item => 
      item.productId && item.productId.isActive
    );

    const totalItems = activeItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = activeItems.reduce((sum, item) => 
      sum + (item.productId.price * item.quantity), 0
    );

    res.json({
      success: true,
      data: {
        items: activeItems,
        totalItems,
        totalAmount: totalAmount.toFixed(2)
      }
    });

  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error.message
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found or inactive"
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available"
      });
    }

    // Prevent sellers from adding their own products
    if (product.sellerId.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot add your own product to cart"
      });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId: req.user.id,
        items: [{ productId, quantity }]
      });
    } else {
      // Check if item already exists in cart
      const existingItem = cart.items.find(item => 
        item.productId.toString() === productId
      );

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          return res.status(400).json({
            success: false,
            message: "Cannot add more items than available stock"
          });
        }
        existingItem.quantity = newQuantity;
      } else {
        // Add new item
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();

    // Populate cart for response
    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.productId',
        select: 'title price images stock unit',
        populate: {
          path: 'sellerId',
          select: 'fullName'
        }
      });

    res.json({
      success: true,
      message: "Item added to cart successfully",
      data: populatedCart
    });

  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
      error: error.message
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const item = cart.items.find(item => 
      item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    // Check stock availability
    const product = await Product.findById(productId);
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available"
      });
    }

    item.quantity = quantity;
    await cart.save();

    // Populate cart for response
    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.productId',
        select: 'title price images stock unit',
        populate: {
          path: 'sellerId',
          select: 'fullName'
        }
      });

    res.json({
      success: true,
      message: "Cart updated successfully",
      data: populatedCart
    });

  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(item => 
      item.productId.toString() !== productId
    );

    await cart.save();

    // Populate cart for response
    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.productId',
        select: 'title price images stock unit',
        populate: {
          path: 'sellerId',
          select: 'fullName'
        }
      });

    res.json({
      success: true,
      message: "Item removed from cart successfully",
      data: populatedCart
    });

  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
      error: error.message
    });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { items: [] },
      { new: true }
    );

    res.json({
      success: true,
      message: "Cart cleared successfully"
    });

  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message
    });
  }
};

// =====================
// ORDER CONTROLLERS
// =====================

// Create a new order
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      items, 
      shippingAddress, 
      paymentMethod, 
      totalAmount,
      couponCode 
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required"
      });
    }

    if (!shippingAddress || !paymentMethod || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Shipping address, payment method, and total amount are required"
      });
    }

    // Validate products exist and have sufficient stock
    const productIds = items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    
    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some products in the order do not exist"
      });
    }

    // Check stock availability
    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.productId);
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.title}`
        });
      }
    }

    // Generate order number
    const orderNumber = `KR${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create order
    const order = new Order({
      orderNumber,
      buyer: userId,
      items: items.map(item => {
        const product = products.find(p => p._id.toString() === item.productId);
        return {
          product: item.productId,
          seller: product.seller,
          quantity: item.quantity,
          price: product.price,
          title: product.title,
          image: product.images[0] || ""
        };
      }),
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
      status: 'confirmed',
      couponCode
    });

    await order.save();

    // Update product stock quantities
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: -item.quantity } }
      );
    }

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [] }
    );

    // Populate order details
    await order.populate([
      { path: 'buyer', select: 'name email phone' },
      { path: 'items.product', select: 'title price images category' },
      { path: 'items.seller', select: 'name email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order
    });

  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
};

// Get user's orders
const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { buyer: userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate([
        { path: 'buyer', select: 'name email phone' },
        { path: 'items.product', select: 'title price images category' },
        { path: 'items.seller', select: 'name email phone' }
      ])
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    });

  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      _id: id,
      buyer: userId
    }).populate([
      { path: 'buyer', select: 'name email phone' },
      { path: 'items.product', select: 'title price images category' },
      { path: 'items.seller', select: 'name email phone' }
    ]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message
    });
  }
};

// Update order status (for sellers)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    // Find order and check if user is seller of any items
    const order = await Order.findById(id).populate('items.seller');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if user is seller of any item in this order
    const isSeller = order.items.some(item => 
      item.seller._id.toString() === userId
    );

    if (!isSeller) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this order"
      });
    }

    // Update order status
    order.status = status;
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }
    
    await order.save();

    // Populate order details
    await order.populate([
      { path: 'buyer', select: 'name email phone' },
      { path: 'items.product', select: 'title price images category' },
      { path: 'items.seller', select: 'name email phone' }
    ]);

    res.json({
      success: true,
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
};

module.exports = {
  // Product controllers
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  
  // Cart controllers
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  
  // Order controllers
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};
