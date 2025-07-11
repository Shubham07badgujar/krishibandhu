const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
  },
  buyerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true 
  },
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true 
  },
  items: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product", 
      required: true 
    },
    title: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: String,
    image: String,
    totalPrice: { type: Number, required: true }
  }],
  orderSummary: {
    subtotal: { type: Number, required: true },
    deliveryCharges: { type: Number, default: 0 },
    taxes: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true }
  },
  deliveryAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    addressLine1: { type: String, required: true },
    addressLine2: String,
    village: String,
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: String
  },
  paymentDetails: {
    method: { 
      type: String, 
      enum: ["cod", "upi", "razorpay", "bank_transfer"], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["pending", "completed", "failed", "refunded"], 
      default: "pending",
      index: true 
    },
    transactionId: String,
    upiId: String,
    paidAt: Date,
    amount: Number
  },
  orderStatus: {
    current: { 
      type: String, 
      enum: [
        "placed", 
        "confirmed", 
        "processing", 
        "ready_to_ship", 
        "shipped", 
        "out_for_delivery", 
        "delivered", 
        "cancelled", 
        "returned"
      ], 
      default: "placed",
      index: true 
    },
    history: [{
      status: String,
      timestamp: { type: Date, default: Date.now },
      note: String,
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }]
  },
  deliveryDetails: {
    estimatedDelivery: Date,
    actualDelivery: Date,
    trackingNumber: String,
    deliveryPartner: String,
    deliveryNotes: String
  },
  communication: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ["message", "status_update", "system"], default: "message" }
  }],
  rating: {
    buyerRating: {
      rating: { type: Number, min: 1, max: 5 },
      review: String,
      ratedAt: Date
    },
    sellerRating: {
      rating: { type: Number, min: 1, max: 5 },
      review: String,
      ratedAt: Date
    }
  },
  metadata: {
    source: { type: String, default: "web" },
    deviceInfo: String,
    ipAddress: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ sellerId: 1, createdAt: -1 });
orderSchema.index({ "orderStatus.current": 1, createdAt: -1 });
orderSchema.index({ "paymentDetails.status": 1 });
orderSchema.index({ orderId: 1 });

// Pre-save middleware to update status history
orderSchema.pre('save', function(next) {
  if (this.isModified('orderStatus.current') && !this.isNew) {
    this.orderStatus.history.push({
      status: this.orderStatus.current,
      timestamp: new Date(),
      note: `Order status updated to ${this.orderStatus.current}`
    });
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.orderStatus.current = newStatus;
  this.orderStatus.history.push({
    status: newStatus,
    timestamp: new Date(),
    note: note,
    updatedBy: updatedBy
  });
  return this.save();
};

// Method to calculate estimated delivery
orderSchema.methods.calculateEstimatedDelivery = function() {
  const baseDeliveryDays = 3; // Base delivery time
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + baseDeliveryDays);
  this.deliveryDetails.estimatedDelivery = estimatedDate;
  return estimatedDate;
};

module.exports = mongoose.model("Order", orderSchema);
