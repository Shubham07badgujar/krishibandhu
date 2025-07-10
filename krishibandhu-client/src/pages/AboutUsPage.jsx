import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const AboutUsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Hero Section */}
      <section className="py-16 px-4 md:px-8 bg-green-700 text-white text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("about.title")}</h1>
          <p className="text-xl md:text-2xl">{t("about.subtitle")}</p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Mission */}
          <div className="bg-green-50 rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-green-800 mb-4">{t("about.mission.title")}</h2>
            <p className="text-gray-700 leading-relaxed">{t("about.mission.description")}</p>
          </div>
          
          {/* Vision */}
          <div className="bg-green-50 rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-green-800 mb-4">{t("about.vision.title")}</h2>
            <p className="text-gray-700 leading-relaxed">{t("about.vision.description")}</p>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-6">{t("about.story.title")}</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-8">{t("about.story.description")}</p>
          <div className="w-20 h-1 bg-green-500 mx-auto"></div>
        </div>
      </section>
      
      {/* Our Team Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-4">{t("about.team.title")}</h2>
          <p className="text-gray-700 text-center mb-12 max-w-3xl mx-auto">{t("about.team.description")}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-green-50 rounded-xl p-6 text-center shadow-md">
              <div className="w-32 h-32 bg-green-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-green-800">{t("about.team.members.member1.name")}</h3>
              <p className="text-green-600 mb-2">{t("about.team.members.member1.role")}</p>
              <p className="text-gray-600">{t("about.team.members.member1.bio")}</p>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-green-50 rounded-xl p-6 text-center shadow-md">
              <div className="w-32 h-32 bg-green-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-green-800">{t("about.team.members.member2.name")}</h3>
              <p className="text-green-600 mb-2">{t("about.team.members.member2.role")}</p>
              <p className="text-gray-600">{t("about.team.members.member2.bio")}</p>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-green-50 rounded-xl p-6 text-center shadow-md">
              <div className="w-32 h-32 bg-green-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-green-800">{t("about.team.members.member3.name")}</h3>
              <p className="text-green-600 mb-2">{t("about.team.members.member3.role")}</p>
              <p className="text-gray-600">{t("about.team.members.member3.bio")}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Approach Section */}
      <section className="py-16 px-4 md:px-8 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">{t("about.approach.title")}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Approach Point 1 */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">{t("about.approach.point1.title")}</h3>
              <p className="text-gray-600">{t("about.approach.point1.description")}</p>
            </div>
            
            {/* Approach Point 2 */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">{t("about.approach.point2.title")}</h3>
              <p className="text-gray-600">{t("about.approach.point2.description")}</p>
            </div>
            
            {/* Approach Point 3 */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">{t("about.approach.point3.title")}</h3>
              <p className="text-gray-600">{t("about.approach.point3.description")}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">{t("about.contact.title")}</h2>
          
          <div className="bg-green-50 rounded-xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Email</p>
                    <p className="text-green-600">{t("about.contact.email")}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Phone</p>
                    <p className="text-green-600">{t("about.contact.phone")}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Address</p>
                    <p className="text-green-600">{t("about.contact.address")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 px-4 md:px-8 bg-green-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">{t("home.ctaTitle")}</h2>
          <p className="text-lg mb-6">{t("home.ctaText")}</p>
          <Link to="/register" className="bg-white text-green-700 px-8 py-3 rounded-lg font-medium hover:bg-green-100 transition duration-200">
            {t("home.ctaButton")}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
