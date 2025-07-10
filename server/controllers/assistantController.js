const User = require('../models/User');
const { getGeminiResponse, validateApiKey } = require('../services/geminiAIService');

// Simple in-memory cache for storing recent conversations
// In a production app, consider using Redis or a database
const conversationCache = new Map();

// Validate API key on startup
(async function checkApiConfiguration() {
  try {
    console.log('🔍 Verifying Gemini AI API configuration...');
    const isValid = await validateApiKey();
    if (isValid) {
      console.log('✅ Gemini AI API key validation successful');
    } else {
      console.error('❌ Gemini AI API key validation failed - AI assistant may not work correctly');
      console.error('Please check your GEMINI_API_KEY in the .env file');
    }
  } catch (error) {
    console.error('❌ Error validating Gemini AI configuration:', error);
  }
})();

// Clear old conversations periodically
setInterval(() => {
  const oneHourAgo = Date.now() - 3600000;
  for (const [userId, conversation] of conversationCache.entries()) {
    if (conversation.lastUpdated < oneHourAgo) {
      conversationCache.delete(userId);
    }
  }
}, 3600000); // Clean up every hour

/**
 * Handle chatbot messages and generate responses
 * @route POST /api/assistant/chat
 * @access Public
 */
exports.chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }
    
    // Get user ID from authenticated user or create a guest ID
    let userId;
    let user = req.user;
    
    if (user) {
      userId = user.id;
    } else {
      // For unauthenticated users, return a message that login is required
      return res.status(403).json({ 
        success: false, 
        error: 'Login required to use the assistant feature'
      });
    }

    // Get or initialize user's conversation history
    if (!conversationCache.has(userId)) {
      conversationCache.set(userId, {
        messages: [],
        lastUpdated: Date.now()
      });
    }
    
    const conversation = conversationCache.get(userId);
    conversation.messages.push({ role: 'user', content: message });
    conversation.lastUpdated = Date.now();
    
    // Keep conversation history limited to last 10 messages
    if (conversation.messages.length > 10) {
      conversation.messages = conversation.messages.slice(-10);
    }
    
    // Process the message and generate a response
    const response = await generateResponse(message, user, conversation.messages);
    
    // Add the response to conversation history
    conversation.messages.push({ role: 'assistant', content: response });
    
    return res.status(200).json({ success: true, reply: response });
  } catch (error) {
    console.error('Chatbot error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to process your message' 
    });
  }
};

/**
 * Generate a response based on user message and context using Gemini AI
 */
async function generateResponse(message, user, conversationHistory) {
  try {
    // Get user name or default to 'there' if user object is not available
    const userName = user && user.name ? user.name : 'there';
    
    // Format conversation history for Gemini
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      content: msg.content
    }));
    
    // Extract user context if available
    const userContext = {
      name: userName,
      location: user?.district || user?.state || 'India',
      preferredLanguage: user?.language || 'English',
      farmingType: user?.primaryCrop ? `${user.primaryCrop} farming` : 'General farming'
    };
    
    // Use Gemini to generate response with a timeout
    let response;    try {
      // Add a timeout to prevent long-running requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 8000) // Extended timeout for AI
      );
      
      response = await Promise.race([
        getGeminiResponse(message, formattedHistory, userContext),
        timeoutPromise
      ]);
    } catch (aiError) {
      console.error('Error with AI response:', aiError.message);
      // Let the AI service handle its own error responses - no fallback
      return "I'm having trouble processing your request right now. Please try again shortly.";
    }
    
    return response;
    
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Fallback to rule-based system if AI fails
    const normalizedMessage = message.toLowerCase();
    const userName = user && user.name ? user.name : 'there';
    
    // Enhanced fallback responses based on keywords for better user experience
    if (normalizedMessage.includes('weather') || normalizedMessage.includes('rain') || normalizedMessage.includes('temperature')) {
      return "You can check detailed weather information on our Weather page. It provides current conditions, forecasts, and agricultural advisory based on weather patterns. The Weather page shows rainfall predictions, temperature trends, and how they might affect your crops.";
    }
    
    if (normalizedMessage.includes('crop') || normalizedMessage.includes('farming') || normalizedMessage.includes('plant') || normalizedMessage.includes('grow')) {
      const cropTips = [
        "For detailed crop information, check our Learning Hub which has guides specific to your region.",
        "Regular crop rotation helps prevent soil depletion and reduces pest problems. Consider alternating between legumes and non-legumes.",
        "Proper spacing between plants ensures adequate sunlight and airflow, reducing disease risks.",
        "Companion planting can help deter pests naturally. For example, marigolds help repel nematodes."
      ];
      return cropTips[Math.floor(Math.random() * cropTips.length)];
    }
    
    if (normalizedMessage.includes('scheme') || normalizedMessage.includes('subsidy') || normalizedMessage.includes('government') || normalizedMessage.includes('loan')) {
      const schemeTips = [
        "We have information about various government schemes and subsidies for farmers on our Schemes page.",
        "PM-KISAN provides income support of ₹6,000 per year to eligible farmers. Check our Schemes page for application details.",
        "Kisan Credit Card scheme offers credit support at favorable terms for farmers.",
        "The Pradhan Mantri Fasal Bima Yojana provides crop insurance protection for registered farmers."
      ];
      return schemeTips[Math.floor(Math.random() * schemeTips.length)];
    }
    
    if (normalizedMessage.includes('hello') || normalizedMessage.includes('hi') || normalizedMessage.includes('hey') || normalizedMessage.includes('namaste')) {
      const greetings = [
        `Hello ${userName}! How can I assist with your farming needs today?`,
        `Namaste ${userName}! Welcome to KrishiBandhu. I can help you with weather forecasts, crop information, and government schemes.`,
        `Greetings ${userName}! I'm here to support your agricultural activities. What would you like to know today?`
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // More varied general responses for better engagement
    const generalResponses = [
      "I'm here to help with farming, agriculture, weather forecasts, and government schemes. How can I assist you today?",
      "As your KrishiBandhu assistant, I can provide information on crop management, weather predictions, and agricultural subsidies. What do you need help with?",
      "Welcome to KrishiBandhu! I can answer questions about farming practices, local weather, and government support programs. What would you like to know?",
      "I'm your agricultural assistant. Feel free to ask about crops, weather, or government schemes for farmers."
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  }
}

/**
 * Clear chat history for a user
 * @route DELETE /api/assistant/chat
 * @access Public
 */
exports.clearChatHistory = async (req, res) => {
  try {
    // Get user ID from authenticated user 
    let userId;
    
    if (req.user) {
      userId = req.user.id;
    } else {
      // For unauthenticated users, return error
      return res.status(403).json({ 
        success: false, 
        error: 'Login required to use the assistant feature'
      });
    }
    
    if (conversationCache.has(userId)) {
      conversationCache.delete(userId);
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Chat history cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to clear chat history' 
    });
  }
};
