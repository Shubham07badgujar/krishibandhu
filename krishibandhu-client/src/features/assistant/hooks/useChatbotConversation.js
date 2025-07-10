import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for managing chatbot conversation state
 * @param {string} initialMessage - The initial greeting message
 * @returns {Object} - Chatbot conversation state and methods
 */
const useChatbotConversation = (initialMessage = "Hello! How can I help you today?") => {
  const [messages, setMessages] = useState([
    { type: 'bot', content: initialMessage }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Initialize from localStorage if available
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatbotMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      } catch (e) {
        console.error('Error parsing saved messages:', e);
      }
    }
  }, []);
  
  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 1) { // Don't save if it's just the initial message
      localStorage.setItem('chatbotMessages', JSON.stringify(messages));
    }
  }, [messages]);
  
  /**
   * Sends a message to the chatbot API
   */
  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return;
    
    setLoading(true);
    setError(null);
    
    // Add user message to chat
    const userMessage = { type: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);    try {
      // Check if user is logged in
      if (!user) {
        setError('Please log in to use the assistant');
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: 'You need to be logged in to use the KrishiMitra Assistant. Please log in first.' 
        }]);
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        
        return;
      }
      
      const token = user.token;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for AI responses
      
      let data;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/assistant/chat`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ message }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.status === 401 || response.status === 403) {
          // Handle authentication errors
          setError('Authentication required');
          setMessages(prev => [...prev, { 
            type: 'bot', 
            content: 'Your session has expired. Please log in again to continue using the assistant.' 
          }]);
          
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        data = await response.json();
        
        // Clear any previous errors
        setError(null);
      } catch (fetchError) {
        // Handle fetch specific errors (timeout, network issues, etc.)
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. Our AI assistant is taking longer than expected. Please try again.');
        }
        throw fetchError;
      }
      
      // Add bot response to chat
      setMessages(prev => [...prev, { type: 'bot', content: data.reply }]);
      
      // Add to chat history
      setChatHistory(prev => [
        ...prev, 
        { question: message, answer: data.reply, timestamp: new Date() }
      ]);
      
    } catch (err) {
      console.error('Error sending message to chatbot:', err);
      setError('Failed to get response. Please try again later.');
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);    } finally {
      setLoading(false);
    }
  }, [user, navigate]);
    /**
   * Clear all messages
   */
  const clearMessages = useCallback(async () => {
    setMessages([{ type: 'bot', content: initialMessage }]);
    localStorage.removeItem('chatbotMessages');
    
    try {
      // Check if user is logged in
      if (!user) {
        return; // Don't attempt to clear on server if not logged in
      }
      
      const token = user.token;
      
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/assistant/chat`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Error clearing chat history on server:', err);
    }
  }, [initialMessage, user]);
  
  return {
    messages,
    inputMessage,
    loading,
    error,
    chatHistory,
    setInputMessage,
    sendMessage,
    clearMessages
  };
};

export default useChatbotConversation;
