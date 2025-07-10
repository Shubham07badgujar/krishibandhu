// Google Auth Helper Functions

/**
 * Process the Google OAuth response
 * @param {Object} response - The response from Google OAuth
 * @returns {Object} - Formatted user data
 */
export const processGoogleResponse = (response) => {
  if (!response || !response.credential) {
    console.error('Invalid Google response:', response);
    throw new Error('Invalid Google response');
  }
  
  // Log success for debugging purposes
  console.log('Google OAuth response received successfully');
  
  // You can decode the credential to get user info if needed
  // For now we just return the credential to send to backend
  return {
    credential: response.credential
  };
};

/**
 * Get Google OAuth configuration
 * @returns {Object} - Google OAuth configuration options
 */
export const getGoogleOAuthConfig = () => {
  // Log the current origin for debugging purposes
  const currentOrigin = window.location.origin;
  console.log('Current origin for Google OAuth:', currentOrigin);
  
  // Add more verbose logging to help diagnose issues
  console.log('Google OAuth Config:', {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'Set (hidden for security)' : 'Not set',
    environment: import.meta.env.MODE,
    redirectURI: `${currentOrigin}/oauth-callback`
  });
  
  return {
    useOneTap: true,
    // Changed to implicit for simplicity - no server-side exchange needed
    flow: 'implicit',
    // Popup is more reliable across different environments
    ux_mode: 'popup',
    shape: 'pill',
    size: 'large',
    width: '300',
    // Comprehensive error handling
    onScriptLoadError: (err) => {
      console.error('Google Sign In script failed to load:', err);
      alert('Failed to load Google Sign-In. Please check your internet connection and try again.');
    },
    // Enhanced error handling with specific error codes
    onError: (error) => {
      console.error('Google OAuth Error:', error);
      
      // Log specific error information if available
      if (error.error) {
        console.error('Error code:', error.error);
      }
      
      // Check for common errors
      if (error.error === 'popup_closed_by_user') {
        console.log('User closed the sign-in popup');
      } else if (error.error === 'access_denied') {
        console.log('User denied access');
      } else if (error.error === 'immediate_failed') {
        console.log('Automatic sign-in failed');
      } else if (error.error === 'idpiframe_initialization_failed') {
        console.log('Google Sign-In initialization failed. Possible causes: Invalid client ID, Invalid origin, or Cookie policy issues');
      }
    }
  };
};
