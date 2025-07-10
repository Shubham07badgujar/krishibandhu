// Test file for loan document upload functionality
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Set up test environment
const baseUrl = 'http://localhost:5000';
let authToken = null;

// Function to authenticate a user
const authenticate = async () => {
  try {
    console.log('Authenticating user...');
    const response = await axios.post(`${baseUrl}/api/auth/login`, {
      email: 'admin@krishibandhu.com',
      password: 'admin123'
    });
    
    authToken = response.data.token;
    console.log('Authentication successful!');
  } catch (error) {
    console.error('Authentication failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

// Function to test file upload
const testFileUpload = async () => {
  try {
    console.log('Testing document upload...');
    
    // Create a form data instance
    const form = new FormData();
    
    // Add loan application data
    form.append('type', 'cropLoan');
    form.append('amount', '50000');
    form.append('interestRate', '7');
    form.append('tenure', '12');
    form.append('purpose', 'Test purpose for document upload functionality');
    
    // Add test documents to the form
    const testDocsDir = path.join(__dirname, 'test-docs');
    
    // Create test docs directory if it doesn't exist
    if (!fs.existsSync(testDocsDir)) {
      fs.mkdirSync(testDocsDir);
      
      // Create a simple text file for testing
      fs.writeFileSync(
        path.join(testDocsDir, 'test-document.txt'), 
        'This is a test document content.'
      );
      
      // Copy an image if available, otherwise create a simple text file as PDF
      try {
        const sourceImage = path.join(__dirname, 'test-image.png');
        if (fs.existsSync(sourceImage)) {
          fs.copyFileSync(
            sourceImage,
            path.join(testDocsDir, 'test-image.png')
          );
        } else {
          fs.writeFileSync(
            path.join(testDocsDir, 'test-pdf.txt'), 
            'This is a mock PDF content. In a real scenario, this would be a PDF file.'
          );
        }
      } catch (err) {
        console.warn('Could not copy test image:', err.message);
      }
    }
    
    // Read directory for test documents
    const files = fs.readdirSync(testDocsDir);
    
    if (files.length === 0) {
      console.warn('No test documents found. Create some files in the test-docs directory.');
      return;
    }
    
    // Add each file to the form data
    files.forEach(file => {
      const filePath = path.join(testDocsDir, file);
      console.log(`Adding file: ${file}`);
      form.append('documents', fs.createReadStream(filePath));
    });
    
    // Make API request
    const response = await axios.post(
      `${baseUrl}/api/loans/apply`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    console.log('\n✅ Document upload test successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Add instructions to test in the admin panel
    console.log('\nTo test the document viewer:');
    console.log('1. Login to the admin dashboard in your browser');
    console.log('2. Go to the Loan Management section');
    console.log('3. Find the test loan application you just created');
    console.log('4. Click on "View Details" to see the uploaded documents');
    console.log('5. Try clicking on a document to preview it');
    
  } catch (error) {
    console.error('\n❌ Document upload test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

// Run the test
(async () => {
  try {
    await authenticate();
    await testFileUpload();
  } catch (error) {
    console.error('Test execution failed:', error);
  }
})();
