const express = require("express");
const router = express.Router();
const { protect, restrictToAdmin } = require("../middleware/authMiddleware");
const { handleLoanDocumentUpload } = require("../middleware/fileUploadMiddleware");
const {
  getLoanTypes,
  getUserLoans,
  getLoanById,
  applyForLoan,
  updateLoanStatus,
  recordLoanPayment,
  getAllLoans,
  calculateLoanEMI
} = require("../controllers/loanController");
const { getDocument, getDocumentInfo } = require("../controllers/documentController");

// Public routes (no authentication required)
router.post("/calculate-emi", calculateLoanEMI);
router.get("/types", getLoanTypes);

// Protected routes (authentication required)
router.post("/apply", protect, handleLoanDocumentUpload, applyForLoan);
router.get("/user/:userId", protect, getUserLoans);
router.get("/:id", protect, getLoanById);
router.post("/:id/payment", protect, recordLoanPayment);

// Admin-only routes
router.get("/", protect, restrictToAdmin, getAllLoans);
router.put("/:id/status", protect, restrictToAdmin, updateLoanStatus);

// Document routes - accessible by admin or document owner
router.get("/:loanId/documents/:documentPath", protect, getDocument);
router.get("/:loanId/documents/:documentPath/info", protect, getDocumentInfo);

module.exports = router;
