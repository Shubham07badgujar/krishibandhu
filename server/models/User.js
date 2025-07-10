const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  village: { type: String },
  district: { type: String },
  state: { type: String },
  phone: { type: String },
  primaryCrop: { type: String },
  googleId: { type: String },
  savedSchemes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scheme" }],
  bookmarkedCities: [{ type: String }],
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
