const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  category: {
    type: String,
    enum: ["Subsidy", "Insurance", "Credit", "Other"],
  },
  state: String,
  eligibility: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Scheme", schemeSchema);
