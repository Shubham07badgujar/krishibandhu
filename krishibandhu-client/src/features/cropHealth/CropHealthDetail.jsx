import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

const CropHealthDetail = () => {
  const { recordId } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/crop-health/${recordId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch record details");
        }

        const data = await response.json();
        setRecord(data.record);
      } catch (err) {
        console.error("Error fetching record:", err);
        setError(err.message || "Failed to load record details");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token && recordId) {
      fetchRecord();
    }
  }, [user?.token, recordId]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color class
  const getStatusBgColor = (status) => {
    switch(status) {
      case 'healthy': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'unhealthy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link 
          to="/crop-health" 
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {t("cropHealth.backToList", "Back to Crop Health")}
        </Link>

        {loading ? (
          <div className="w-full flex justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
            <h2 className="text-red-700 text-xl mb-2">{t("cropHealth.error", "Error")}</h2>
            <p className="text-red-600">{error}</p>
            <Link to="/crop-health" className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              {t("cropHealth.backToList", "Back to Crop Health")}
            </Link>
          </div>
        ) : !record ? (
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
            <h2 className="text-yellow-700 text-xl mb-2">{t("cropHealth.recordNotFound", "Record Not Found")}</h2>
            <p className="text-yellow-600">{t("cropHealth.recordNotFoundMessage", "The requested crop health record could not be found")}</p>
            <Link to="/crop-health" className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              {t("cropHealth.backToList", "Back to Crop Health")}
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              {/* Banner image */}
              <div className="h-64 bg-green-100 flex items-center justify-center">                {record.imageUrl ? (
                  <img 
                    src={`${import.meta.env.VITE_BACKEND_URL}${record.imageUrl}`} 
                    alt={`${record.cropType} analysis`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Status badge */}
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-white font-medium ${getStatusBgColor(record.healthStatus)}`}>
                  {record.healthStatus === "healthy" ? 
                    t("cropHealth.statusHealthy", "Healthy") :
                    record.healthStatus === "moderate" ?
                    t("cropHealth.statusModerate", "Moderately Affected") :
                    t("cropHealth.statusUnhealthy", "Unhealthy")
                  }
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 capitalize">{record.cropType}</h1>
                  <p className="text-gray-500">{formatDate(record.createdAt)}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {t("cropHealth.diagnosis", "Diagnosis")}
                </h2>
                <p className="text-gray-700 mb-4">{record.diagnosis}</p>
                
                {record.disease && (
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {t("cropHealth.identifiedDisease", "Identified Disease")}
                    </h2>
                    <div className="bg-red-50 p-4 rounded-md border border-red-100">
                      <p className="text-red-700 font-medium">{record.disease}</p>
                      {record.diseaseDescription && (
                        <p className="mt-1 text-gray-700">{record.diseaseDescription}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {record.recommendations && record.recommendations.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {t("cropHealth.recommendations", "Recommendations")}
                    </h2>
                    <ul className="list-disc pl-5 space-y-1">
                      {record.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-gray-700">{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {record.fertilizers && record.fertilizers.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {t("cropHealth.suggestedFertilizers", "Suggested Fertilizers")}
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {record.fertilizers.map((fertilizer, index) => (
                        <div key={index} className="bg-green-50 p-4 rounded-md border border-green-100">
                          <p className="text-green-700 font-medium">{fertilizer.name}</p>
                          <p className="mt-1 text-gray-700">{fertilizer.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropHealthDetail;
