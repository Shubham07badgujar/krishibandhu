const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads');
const cropUploadsDir = path.join(__dirname, 'uploads/crops');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(cropUploadsDir)) {
  fs.mkdirSync(cropUploadsDir, { recursive: true });
}

// Serve uploads directory statically
app.use('/uploads', express.static('uploads'));

// Test routes - NO AUTH REQUIRED
// IMPORTANT: Remove in production
app.use('/test', require('./test-routes'));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/weather", require("./routes/weatherRoutes"));
app.use("/api/schemes", require("./routes/schemeRoutes.js.fixed"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/assistant", require("./routes/assistantRoutes"));
app.use("/api/crop-health", require("./routes/cropHealthRoutes"));
app.use("/api/loans", require("./routes/loanRoutes"));





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
