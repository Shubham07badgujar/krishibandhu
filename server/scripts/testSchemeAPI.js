const mongoose = require('mongoose');
require('dotenv').config();
const fetch = require('node-fetch');

// Define models similar to those in the app
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

// Test cases
const testCases = [
  {
    name: "Get all schemes with no filter",
    endpoint: "/api/schemes?limit=100",
    expectMinCount: 5, // We should have at least 5 schemes after our additions
  },
  {
    name: "Get schemes with Pan India filter",
    endpoint: "/api/schemes?state=Pan%20India&limit=100",
    expectMinCount: 3, // We should have at least 3 Pan India schemes
  },
  {
    name: "Get schemes with Maharashtra filter",
    endpoint: "/api/schemes?state=Maharashtra&limit=100",
    expectMinCount: 1, // At least one Maharashtra scheme
  },
  {
    name: "Search for 'farm' in schemes",
    endpoint: "/api/schemes?search=farm&limit=100",
    expectMinCount: 1, // Should find Maharashtra Agriculture Farm Ponds
  },
  {
    name: "Test pagination - page 1 with 2 items per page",
    endpoint: "/api/schemes?page=1&limit=2",
    expectCount: 2, // Should get exactly 2 items
  },
  {
    name: "Test pagination - page 2 with 2 items per page",
    endpoint: "/api/schemes?page=2&limit=2",
    expectMinCount: 1, // Should get at least 1 item on page 2
  }
];

async function runTests() {
  try {
    // Connect to database
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/krishibandhu1');
    console.log("Connected to MongoDB");
    
    // Count how many schemes we have in total
    const totalSchemes = await Scheme.countDocuments();
    console.log(`Total schemes in database before tests: ${totalSchemes}`);
    
    if (totalSchemes < 5) {
      console.warn("Warning: Database has fewer than 5 schemes. Some tests may fail.");
    }
      // Run API tests
    console.log("\n=== RUNNING API TESTS ===");
    const BASE_URL = "http://localhost:5000/api";
    
    // Check if server is running
    try {
      console.log("Checking if server is running at", BASE_URL);
      const healthCheck = await fetch("http://localhost:5000/");
      console.log(`Server status: ${healthCheck.status} ${healthCheck.statusText}`);
    } catch (err) {
      console.error("❌ ERROR: Server does not appear to be running. Make sure the server is started on port 5000 before running tests.");
      console.log("Skipping API tests since server is not available.");
      await mongoose.connection.close();
      return;
    }
    
    for (const test of testCases) {
      try {
        console.log(`\nTEST: ${test.name}`);
        console.log(`Endpoint: ${test.endpoint}`);
        
        const url = `${BASE_URL}${test.endpoint}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`❌ FAILED - Status ${response.status}: ${response.statusText}`);
          continue;
        }
        
        const data = await response.json();
        const count = data.schemes ? data.schemes.length : 0;
        
        // Log result details
        console.log(`Received ${count} schemes`);
        if (count > 0) {
          console.log(`Sample: "${data.schemes[0].title}" (${data.schemes[0].category})`);
        }
        
        // Validate expectations
        if (test.expectCount !== undefined && count === test.expectCount) {
          console.log(`✅ PASSED - Got exactly ${count} schemes as expected`);
        } else if (test.expectMinCount !== undefined && count >= test.expectMinCount) {
          console.log(`✅ PASSED - Got ${count} schemes (expected at least ${test.expectMinCount})`);
        } else if (test.expectCount !== undefined) {
          console.error(`❌ FAILED - Expected exactly ${test.expectCount} schemes, got ${count}`);
        } else if (test.expectMinCount !== undefined) {
          console.error(`❌ FAILED - Expected at least ${test.expectMinCount} schemes, got ${count}`);
        }
        
      } catch (err) {
        console.error(`❌ ERROR in test "${test.name}":`, err.message);
      }
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log("\nMongoDB connection closed");
    console.log("\nTests completed!");
    
  } catch (error) {
    console.error("Error in tests:", error);
  }
}

console.log("Starting API tests for schemes...");
runTests();
