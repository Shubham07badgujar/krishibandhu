const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: [
      "seeds", 
      "fertilizers", 
      "pesticides", 
      "equipment", 
      "saplings",
      "crops", 
      "organic-products",
      "used-equipment",
      "other"
    ]
  },
  type: { 
    type: String, 
    required: true,
    enum: ["buy", "sell"], // buy = farming essentials, sell = agri products
    index: true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  originalPrice: { 
    type: Number,
    min: 0 
  },
  stock: { 
    type: Number, 
    required: true,
    min: 0,
    default: 1 
  },
  unit: { 
    type: String, 
    required: true,
    enum: ["kg", "g", "piece", "liter", "packet", "ton", "quintal", "bundle"]
  },
  images: [{ 
    type: String,
    required: true 
  }],
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true 
  },
  location: {
    village: String,
    district: String,
    state: String,
    pincode: String
  },
  specifications: {
    variety: String,
    brand: String,
    expiryDate: Date,
    organicCertified: { type: Boolean, default: false },
    harvestDate: Date,
    packagingDate: Date
  },
  tags: [String],
  isActive: { 
    type: Boolean, 
    default: true,
    index: true 
  },
  isApproved: { 
    type: Boolean, 
    default: true // Auto-approve for now
  },
  views: { 
    type: Number, 
    default: 0 
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  discount: {
    percentage: { type: Number, min: 0, max: 100, default: 0 },
    validTill: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ type: 1, category: 1, isActive: 1 });
productSchema.index({ sellerId: 1, isActive: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ price: 1 });
productSchema.index({ "location.district": 1, "location.state": 1 });

// Virtual for calculated price after discount
productSchema.virtual('finalPrice').get(function() {
  if (this.discount.percentage > 0 && this.discount.validTill > new Date()) {
    return this.price * (1 - this.discount.percentage / 100);
  }
  return this.price;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
