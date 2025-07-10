const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

// Check if API key is set
if (!process.env.GEMINI_API_KEY) {
  console.error('⚠️ CRITICAL ERROR: GEMINI_API_KEY is not set in environment variables');
}

// Initialize Google Generative AI with your API key
let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('✅ Gemini AI initialized successfully');
} catch (initError) {
  console.error('❌ Failed to initialize Gemini AI:', initError);
}

/**
 * Get a response from Gemini AI
 * @param {string} message - The user's message
 * @param {Array} conversationHistory - Previous conversation history
 * @param {Object} userContext - Context about the user (location, preferences, etc.)
 */
async function getGeminiResponse(message, conversationHistory = [], userContext = {}) {  
  // Define modelName at the top level of function to avoid undefined reference errors
  const modelName = 'gemini-2.0-flash';  
  
  try {
    // Validate that genAI was initialized successfully
    if (!genAI) {
      console.error("❌ Gemini AI not initialized - API key may be missing or invalid");
      return "I'm sorry, but I'm currently unable to process your request. The AI service is unavailable. Please try again later or contact support.";
    }
    
    // Log request for debugging
    console.log(`🔄 Processing AI request for user: ${userContext.name || 'Unknown'}`);
    console.log(`📝 Message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
    console.log(`🤖 Using model: ${modelName}`);
    
    // For Gemini API, format the conversation history
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));
    
    // Create a model instance with the working model
    const model = genAI.getGenerativeModel({ model: modelName });
    
    // Start a chat session with appropriate configuration
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    });
    
    // Add context information to the message instead of using systemInstruction
    const contextPrompt = `You are KrishiMitra, an AI assistant for farmers in India. 
The user is from ${userContext.location || 'India'}, speaks ${userContext.preferredLanguage || 'English'}, 
and is involved in ${userContext.farmingType || 'agriculture'}. 
Today's date is ${new Date().toLocaleDateString()}.

The user's question is: ${message}`;
    
    // Generate a response with the context included
    const result = await chat.sendMessage(contextPrompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error generating response from Gemini:', error);
    
    // Log all available error information for debugging
    console.error('📋 AI ERROR DIAGNOSIS 📋');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Selected model:', modelName);
    console.error('User message:', message.substring(0, 50) + (message.length > 50 ? '...' : ''));
    console.error('Timestamp:', new Date().toISOString());
    
    // Provide more detailed error logging based on error message
    if (error.message.includes('API key') || error.message.includes('key not valid')) {
      console.error('❌ API key issue detected. Check your Gemini AI API key configuration');
    } else if (error.message.includes('connectivity') || error.message.includes('network')) {
      console.error('❌ Network connectivity issue when contacting Gemini AI API');    
    } else if (error.message.includes('rate') || error.message.includes('quota') || 
               error.message.includes('exceeded') || error.message.includes('limit')) {
      console.error('❌ Rate limit exceeded with Gemini AI API - You may need to create a new API key or upgrade your plan');
    } else if (error.message.includes('not found') || error.message.includes('not supported')) {
      console.error(`❌ Model "${modelName}" not found or not supported. Try using a different model`);
    } else if (error.message.includes('system_instruction')) {
      console.error('❌ System instruction format error - Using simpler prompt format instead');
    }
    
    // Log the complete error for diagnostics
    console.error('Full error details:', {
      message: error.message,
      status: error.status,
      code: error.code,
      stack: error.stack?.split('\n').slice(0, 5).join('\n')
    });
      
    // Handle different types of errors with appropriate responses - NO OFFLINE KNOWLEDGE BASE
    if (error.message.includes('API key') || error.message.includes('key not valid')) {
      return "I'm currently experiencing a configuration issue. Please contact the administrator to check the API key setup.";
    } else if (error.message.includes('rate') || error.message.includes('quota') || 
               error.message.includes('exceeded') || error.message.includes('limit')) {
      return "I'm currently experiencing heavy traffic and have reached my request limits. Please try again in a few minutes.";
    } else if (error.message.includes('safety') || error.message.includes('blocked')) {
      return "I cannot provide a response to this query due to content safety policies. Please try asking a different farming-related question.";
    } else if (error.message.includes('system_instruction')) {
      // Special handling for system instruction format errors
      try {
        // Try a simpler approach without system instructions
        const simpleModel = genAI.getGenerativeModel({ model: modelName });
        const result = await simpleModel.generateContent(`You are a farming assistant. Please answer this question: ${message}`);
        const text = await result.response.text();
        return text;
      } catch (retryError) {
        console.error('Failed on retry attempt:', retryError.message);
        return "I'm having trouble processing your request right now. Please try again in a few moments.";
      }
    } else {
      // AI service error - clear message with no fallback
      return "I apologize, but I'm temporarily unable to answer your question due to a technical issue. Please try again shortly.";
    }
  }
}

/**
 * Validate the Gemini API key by trying multiple models
 * @returns {Promise<boolean>} True if API key is valid
 */
async function validateApiKey() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not set in environment');
      return false;
    }
    
  // Use the model that we know works with this API key
    try {
      // Based on our testing, only gemini-2.0-flash works for this API key
      const modelName = 'gemini-2.0-flash';
      console.log(`Attempting to validate API key with known working model: ${modelName}`);
      
      const test = genAI.getGenerativeModel({ model: modelName });
      console.log(`Sending test query with model ${modelName}...`);
      
      const result = await test.generateContent('Test connection');
      console.log(`✅ API key validated successfully with model: ${modelName}`);
      
      // If we got here, the API key works with this model
      return true;
    } catch (modelError) {
      console.log(`❌ Model validation failed: ${modelError.message}`);
      
      // Check for specific error types
      if (modelError.message.includes('quota') || modelError.message.includes('exceeded')) {
        console.log('You have exceeded your quota. Try again later or create a new API key.');
      }
      
      return false;
    }
    
    // If we get here, all models failed
    console.error('❌ All models failed validation');
    return false;
  } catch (error) {
    console.error('API key validation failed:', error.message);
    return false;
  }
}

