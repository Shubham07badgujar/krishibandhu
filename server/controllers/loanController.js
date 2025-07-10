const Loan = require("../models/Loan");
const User = require("../models/User");
const { sendLoanStatusEmail } = require("../services/emailService");
const { createSystemNotification } = require("./notificationController");

/**
 * Get all available loan types and their details
 */
exports.getLoanTypes = async (req, res) => {
  try {
    // Define the loan types with their details
    // In a production environment, this might come from a database
    const loanTypes = [
      {
        id: 'cropLoan',
        interestRate: 7,
        maxAmount: 300000,
        maxDuration: 12 // months
      },
      {
        id: 'equipmentLoan',
        interestRate: 8.5,
        maxAmount: 1000000,
        maxDuration: 84 // months
      },
      {
        id: 'landLoan',
        interestRate: 9,
        maxAmount: 2500000,
        maxDuration: 180 // months
      }
    ];

    res.status(200).json({
      success: true,
      data: loanTypes
    });
  } catch (error) {
    console.error("Error in getLoanTypes:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching loan types",
      error: error.message
    });
  }
};

/**
 * Get all loans for a user
 */
exports.getUserLoans = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Verify that the user is requesting their own loans or is an admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these loans"
      });
    }
    
    const loans = await Loan.find({ userId });
    
    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    console.error("Error in getUserLoans:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user loans",
      error: error.message
    });
  }
};

/**
 * Get a specific loan by ID
 */
exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found"
      });
    }
    
    // Verify that the user is requesting their own loan or is an admin
    if (req.user._id.toString() !== loan.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this loan"
      });
    }
    
    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (error) {
    console.error("Error in getLoanById:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching loan",
      error: error.message
    });
  }
};

/**
 * Apply for a new loan
 */
exports.applyForLoan = async (req, res) => {
  try {
    // Add the user ID from the authenticated request
    req.body.userId = req.user._id;
    
    // Calculate EMI
    const { amount, interestRate, tenure } = req.body;
    const monthlyRate = interestRate / 100 / 12;
    const emi = amount * monthlyRate * 
      Math.pow(1 + monthlyRate, tenure) / 
      (Math.pow(1 + monthlyRate, tenure) - 1);
    
    // Round the EMI to a whole number
    req.body.emi = Math.round(emi);
    
    // Process document information if available from middleware
    if (req.documentInfo && req.documentInfo.length > 0) {
      req.body.documents = req.documentInfo;
    }
    
    // Handle address information
    if (req.body['address.street'] || req.body['address.village'] || 
        req.body['address.district'] || req.body['address.state'] || req.body['address.pincode']) {
      req.body.address = {
        street: req.body['address.street'] || '',
        village: req.body['address.village'] || '',
        district: req.body['address.district'] || '',
        state: req.body['address.state'] || '',
        pincode: req.body['address.pincode'] || ''
      };
      
      // Remove the flattened address fields
      delete req.body['address.street'];
      delete req.body['address.village'];
      delete req.body['address.district'];
      delete req.body['address.state'];
      delete req.body['address.pincode'];
    }
      // Create a new loan application
    const loan = await Loan.create(req.body);
    
    // Get user details for notification
    const user = await User.findById(req.user._id);
    
    // Send notification to all admins
    await createSystemNotification({
      message: `New loan application submitted by ${user.name} for ${req.body.type} of amount ₹${req.body.amount}`,
      forRole: 'admin',
      type: 'loan_application',
      referenceId: loan._id.toString()
    });
    
    res.status(201).json({
      success: true,
      data: loan,
      message: "Loan application submitted successfully"
    });
  } catch (error) {
    console.error("Error in applyForLoan:", error);
    res.status(500).json({
      success: false,
      message: "Server error while applying for loan",
      error: error.message
    });
  }
};

/**
 * Update loan status (for admin use)
 */
