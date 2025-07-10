const mongoose = require("mongoose");
const CropHealth = require("../models/CropHealth");
const geminiService = require("../services/geminiAIService");
const fs = require('fs');
const path = require('path');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

// Create uploads directory if not exists
const uploadDir = path.join(__dirname, '../uploads/crops');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create temp directory if not exists
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

/**
 * Analyze a crop image and return health assessment
 * @route POST /api/crop-health/analyze
 * @access Private
 */
const analyzeCropImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: "Please upload an image" });
    }

    const { image } = req.files;
    const cropType = req.body.cropType;

    if (!cropType) {
      return res.status(400).json({ success: false, message: "Please specify the crop type" });
    }
    
    // Save the image
    const timestamp = Date.now();
    const filename = `${req.user.id}_${timestamp}_${image.name}`;
    const filepath = path.join(uploadDir, filename);
    
    // Ensure the image data is valid
    if (!image.data || image.data.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid image data" });
    }
    
    // Check if the image is too small (likely invalid)
    if (image.data.length < 1000) {
      return res.status(400).json({ 
        success: false, 
        message: "Image file is too small to be valid. Please upload a clear photo of your crop." 
      });
    }
    
    // Convert image to base64 for AI processing
    const imageBase64 = image.data.toString('base64');
    const mimeType = image.mimetype || 'image/jpeg'; // Default to JPEG if mimetype is not available
    
    // Save the image file
    try {
      await writeFile(filepath, image.data);
      
      // Verify the file was saved correctly
      const savedFile = await readFile(filepath);
      if (savedFile.length === 0) {
        throw new Error("File was saved but is empty");
      }
    } catch (fileError) {
      console.error("Error saving image file:", fileError);
      return res.status(500).json({ success: false, message: "Error saving image file" });
    }
    
    // Use Gemini AI to analyze the crop image
    const gemini = new geminiService.GeminiAI();
    
    // Create a detailed prompt for the Gemini model with explicit formatting instructions
    const prompt = `
      You are an expert agricultural scientist specializing in crop disease identification and treatment. 
      Analyze this ${cropType} plant image and provide a detailed health assessment with the following information:
      
      1) Health Status: Classify as "healthy", "moderate" (showing some issues), or "unhealthy" (serious problems)
      2) Diagnosis: Brief summary of what you observe about the plant's health
      3) Disease identification (if applicable): Name the disease if present, or "none detected" if healthy
      4) Disease description (if applicable): Brief explanation of the disease, or "not applicable" if no disease
      5) Recommendations: 3-5 specific care recommendations for the farmer
      6) Suggested fertilizers: 1-3 specific fertilizers that would help this crop with their benefits
      
      IMPORTANT: You must format your response as a valid JSON object with these exact keys:
      {
        "healthStatus": "healthy|moderate|unhealthy",
        "diagnosis": "your diagnosis text",
        "disease": "disease name or none detected", 
        "diseaseDescription": "disease description or not applicable",
        "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
        "fertilizers": [{"name": "fertilizer name", "description": "fertilizer benefit"}]
      }

      ONLY respond with the JSON. Do not include any other text, explanations, or markdown.
    `;
    
    try {
      const result = await gemini.generateContentFromImage(prompt, imageBase64, mimeType);

      // Parse the AI response and extract JSON
      let jsonResponse;
      try {
        const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```|({[\s\S]*})/);
        const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : result;
        jsonResponse = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to analyze crop image. AI returned invalid data." 
        });
      }
      
      // Save the analysis to database
      const cropHealthRecord = new CropHealth({
        userId: req.user.id,
        cropType,
        imageUrl: `/uploads/crops/${filename}`,
        healthStatus: jsonResponse.healthStatus,
        diagnosis: jsonResponse.diagnosis,
        disease: jsonResponse.disease,
        diseaseDescription: jsonResponse.diseaseDescription,
        recommendations: jsonResponse.recommendations,
        fertilizers: jsonResponse.fertilizers
      });

      await cropHealthRecord.save();

      // Return the analysis results
      return res.status(200).json({
        success: true,
        ...jsonResponse,
        recordId: cropHealthRecord._id
      });
    } catch (aiError) {
      console.error("AI analysis error:", aiError);
      return res.status(500).json({
        success: false,
        message: "Failed to analyze image with AI. Please try again."
      });
    }
  } catch (error) {
    console.error("Error analyzing crop image:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to analyze crop image. Please try again later."
    });
  }
};

/**
 * Get all crop health records for a user
 * @route GET /api/crop-health
 * @access Private
 */
const getUserCropHealthRecords = async (req, res) => {
  try {
    const records = await CropHealth.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, records });
  } catch (error) {
    console.error("Error fetching crop health records:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch crop health records" });
  }
};

/**
 * Get a specific crop health record
 * @route GET /api/crop-health/:id
 * @access Private
 */
const getCropHealthRecord = async (req, res) => {
  try {
    const record = await CropHealth.findOne({ 
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    
    return res.status(200).json({ success: true, record });
  } catch (error) {
    console.error("Error fetching crop health record:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch crop health record" });
  }
};

/**
 * Debug endpoint for testing Gemini Vision API without auth
 * @route POST /api/crop-health/test-vision
 * @access Public (for testing only)
 */
const testVisionAPI = async (req, res) => {
  try {
    // Check if this is a text-only test (for simple API verification)
    if (req.query.textOnly === 'true') {
      // Use Gemini AI to test text generation without image
      const gemini = new geminiService.GeminiAI();
      
      const simplePrompt = `
        Generate a sample crop health analysis in JSON format:
        {
          "healthStatus": "healthy|moderate|unhealthy",
          "diagnosis": "brief description",
          "disease": "disease name or none",
          "diseaseDescription": "brief explanation",
          "recommendations": ["recommendation 1", "recommendation 2"],
          "fertilizers": [{"name": "fertilizer name", "description": "brief description"}]
        }
      `;
      
      const result = await gemini.generateContent(simplePrompt);
      
      // Return the raw result for debugging
      return res.status(200).json({
        success: true,
        result: result,
        testType: "text-only"
      });
    }

    // Regular image testing path
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: "Please upload an image" });
    }

    const { image } = req.files;
    const cropType = req.body.cropType || "Unknown";
    
    // Convert image to base64 for AI processing
    const imageBase64 = image.data.toString('base64');
    const mimeType = image.mimetype || 'image/jpeg';
    
    // Use Gemini AI to analyze the image
    const gemini = new geminiService.GeminiAI();
    
    const simplePrompt = `
      Analyze this ${cropType} plant image and provide a brief health assessment in JSON format:
      {
        "healthStatus": "healthy|moderate|unhealthy",
        "diagnosis": "brief description"
      }
    `;
    
    const result = await gemini.generateContentFromImage(simplePrompt, imageBase64, mimeType);
    
    // Return the raw result for debugging
    return res.status(200).json({
      success: true,
      result: result,
      imageSize: image.data.length,
      mimeType: mimeType
    });
    
  } catch (error) {
    console.error("Error in test vision API:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Test API error",
      error: error.toString()
    });
  }
};

module.exports = {
  analyzeCropImage,
  getUserCropHealthRecords,
  getCropHealthRecord,
  testVisionAPI
};
