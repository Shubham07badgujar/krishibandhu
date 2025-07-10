import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useChatbotConversation from '../hooks/useChatbotConversation';
import { useAuth } from '../../../context/AuthContext';

// Custom keyframes for animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulseSlow {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 10px 25px -5px rgba(0, 128, 0, 0.3);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 15px 25px -5px rgba(0, 128, 0, 0.4);
    }
  }
  
  .animate-pulse-slow {
    animation: pulseSlow 3s ease-in-out infinite;
  }
  
  .animate-fade-in {
    animation: fadeInUp 0.3s ease-out forwards;
  }
  
  .animate-fade-slide-in {
    animation: fadeSlideIn 0.3s ease-out forwards;
  }
`;
document.head.appendChild(styleSheet);

const ChatBot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const {
    messages,
    inputMessage,
    loading,
    error,
    setInputMessage,
    sendMessage,
    clearMessages
  } = useChatbotConversation(t('chatbot.welcome') || `Hello ${user?.name || ''}! I am KrishiMitra, your farming assistant powered by Gemini AI. How can I help you today?`);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };
    const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const messageToSend = inputMessage;
    setInputMessage('');
    setShowSuggestions(false);
    
    // Add a visual feedback animation to the send button
    const sendButton = e.currentTarget.querySelector('button[type="submit"]');
    if (sendButton) {
      sendButton.classList.add('scale-90');
      setTimeout(() => {
        sendButton.classList.remove('scale-90');
      }, 150);
    }
    
    await sendMessage(messageToSend);
  };
  
  const handleSuggestionClick = async (suggestion) => {
    setInputMessage('');
    setShowSuggestions(false);
    await sendMessage(suggestion);
  };
  // Quick suggestion buttons
  const suggestions = [
    t("assistant.suggestions.crops", "What crops are best for this season?"),
    t("assistant.suggestions.pests", "How to protect crops from pests?"),
    t("assistant.suggestions.schemes", "Tell me about government schemes for farmers"),
    t("assistant.suggestions.soil", "How to improve soil health?"),
    t("assistant.suggestions.irrigation", "What's the best irrigation method for wheat?"),
    t("assistant.suggestions.weather", "Weather forecast for farming")
  ];

  return (
    <>
      {/* Chat button */}
      <button 
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white flex items-center justify-center shadow-lg hover:from-green-700 hover:to-green-600 transition-all z-50 animate-pulse-slow"
        style={{ boxShadow: '0 10px 25px -5px rgba(0, 128, 0, 0.3)' }}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[560px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-100 animate-fade-in overflow-hidden"
             style={{ boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)', animation: 'fadeInUp 0.3s ease-out forwards' }}>
          {/* Chat header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-t-2xl flex justify-between items-center relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" 
                   style={{ 
                     backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)', 
                     backgroundSize: '20px 20px' 
                   }}>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 z-10">
              <div className="bg-white rounded-full p-1.5 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#047857" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('chatbot.title') || 'KrishiMitra'}</h3>
                <div className="flex items-center text-xs font-light text-green-50">
                  <span className="inline-block w-2 h-2 bg-green-200 rounded-full mr-1.5 animate-pulse"></span>
                  Powered by Gemini AI
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 z-10">
              <button 
                onClick={clearMessages} 
                className="text-white hover:text-gray-200 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-700"
                title={t('chatbot.clearChat') || "Clear chat"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
              <button onClick={toggleChatbot} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>{/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-slide-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {message.type !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-1 shadow-sm border border-green-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#047857" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  </div>
                )}
                
                <div 
                  className={`px-4 py-3 rounded-2xl max-w-[75%] ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-br-none font-medium shadow-md' 
                      : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none'
                  }`}
                  style={{ 
                    boxShadow: message.type === 'user' 
                      ? '0 4px 6px -1px rgba(0, 128, 0, 0.2)' 
                      : '0 2px 5px -1px rgba(0, 0, 0, 0.05)' 
                  }}
                >                  {message.content}
                </div>
                
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center ml-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            
            {/* Quick reply suggestions */}
            {messages.length === 1 && showSuggestions && (
              <div className="mt-4 flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="bg-white border border-green-200 text-green-700 px-3 py-2 rounded-full text-sm hover:bg-green-50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            
            {loading && (
              <div className="flex justify-start mb-4 items-end">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#047857" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mt-2 mb-4 text-sm">
                {error}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex">
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                placeholder={t('chatbot.placeholder') || "Ask me anything about farming..."}
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              />              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center disabled:bg-green-400 transform hover:scale-105 active:scale-95"
                disabled={loading || !inputMessage.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
