// Script to check schemes in the database
const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');
require('dotenv').config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/krishibandhu1')
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Check total number of schemes
      const totalSchemes = await Scheme.countDocuments({});
      console.log(`Total schemes in database: ${totalSchemes}`);

      // Get all schemes
      const schemes = await Scheme.find({}).sort({ createdAt: -1 });
      
      if (schemes.length === 0) {
        console.log('No schemes found in the database');
      } else {
        console.log('\nListing all schemes:');
        schemes.forEach((scheme, index) => {
          console.log(`\nScheme ${index + 1}/${schemes.length}:`);
          console.log(`  ID: ${scheme._id}`);
          console.log(`  Title: ${scheme.title}`);
          console.log(`  Category: ${scheme.category}`);
          console.log(`  State: ${scheme.state}`);
          console.log(`  Created: ${scheme.createdAt}`);
        });
      }
    } catch (error) {
      console.error('Error fetching schemes:', error);
    } finally {
      // Close the connection
      mongoose.connection.close();
      console.log('\nMongoDB connection closed');
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
