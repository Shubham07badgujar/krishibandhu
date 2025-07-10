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

// Sample additional schemes to add
const additionalSchemes = [
  {
    title: "Kisan Credit Card Scheme",
    description: "Provides farmers with credit for their agricultural needs at reasonable interest rates. It offers pre-approved credit limits based on the farmer's landholding size and productivity.",
    category: "Credit",
    state: "Pan India",
    eligibility: "All farmers, tenant farmers, share croppers, and agricultural laborers. Ownership of land is not mandatory.",
    link: "https://pmkisan.gov.in",
    launchedBy: "Government of India",
    year: 2022
  },
  {
    title: "Paramparagat Krishi Vikas Yojana",
    description: "Promotes organic farming practices and helps farmers adopt organic cultivation methods. Provides financial assistance for certification, marketing, and other aspects of organic farming.",
    category: "Organic Farming",
    state: "Pan India",
    eligibility: "Farmers willing to adopt organic farming practices and form clusters.",
    link: "https://pgsindia-ncof.gov.in/pkvy/index.aspx",
    launchedBy: "Ministry of Agriculture",
    year: 2021
  },
  {
    title: "Maharashtra Agriculture Farm Ponds",
    description: "Scheme for construction of farm ponds to collect rainwater for irrigation purposes during dry periods, specifically designed for the farmers of Maharashtra.",
    category: "Water Management",
    state: "Maharashtra",
    eligibility: "Farmers with land ownership in Maharashtra, with priority to small and marginal farmers.",
    link: "https://mahaagri.gov.in",
    launchedBy: "Government of Maharashtra",
    year: 2023
  }
];

async function addMoreSchemes() {
  try {
    // Connect to database
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/krishibandhu1');
    console.log("Connected to MongoDB");

    // Count schemes before adding
    const beforeCount = await Scheme.countDocuments();
    console.log(`Existing schemes in database: ${beforeCount}`);
    
    // Add new schemes
    console.log("Adding additional sample schemes...");
    const result = await Scheme.insertMany(additionalSchemes);
    
    // Count schemes after adding
    const afterCount = await Scheme.countDocuments();
    console.log(`\nSuccessfully added ${result.length} new schemes!`);
    console.log(`Total schemes now in database: ${afterCount}`);
    
    // Show the newly added schemes
    console.log("\nNewly added schemes:");
    for (const scheme of result) {
      console.log(`- ${scheme.title} (${scheme.category}, ${scheme.state})`);
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log("\nMongoDB connection closed");
  } catch (error) {
    console.error("Error adding schemes:", error);
  }
}

addMoreSchemes();
