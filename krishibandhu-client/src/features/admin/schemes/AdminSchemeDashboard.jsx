import { useEffect, useState } from "react";
import AdminSchemeForm from "./AdminSchemeForm";
import { useTranslation } from "react-i18next";
import AdminCharts from "../components/AdminCharts";
import { useAuth } from "../../../context/AuthContext";

const AdminSchemeDashboard = () => {
    const { user } = useAuth();
    const [schemes, setSchemes] = useState([]);    const [editing, setEditing] = useState(null);
    const [stats, setStats] = useState({ users: 0, admins: 0, schemes: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const API_BASE = import.meta.env.VITE_BACKEND_URL;const fetchSchemes = async () => {
        setLoading(true);
        setError(null);
        try {
            // For admin dashboard, we want to fetch all schemes by default
            const res = await fetch(`${API_BASE}/api/schemes?limit=100`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            
            if (!res.ok) {
                throw new Error(`Failed to fetch schemes: ${res.status}`);
            }
            
            const data = await res.json();
            setSchemes(data.schemes || data); // support for both responses
        } catch (error) {
            console.error("Error fetching schemes:", error);
            setError("Failed to load schemes. Please try again later.");
        } finally {
            setLoading(false);
        }
    };useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
          
                if (!res.ok) {
                    throw new Error(`Failed to fetch admin stats: ${res.status}`);
                }
          
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
                setError("Failed to load admin statistics. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
    
        if (user?.token) {
            fetchStats();
        }
    }, [user]);const handleSave = async (scheme) => {
        try {
            if (scheme._id) {
                const res = await fetch(`${API_BASE}/api/schemes/${scheme._id}`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                    },
                    body: JSON.stringify(scheme),
                });
                
                if (!res.ok) {
                    throw new Error(`Failed to update scheme: ${res.status}`);
                }
            } else {
                const res = await fetch(`${API_BASE}/api/schemes`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                    },
                    body: JSON.stringify(scheme),
                });
                
                if (!res.ok) {
                    throw new Error(`Failed to create scheme: ${res.status}`);
                }
            }

            await fetchSchemes();
            setEditing(null);
        } catch (error) {
            console.error("Error saving scheme:", error);
            // You could add state for error handling here
        }
    };    const handleDelete = async (id) => {
        if (confirm("Delete this scheme?")) {
            try {
                const res = await fetch(`${API_BASE}/api/schemes/${id}`, { 
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                });
                
                if (!res.ok) {
                    throw new Error(`Failed to delete scheme: ${res.status}`);
                }
                
                await fetchSchemes();
            } catch (error) {
                console.error("Error deleting scheme:", error);
                // You could add state for error handling here
            }
        }
    };    useEffect(() => {
        if (user?.token) {
            fetchSchemes();
        }
    }, [user]);    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-green-800">Admin Dashboard</h1>
                {loading && (
                    <div className="flex items-center text-amber-700">
                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                    </div>
                )}
            </div>
            
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold text-green-700">Dashboard Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-100 p-4 rounded shadow text-center">
                    <h4 className="font-bold text-lg">Total Users</h4>
                    <p className="text-2xl text-green-800">{stats.users}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded shadow text-center">
                    <h4 className="font-bold text-lg">Admins</h4>
                    <p className="text-2xl text-blue-800">{stats.admins}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded shadow text-center">
                    <h4 className="font-bold text-lg">Schemes</h4>
                    <p className="text-2xl text-yellow-800">{stats.schemes}</p>
                </div>
            </div>
            
            {/* Add Schemes Summary Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.413 48.413 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75a2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.413 48.413 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m5.8 4.5v9.75m0-9.75h-5.8m5.8 0c1.012 0 1.867.668 2.15 1.586" />
                    </svg>
                    Schemes Summary
                </h2>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <div className="text-indigo-800 font-medium mb-2 flex justify-between items-center">
                            <span>Total Schemes</span>
                            <span className="text-xl">{stats.schemes}</span>
                        </div>
                        <div className="flex justify-between text-xs text-indigo-600">
                            <span>Last added:</span>
                            {stats.latestScheme ? (
                                <span title={stats.latestScheme.title}>
                                    {new Date(stats.latestScheme.createdAt).toLocaleDateString()}
                                </span>
                            ) : (
                                <span>-</span>
                            )}
                        </div>
                    </div>
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                        <div className="text-amber-800 font-medium mb-2 flex justify-between items-center">
                            <span>Scheme Categories</span>
                            <span className="text-xl">{Object.keys(stats.schemeCategories || {}).length}</span>
                        </div>
                        <div className="flex justify-between text-xs text-amber-600">
                            <span>Most common:</span>
                            {stats.schemeCategories && (
                                <span className="font-medium">
                                    {Object.entries(stats.schemeCategories)
                                        .sort((a, b) => b[1] - a[1])
                                        .slice(0, 1)
                                        .map(([cat, count]) => `${cat} (${count})`)[0] || "-"}
                                </span>
                            )}
                        </div>
                    </div>
                      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                        <div className="text-emerald-800 font-medium mb-2 flex justify-between items-center">
                            <span>Pan India Schemes</span>
                            <span className="text-xl">
                                {stats.panIndiaSchemes || 0}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs text-emerald-600">
                            <span>State-specific schemes:</span>
                            <span>
                                {stats.stateSpecificSchemes || 0}
                            </span>
                        </div>
                    </div>
                </div>
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    {/* Categories distribution */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Categories Distribution</h3>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(stats.schemeCategories || {})
                                .sort((a, b) => b[1] - a[1])
                                .map(([category, count]) => (
                                    <div key={category} className="text-xs bg-blue-50 text-blue-800 py-1 px-2 rounded-full flex items-center border border-blue-100">
                                        <span>{category}: </span>
                                        <span className="ml-1 font-semibold">{count}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    
                    {/* States distribution */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">States Distribution</h3>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(stats.schemeStates || {})
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 10) // Show only top 10 states to avoid cluttering
                                .map(([state, count]) => (
                                    <div key={state} className="text-xs bg-green-50 text-green-800 py-1 px-2 rounded-full flex items-center border border-green-100">
                                        <span>{state}: </span>
                                        <span className="ml-1 font-semibold">{count}</span>
                                    </div>
                                ))
                            }
                            {Object.keys(stats.schemeStates || {}).length > 10 && (
                                <div className="text-xs bg-gray-100 text-gray-600 py-1 px-2 rounded-full">
                                    +{Object.keys(stats.schemeStates || {}).length - 10} more
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-green-700">Manage Schemes</h2>
                    <div className="flex space-x-4">
                        <div className="flex items-center bg-green-50 px-3 py-1 rounded-full text-green-700 text-sm border border-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Last Updated: {new Date().toLocaleTimeString()}
                        </div>
                        <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-sm border border-blue-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                            Total Schemes: {stats.schemes}
                        </div>
                    </div>
                </div>
                <AdminSchemeForm onSave={handleSave} editingScheme={editing} />                <div className="mt-8">                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Existing Schemes</h3>                        <div className="flex items-center">
                            <span className="text-sm bg-green-100 text-green-800 py-1 px-3 rounded-full font-medium">
                                Total: {stats.schemes} schemes
                            </span>
                            <span className="text-sm ml-2 text-gray-500 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                                Showing {schemes.length} schemes
                            </span>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search schemes by title, description or category..."
                                className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-lg focus:ring-green-500 focus:border-green-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                      {schemes.length === 0 && !loading ? (
                        <p className="text-gray-500 italic">No schemes found. Add your first scheme above.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {schemes
                                .filter(scheme => 
                                    searchTerm === "" || 
                                    scheme.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    scheme.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    scheme.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    scheme.state?.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((scheme) => (
                                <div key={scheme._id} className="border rounded-md p-4 bg-white shadow hover:shadow-md transition-shadow">
                                    <h3 className="text-lg font-bold text-green-800">{scheme.title}</h3>
                                    <p className="text-sm my-2">{scheme.description}</p>
                                    <div className="flex gap-2 mt-1 mb-3">
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{scheme.category}</span>
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{scheme.state}</span>
                                    </div>
                                    
                                    <div className="mt-3 flex gap-3 justify-end">
                                        <button 
                                            onClick={() => setEditing(scheme)} 
                                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(scheme._id)} 
                                            className="text-sm text-red-600 hover:text-red-800 flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}                        </div>
                    )}
                      {/* Refresh button if we need to reload the data */}
                    {schemes.length > 0 && (
                        <div className="mt-6 flex justify-center">
                            <button 
                                onClick={() => fetchSchemes()}
                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>
                                Refresh schemes
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="mt-6 text-sm text-gray-500 border-t pt-4 border-gray-100">
                    <p>Last updated: {new Date().toLocaleString()}</p>
                </div>
            </div>

            <AdminCharts />

        </div>
    );
};

export default AdminSchemeDashboard;
