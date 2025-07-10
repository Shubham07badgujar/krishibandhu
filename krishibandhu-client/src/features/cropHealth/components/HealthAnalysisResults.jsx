import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const HealthAnalysisResults = ({ results, loading, error }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {t("cropHealth.resultsTitle", "Analysis Results")}
      </h2>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">{t("cropHealth.processingImage", "Processing your image...")}</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-red-800 font-medium">{t("cropHealth.error", "Error")}</h3>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      ) : !results ? (
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p className="mt-2 text-gray-500">{t("cropHealth.noResults", "Upload a crop image to see analysis results")}</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {t("cropHealth.diagnosis", "Diagnosis")}
            </h3>
            <div className="bg-white p-3 rounded-md border border-gray-200">
              <div className="flex items-center mb-2">
                <div className={`w-3 h-3 rounded-full ${
                  results.healthStatus === "healthy" ? "bg-green-500" :
                  results.healthStatus === "moderate" ? "bg-yellow-500" : "bg-red-500"
                } mr-2`}></div>
                <span className="font-medium">
                  {results.healthStatus === "healthy" ? 
                    t("cropHealth.statusHealthy", "Healthy") :
                    results.healthStatus === "moderate" ?
                    t("cropHealth.statusModerate", "Moderately Affected") :
                    t("cropHealth.statusUnhealthy", "Unhealthy")
                  }
                </span>
              </div>
              <p>{results.diagnosis}</p>
            </div>
          </div>

          {results.disease && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {t("cropHealth.identifiedDisease", "Identified Disease")}
              </h3>
              <div className="bg-white p-3 rounded-md border border-gray-200">
                <span className="font-medium text-red-600">{results.disease}</span>
                <p className="mt-1">{results.diseaseDescription}</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {t("cropHealth.recommendations", "Recommendations")}
            </h3>
            <div className="bg-white p-3 rounded-md border border-gray-200">
              <ul className="list-disc list-inside space-y-1">
                {results.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {results.fertilizers && results.fertilizers.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {t("cropHealth.suggestedFertilizers", "Suggested Fertilizers")}
              </h3>
              <div className="bg-white p-3 rounded-md border border-gray-200">
                <ul className="list-disc list-inside space-y-1">
                  {results.fertilizers.map((fert, index) => (
                    <li key={index}>
                      <span className="font-medium">{fert.name}</span>: {fert.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

HealthAnalysisResults.propTypes = {
  results: PropTypes.shape({
    healthStatus: PropTypes.string,
    diagnosis: PropTypes.string,
    disease: PropTypes.string,
    diseaseDescription: PropTypes.string,
    recommendations: PropTypes.arrayOf(PropTypes.string),
    fertilizers: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string
      })
    )
  }),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string
};

export default HealthAnalysisResults;
