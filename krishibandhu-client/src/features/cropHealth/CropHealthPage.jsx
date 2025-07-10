import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import CropImageUploader from "./components/CropImageUploader";
import HealthAnalysisResults from "./components/HealthAnalysisResults";
import CropHealthRecords from "./components/CropHealthRecords";

const CropHealthPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  
  const handleImageUpload = async (imageFile, cropType) => {
    setLoading(true);
    setError(null);
      try {
      // Verify user authentication
      if (!user || !user.token) {
        throw new Error(t("error.authMissing", "User authentication missing. Please login again."));
      }
      
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("cropType", cropType);
      
      // Browser automatically sets the Content-Type header with boundary for FormData
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/crop-health/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Error analyzing crop image");
      }
      
      setAnalysisResults(data);
    } catch (err) {
      console.error("Error analyzing crop:", err);
      setError(err.message || "Failed to analyze crop image");
      setAnalysisResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
        {t("cropHealth.title", "Crop Health Monitoring")}
      </h1>
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            {t("cropHealth.description", "Upload images of your crops to analyze their health, identify potential diseases, and receive fertilizer recommendations.")}
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <CropImageUploader 
              onSubmit={handleImageUpload} 
              loading={loading} 
            />
            
            <HealthAnalysisResults 
              results={analysisResults} 
              loading={loading}
              error={error}
            />          </div>
          
          {/* Divider */}
          <hr className="my-8 border-gray-200" />
          
          {/* Past Records Section */}
          <CropHealthRecords />
        </div>
      </div>
    </div>
  );
};

export default CropHealthPage;
