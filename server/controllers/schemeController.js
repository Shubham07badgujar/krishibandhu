const Scheme = require("../models/Scheme");
const User = require("../models/User");

const getSchemes = async (req, res) => {
    try {
        const { state, category, launchedBy, search, page = 1, limit } = req.query;

        const PAGE_SIZE = 6;
        const skip = (page - 1) * PAGE_SIZE;

        let filter = {};

        if (state && state !== "All") filter.state = state;
        if (category && category !== "All") filter.category = category;
        if (launchedBy && launchedBy !== "All") filter.launchedBy = launchedBy;
        
        // Enhanced search to look in title, description, and eligibility
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { eligibility: { $regex: search, $options: "i" } }
            ];
        }
        
        const totalCount = await Scheme.countDocuments(filter);
        console.log(`Found ${totalCount} schemes matching filter:`, filter);
        
        // If limit parameter is provided, use it instead of PAGE_SIZE
        const limitValue = limit ? parseInt(limit) : PAGE_SIZE;
        
        // Build the query with proper sorting
        const query = Scheme.find(filter).sort({ createdAt: -1 });
        
        // Apply pagination unless we're requesting all schemes
        if (!limit || limitValue < 100) {
            query.skip(skip).limit(limitValue);
        } else {
            // For large limits (like 100), we're probably trying to get all schemes
            query.limit(limitValue);
        }
        
        const schemes = await query;
        console.log(`Returning ${schemes.length} schemes with pagination: page=${page}, limit=${limitValue}`);
        
        // Log the first scheme for debugging if any exist
        if (schemes.length > 0) {
            console.log("First scheme:", {
                id: schemes[0]._id,
                title: schemes[0].title,
                category: schemes[0].category,
                state: schemes[0].state
            });
        }

        res.json({
            schemes,
            totalSchemes: totalCount,
            totalPages: Math.ceil(totalCount / PAGE_SIZE),
        });
    } catch (err) {
        console.error("Error fetching schemes:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
const createScheme = async (req, res) => {
    try {
        console.log("Creating new scheme:", req.body);
        const scheme = new Scheme(req.body);
        const saved = await scheme.save();
        console.log("New scheme created successfully with ID:", saved._id);
        res.status(201).json(saved);
    } catch (err) {
        console.error("Error creating scheme:", err);
        res.status(400).json({ message: "Error creating scheme", error: err.message });
    }
};

const updateScheme = async (req, res) => {
    try {
        const updated = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: "Error updating scheme", error: err.message });
    }
};

const deleteScheme = async (req, res) => {
    try {
        await Scheme.findByIdAndDelete(req.params.id);
        res.json({ message: "Scheme deleted" });
    } catch (err) {
        res.status(400).json({ message: "Error deleting scheme", error: err.message });
    }
};

const saveScheme = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const schemeId = req.params.id;
  
    if (!user.savedSchemes.includes(schemeId)) {
      user.savedSchemes.push(schemeId);
      await user.save();
    }
  
    res.json({ message: "Scheme saved" });
  } catch (err) {
    console.error("Error saving scheme:", err);
    res.status(500).json({ message: "Error saving scheme", error: err.message });
  }
};
  
const getSavedSchemes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedSchemes");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user.savedSchemes);
  } catch (err) {
    console.error("Error getting saved schemes:", err);
    res.status(500).json({ message: "Error getting saved schemes", error: err.message });
  }
};

module.exports = {
    getSchemes,
    createScheme,
    updateScheme,
    deleteScheme,
    saveScheme,
    getSavedSchemes,    
};


// module.exports = { getSchemes };
