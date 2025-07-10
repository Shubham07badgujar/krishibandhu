// testNotifications.js
const mongoose = require('mongoose');
const Notification = require('../models/Notification');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/krishibandhu', {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Create test notifications
const createTestNotifications = async () => {
  try {
    // Find a user from the database (get first user)
    const User = require('../models/User');
    const testUser = await User.findOne({ role: 'user' });
    if (!testUser) {
      console.log('No users found in database. Creating notifications with placeholder IDs.');
    } else {
      console.log(`Found test user: ${testUser.name} (${testUser._id})`);
    }
    
    const userId = testUser ? testUser._id : '1234567890';

    // Create a test notification for admin
    const adminNotification = await Notification.create({
      message: `Test notification for admin - New loan application submitted by ${testUser ? testUser.name : 'Test User'}`,
      forRole: 'admin',
      type: 'loan_application',
      referenceId: '1234567890',
      read: false
    });
    console.log('Admin notification created:', adminNotification);

    // Create a test notification for user
    const userNotification = await Notification.create({
      message: 'Test notification for user - Your loan has been approved!',
      forRole: 'user',
      userId: userId, 
      type: 'loan_status',
      referenceId: '0987654321',
      read: false
    });
    console.log('User notification created:', userNotification);

    // Create a general notification for all users
    const generalNotification = await Notification.create({
      message: 'Important announcement: System maintenance scheduled for tomorrow',
      forRole: 'all',
      type: 'general',
      read: false
    });
    console.log('General notification created:', generalNotification);

    console.log('Test notifications created successfully!');
  } catch (error) {
    console.error('Error creating test notifications:', error);
  }
};

// Run the script
const runTest = async () => {
  const conn = await connectDB();
  await createTestNotifications();
  mongoose.disconnect();
  console.log('Database connection closed');
};

runTest();
