import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import WeatherPage from "./pages/WeatherPage";
import SchemesPage from "./features/schemes/SchemesPage";
import "./i18n/i18n";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import { NotificationProvider } from "./context/NotificationContext";
import AdminSchemeDashboard from "./features/admin/schemes/AdminSchemeDashboard";
import AdminLoanDashboard from "./features/admin/loans/AdminLoanDashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import AssistantPage from "./features/assistant/pages/AssistantPage";
import ChatBotLoader from "./features/assistant/ChatBotLoader";
import CropHealthPage from "./features/cropHealth/CropHealthPage";
import CropHealthDetail from "./features/cropHealth/CropHealthDetail";
import CropHealthRecord from "./features/cropHealth/CropHealthRecord";
import LoansPage from "./features/loans/pages/LoansPage";
import NotificationsPage from "./features/notifications/pages/NotificationsPage";
import { GoogleOAuthProvider } from '@react-oauth/google';
import OriginDebugger from "./components/OriginDebugger";

function App() {
  // Debug mode is now completely disabled
  const showDebug = false; // Previously: import.meta.env.DEV || import.meta.env.VITE_SHOW_DEBUG === 'true'

  return (
    <GoogleOAuthProvider 
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      onScriptLoadError={() => console.error("Google OAuth script failed to load")}
      onScriptLoadSuccess={() => console.log("Google OAuth script loaded successfully")}
    >
      <NotificationProvider>
        <div className="bg-green-50 min-h-screen">
          <Navbar />
          {showDebug && <OriginDebugger />}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/weather" element={
              <PrivateRoute>
                <WeatherPage />
              </PrivateRoute>
            } />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route path="/loans" element={
              <PrivateRoute>
                <LoansPage />
              </PrivateRoute>
            } />
            <Route path="/admin/schemes" element={
              <AdminRoute>
                <AdminSchemeDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/loans" element={
              <AdminRoute>
                <AdminLoanDashboard />
              </AdminRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            } />
            <Route path="/assistant" element={
              <PrivateRoute>
                <AssistantPage />
              </PrivateRoute>
            } />
            <Route path="/crop-health" element={
              <PrivateRoute>
                <CropHealthPage />
              </PrivateRoute>
            } />
            <Route path="/crop-health/:recordId" element={
              <PrivateRoute>
                <CropHealthDetail />
              </PrivateRoute>
            } />
            
            <Route path="/notifications" element={
              <PrivateRoute>
                <NotificationsPage />
              </PrivateRoute>
            } />

            {/* Add more routes like /schemes, /shop, etc. later */}
          </Routes>
          
          {/* ChatBot that appears on all pages except login/register */}
          <ChatBotLoader />
        </div>
      </NotificationProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
