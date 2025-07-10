import { useState, lazy, Suspense, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Lazy load the ChatBot component to improve initial load performance
const ChatBot = lazy(() => import('./components/ChatBot'));

const ChatBotLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  // Only show the chatbot on certain routes AND if user is logged in
  // Adjust this logic based on your app's needs
  const shouldShowChatbot = () => {
    // Don't show if not logged in or on login/register pages
    const path = window.location.pathname;
    return !!user && !path.includes('/login') && !path.includes('/register');
  };
  // Load chatbot after a slight delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || !shouldShowChatbot()) return null;

  return (
    <Suspense fallback={null}>
      <ChatBot />
    </Suspense>
  );
};

export default ChatBotLoader;
