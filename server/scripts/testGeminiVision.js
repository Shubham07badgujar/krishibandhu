require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const { GeminiAI } = require('../services/geminiAIService');

// Create a sample image file for testing
const useSampleUrl = false;
const createTestImage = true;
const sampleImageUrl = 'n/a';
const testImagePath = path.join(__dirname, '../uploads/crops/681cfc586f7350a6c36a4eb1_1747368874517_Crop.webp');

// Function to create a simple test image using Canvas
function createTestImage() {
  // Since we can't use Canvas in Node.js without additional modules,
  // let's create a simple 1x1 pixel base64 encoded JPEG
  // This is a red 1x1 pixel JPEG image
  return '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAP/2Q==';
}

async function testGeminiVision() {
  try {
    let imageBase64;
    let mimeType;
    
    if (useSampleUrl) {
      console.log(`Downloading sample image from ${sampleImageUrl}...`);
      // Download the image from URL
      imageBase64 = await downloadAndConvertToBase64(sampleImageUrl);
      mimeType = 'image/jpeg'; // Assuming the sample is a JPEG
    } else if (createTestImage) {
      console.log('Creating test image...');
      imageBase64 = createTestImage();
      mimeType = 'image/jpeg';
    } else {
      console.log('Reading image file...');
      // Check if file exists
      if (!fs.existsSync(testImagePath)) {
        console.error(`Test image not found at path: ${testImagePath}`);
        return;
      }
      
      // Read image file
      const imageBuffer = fs.readFileSync(testImagePath);
      imageBase64 = imageBuffer.toString('base64');
      mimeType = 'image/webp';
    }
      console.log(`Image loaded successfully`);
    console.log(`Image size: ${imageBase64.length} bytes`);
    
    // Create prompt
    const prompt = `
      Analyze this crop plant image and provide a health assessment with:
      1) Health Status (healthy, moderate, unhealthy)
      2) Brief diagnosis
      
      Format as JSON: {"healthStatus": "", "diagnosis": ""}
    `;
    
    console.log('Initializing Gemini AI...');
    const gemini = new GeminiAI();
    
    console.log('Sending image to Gemini Vision API...');
    const result = await gemini.generateContentFromImage(prompt, imageBase64, mimeType);
    
    console.log('Response received:');
    console.log('--------------------------------');
    console.log(result);
    console.log('--------------------------------');
    
    // Try to parse as JSON
    try {
      const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```|({[\s\S]*})/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : result;
      const jsonResponse = JSON.parse(jsonString);
      
      console.log('JSON parsed successfully:');
      console.log(JSON.stringify(jsonResponse, null, 2));
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError.message);
    }
    
  } catch (error) {
    console.error('Error testing Gemini Vision API:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
  }
}

// Function to download an image and convert it to base64
function downloadAndConvertToBase64(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer.toString('base64'));
      });
      response.on('error', reject);
    }).on('error', reject);
  });
}

console.log('Starting Gemini Vision API test...');
testGeminiVision().catch(console.error);