const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");
const mongoose = require("mongoose");

// @desc Create new order
// @route POST /api/orders
// @access Private
const createOrder = async (req, res) => {
  try {
    const {
      items,
      deliveryAddress,
      paymentMethod,
      upiId,
      specialInstructions
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required"
      });
    }

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required"
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required"
      });
    }

    // Validate UPI ID if UPI payment is selected
    if (paymentMethod === 'upi' && !upiId) {
      return res.status(400).json({
        success: false,
        message: "UPI ID is required for UPI payments"
      });
    }

    let totalAmount = 0;
    const orderItems = [];
    const sellerIds = new Set();

    // Process each item and validate
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.productId} is not available`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}. Available: ${product.stock}`
        });
      }

      const itemTotal = product.finalPrice * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        productId: product._id,
        title: product.title,
        price: product.finalPrice,
        quantity: item.quantity,
        unit: product.unit,
        image: product.images[0] || '',
        totalPrice: itemTotal
      });

      sellerIds.add(product.sellerId.toString());
    }

    // For now, we'll create separate orders for each seller
    // In a real-world scenario, you might want to handle multi-seller orders differently
    const orders = [];

    for (const sellerId of sellerIds) {
      const sellerItems = orderItems.filter(item => {
        // We need to find the product to get sellerId
        return items.find(originalItem => 
          originalItem.productId === item.productId.toString()
        );
      });

      // Get actual seller items with proper filtering
      const actualSellerItems = [];
      let sellerTotal = 0;

      for (const item of orderItems) {
        const product = await Product.findById(item.productId);
        if (product.sellerId.toString() === sellerId) {
          actualSellerItems.push(item);
          sellerTotal += item.totalPrice;
        }
      }

      if (actualSellerItems.length === 0) continue;

      // Calculate delivery charges (can be made dynamic)
      const deliveryCharges = sellerTotal > 500 ? 0 : 50;
      const taxes = Math.round(sellerTotal * 0.05); // 5% GST
      const finalTotal = sellerTotal + deliveryCharges + taxes;

      const order = new Order({
        buyerId: req.user.id,
        sellerId: sellerId,
        items: actualSellerItems,
        orderSummary: {
          subtotal: sellerTotal,
          deliveryCharges,
          taxes,
          discount: 0,
          totalAmount: finalTotal
        },
        deliveryAddress,
        paymentDetails: {
          method: paymentMethod,
          status: paymentMethod === 'cod' ? 'pending' : 'pending',
          upiId: paymentMethod === 'upi' ? upiId : undefined,
          amount: finalTotal
        },
        orderStatus: {
          current: 'placed',
          history: [{
            status: 'placed',
            timestamp: new Date(),
            note: 'Order placed successfully'
          }]
        }
      });

      // Calculate estimated delivery
      order.calculateEstimatedDelivery();

      await order.save();
      orders.push(order);

      // Update product stock
      for (const item of actualSellerItems) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      }
    }

    // Clear user's cart after successful order
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { items: [], totalItems: 0, estimatedTotal: 0 } },
      { upsert: true }
    );

    // Populate order details
    const populatedOrders = await Order.find({
      _id: { $in: orders.map(o => o._id) }
    })
    .populate('buyerId', 'name email phone')
    .populate('sellerId', 'name email phone village district state')
    .populate('items.productId', 'title category');

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: populatedOrders
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
};

// @desc Get user's orders
// @route GET /api/orders
// @access Private
const getUserOrders = async (req, res) => {
  try {
    const {
      role = 'buyer', // 'buyer' or 'seller'
      status,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};
    
    if (role === 'buyer') {
      filter.buyerId = req.user.id;
    } else {
      filter.sellerId = req.user.id;
    }

    if (status) {
      filter['orderStatus.current'] = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('buyerId', 'name email phone village district state')
      .populate('sellerId', 'name email phone village district state')
      .populate('items.productId', 'title category images');

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalOrders: total
        }
      }
    });

  } catch (error) {
    console.error("Get User Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

// @desc Get order by ID
// @route GET /api/orders/:orderId
// @access Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      $or: [
        { orderId: req.params.orderId },
        { _id: req.params.orderId }
      ]
    })
    .populate('buyerId', 'name email phone village district state')
    .populate('sellerId', 'name email phone village district state')
    .populate('items.productId', 'title category images specifications');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if user has access to this order
    const userId = req.user.id;
    if (order.buyerId._id.toString() !== userId && order.sellerId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message
    });
  }
};

