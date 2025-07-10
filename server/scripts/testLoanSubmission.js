/**
 * Test script for loan application submission
 */
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'http://localhost:5000';
const TOKEN = ''; // Add a valid JWT token here before running

// Prepare test data
const loanData = {
  type: 'cropLoan',
  purpose: 'Test purpose for farming equipment',
  amount: 50000,
  tenure: 12,
  interestRate: 7,
  landArea: 5,
  income: 120000,
  fullName: 'Test User',
  email: 'test@example.com',
  'address.street': '123 Farm St',
  'address.village': 'Test Village',
  'address.district': 'Test District',
  'address.state': 'Maharashtra',
  'address.pincode': '123456'
};

// Document types mapping
const documentTypes = {
  'test-document.pdf': 'panCard',
  'test-document2.jpg': 'aadharCard'
};

async function testLoanSubmission() {
  try {
    console.log('Starting loan submission test...');
    
    // Create a form data instance
    const form = new FormData();
    
    // Add loan data fields to form
    Object.keys(loanData).forEach(key => {
      form.append(key, loanData[key]);
    });
    
    // Add document types mapping
    form.append('documentTypes', JSON.stringify(documentTypes));
    
    // Add a test file (if available)
    const testFilePath = path.join(__dirname, 'test-image.png');
    
    if (fs.existsSync(testFilePath)) {
      const fileStream = fs.createReadStream(testFilePath);
      form.append('documents', fileStream, { filename: 'test-document.pdf' });
      console.log('Added test document to request');
    } else {
      console.log('Test file not found:', testFilePath);
    }
    
    console.log('Sending request to:', `${API_URL}/api/loans/apply`);
    
    // Make API request
    const response = await fetch(`${API_URL}/api/loans/apply`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      },
      body: form
    });
    
    const data = await response.json();
    
    // Log response
    console.log('Status code:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('Test successful!');
    } else {
      console.error('Test failed with error:', data.message);
    }
  } catch (error) {
    console.error('Error during test:', error);
  }
}

// Run the test
testLoanSubmission();
