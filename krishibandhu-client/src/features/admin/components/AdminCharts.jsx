import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from "chart.js";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const AdminCharts = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    admins: 0,
    schemeCategories: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate random colors for pie chart segments
  const generateChartColors = (count) => {
    const baseColors = [
      '#10B981', // green
      '#3B82F6', // blue
      '#F59E0B', // amber
      '#EF4444', // red
      '#8B5CF6', // violet
      '#EC4899', // pink
      '#F97316', // orange
      '#14B8A6', // teal
    ];
    
    // If we have more categories than base colors, generate additional colors
    if (count <= baseColors.length) {
      return baseColors.slice(0, count);
    }
    
    // Generate additional random colors
    const colors = [...baseColors];
    for (let i = baseColors.length; i < count; i++) {
      const r = Math.floor(Math.random() * 200) + 55; // avoid too dark colors
      const g = Math.floor(Math.random() * 200) + 55;
      const b = Math.floor(Math.random() * 200) + 55;
      colors.push(`rgb(${r}, ${g}, ${b})`);
    }
    
    return colors;
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.token) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch admin stats: ${res.status}`);
        }
        
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching admin stats for charts:", err);
        setError("Failed to load analytics data. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user?.token]);
  // Enhanced chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      }
    }
  };
  
  // Bar chart data
  const barData = {
    labels: ["Regular Users", "Admins"],
    datasets: [
      {
        label: "User Count",
        data: [stats.users - stats.admins, stats.admins],
        backgroundColor: ["#10B981", "#3B82F6"],
        borderColor: ["#065F46", "#1E40AF"],
        borderWidth: 1,
        borderRadius: 6,
        hoverOffset: 8
      }
    ]
  };

  // Pie chart data for scheme categories
  const categoryLabels = Object.keys(stats.schemeCategories || {});
  const pieData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Number of Schemes",
        data: Object.values(stats.schemeCategories || {}),
        backgroundColor: generateChartColors(categoryLabels.length),
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 12
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg shadow-inner">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mb-3"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-red-800">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* User Distribution Chart */}
        <div className="bg-white shadow-md rounded-lg p-5 border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
            <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">👥</span>
            User Distribution
          </h3>
          <div className="h-64">
            <Bar 
              data={barData} 
              options={chartOptions} 
            />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
            <p>Total users: <span className="font-semibold">{stats.users}</span></p>
          </div>
        </div>

        {/* Scheme Categories Chart */}
        <div className="bg-white shadow-md rounded-lg p-5 border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
            <span className="bg-green-100 text-green-600 p-1 rounded-md mr-2">📊</span>
            Scheme Categories
          </h3>
          <div className="h-64">
            <Pie 
              data={pieData} 
              options={chartOptions} 
            />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
            <p>Total schemes: <span className="font-semibold">{stats.schemes}</span></p>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 text-center pt-4 border-t border-gray-200">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default AdminCharts;
