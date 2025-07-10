const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user._id;
    
    // Filter notifications based on role and user ID
    const query = {
      $or: [
        { forRole: role },
        { forRole: "all" }
      ]
    };
    
    // Add user-specific filter for regular users
    if (role === 'user') {
      query.$or.push({ userId: userId });
    }
    
    const notes = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50); // Limit to prevent large responses

    res.json(notes);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

const createNotification = async (req, res) => {
  try {
    const note = await Notification.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Failed to create notification" });
  }
};

// Internal function to create notifications programmatically
const createSystemNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating system notification:", error);
    return null;
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Failed to update notification" });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndDelete(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

module.exports = { 
  getNotifications, 
  createNotification,
  createSystemNotification,
  markAsRead,
  deleteNotification
};
