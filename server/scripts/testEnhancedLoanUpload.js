/**
 * Test script for enhanced loan document upload
 * 
 * This script tests the upload of loan documents with document type metadata
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
require('dotenv').config();

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const TEST_IMAGE_PATH = path.join(__dirname, 'test-image.png');
const TEST_TOKEN = process.env.TEST_TOKEN; // Set your test token in .env

if (!TEST_TOKEN) {
  console.error('TEST_TOKEN is required in your .env file');
  process.exit(1);
}

if (!fs.existsSync(TEST_IMAGE_PATH)) {
  console.error(`Test image not found at ${TEST_IMAGE_PATH}`);
  process.exit(1);
}

async function testEnhancedLoanUpload() {
  try {
    console.log('Testing enhanced loan document upload...');
    
    // Create form data with multiple documents
    const formData = new FormData();
    
    // Add loan application fields
    formData.append('type', 'cropLoan');
    formData.append('purpose', 'For testing enhanced document uploads');
    formData.append('amount', 50000);
    formData.append('tenure', 12);
    formData.append('interestRate', 7);
    formData.append('landArea', 5);
    
    // Add address information
    formData.append('address.street', '123 Farm Street');
    formData.append('address.village', 'Test Village');
    formData.append('address.district', 'Test District');
    formData.append('address.state', 'Test State');
    formData.append('address.pincode', '123456');
    
    // Create document types mapping
    const documentTypes = {
      'aadhar': 'aadharCard',
      'pan': 'panCard', 
      'land': 'landDocument'
    };
    
    formData.append('documentTypes', JSON.stringify(documentTypes));
    
    // Append files with different field names
    formData.append('aadhar', fs.createReadStream(TEST_IMAGE_PATH));
    formData.append('pan', fs.createReadStream(TEST_IMAGE_PATH));
    formData.append('land', fs.createReadStream(TEST_IMAGE_PATH));
    
    console.log('Sending loan application with documents...');
    
    // Make the API request
    const response = await axios.post(`${API_URL}/loans/apply`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    // Check the response
    if (response.data.success) {
      console.log('✓ Loan application submitted successfully!');
      console.log(`✓ Loan ID: ${response.data.data._id}`);
      console.log('✓ Document information included in response:', 
        JSON.stringify(response.data.data.documents, null, 2));
    } else {
      console.error('✗ Loan application failed:', response.data.message);
    }
    
  } catch (error) {
    console.error('✗ Error during test:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Execute the test
testEnhancedLoanUpload();
