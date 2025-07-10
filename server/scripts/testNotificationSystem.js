// testNotificationSystem.js
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const User = require('../models/User');

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

// Verify notification system
const testNotificationSystem = async () => {
  try {
    console.log("=== Testing Notification System ===");
    
    // 1. Check if notification model exists and is properly configured
    console.log("\n1. Notification Model Check:");
    const notificationSchema = Notification.schema.obj;
    console.log("Notification Schema Fields:", Object.keys(notificationSchema));
    
    // 2. Get user counts by role
    console.log("\n2. User Counts:");
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });
    console.log(`Admin users: ${adminCount}`);
    console.log(`Regular users: ${userCount}`);
    
    // 3. Create test notifications
    console.log("\n3. Creating Test Notifications...");
    
    // Find a test user
    const testUser = await User.findOne({ role: 'user' });
    if (!testUser) {
      console.error('No regular users found in database. Test cannot continue.');
      return;
    }
    console.log(`Test user: ${testUser.name} (${testUser._id})`);
    
    // Find a test admin
    const testAdmin = await User.findOne({ role: 'admin' });
    if (!testAdmin) {
      console.error('No admin users found in database. Testing admin notifications will be limited.');
    } else {
      console.log(`Test admin: ${testAdmin.name} (${testAdmin._id})`);
    }
    
    // Create notifications
    const testNotifications = [
      {
        message: `Test notification for admins - New loan application from ${testUser.name}`,
        forRole: 'admin',
        type: 'loan_application',
        referenceId: '123test456',
        read: false
      },
      {
        message: 'Test notification for specific user - Your loan has been approved',
        forRole: 'user',
        userId: testUser._id,
        type: 'loan_status',
        referenceId: '456test789',
        read: false
      },
      {
        message: 'Test notification for everyone - System maintenance scheduled',
        forRole: 'all',
        type: 'general',
        read: false
      }
    ];
    
    // Create all test notifications
    await Notification.deleteMany({ message: { $regex: /^Test notification/ } });
    const createdNotifications = await Notification.insertMany(testNotifications);
    console.log(`Created ${createdNotifications.length} test notifications`);
    
    // 4. Verify notification retrieval for admin
    if (testAdmin) {
      console.log("\n4. Testing Admin Notification Retrieval:");
      const adminNotifications = await Notification.find({
        $or: [
          { forRole: 'admin' },
          { forRole: 'all' }
        ]
      });
      console.log(`Admin should see ${adminNotifications.length} notifications:`);
      adminNotifications.forEach(n => console.log(`- ${n.message}`));
    }
    
    // 5. Verify notification retrieval for user
    console.log("\n5. Testing User Notification Retrieval:");
    const userNotifications = await Notification.find({
      $or: [
        { forRole: 'user' },
        { forRole: 'all' },
        { userId: testUser._id }
      ]
    });
    console.log(`User ${testUser.name} should see ${userNotifications.length} notifications:`);
    userNotifications.forEach(n => console.log(`- ${n.message}`));
    
    // 6. Test marking notification as read
    console.log("\n6. Testing Mark as Read:");
    if (userNotifications.length > 0) {
      const notificationToMark = userNotifications[0];
      console.log(`Marking notification as read: "${notificationToMark.message}"`);
      await Notification.findByIdAndUpdate(notificationToMark._id, { read: true });
      
      const updatedNotification = await Notification.findById(notificationToMark._id);
      console.log(`Updated notification read status: ${updatedNotification.read}`);
    }
    
    // 7. Test notification deletion
    console.log("\n7. Testing Notification Deletion:");
    if (userNotifications.length > 1) {
      const notificationToDelete = userNotifications[1];
      console.log(`Deleting notification: "${notificationToDelete.message}"`);
      await Notification.findByIdAndDelete(notificationToDelete._id);
      
      const deletedNotification = await Notification.findById(notificationToDelete._id);
      console.log(`Notification deleted successfully: ${deletedNotification === null}`);
    }
    
    console.log("\n=== Notification System Test Complete ===");
    
  } catch (error) {
    console.error('Error testing notification system:', error);
  }
};

// Run the script
const runTest = async () => {
  const conn = await connectDB();
  await testNotificationSystem();
  mongoose.disconnect();
  console.log('Database connection closed');
};

runTest();
