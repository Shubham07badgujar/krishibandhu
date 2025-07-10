const User = require("../models/User");
const Scheme = require("../models/Scheme");

const getAdminStats = async (req, res) => {
    try {
        // Basic user stats
        const users = await User.countDocuments();
        const admins = await User.countDocuments({ role: "admin" });
        const schemes = await Scheme.countDocuments();

        // Scheme categories distribution
        const categoryAgg = await Scheme.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        const schemeCategories = {};
        categoryAgg.forEach(cat => {
            schemeCategories[cat._id || "Uncategorized"] = cat.count;
        });
        
        // State distribution
        const stateAgg = await Scheme.aggregate([
            { $group: { _id: "$state", count: { $sum: 1 } } }
        ]);

        const schemeStates = {};
        stateAgg.forEach(state => {
            schemeStates[state._id || "Unspecified"] = state.count;
        });
        
        // Get the latest scheme
        const latestScheme = await Scheme.findOne()
            .sort({ createdAt: -1 })
            .select('title createdAt');
        
        // Count pan-India schemes
        const panIndiaCount = await Scheme.countDocuments({
            $or: [
                { state: { $regex: "pan", $options: "i" } },
                { state: { $regex: "all", $options: "i" } }
            ]
        });
        
        // Build the response with enhanced stats
        res.json({ 
            users, 
            admins, 
            schemes, 
            schemeCategories,
            schemeStates,
            latestScheme: latestScheme ? {
                title: latestScheme.title,
                createdAt: latestScheme.createdAt
            } : null,
            panIndiaSchemes: panIndiaCount,
            stateSpecificSchemes: schemes - panIndiaCount
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        res.status(500).json({ message: "Failed to load stats" });
    }
};

module.exports = { getAdminStats };
