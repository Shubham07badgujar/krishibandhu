import PropTypes from 'prop-types';

const SchemeInfoSection = ({ language = 'en' }) => {
  // Content in different languages
  const content = {
    en: {
      title: "About Agricultural Schemes",
      description: `Agricultural schemes are government initiatives designed to support farmers and improve the agricultural sector. 
        These schemes cover various aspects like subsidies, insurance, credit facilities, infrastructure development, and more. 
        Browse through our comprehensive collection to find schemes that may benefit you.`
    },
    hi: {
      title: "कृषि योजनाओं के बारे में",
      description: `कृषि योजनाएँ सरकारी पहल हैं जो किसानों का समर्थन करने और कृषि क्षेत्र को बेहतर बनाने के लिए डिज़ाइन की गई हैं। 
        इन योजनाओं में सब्सिडी, बीमा, ऋण सुविधाएँ, बुनियादी ढांचा विकास, और अधिक शामिल हैं। 
        आपके लिए लाभकारी योजनाओं को खोजने के लिए हमारे व्यापक संग्रह को ब्राउज़ करें।`
    }
  };

  // Get content based on language
  const { title, description } = content[language] || content.en;

  return (
    <div className="bg-green-50 border border-green-100 rounded-lg p-6 mt-8">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">{title}</h3>
          <p className="text-green-700 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      <div className="mt-4 border-t border-green-100 pt-4">
        <h4 className="text-md font-medium text-green-800 mb-2">Types of Schemes Available:</h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <li className="flex items-center text-sm text-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Subsidies
          </li>
          <li className="flex items-center text-sm text-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Insurance
          </li>
          <li className="flex items-center text-sm text-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Credit Facilities
          </li>
          <li className="flex items-center text-sm text-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Infrastructure
          </li>
          <li className="flex items-center text-sm text-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Extension Services
          </li>
          <li className="flex items-center text-sm text-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Irrigation Schemes
          </li>
          <li className="flex items-center text-sm text-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Marketing Support
          </li>
        </ul>
      </div>
    </div>
  );
};

SchemeInfoSection.propTypes = {
  language: PropTypes.string
};

export default SchemeInfoSection;
