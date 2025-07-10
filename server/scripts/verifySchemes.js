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

async function verifySchemes() {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/krishibandhu1');
    console.log("Connected to MongoDB");

    // Get total count
    const totalCount = await Scheme.countDocuments();
    console.log(`\n=== SCHEME DATABASE VERIFICATION ===`);
    console.log(`Total schemes in database: ${totalCount}`);
    
    // Get statistics
    const categories = await Scheme.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const states = await Scheme.aggregate([
      { $group: { _id: "$state", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const years = await Scheme.aggregate([
      { $group: { _id: "$year", count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    
    const launchedBy = await Scheme.aggregate([
      { $group: { _id: "$launchedBy", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Display stats
    console.log("\n=== CATEGORY BREAKDOWN ===");
    categories.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} schemes (${(cat.count / totalCount * 100).toFixed(1)}%)`);
    });
    
    console.log("\n=== STATE BREAKDOWN ===");
    const panIndiaCount = states.find(s => s._id === "Pan India")?.count || 0;
    console.log(`Pan India: ${panIndiaCount} schemes (${(panIndiaCount / totalCount * 100).toFixed(1)}%)`);
    console.log(`State-specific: ${totalCount - panIndiaCount} schemes (${((totalCount - panIndiaCount) / totalCount * 100).toFixed(1)}%)`);
    
    states.forEach(state => {
      if (state._id !== "Pan India") {
        console.log(`${state._id}: ${state.count} schemes`);
      }
    });
    
    console.log("\n=== YEAR BREAKDOWN ===");
    const currentYear = new Date().getFullYear();
    const last5Years = years.filter(y => y._id >= (currentYear - 5)).reduce((sum, y) => sum + y.count, 0);
    console.log(`Last 5 years (${currentYear-5}-${currentYear}): ${last5Years} schemes (${(last5Years / totalCount * 100).toFixed(1)}%)`);
    console.log(`Earlier schemes: ${totalCount - last5Years} schemes (${((totalCount - last5Years) / totalCount * 100).toFixed(1)}%)`);
    
    // Test specific queries that users might make
    console.log("\n=== TESTING COMMON QUERIES ===");
    
    // Test 1: Subsidy schemes
    const subsidyCount = await Scheme.countDocuments({ category: "Subsidy" });
    console.log(`Subsidy schemes: ${subsidyCount}`);
    
    // Test 2: Insurance schemes
    const insuranceCount = await Scheme.countDocuments({ category: "Insurance" });
    console.log(`Insurance schemes: ${insuranceCount}`);
    
    // Test 3: Maharashtra schemes
    const maharashtraCount = await Scheme.countDocuments({ state: "Maharashtra" });
    console.log(`Maharashtra schemes: ${maharashtraCount}`);
    
    // Test 4: Recent schemes (last 3 years)
    const recentCount = await Scheme.countDocuments({ year: { $gte: currentYear - 3 } });
    console.log(`Recent schemes (last 3 years): ${recentCount}`);
    
    // Test 5: Text search for "credit"
    const creditCount = await Scheme.countDocuments({ 
      $or: [
        { title: { $regex: 'credit', $options: 'i' } },
        { description: { $regex: 'credit', $options: 'i' } }
      ]
    });
    console.log(`Schemes mentioning "credit": ${creditCount}`);
    
    // Verify a few specific important schemes exist
    console.log("\n=== VERIFYING KEY SCHEMES ===");
    const keySchemes = ["PM-KISAN", "Kisan Credit Card", "Pradhan Mantri Fasal Bima Yojana"];
    
    for (const scheme of keySchemes) {
      const found = await Scheme.findOne({ title: scheme });
      if (found) {
        console.log(`✅ Found: ${scheme}`);
      } else {
        console.log(`❌ Missing: ${scheme}`);
      }
    }
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("\nMongoDB connection closed");
    console.log("\nVerification completed successfully!");
    
  } catch (error) {
    console.error("Error verifying schemes:", error);
    await mongoose.connection.close();
  }
}

// Run the verification function
verifySchemes();
