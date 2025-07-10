const mongoose = require('mongoose');
require('dotenv').config();

// Define Scheme model similar to the one used in the app
const schemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    state: { type: String, required: true },
    eligibility: { type: String, required: true },
    link: { type: String },
    launchedBy: { type: String },
    year: { type: Number }
  },
  { timestamps: true }
);

const Scheme = mongoose.model('Scheme', schemeSchema);

async function diagnoseSchemes() {
  try {
    // Connect to database
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/krishibandhu1');
    console.log("Connected to MongoDB");

    // Count schemes
    const totalSchemes = await Scheme.countDocuments();
    console.log(`Total schemes in database: ${totalSchemes}`);
    
    // Get distinct values for key fields to help diagnose issues
    const categories = await Scheme.distinct('category');
    const states = await Scheme.distinct('state');
    const years = await Scheme.distinct('year');
    
    console.log("\nDistinct categories:", categories);
    console.log("Distinct states:", states);
    console.log("Distinct years:", years);
    
    // Test the query used in the app
    console.log("\nTesting typical query with pagination...");
    const queryResults = await Scheme.find({})
      .sort({ createdAt: -1 })
      .limit(9);
      
    console.log(`Query returned ${queryResults.length} schemes`);
    
    // Show sample data
    console.log("\nSample scheme data:");
    if (queryResults.length > 0) {
      const sample = queryResults[0];
      console.log(JSON.stringify(sample, null, 2));
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error in diagnosis:", error);
  }
}

diagnoseSchemes();
