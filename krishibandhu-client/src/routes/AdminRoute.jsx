import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Function to show a temporary notification
  const showAccessDeniedNotification = () => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 
      'fixed top-24 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50 transition-all duration-500';
    notification.style.transform = 'translateX(100%)';
    notification.innerHTML = `
      <div class="flex items-center">
        <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <p><strong>Access Denied:</strong> Admin privileges required</p>
      </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 4000);
  };

  useEffect(() => {
    // Show notification if not admin but tried to access admin route
    if (user && user.role !== "admin") {
      showAccessDeniedNotification();
    }
  }, [location.pathname]);

  // Check if user exists and has admin role
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Redirect to dashboard if user is not an admin
  if (user && user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  // Allow access if user is admin
  return children;
};

export default AdminRoute;
