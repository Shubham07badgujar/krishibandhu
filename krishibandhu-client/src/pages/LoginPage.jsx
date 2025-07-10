import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { GoogleLogin } from '@react-oauth/google';
import { getGoogleOAuthConfig } from "../utils/googleAuth";

const LoginPage = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        login(data);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Send the ID token to your backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          credential: credentialResponse.credential
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        login(data);
        navigate("/dashboard");
      } else {
        setError(data.message || "Google authentication failed");
      }
    } catch (err) {
      console.error("Google auth error:", err);
      setError("Server error during Google authentication");
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleError = (errorResponse) => {
    console.error("Google Sign-in Error:", errorResponse);
    
    // Provide more detailed error feedback based on error type
    let errorMessage = "Google sign-in failed: Please try again.";
    
    if (errorResponse) {
      if (errorResponse.error === 'popup_closed_by_user') {
        errorMessage = "Sign-in canceled: You closed the Google sign-in window.";
      } else if (errorResponse.error === 'access_denied') {
        errorMessage = "Access denied: You didn't grant permission for the sign-in.";
      } else if (errorResponse.error === 'immediate_failed') {
        errorMessage = "Automatic sign-in failed: Please try clicking the sign-in button.";
      } else if (errorResponse.error === 'redirect_uri_mismatch') {
        errorMessage = "Configuration error: Please contact support (URI mismatch).";
        console.error("Google OAuth redirect URI mismatch. Current origin:", window.location.origin);
      } else if (errorResponse.error) {
        errorMessage = `Google sign-in error: ${errorResponse.error}`;
      }
    }
    
    setError(errorMessage);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-green-600 py-4">
          <h1 className="text-center text-2xl font-bold text-white">{t("auth.welcomeBack")}</h1>
        </div>
        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t("auth.email")}
              </label>
              <input 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t("auth.password")}
                </label>
                <a href="#" className="text-sm text-green-600 hover:text-green-500">
                  {t("auth.forgotPassword")}
                </a>
              </div>
              <input 
                id="password"
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" 
              />
            </div>
            
            <div>
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? t("loading") : t("auth.signIn")}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t("auth.signIn")} with</span>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-center">                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="signin_with"
                  {...getGoogleOAuthConfig()}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {t("auth.noAccount")}{" "}
              <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                {t("auth.signUp")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
