const path = require('path');
const fs = require('fs');
const Loan = require("../models/Loan");

/**
 * Get a document file by path
 */
exports.getDocument = async (req, res) => {
  try {
    const { loanId, documentPath } = req.params;
    
    // Security check: Verify this document belongs to the requested loan
    const loan = await Loan.findById(loanId);
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found"
      });
    }
    
    // Check if user is authorized (admin or the loan owner)
    if (req.user.role !== 'admin' && req.user._id.toString() !== loan.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this document"
      });
    }
    
    // Verify the requested document belongs to this loan
    const documentExists = loan.documents.some(doc => doc.path === documentPath);
    
    if (!documentExists) {
      return res.status(404).json({
        success: false,
        message: "Document not found or does not belong to this loan"
      });
    }
    
    // Get file path
    const filePath = path.join(__dirname, '../uploads/loan-documents', documentPath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server"
      });
    }
    
    // Send the file
    return res.sendFile(filePath);
  } catch (error) {
    console.error("Error in getDocument:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving document",
      error: error.message
    });
  }
};

/**
 * Get document metadata
 */
exports.getDocumentInfo = async (req, res) => {
  try {
    const { loanId, documentPath } = req.params;
    
    // Security check: Verify this document belongs to the requested loan
    const loan = await Loan.findById(loanId);
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found"
      });
    }
    
    // Check if user is authorized (admin or the loan owner)
    if (req.user.role !== 'admin' && req.user._id.toString() !== loan.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this document"
      });
    }
    
    // Find the requested document
    const document = loan.documents.find(doc => doc.path === documentPath);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found or does not belong to this loan"
      });
    }
    
    // Get file path and check if it exists
    const filePath = path.join(__dirname, '../uploads/loan-documents', documentPath);
    let exists = false;
    
    try {
      exists = fs.existsSync(filePath);
    } catch (err) {
      console.error('Error checking file existence:', err);
    }
    
    return res.status(200).json({
      success: true,
      data: {
        ...document.toObject(),
        exists
      }
    });
  } catch (error) {
    console.error("Error in getDocumentInfo:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving document info",
      error: error.message
    });
  }
};