// @desc Update order status
// @route PUT /api/orders/:orderId/status
// @access Private (Seller only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note, trackingNumber, deliveryPartner } = req.body;

    const order = await Order.findOne({
      $or: [
        { orderId: req.params.orderId },
        { _id: req.params.orderId }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if user is the seller of this order
    if (order.sellerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only sellers can update order status"
      });
    }

    // Validate status transition
    const validStatuses = [
      "placed", "confirmed", "processing", "ready_to_ship", 
      "shipped", "out_for_delivery", "delivered", "cancelled"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    // Update order status
    await order.updateStatus(status, note, req.user.id);

    // Update delivery details if provided
    if (trackingNumber) {
      order.deliveryDetails.trackingNumber = trackingNumber;
    }
    if (deliveryPartner) {
      order.deliveryDetails.deliveryPartner = deliveryPartner;
    }

    // Set delivery date if order is delivered
    if (status === 'delivered') {
      order.deliveryDetails.actualDelivery = new Date();
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email');

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder
    });

  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
};

// @desc Process payment
// @route POST /api/orders/:orderId/payment
// @access Private
const processPayment = async (req, res) => {
  try {
    const { transactionId, paymentMethod, amount } = req.body;

    const order = await Order.findOne({
      $or: [
        { orderId: req.params.orderId },
        { _id: req.params.orderId }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if user is the buyer
    if (order.buyerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Validate payment amount
    if (amount !== order.orderSummary.totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch"
      });
    }

    // Update payment details
    order.paymentDetails.status = 'completed';
    order.paymentDetails.transactionId = transactionId;
    order.paymentDetails.paidAt = new Date();
    order.paymentDetails.amount = amount;

    // Update order status to confirmed
    if (order.orderStatus.current === 'placed') {
      await order.updateStatus('confirmed', 'Payment completed successfully');
    }

    await order.save();

    res.json({
      success: true,
      message: "Payment processed successfully",
      data: {
        orderId: order.orderId,
        paymentStatus: order.paymentDetails.status,
        transactionId: order.paymentDetails.transactionId
      }
    });

  } catch (error) {
    console.error("Process Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process payment",
      error: error.message
    });
  }
};

// @desc Cancel order
// @route PUT /api/orders/:orderId/cancel
// @access Private
const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findOne({
      $or: [
        { orderId: req.params.orderId },
        { _id: req.params.orderId }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if user has permission to cancel
    const userId = req.user.id;
    if (order.buyerId.toString() !== userId && order.sellerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Check if order can be cancelled
    const nonCancellableStatuses = ['shipped', 'out_for_delivery', 'delivered', 'cancelled'];
    if (nonCancellableStatuses.includes(order.orderStatus.current)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order in ${order.orderStatus.current} status`
      });
    }

    // Update order status
    await order.updateStatus('cancelled', reason || 'Order cancelled by user', userId);

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    // Handle refund for paid orders
    if (order.paymentDetails.status === 'completed') {
      order.paymentDetails.status = 'refunded';
      await order.save();
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    });

  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message
    });
  }
};

// @desc Get order statistics
// @route GET /api/orders/stats
// @access Private
const getOrderStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { role = 'seller' } = req.query;

    const matchField = role === 'seller' ? 'sellerId' : 'buyerId';
    
    const stats = await Order.aggregate([
      { $match: { [matchField]: userId } },
      {
        $group: {
          _id: '$orderStatus.current',
          count: { $sum: 1 },
          totalAmount: { $sum: '$orderSummary.totalAmount' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments({ [matchField]: userId });
    const totalRevenue = await Order.aggregate([
      { $match: { [matchField]: userId, 'paymentDetails.status': 'completed' } },
      { $group: { _id: null, total: { $sum: '$orderSummary.totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        statusBreakdown: stats,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });

  } catch (error) {
    console.error("Get Order Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order statistics",
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  processPayment,
  cancelOrder,
  getOrderStats
};
