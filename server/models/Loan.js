const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["cropLoan", "equipmentLoan", "landLoan"], 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  interestRate: { 
    type: Number, 
    required: true 
  },
  tenure: { 
    type: Number, 
    required: true, 
    comment: "Tenure in months" 
  },
  emi: {
    type: Number,
    required: true 
  },
  purpose: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected", "active", "completed"], 
    default: "pending" 
  },
  applicationDate: { 
    type: Date, 
    default: Date.now 
  },
  disbursedDate: { 
    type: Date 
  },
  dueDate: { 
    type: Date 
  },
  remainingAmount: { 
    type: Number 
  },
  nextPaymentDate: { 
    type: Date 
  },  documents: [{
    name: { type: String },
    path: { type: String },
    type: { type: String },
    size: { type: Number },
    documentType: { 
      type: String, 
      enum: ['aadharCard', 'panCard', 'bankStatement', 'landDocument', 'incomeProof', 'bankPassbook', 'other']
    }
  }],
  address: {
    street: { type: String },
    village: { type: String },
    district: { type: String },
    state: { type: String },
    pincode: { type: String }
  },
  notes: { 
    type: String 
  }
});

module.exports = mongoose.model("Loan", loanSchema);
