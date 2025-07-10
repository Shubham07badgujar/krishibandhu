const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  forRole: {
    type: String,
    enum: ["user", "admin", "all"],
    default: "all"
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null 
  },
  type: {
    type: String,
    enum: ["general", "loan_application", "loan_status"],
    default: "general"
  },
  referenceId: {
    type: String,
    default: null
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Notification", notificationSchema);
