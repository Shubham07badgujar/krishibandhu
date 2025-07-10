require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const FormData = require('form-data');
const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:5000/api/crop-health/test-vision';
const SAMPLE_IMAGE_URL = 'https://cdn.pixabay.com/photo/2019/05/31/11/34/tomato-4241910_1280.jpg';
// No token needed for the test endpoint
const CROP_TYPE = 'Tomato';

// Create temp directory if not exists
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

/**
 * Download an image from URL to a local file
 * @param {string} url - Image URL
 * @param {string} outputPath - Path to save the image
 */
async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading image from ${url}...`);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Image downloaded to ${outputPath}`);
        resolve(outputPath);
      });
      
      fileStream.on('error', (err) => {
        fs.unlinkSync(outputPath);
        reject(err);
      });
    }).on('error', reject);
  });
}

/**
 * Test the crop health analysis API with a sample image
 */
async function testCropHealthAPI() {
  try {
    // Step 1: Download a sample image
    const imagePath = path.join(tempDir, 'sample_tomato.jpg');
    await downloadImage(SAMPLE_IMAGE_URL, imagePath);
    
    // Verify the image file exists and has content
    const stats = fs.statSync(imagePath);
    if (stats.size === 0) {
      throw new Error('Downloaded image file is empty');
    }
    console.log(`Image file size: ${stats.size} bytes`);
    
    // Step 2: Create form data
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath), {
      filename: 'tomato_plant.jpg',
      contentType: 'image/jpeg'
    });
    formData.append('cropType', CROP_TYPE);
    
    console.log('Sending request to crop health analysis API...');
      // Step 3: Make API request
    const response = await axios.post(API_URL, formData, {
      headers: {
        ...formData.getHeaders()
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    // Step 4: Display result
    console.log('Response status:', response.status);
    console.log('Analysis results:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error testing crop health API:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

console.log('Starting Crop Health API test...');
testCropHealthAPI().catch(console.error);
