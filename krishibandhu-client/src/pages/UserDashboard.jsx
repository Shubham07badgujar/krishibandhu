import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


const UserDashboard = () => {
    const { user, logout, login } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [cities, setCities] = useState([]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    useEffect(() => {
        const fetchCities = async () => {
            try {
                if (!user?.token) {
                    return; // Don't attempt to fetch if no token
                }
                
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/bookmark-cities`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                
                if (!res.ok) {
                    console.error(`Error fetching bookmarked cities: ${res.status}`);
                    return;
                }
                
                const data = await res.json();
                setCities(data);
            } catch (error) {
                console.error("Failed to fetch bookmarked cities:", error);
                setCities([]);
            }
        };
        
        fetchCities();
    }, [user?.token]);

    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
    });
    const [message, setMessage] = useState("");

    const handleProfileChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
            },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (res.ok) {
            login(data); // update user context
            setMessage("Profile updated!");
        } else {
            setMessage(data.message || "Update failed");
        }
    };


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                
                if (!res.ok) {
                    console.error(`Error fetching notifications: ${res.status}`);
                    return;
                }
                
                const data = await res.json();
                setNotifications(data);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
                // Set empty notifications array on error
                setNotifications([]);
            }
        };
        
        if (user?.token) {
            fetchNotifications();
        }
    }, [user?.token]);
    return (
        <div className="p-6 max-w-4xl mx-auto bg-green-50">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-green-600 to-green-400 p-6 rounded-lg shadow-lg mb-8 text-white">
                <h1 className="text-3xl font-bold">
                    {t("dashboard.title", "Welcome,")} {user?.name} 👋
                </h1>
                <p className="mt-2 opacity-80">Your personal farming dashboard</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Left column - Profile */}
                <div className="md:col-span-1">
                    <div className="bg-white shadow-md rounded-lg p-6 border-t-4 border-green-500">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-3xl font-bold border-2 border-green-300">
                                {user?.name?.substring(0, 1).toUpperCase()}
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-green-700 text-center mb-4">{user?.name}</h2>
                        <div className="space-y-2 text-gray-700">
                            <p><span className="font-medium">Email:</span> {user?.email}</p>
                            <p><span className="font-medium">Role:</span> {user?.role}</p>
                            {user?.district && <p><span className="font-medium">District:</span> {user.district}</p>}
                            {user?.state && <p><span className="font-medium">State:</span> {user.state}</p>}
                            {user?.primaryCrop && <p><span className="font-medium">Primary Crop:</span> {user.primaryCrop}</p>}
                        </div>
                        <button
                            onClick={() => document.getElementById('updateProfileModal').classList.remove('hidden')}
                            className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Update Profile
                        </button>
                    </div>
                </div>

                {/* Right column - Dashboard widgets */}
                <div className="md:col-span-2 space-y-6">
                    {/* Quick Access */}
                    <div className="bg-white shadow-md rounded-lg p-6 border-t-4 border-green-500">
                        <h2 className="text-xl font-semibold text-green-700 flex items-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {t("dashboard.quickAccess")}
                        </h2>                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <Link to="/schemes" className="bg-green-100 hover:bg-green-200 p-4 rounded-lg text-center transition-colors">
                                <div className="text-3xl mb-2">📜</div>
                                <div className="text-green-800 font-medium">{t("navbar.schemes")}</div>
                            </Link>
                            <Link to="/weather" className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg text-center transition-colors">
                                <div className="text-3xl mb-2">☀️</div>
                                <div className="text-blue-800 font-medium">{t("navbar.weather")}</div>
                            </Link>
                            <Link to="/crop-health" className="bg-emerald-100 hover:bg-emerald-200 p-4 rounded-lg text-center transition-colors">
                                <div className="text-3xl mb-2">🌱</div>
                                <div className="text-emerald-800 font-medium">{t("navbar.cropHealth", "Crop Health")}</div>
                            </Link>
                            <Link to="/assistant" className="bg-purple-100 hover:bg-purple-200 p-4 rounded-lg text-center transition-colors">
                                <div className="text-3xl mb-2">🤖</div>
                                <div className="text-purple-800 font-medium">AI Assistant</div>
                            </Link>
                            <button onClick={handleLogout} className="bg-red-100 hover:bg-red-200 p-4 rounded-lg text-center transition-colors">
                                <div className="text-3xl mb-2">🚪</div>
                                <div className="text-red-800 font-medium">{t("auth.logout")}</div>
                            </button>
                        </div>
                    </div>

                    {/* Weather Cities */}
                    {cities.length > 0 && (
                        <div className="bg-white shadow-md rounded-lg p-6 border-t-4 border-blue-500">
                            <h2 className="text-xl font-semibold text-blue-700 flex items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Saved Weather Locations
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {cities.map((city, idx) => (
                                    <Link
                                        key={idx}
                                        to={`/weather?city=${encodeURIComponent(city)}`}
                                        className="bg-blue-50 hover:bg-blue-100 p-3 rounded-md text-center transition-colors"
                                    >
                                        <span className="text-blue-700 font-medium">{city}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notifications */}
                    <div className="bg-white shadow-md rounded-lg p-6 border-t-4 border-yellow-500">
                        <h2 className="text-xl font-semibold text-yellow-700 flex items-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            Notifications
                        </h2>
                        {notifications.length > 0 ? (
                            <ul className="space-y-3">
                                {notifications.map(n => (
                                    <li key={n._id} className="bg-yellow-50 p-3 rounded-md text-gray-700 flex items-start">
                                        <span className="text-yellow-600 mr-2">•</span>
                                        {n.message}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic text-center py-4">No new notifications</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Update Modal */}
            <div id="updateProfileModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-xl font-semibold text-green-700 mb-4">Update Your Profile</h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-1">Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={form.name} 
                                onChange={handleProfileChange}
                                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={form.email} 
                                onChange={handleProfileChange}
                                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">New Password (leave blank to keep current)</label>
                            <input 
                                type="password" 
                                name="password" 
                                value={form.password} 
                                onChange={handleProfileChange}
                                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                            />
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button 
                                type="button" 
                                onClick={() => document.getElementById('updateProfileModal').classList.add('hidden')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Update Profile
                            </button>
                        </div>
                    </form>
                    {message && <p className="mt-4 text-sm font-medium text-green-600">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
