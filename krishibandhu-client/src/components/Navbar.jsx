import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import NotificationBell from "../features/notifications/components/NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState(i18n.language || "en");

  const handleLanguageChange = (lng) => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-2 text-green-700 text-xl font-bold"
        >
          <span>🌾</span>
          <span>KrishiBandhu</span>
        </Link>

        <nav className="flex items-center space-x-6 text-sm font-medium text-gray-700">
          <Link to="/">{t("navbar.home")}</Link>
          <Link to="/about">{t("navbar.about")}</Link>          {user && (            <>              <Link to="/dashboard">{t("navbar.dashboard")}</Link>
              <Link to="/schemes">{t("navbar.schemes")}</Link>
              <Link to="/loans" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
                {t("navbar.loans")}
              </Link>
              <Link to="/weather">{t("navbar.weather")}</Link>
              <Link to="/crop-health" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
                </svg>
                {t("navbar.cropHealth", "Crop Health")}
              </Link>              <Link to="/assistant" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                {t("navbar.assistant") || "Assistant"}
              </Link>
              
              {/* Notification Bell */}
              <div className="ml-2">
                <NotificationBell />
              </div>{user.role === "admin" && (
                <div className="relative group">
                  <button 
                    className="flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-md border border-amber-200 hover:bg-amber-200 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    Admin
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  <div className="absolute z-50 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-150 ease-in-out">
                    <div className="py-1">
                      <Link 
                        to="/admin/schemes" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Manage Schemes
                      </Link>
                      <Link 
                        to="/admin/loans" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Manage Loans
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="text-red-600 hover:underline"
              >
                {t("auth.logout")}
              </button>
            </>
          )}          {!user && (
            <>
              <Link to="/login">{t("auth.login")}</Link>
              <Link to="/register">{t("auth.register")}</Link>
            </>
          )}

          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="border px-2 py-1 rounded text-sm bg-green-100 text-green-700"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="bn">বাংলা</option>
          </select>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

{
  /* <button onClick={handleLogout} className="text-red-600">
                {t("auth.logout")}
              </button> */
}
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// const Navbar = () => {
//   const { t, i18n } = useTranslation();

//   const changeLanguage = (lng) => {
//     i18n.changeLanguage(lng);
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-white shadow-md border-b border-green-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <span className="text-green-600 text-2xl font-extrabold">🌾</span>
//           <span className="text-xl font-bold text-green-800">KrishiBandhu</span>
//         </div>

//         <nav className="hidden md:flex space-x-6 font-medium text-gray-700">
//           <Link to="/" className="hover:text-green-600">{t("navbar.home")}</Link>
//           <Link to="/weather" className="hover:text-green-600">{t("navbar.weather")}</Link>
//           <Link to="/schemes" className="hover:text-green-600">{t("navbar.schemes")}</Link>

//           {/* Add more links like /schemes, /shop, etc. */}
//         </nav>

//         <div className="flex items-center space-x-4">
//           <select
//             onChange={(e) => changeLanguage(e.target.value)}
//             value={i18n.language}
//             className="bg-green-100 text-green-800 rounded px-2 py-1"
//           >
//             <option value="en">English</option>
//             <option value="hi">हिंदी</option>
//           </select>

//           <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded font-semibold shadow-sm">
//             {t("navbar.login")}
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
