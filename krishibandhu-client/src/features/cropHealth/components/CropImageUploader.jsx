import { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const CropImageUploader = ({ onSubmit, loading }) => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cropType, setCropType] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedImage && cropType) {
      onSubmit(selectedImage, cropType);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {t("cropHealth.uploadTitle", "Upload Crop Image")}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-1">
            {t("cropHealth.cropType", "Crop Type")}
          </label>
          <input
            type="text"
            id="cropType"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            placeholder={t("cropHealth.cropTypePlaceholder", "E.g., Rice, Wheat, Cotton")}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            {t("cropHealth.specifyType", "Please specify the type of crop for more accurate analysis")}
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("cropHealth.selectImage", "Select Image")}
          </label>
          
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">{t("cropHealth.clickToUpload", "Click to upload")}</span>
                </p>
                <p className="text-xs text-gray-500">{t("cropHealth.imageFormats", "PNG, JPG or JPEG")}</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange} 
                required 
              />
            </label>
          </div>
        </div>
        
        {imagePreview && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {t("cropHealth.preview", "Image Preview")}
            </p>
            <div className="w-full flex justify-center border rounded-lg overflow-hidden">
              <img 
                src={imagePreview} 
                alt="Crop preview" 
                className="max-h-64 object-contain" 
              />
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={!selectedImage || !cropType || loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium 
            ${loading || !selectedImage || !cropType 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
            } transition-colors`}
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t("cropHealth.analyzing", "Analyzing...")}
            </div>
          ) : (
            t("cropHealth.analyzeButton", "Analyze Crop")
          )}
        </button>
      </form>
    </div>
  );
};

CropImageUploader.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default CropImageUploader;
