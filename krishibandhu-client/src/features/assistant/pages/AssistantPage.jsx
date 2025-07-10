import { useEffect, useState } from 'react';
import ChatBot from '../components/ChatBot';
import { useTranslation } from 'react-i18next';

const AssistantPage = () => {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch FAQs from API
    setFaqs([
      {
        question: t('assistant.faq.weather'),
        answer: t('assistant.faq.weatherAnswer')
      },
      {
        question: t('assistant.faq.crops'),
        answer: t('assistant.faq.cropsAnswer')
      },
      {
        question: t('assistant.faq.schemes'),
        answer: t('assistant.faq.schemesAnswer')
      },
      {
        question: t('assistant.faq.market'),
        answer: t('assistant.faq.marketAnswer')
      },
      {
        question: t('assistant.faq.pests'),
        answer: t('assistant.faq.pestsAnswer')
      }
    ]);
    setIsLoading(false);
  }, [t]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
        {t('assistant.title') || 'Farming Assistant'}
      </h1>
      
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          {t('assistant.description.title') || 'How can our assistant help you?'}
        </h2>
        <p className="text-gray-700 mb-6">
          {t('assistant.description.content') || 
          'Our AI-powered farming assistant can help answer your questions about crop management, weather forecasts, government schemes, market prices, pest control, and more. Just ask any farming-related question in the chat window.'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              {t('assistant.features.instant') || 'Instant Answers'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('assistant.features.instantDesc') || 'Get immediate responses to your farming queries'}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
              </svg>
              {t('assistant.features.multilingual') || 'Multilingual Support'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('assistant.features.multilingualDesc') || 'Communicate in your preferred language'}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
              </svg>
              {t('assistant.features.personalized') || 'Personalized Advice'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('assistant.features.personalizedDesc') || 'Get recommendations based on your location and needs'}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              {t('assistant.features.knowledge') || 'Agricultural Knowledge'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('assistant.features.knowledgeDesc') || 'Access to extensive farming knowledge and best practices'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          {t('assistant.faqTitle') || 'Frequently Asked Questions'}
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details 
              key={index} 
              className="bg-white p-4 rounded-lg shadow-md group"
            >
              <summary className="font-medium text-green-800 cursor-pointer flex justify-between items-center">
                {faq.question}
                <span className="transition-transform group-open:rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-gray-700">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
      
      {/* ChatBot component will be shown floating on the page */}
      <ChatBot />
    </div>
  );
};

export default AssistantPage;