/**
 * GeminiAI class for interacting with Google's Gemini API
 * Handles both text and image-based content generation
 */
class GeminiAI {
  constructor() {
    if (!genAI) {
      throw new Error('Gemini AI not initialized - API key may be missing or invalid');
    }
  }

  /**
   * Generate content from text prompt
   * @param {string} prompt - The text prompt
   * @returns {Promise<string>} - Generated text content
   */
  async generateContent(prompt) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating content from text:', error);
      throw error;
    }
  }
  /**
   * Generate content from a text prompt and an image
   * @param {string} prompt - The text prompt
   * @param {string} imageBase64 - Base64 encoded image
   * @param {string} mimeType - MIME type of the image
   * @returns {Promise<string>} - Generated text content   */    async generateContentFromImage(prompt, imageBase64, mimeType = 'image/jpeg') {
    try {
      // Enhanced validation for image data
      if (!imageBase64 || imageBase64.length === 0) {
        throw new Error('Empty image data provided');
      }
      
      // Check if the image data looks valid (at least has a reasonable length)
      if (imageBase64.length < 100) {
        console.warn(`Warning: Very small image data (${imageBase64.length} bytes). This might be invalid.`);
      }
      
      // Remove any "data:image/jpeg;base64," prefix if present
      if (imageBase64.startsWith('data:')) {
        imageBase64 = imageBase64.split(',')[1];
      }

      // Log the image size for debugging
      console.log(`Image processing: size=${imageBase64.length} bytes, type=${mimeType}`);
      
      // For image processing, we use gemini-1.5-flash model which supports multimodal inputs
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      // Create parts array with prompt and image
      const imageParts = [
        { text: prompt },
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType, // Use the provided MIME type or default to JPEG
          },
        },
      ];
        // Generate content using the image and prompt
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: imageParts }],
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.4,
          topP: 0.95,
          topK: 32,
        }
      });
      
      return result.response.text();
    } catch (error) {
      console.error('Error generating content from image:', error);
      console.error('Error details:', JSON.stringify({
        modelUsed: 'gemini-1.5-flash',
        imageSize: imageBase64.length,
        promptSize: prompt.length,
        timestamp: new Date().toISOString()
      }));
      throw error;
    }
  }
}

module.exports = { 
  getGeminiResponse,
  validateApiKey,
  GeminiAI
};
