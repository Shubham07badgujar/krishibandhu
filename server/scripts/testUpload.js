// Test script for uploading an image to the crop health API
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

const API_URL = 'http://localhost:5000/api/crop-health/test-vision';
const IMAGE_PATH = path.join(__dirname, '../temp/sample_tomato.jpg');

async function testUpload() {
  try {
    // Check if image exists
    if (!fs.existsSync(IMAGE_PATH)) {
      console.error(`Error: Image file not found at ${IMAGE_PATH}`);
      return;
    }

    console.log(`Using image: ${IMAGE_PATH}`);
    
    // Create form data
    const form = new FormData();
    form.append('image', fs.createReadStream(IMAGE_PATH));
    form.append('cropType', 'Tomato');
    
    // Make API request
    console.log('Sending request to', API_URL);
    const response = await axios.post(API_URL, form, {
      headers: {
        ...form.getHeaders(),
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testUpload();
