const express = require('express');
const router = express.Router();
const geminiService = require('./services/geminiAIService');

/**
 * Simple health check test route
 */
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Test server is running' });
});

/**
 * Test Gemini AI text capabilities
 */
router.get('/test-gemini-text', async (req, res) => {
  try {
    // Initialize Gemini AI
    const gemini = new geminiService.GeminiAI();
    
    // Simple prompt for testing
    const prompt = req.query.prompt || 'Generate a simple JSON response about crop health assessment';
    
    // Generate content
    const result = await gemini.generateContent(prompt);
    
    // Return the result
    res.json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error('Error in test-gemini endpoint:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error testing Gemini AI',
      error: error.toString()
    });
  }
});

/**
 * Test Gemini Vision API directly with fixed sample data
 */
router.get('/test-gemini-vision', async (req, res) => {
  try {
    // Initialize Gemini AI
    const gemini = new geminiService.GeminiAI();
    
    // This is a base64 encoded 1x1 red pixel JPEG (minimal valid image)
    const minimalImageBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAP/2Q==';
    
    // Create a simple prompt for vision API
    const simplePrompt = 'What color is this image?';
    
    // Generate content using the image
    const result = await gemini.generateContentFromImage(simplePrompt, minimalImageBase64, 'image/jpeg');
    
    // Return the result
    res.json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error('Error in test-gemini-vision endpoint:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error testing Gemini Vision API',
      error: error.toString()
    });
  }
});

/**
 * Add a direct test endpoint for Gemini Vision without auth
 */
router.post('/direct-vision-test', async (req, res) => {
  try {
    // Check if an image was uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({ 
        success: false, 
        message: "Please upload an image"
      });
    }
    
    const { image } = req.files;
    
    // Get the crop type from the request
    const cropType = req.body.cropType || "Unknown";
    
    // Log important info
    console.log(`Testing with image: type=${image.mimetype}, size=${image.data.length} bytes, crop=${cropType}`);
    
    // Convert image to base64
    const imageBase64 = image.data.toString('base64');
    
    // Create a Gemini AI instance
    const gemini = new geminiService.GeminiAI();
    
    // Generate a basic prompt
    const prompt = `Tell me if this appears to be a healthy ${cropType} plant.`;
    
    // Call the Gemini Vision API
    const result = await gemini.generateContentFromImage(
      prompt, 
      imageBase64, 
      image.mimetype || 'image/jpeg'
    );
    
    // Return success with the analysis
    return res.status(200).json({
      success: true,
      cropType,
      analysis: result,
      imageSize: image.data.length
    });
    
  } catch (error) {
    console.error("Error in direct vision test:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze image",
      error: error.toString()
    });
  }
});

/**
 * Export the test router
 */
module.exports = router;
