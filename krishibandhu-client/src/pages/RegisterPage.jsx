import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { GoogleLogin } from '@react-oauth/google';
import { getGoogleOAuthConfig } from "../utils/googleAuth";

const RegisterPage = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1: Personal Info, 2: Farm Info
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    village: "",
    district: "",
    state: "",
    phone: "",
    primaryCrop: "",
    role: "user",
    agreedToTerms: false
  });

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal"
  ];

  const commonCrops = [
    "Rice", "Wheat", "Maize", "Millets", "Pulses", "Cotton", "Sugarcane", "Oilseeds", 
    "Fruits", "Vegetables", "Tea", "Coffee", "Rubber", "Spices", "Other"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const nextStep = () => {
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!form.name || !form.email || !form.password) {
      setError("Please fill all required fields");
      return;
    }
    
    setError("");
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.agreedToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const { confirmPassword, agreedToTerms, ...submitData } = form;
      
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        login(data);
        navigate("/dashboard");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
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
  };    const handleGoogleError = (errorResponse) => {
    console.error("Google Sign-up Error:", errorResponse);
    
    // Provide more detailed error feedback based on error type
    let errorMessage = "Google sign-up failed: Please try again.";
    
    if (errorResponse) {
      if (errorResponse.error === 'popup_closed_by_user') {
        errorMessage = "Sign-up canceled: You closed the Google sign-in window.";
      } else if (errorResponse.error === 'access_denied') {
        errorMessage = "Access denied: You didn't grant permission for the sign-up.";
      } else if (errorResponse.error === 'immediate_failed') {
        errorMessage = "Automatic sign-up failed: Please try clicking the sign-up button.";
      } else if (errorResponse.error === 'redirect_uri_mismatch') {
        errorMessage = "Configuration error: Please contact support (URI mismatch).";
        console.error("Google OAuth redirect URI mismatch. Current origin:", window.location.origin);
      } else if (errorResponse.error) {
        errorMessage = `Google sign-up error: ${errorResponse.error}`;
      }
    }
    
    setError(errorMessage);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-green-600 py-4">
          <h1 className="text-center text-2xl font-bold text-white">{t("auth.createAccount")}</h1>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {/* Progress Steps */}
          <div className="flex mb-8 justify-center">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'}`}>
                1
              </div>
              <div className="text-sm ml-2">{t("auth.personalInfo")}</div>
            </div>
            <div className="w-10 h-0.5 mx-2 self-center bg-gray-300"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'}`}>
                2
              </div>
              <div className="text-sm ml-2">{t("auth.farmInfo")}</div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {currentStep === 1 ? (
              // Step 1: Personal Information
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("auth.name")} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="name"
                    name="name"
                    type="text" 
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" 
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("auth.email")} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="email"
                    name="email"
                    type="email" 
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" 
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("auth.password")} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" 
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm {t("auth.password")} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" 
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("auth.phone")}
                  </label>
                  <input 
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" 
                  />
                </div>
                
                <div className="pt-4">
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              // Step 2: Farm Information
              <div className="space-y-4">
                <div>
                  <label htmlFor="village" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("auth.village")}
                  </label>
                  <input 
                    id="village"
                    name="village"
                    type="text" 
                    value={form.village}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" 
                  />
                </div>
                
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("auth.district")}
                  </label>
                  <input 
                    id="district"
                    name="district"
                    type="text" 
                    value={form.district}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" 
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("auth.state")}
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="primaryCrop" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("auth.primaryCrop")}
                  </label>
                  <select
                    id="primaryCrop"
                    name="primaryCrop"
                    value={form.primaryCrop}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">Select Primary Crop</option>
                    {commonCrops.map((crop) => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="agreedToTerms"
                    name="agreedToTerms"
                    type="checkbox"
                    checked={form.agreedToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreedToTerms" className="ml-2 block text-sm text-gray-700">
                    {t("auth.terms")}
                  </label>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="w-1/2 flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Back
                  </button>
                  
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className={`w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? t("loading") : t("auth.signUp")}
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === 1 && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">{t("auth.signUp")} with</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-center">                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      text="signup_with"
                      {...getGoogleOAuthConfig()}
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {t("auth.alreadyHaveAccount")}{" "}
              <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                {t("auth.signIn")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
