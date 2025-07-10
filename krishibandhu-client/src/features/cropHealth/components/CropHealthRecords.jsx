import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import CropHealthRecord from "../CropHealthRecord";

const CropHealthRecords = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch user's crop health records
    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/crop-health`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch crop health records");
        }
          const data = await response.json();
        
        // Check if data contains records array, otherwise use empty array
        if (data && data.success && Array.isArray(data.records)) {
          setRecords(data.records);
        } else {
          console.warn("API response missing expected records array:", data);
          setRecords([]);
          // Show error message if API indicates an error
          if (data && !data.success) {
            setError(data.message || "Server returned an error");
          }
        }
      } catch (err) {
        console.error("Error fetching crop health records:", err);
        setError(err.message || "Failed to load records");
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.token) {
      fetchRecords();
    }
  }, [user?.token]);
  
  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Color based on health status
  const getStatusColor = (status) => {
    switch(status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'unhealthy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {t("cropHealth.previousAnalysis", "Previous Analysis Records")}
      </h2>
      
      {loading ? (
        <div className="w-full flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-700 border border-red-200">
          <p>{error}</p>
        </div>
      ) : !records || records.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-600">{t("cropHealth.noRecords", "No analysis records found")}</p>
          <p className="mt-2 text-gray-500">{t("cropHealth.uploadFirst", "Upload a crop image to create your first record")}</p>
        </div>
      ) : (        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record) => (
            <CropHealthRecord key={record._id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CropHealthRecords;
