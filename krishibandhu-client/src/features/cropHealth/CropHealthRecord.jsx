import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

const CropHealthRecord = ({ record }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
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
  
  // Navigate to detail view when clicked
  const handleViewDetails = () => {
    navigate(`/crop-health/${record._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewDetails}>
      {/* Record thumbnail/image */}
      <div className="h-48 bg-gray-200 relative overflow-hidden">        {record.imageUrl && (
          <img 
            src={`${import.meta.env.VITE_BACKEND_URL}${record.imageUrl}`}
            alt={`${record.cropType} health analysis`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
            }}
          />
        )}
        {/* Health status badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.healthStatus)}`}>
          {record.healthStatus === "healthy" && t("cropHealth.statusHealthy", "Healthy")}
          {record.healthStatus === "moderate" && t("cropHealth.statusModerate", "Moderately Affected")}
          {record.healthStatus === "unhealthy" && t("cropHealth.statusUnhealthy", "Unhealthy")}
        </div>
      </div>
      
      {/* Record details */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-800 capitalize">{record.cropType}</h3>
          <span className="text-xs text-gray-500">{record.createdAt && formatDate(record.createdAt)}</span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{record.diagnosis}</p>
        
        {record.disease && (
          <div className="mb-3">
            <span className="text-xs font-medium text-red-700">{t("cropHealth.identifiedDisease")}:</span>
            <span className="text-sm ml-1">{record.disease}</span>
          </div>
        )}
        
        <button 
          className="w-full mt-2 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
        >
          {t("cropHealth.viewDetails", "View Details")}
        </button>
      </div>
    </div>
  );
};

export default CropHealthRecord;