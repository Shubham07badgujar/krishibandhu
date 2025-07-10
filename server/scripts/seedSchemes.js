// server/scripts/seedSchemes.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Scheme = require("../models/Scheme");

dotenv.config();

const seedSchemes = async () => {  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/krishibandhu1');
    console.log("Connected to MongoDB successfully!");

    // Check existing schemes count
    const existingCount = await Scheme.countDocuments();
    console.log(`Found ${existingCount} existing schemes in the database.`);

    // Uncomment the next line if you want to delete existing schemes
    // await Scheme.deleteMany();
    // console.log("Deleted existing schemes.");

    await Scheme.insertMany([
    {
      title: "PM-Kisan Samman Nidhi",
      description: "Direct income support to farmers up to ₹6,000 annually.",
      category: "Subsidy",
      state: "Pan India",
      eligibility: "Small & marginal farmers",
    },
    {
      title: "Fasal Bima Yojana",
      description: "Crop insurance scheme against natural calamities.",
      category: "Insurance",
      state: "Pan India",
      eligibility: "All farmers",
    },  ]);

    console.log("Schemes seeded successfully!");
    
  } catch (error) {
    console.error("Error seeding schemes:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit();
  }
};

seedSchemes();
