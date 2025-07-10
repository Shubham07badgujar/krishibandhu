const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistantController');
const { protect } = require('../middleware/authMiddleware');

// Routes for chatbot functionality - only available for authenticated users
router.post('/chat', protect, assistantController.chatWithAssistant);
router.delete('/chat', protect, assistantController.clearChatHistory);

module.exports = router;