exports.updateLoanStatus = async (req, res) => {
  try {
    // Only admins can update loan status
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update loan status"
      });
    }
    
    const { status } = req.body;
    const loanId = req.params.id;
    
    // Find and update the loan
    const loan = await Loan.findById(loanId);
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found"
      });
    }
      // Update the loan status
    loan.status = status;
    
    // If the loan is approved, set disbursedDate and dueDate
    if (status === 'approved') {
      loan.status = 'active';
      loan.disbursedDate = new Date();
      
      // Calculate dueDate based on tenure (e.g., 12 months from now)
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + loan.tenure);
      loan.dueDate = dueDate;
      
      // Set remainingAmount to the full loan amount initially
      loan.remainingAmount = loan.amount;
      
      // Calculate next payment date (1 month from disbursement)
      const nextPaymentDate = new Date(loan.disbursedDate);
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      loan.nextPaymentDate = nextPaymentDate;
    }
    
    await loan.save();
      // Send email notification to the user about loan status change
    try {
      // Fetch the user details to get email
      const user = await User.findById(loan.userId);
      if (user) {
        await sendLoanStatusEmail(loan, user);
        
        // Create notification for the user
        let notificationMessage = '';
        if (status === 'approved' || status === 'active') {
          notificationMessage = `Your loan application for ${loan.type} (₹${loan.amount}) has been approved.`;
        } else if (status === 'rejected') {
          notificationMessage = `Your loan application for ${loan.type} (₹${loan.amount}) has been rejected.`;
        } else {
          notificationMessage = `Your loan application for ${loan.type} (₹${loan.amount}) status has been updated to ${status}.`;
        }
        
        await createSystemNotification({
          message: notificationMessage,
          forRole: 'user',
          userId: user._id,
          type: 'loan_status',
          referenceId: loan._id.toString()
        });
      }
    } catch (emailError) {
      console.error("Failed to send loan status email:", emailError);
      // Don't fail the request if email fails
    }
    
    res.status(200).json({
      success: true,
      data: loan,
      message: `Loan status updated to ${status}`
    });
  } catch (error) {
    console.error("Error in updateLoanStatus:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating loan status",
      error: error.message
    });
  }
};

/**
 * Record a loan payment
 */
exports.recordLoanPayment = async (req, res) => {
  try {
    const { amount } = req.body;
    const loanId = req.params.id;
    
    // Find the loan
    const loan = await Loan.findById(loanId);
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found"
      });
    }
    
    // Verify that the user is making payment on their own loan or is an admin
    if (req.user._id.toString() !== loan.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to make payments on this loan"
      });
    }
    
    // Update remaining amount
    loan.remainingAmount -= amount;
    
    // If remaining amount is zero or less, mark loan as completed
    if (loan.remainingAmount <= 0) {
      loan.status = 'completed';
      loan.remainingAmount = 0;
    } else {
      // Calculate next payment date (1 month from now)
      const nextPaymentDate = new Date();
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      loan.nextPaymentDate = nextPaymentDate;
    }
    
    await loan.save();
    
    res.status(200).json({
      success: true,
      data: loan,
      message: `Payment of ₹${amount} recorded successfully`
    });
  } catch (error) {
    console.error("Error in recordLoanPayment:", error);
    res.status(500).json({
      success: false,
      message: "Server error while recording payment",
      error: error.message
    });
  }
};

/**
 * Get all loans (admin only)
 */
exports.getAllLoans = async (req, res) => {
  try {
    // Verify that the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view all loans"
      });
    }
    
    // Optional filters from query params
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    
    const loans = await Loan.find(filter).populate('userId', 'name email phone');
    
    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    console.error("Error in getAllLoans:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching all loans",
      error: error.message
    });
  }
};

/**
 * Calculate loan EMI (no authentication required)
 */
exports.calculateLoanEMI = (req, res) => {
  try {
    const { principal, interestRate, tenure } = req.body;
    
    // Validate input
    if (!principal || !interestRate || !tenure) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: principal, interestRate, or tenure"
      });
    }
    
    // Convert annual interest rate to monthly rate
    const monthlyRate = interestRate / 100 / 12;
    
    // Calculate EMI using formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    const emi = principal * monthlyRate * 
      Math.pow(1 + monthlyRate, tenure) / 
      (Math.pow(1 + monthlyRate, tenure) - 1);
    
    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - principal;
    
    res.status(200).json({
      success: true,
      data: {
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalAmount: Math.round(totalAmount),
        monthlyBreakdown: calculateMonthlyBreakdown(principal, interestRate, tenure)
      }
    });
  } catch (error) {
    console.error("Error in calculateLoanEMI:", error);
    res.status(500).json({
      success: false,
      message: "Server error while calculating EMI",
      error: error.message
    });
  }
};

/**
 * Helper function to calculate the monthly breakdown of payments
 */
const calculateMonthlyBreakdown = (principal, interestRate, tenure) => {
  const monthlyRate = interestRate / 100 / 12;
  const emi = principal * monthlyRate * 
    Math.pow(1 + monthlyRate, tenure) / 
    (Math.pow(1 + monthlyRate, tenure) - 1);
  
  let remainingPrincipal = principal;
  const breakdown = [];
  
  for (let month = 1; month <= tenure; month++) {
    const interestForMonth = remainingPrincipal * monthlyRate;
    const principalForMonth = emi - interestForMonth;
    
    remainingPrincipal -= principalForMonth;
    
    breakdown.push({
      month,
      emi: Math.round(emi),
      principal: Math.round(principalForMonth),
      interest: Math.round(interestForMonth),
      remainingPrincipal: Math.round(remainingPrincipal)
    });
  }
  
  return breakdown;
};
