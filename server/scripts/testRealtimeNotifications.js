/**
 * Test script for simulating real-time notifications
 * This script demonstrates how real-time notifications could be implemented
 * using WebSockets in the future.
 */

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

// Simulate real-time notification creation and delivery
const simulateRealtimeNotifications = async () => {
  try {
    console.log("\n=== Real-time Notifications Simulation ===\n");
    
    // Find users for notification targeting
    const adminUser = await User.findOne({ role: 'admin' });
    const regularUser = await User.findOne({ role: 'user' });
    
    if (!adminUser || !regularUser) {
      console.error('Test users not found. Please run createTestUsers.js first.');
      return;
    }
    
    console.log(`Admin User: ${adminUser.name} (${adminUser._id})`);
    console.log(`Regular User: ${regularUser.name} (${regularUser._id})`);
    
    // Create some clean test data - delete existing test notifications
    await Notification.deleteMany({ message: { $regex: /^Real-time Test:/ } });
    
    console.log("\n1. Simulating loan application notification (user → admin)");
    // Step 1: Create a notification in the database
    const loanNotification = await Notification.create({
      message: `Real-time Test: New loan application from ${regularUser.name}`,
      forRole: 'admin',
      type: 'loan_application',
      referenceId: 'loan123',
      read: false,
      createdAt: new Date()
    });
    
    console.log(`Created notification: ${loanNotification._id}`);
    console.log("→ In a WebSocket implementation, the server would emit an event to all admin clients");
    console.log("→ Admin UI would show a real-time notification alert");
    
    // Simulate a delay between notifications
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("\n2. Simulating loan approval notification (admin → user)");
    // Step 2: Create a notification for the user
    const approvalNotification = await Notification.create({
      message: `Real-time Test: Your loan application has been approved`,
      forRole: 'user',
      userId: regularUser._id,
      type: 'loan_status',
      referenceId: 'loan123',
      read: false,
      createdAt: new Date()
    });
    
    console.log(`Created notification: ${approvalNotification._id}`);
    console.log(`→ In a WebSocket implementation, the server would emit an event to user ID: ${regularUser._id}`);
    console.log("→ User's UI would show a real-time notification alert");
    
    // Simulate a delay before system notification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("\n3. Simulating system-wide notification (all users)");
    // Step 3: Create a system-wide notification
    const systemNotification = await Notification.create({
      message: `Real-time Test: System maintenance scheduled for tomorrow`,
      forRole: 'all',
      type: 'general',
      read: false,
      createdAt: new Date()
    });
    
    console.log(`Created notification: ${systemNotification._id}`);
    console.log("→ In a WebSocket implementation, the server would broadcast to all connected clients");
    console.log("→ All users would see a real-time notification alert");
    
    // Simulate real-time reading of notifications
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("\n4. Simulating real-time 'mark as read' action");
    await Notification.findByIdAndUpdate(loanNotification._id, { read: true });
    console.log(`Notification ${loanNotification._id} marked as read`);
    console.log("→ In a WebSocket implementation, this status change would be broadcast to relevant clients");
    console.log("→ Admin UI would update to show the notification as read");
    
    // Simulate real-time deletion of a notification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("\n5. Simulating real-time notification deletion");
    await Notification.findByIdAndDelete(systemNotification._id);
    console.log(`Notification ${systemNotification._id} deleted`);
    console.log("→ In a WebSocket implementation, this deletion would be broadcast to all clients");
    console.log("→ All user UIs would update to remove this notification");
    
    console.log("\n=== Real-time Notifications Simulation Complete ===");
    console.log("\nNote: To implement real-time notifications:");
    console.log("1. Add socket.io package to the server");
    console.log("2. Set up WebSocket connection in the frontend");
    console.log("3. Emit notification events from relevant controller functions");
    console.log("4. Add socket listeners in the NotificationContext to update state");
    
  } catch (error) {
    console.error('Error simulating real-time notifications:', error);
  }
};

// Run the simulation
const runSimulation = async () => {
  const conn = await connectDB();
  await simulateRealtimeNotifications();
  mongoose.disconnect();
  console.log('\nDatabase connection closed');
};

runSimulation();