const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    unique: true,
    index: true 
  },
  items: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product", 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1,
      default: 1 
    },
    addedAt: { 
      type: Date, 
      default: Date.now 
    },
    selectedVariant: {
      weight: String,
      size: String,
      color: String
    }
  }],
  totalItems: {
    type: Number,
    default: 0
  },
  estimatedTotal: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity = 1, selectedVariant = {}) {
  const existingItem = this.items.find(item => 
    item.productId.toString() === productId.toString()
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      productId,
      quantity,
      selectedVariant,
      addedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(item => 
    item.productId.toString() === productId.toString()
  );
  
  if (item) {
    if (quantity <= 0) {
      this.items = this.items.filter(item => 
        item.productId.toString() !== productId.toString()
      );
    } else {
      item.quantity = quantity;
    }
  }
  
  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => 
    item.productId.toString() !== productId.toString()
  );
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.totalItems = 0;
  this.estimatedTotal = 0;
  return this.save();
};

module.exports = mongoose.model("Cart", cartSchema);
