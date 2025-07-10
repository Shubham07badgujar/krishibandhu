import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {user ? (
        // Logged-in user view
        <>
          {/* Hero Section for Logged-in Users */}
          <section className="py-16 px-4 md:px-8 text-center">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
                {t("welcome")}, {user.name || user.email.split('@')[0]}!
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8">
                {t("home.welcomeBack")}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/dashboard"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
                >
                  {t("navbar.dashboard")}
                </Link>
                <Link
                  to="/schemes"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
                >
                  {t("home.exploreSchemes")}
                </Link>
                <Link
                  to="/assistant"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
                >
                  {t("home.askAssistant")}
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section for Logged-in Users */}
          <section className="py-16 px-4 md:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
                {t("home.quickActions")}
              </h2>              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Quick Action 1 */}
                <div className="bg-green-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">{t("home.feature1.title")}</h3>
                  <p className="text-gray-600">{t("home.feature1.description")}</p>
                  <Link to="/schemes" className="mt-4 inline-block text-green-600 font-medium hover:underline">
                    {t("home.viewSchemes")} →
                  </Link>
                </div>
                
                {/* Quick Action 2 */}
                <div className="bg-green-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">{t("home.feature2.title")}</h3>
                  <p className="text-gray-600">{t("home.feature2.description")}</p>
                  <Link to="/weather" className="mt-4 inline-block text-green-600 font-medium hover:underline">
                    {t("home.checkWeather")} →
                  </Link>
                </div>
                
                {/* Quick Action 3 */}
                <div className="bg-green-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">{t("home.feature3.title")}</h3>
                  <p className="text-gray-600">{t("home.feature3.description")}</p>
                  <Link to="/assistant" className="mt-4 inline-block text-green-600 font-medium hover:underline">
                    {t("home.chatWithAssistant")} →
                  </Link>
                </div>

                {/* Quick Action 4 - Loans */}                <div className="bg-green-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 md:col-span-3">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">{t("home.feature4.title")}</h3>
                  <p className="text-gray-600">{t("home.feature4.description")}</p>
                  <Link to="/loans" className="mt-4 inline-block text-green-600 font-medium hover:underline">
                    {t("loans.applyNow")} →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        // Logged-out user view
        <>
          {/* Hero Section for Logged-out Users */}
          <section className="py-20 px-4 md:px-8 text-center">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-6">
                {t("welcome")}
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8">
                {t("home.tagline")}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/login"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
                >
                  {t("auth.login")}
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
                >
                  {t("auth.register")}
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section for Logged-out Users */}
          <section className="py-16 px-4 md:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
                {t("home.featuresTitle")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-green-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">{t("home.feature1.title")}</h3>
                  <p className="text-gray-600">{t("home.feature1.description")}</p>
                </div>
                
                {/* Feature 2 */}
                <div className="bg-green-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">{t("home.feature2.title")}</h3>
                  <p className="text-gray-600">{t("home.feature2.description")}</p>
                </div>
                
                {/* Feature 3 */}
                <div className="bg-green-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">{t("home.feature3.title")}</h3>
                  <p className="text-gray-600">{t("home.feature3.description")}</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}      
      {/* Stats Section - visible to both logged-in and logged-out users */}
      <section className="py-16 px-4 md:px-8 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            {t("home.statsTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-4xl font-bold text-green-600 mb-2">{t("home.stats.farmers")}</h3>
              <p className="text-gray-700">Served</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-4xl font-bold text-green-600 mb-2">{t("home.stats.schemes")}</h3>
              <p className="text-gray-700">Cataloged</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-4xl font-bold text-green-600 mb-2">{t("home.stats.states")}</h3>
              <p className="text-gray-700">Across India</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section - visible to both logged-in and logged-out users */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            {t("home.testimonialTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium">{t("home.testimonial1.author")}</p>
                </div>
              </div>
              <p className="italic text-gray-700">"{t("home.testimonial1.quote")}"</p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium">{t("home.testimonial2.author")}</p>
                </div>
              </div>
              <p className="italic text-gray-700">"{t("home.testimonial2.quote")}"</p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium">{t("home.testimonial3.author")}</p>
                </div>
              </div>
              <p className="italic text-gray-700">"{t("home.testimonial3.quote")}"</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action - conditionally shown based on authentication status */}
      {!user && (
        <section className="py-16 px-4 md:px-8 bg-green-600 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{t("home.ctaTitle")}</h2>
            <p className="text-xl mb-6">{t("home.ctaText")}</p>
            <Link to="/register" className="bg-white text-green-700 px-8 py-3 rounded-lg font-medium hover:bg-green-100 transition duration-200">
              {t("home.ctaButton")}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;

