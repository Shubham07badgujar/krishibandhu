const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Setup email transporter with more detailed configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  // Additional configuration for troubleshooting
  debug: process.env.NODE_ENV !== 'production',
  logger: process.env.NODE_ENV !== 'production'
});

// Verify the transporter configuration at startup
(async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Email service connected successfully!');
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    console.error('\nEmail not working! Please check your EMAIL_USER and EMAIL_PASSWORD in .env');
    if (error.code === 'EAUTH') {
      console.error('Authentication error - Make sure you are using an App Password for Gmail');
      console.error('Visit https://myaccount.google.com/apppasswords to generate one');
    }
  }
})();

const sendWelcomeEmail = async (user) => {
  try {
    const mailOptions = {
      from: `KrishiBandhu <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Welcome to KrishiBandhu! Your Registration is Complete",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
          <div style="text-align: center; padding: 10px 0;">
            <h1 style="color: #388e3c;">Welcome to KrishiBandhu!</h1>
            <p style="color: #666;">Your Agricultural Support Platform</p>
          </div>
          <div style="padding: 20px; background-color: white; border-radius: 5px; margin-top: 20px;">
            <p>Dear ${user.name},</p>
            <p>Thank you for registering with KrishiBandhu! We're excited to have you join our growing community of farmers.</p>
            <p>Your account has been successfully created with the email: <strong>${user.email}</strong></p>
            <p>With KrishiBandhu, you can:</p>
            <ul style="padding-left: 20px;">
              <li>Access agricultural schemes and subsidies tailored for you</li>
              <li>Get real-time weather forecasts for your farming location</li>
              <li>Receive personalized farming advice based on your crops</li>
              <li>Connect with our AI-powered farming assistant for instant support</li>
              <li>Stay updated with the latest agricultural news and practices</li>
            </ul>
            <p>We've also noted the following details from your registration:</p>
            <ul style="padding-left: 20px;">
              ${user.village ? `<li><strong>Village:</strong> ${user.village}</li>` : ''}
              ${user.district ? `<li><strong>District:</strong> ${user.district}</li>` : ''}
              ${user.state ? `<li><strong>State:</strong> ${user.state}</li>` : ''}
              ${user.primaryCrop ? `<li><strong>Primary Crop:</strong> ${user.primaryCrop}</li>` : ''}
            </ul>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team at <a href="mailto:support@krishibandhu.com">support@krishibandhu.com</a>.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #388e3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
            </div>
          </div>
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; margin-top: 20px; color: #666;">
            <p>Follow us on social media for the latest agricultural tips and updates.</p>
            <p>&copy; ${new Date().getFullYear()} KrishiBandhu. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent to:", user.email);
    console.log("Message ID:", info.messageId);
    
    return info;
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

const register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      village, 
      district, 
      state, 
      phone, 
      primaryCrop 
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    
    const user = await User.create({ 
      name, 
      email, 
      password: hashed, 
      role,
      village,
      district,
      state,
      phone,
      primaryCrop
    });

    // Send welcome email
    await sendWelcomeEmail(user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      village: user.village,
      district: user.district,
      state: user.state,
      phone: user.phone,
      primaryCrop: user.primaryCrop,
      token: generateToken(user),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        console.log("User not found:", email);
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("Password mismatch for user:", email);
        return res.status(401).json({ message: "Invalid email or password" });
      }      // Send login notification email
      try {
        const loginNotification = {
          from: `KrishiBandhu <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "New Login to Your KrishiBandhu Account",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <div style="text-align: center; padding: 10px 0;">
                <h1 style="color: #388e3c;">KrishiBandhu Account Login</h1>
              </div>
              <div style="padding: 20px 0;">
                <p>Dear ${user.name},</p>
                <p>We detected a new login to your KrishiBandhu account on ${new Date().toLocaleString()}.</p>
                <p>If this was you, no action is needed. If you did not login, please contact our support team immediately.</p>
                <p>Login details:</p>
                <ul>
                  <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
                  <li><strong>Email:</strong> ${user.email}</li>
                </ul>
              </div>
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; margin-top: 20px; color: #666;">
                <p>&copy; ${new Date().getFullYear()} KrishiBandhu. All rights reserved.</p>
              </div>
            </div>
          `
        };
        
        // Use await to ensure email is sent before responding
        await transporter.sendMail(loginNotification);
        console.log("Login notification email sent to:", user.email);
      } catch (emailError) {
        console.error("Error sending login notification email:", emailError);
      }
  
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        village: user.village,
        district: user.district,
        state: user.state,
        phone: user.phone,
        primaryCrop: user.primaryCrop,
        token: generateToken(user),
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };  const googleAuth = async (req, res) => {
    try {
      const { credential } = req.body;
      
      if (!credential) {
        return res.status(400).json({ message: "Google credential is required" });
      }
      
      // Import the required library
      const { OAuth2Client } = require('google-auth-library');
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      
      // Verify the token
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      const { email, name, sub: googleId, picture } = payload;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required from Google authentication" });
      }
      
      // Check if user exists
      let user = await User.findOne({ email });
      
      if (user) {
        // Update Google ID if not present
        if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }
          // Send login notification email
        try {
          const loginNotification = {
            from: `KrishiBandhu <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "New Google Sign-In to Your KrishiBandhu Account",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
                <div style="text-align: center; padding: 10px 0;">
                  <h1 style="color: #388e3c;">KrishiBandhu Account Sign-In</h1>
                </div>
                <div style="padding: 20px; background-color: white; border-radius: 5px; margin-top: 20px;">
                  <p>Dear ${user.name},</p>
                  <p>We detected a new Google sign-in to your KrishiBandhu account on ${new Date().toLocaleString()}.</p>
                  <p>If this was you, no action is needed. If you did not sign in, please contact our support team immediately.</p>
                  <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #388e3c; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Sign-in Details:</strong></p>
                    <p style="margin: 5px 0;">Time: ${new Date().toLocaleString()}</p>
                    <p style="margin: 5px 0;">Method: Google Authentication</p>
                    <p style="margin: 5px 0;">Email: ${user.email}</p>
                  </div>
                  <p>If you did not perform this login, please secure your account by:</p>
                  <ol>
                    <li>Changing your Google account password</li>
                    <li>Contacting our support team at support@krishibandhu.com</li>
                  </ol>
                </div>
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; margin-top: 20px; color: #666;">
                  <p>&copy; ${new Date().getFullYear()} KrishiBandhu. All rights reserved.</p>
                </div>
              </div>
            `
          };
          const info = await transporter.sendMail(loginNotification);
          console.log("Google login notification email sent to:", user.email);
          console.log("Message ID:", info.messageId);
        } catch (emailErr) {
          console.error("Error sending login notification:", emailErr);
        }
      } else {
        // Create new user
        const randomPassword = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        
        user = await User.create({
          name,
          email,
          googleId,
          password: hashedPassword,
          emailVerified: true,
          picture
        });
        
        // Send welcome email
        await sendWelcomeEmail(user);
      }
      
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        village: user.village,
        district: user.district,
        state: user.state,
        phone: user.phone,
        primaryCrop: user.primaryCrop,
        token: generateToken(user)
      });
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(500).json({ message: "Google authentication failed" });
    }
  };
  
  const updateProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const { name, email, password, village, district, state, phone, primaryCrop } = req.body;
  
      if (name) user.name = name;
      if (email) user.email = email;
      if (village) user.village = village;
      if (district) user.district = district;
      if (state) user.state = state;
      if (phone) user.phone = phone;
      if (primaryCrop) user.primaryCrop = primaryCrop;
      if (password) user.password = await bcrypt.hash(password, 10);
  
      const updated = await user.save();
  
    res.json({
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        village: updated.village,
        district: updated.district,
        state: updated.state,
        phone: updated.phone,
        primaryCrop: updated.primaryCrop,
        role: updated.role,
        token: generateToken(updated),
      });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ message: "Profile update failed" });
    }
  };  

module.exports = { register, login, updateProfile, googleAuth };
