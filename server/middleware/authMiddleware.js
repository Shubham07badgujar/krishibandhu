const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // Log headers for debugging
    console.log("Auth Headers:", req.headers.authorization ? "Authorization header present" : "No Authorization header");
    
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("Auth Error: No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        console.log("Auth Error: User not found for token");
        return res.status(401).json({ message: "User not found" });
      }
      
      console.log("Auth Success: User authenticated", user._id);
      req.user = user;
      next();
    } catch (err) {
      console.log("Auth Error:", err.message);
      res.status(401).json({ message: "Invalid token: " + err.message });
    }
  } catch (err) {
    console.log("Unexpected Auth Error:", err);
    res.status(500).json({ message: "Authentication error" });
  }
};

const restrictToAdmin = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  res.status(403).json({ message: "Access denied: Admin privileges required" });
};

module.exports = { protect, restrictToAdmin };
