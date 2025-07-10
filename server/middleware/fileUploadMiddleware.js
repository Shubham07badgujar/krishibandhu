const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure loan documents directory exists
const loanDocsDir = path.join(__dirname, '../uploads/loan-documents');
if (!fs.existsSync(loanDocsDir)) {
  fs.mkdirSync(loanDocsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, loanDocsDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with user ID and timestamp
    const userId = req.user._id;
    const timestamp = Date.now();
    const fileExt = path.extname(file.originalname);
    const uniqueFilename = `${userId}_${timestamp}${fileExt}`;
    cb(null, uniqueFilename);
  }
});

// File filter
const fileFilter = function (req, file, cb) {
  // Accept images and PDFs
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format. Please upload an image (JPG, PNG) or PDF'), false);
  }
};

// Set up multer
const uploadLoanDocuments = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max size
  },
  fileFilter: fileFilter
}).any(); // Accept any field name to support document type fields

// Middleware for handling file uploads
const handleLoanDocumentUpload = (req, res, next) => {
  uploadLoanDocuments(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred (e.g., file too large)
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`
      });
    }
      // If files were uploaded, add file info to request body
    if (req.files && req.files.length > 0) {
      try {
        console.log('Files uploaded:', req.files);
        console.log('Document types:', req.body.documentTypes);
        
        let documentTypesMap = {};
        if (req.body.documentTypes) {
          try {
            documentTypesMap = JSON.parse(req.body.documentTypes);
            console.log('Parsed document types:', documentTypesMap);
          } catch (parseError) {
            console.error('Error parsing documentTypes:', parseError);
          }
        }
        
        const documentInfo = req.files.map(file => ({
          name: file.originalname,
          path: file.filename,
          type: file.mimetype,
          size: file.size,
          // Try to determine document type from the mapping or fieldname
          documentType: (documentTypesMap && documentTypesMap[file.originalname]) || 
                        (file.fieldname !== 'documents' ? file.fieldname : 'other')
        }));
        
        req.documentInfo = documentInfo;
        console.log('Processed documents:', documentInfo);
      } catch (error) {
        console.error('Error processing document info:', error);
      }
    }
    
    next();
  });
};

module.exports = { handleLoanDocumentUpload };
