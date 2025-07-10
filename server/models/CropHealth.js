const mongoose = require("mongoose");

const cropHealthSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  cropType: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  healthStatus: {
    type: String,
    enum: ["healthy", "moderate", "unhealthy"],
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  disease: {
    type: String
  },
  diseaseDescription: {
    type: String
  },
  recommendations: [{
    type: String
  }],
  fertilizers: [{
    name: { type: String },
    description: { type: String }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CropHealth", cropHealthSchema);