const nodemailer = require("nodemailer");

// Setup email transporter with configuration from .env
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  debug: process.env.NODE_ENV !== 'production',
  logger: process.env.NODE_ENV !== 'production'
});

// Verify the transporter configuration
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    console.error('\nEmail not working! Please check your EMAIL_USER and EMAIL_PASSWORD in .env');
    if (error.code === 'EAUTH') {
      console.error('Authentication error - Make sure you are using an App Password for Gmail');
    }
    return false;
  }
};

/**
 * Send email notification for loan status update
 * @param {Object} loan - The loan object with updated status
 * @param {Object} user - The user who applied for the loan
 */
const sendLoanStatusEmail = async (loan, user) => {
  try {
    if (!user || !user.email) {
      console.error("Cannot send loan status email: User email not provided");
      return null;
    }

    // Status-specific content
    let subject, statusText, statusColor, additionalInfo;
    
    if (loan.status === 'approved' || loan.status === 'active') {
      subject = "Good News! Your KrishiBandhu Loan Application is Approved";
      statusText = "APPROVED";
      statusColor = "#388e3c"; // Green
      additionalInfo = `
        <div style="background-color: #f5f9f5; border-left: 4px solid #388e3c; padding: 15px; margin: 15px 0;">
          <p><strong>Loan Details:</strong></p>
          <ul style="padding-left: 20px;">
            <li>Loan Amount: ₹${loan.amount.toLocaleString()}</li>
            <li>EMI: ₹${loan.emi.toLocaleString()} per month</li>
            <li>Tenure: ${loan.tenure} months</li>
            <li>Disbursement Date: ${new Date(loan.disbursedDate).toLocaleDateString()}</li>
            <li>First Payment Due: ${new Date(loan.nextPaymentDate).toLocaleDateString()}</li>
          </ul>
        </div>
        <p>The approved funds will be disbursed to your registered bank account within 2-3 business days.</p>
        <p>Please log in to your KrishiBandhu account to view complete loan details and repayment schedule.</p>
      `;
    } else if (loan.status === 'rejected') {
      subject = "Update on Your KrishiBandhu Loan Application";
      statusText = "NOT APPROVED";
      statusColor = "#d32f2f"; // Red
      additionalInfo = `
        <div style="background-color: #fdf5f5; border-left: 4px solid #d32f2f; padding: 15px; margin: 15px 0;">
          <p>We regret to inform you that we are unable to approve your loan application at this time.</p>
          <p>This decision was based on our current lending criteria and the information provided.</p>
        </div>
        <p>You may reapply after 3 months with updated documents or additional collateral information.</p>
        <p>For more information or to discuss other financial options, please contact our support team.</p>
      `;
    } else if (loan.status === 'completed') {
      subject = "Congratulations! Your KrishiBandhu Loan is Fully Repaid";
      statusText = "COMPLETED";
      statusColor = "#1976d2"; // Blue
      additionalInfo = `
        <div style="background-color: #f5f9ff; border-left: 4px solid #1976d2; padding: 15px; margin: 15px 0;">
          <p><strong>Congratulations!</strong> You have successfully repaid your loan in full.</p>
          <p>We appreciate your timely payments and commitment.</p>
        </div>
        <p>This demonstrates your excellent credit standing with KrishiBandhu, which may qualify you for higher loan amounts and better terms on future loans.</p>
      `;
    } else {
      subject = "Update on Your KrishiBandhu Loan Application";
      statusText = loan.status.toUpperCase();
      statusColor = "#ff9800"; // Orange for other statuses
      additionalInfo = `
        <p>Your loan application is currently under review by our team.</p>
        <p>We will notify you once a decision has been made. Thank you for your patience.</p>
      `;
    }

    const mailOptions = {
      from: `KrishiBandhu <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
          <div style="text-align: center; padding: 10px 0;">
            <h1 style="color: #388e3c;">KrishiBandhu Loan Update</h1>
          </div>
          
          <div style="padding: 20px; background-color: white; border-radius: 5px; margin-top: 20px;">
            <p>Dear ${user.name},</p>
            
            <p>We are writing to inform you about an update to your loan application for <strong>${loan.type === 'cropLoan' ? 'Crop Loan' : loan.type === 'equipmentLoan' ? 'Equipment Loan' : 'Land Loan'}</strong>.</p>
            
            <div style="text-align: center; margin: 25px 0;">
              <div style="display: inline-block; background-color: ${statusColor}; color: white; padding: 10px 20px; border-radius: 5px; font-weight: bold; font-size: 18px;">
                ${statusText}
              </div>
            </div>
            
            ${additionalInfo}
            
            <p>If you have any questions, please contact our support team at <a href="mailto:support@krishibandhu.com">support@krishibandhu.com</a> or call us at <strong>1800-123-4567</strong>.</p>
            
            <p>Thank you for choosing KrishiBandhu for your agricultural financial needs.</p>
            
            <p>Best regards,<br>The KrishiBandhu Team</p>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; margin-top: 20px; color: #666;">
            <p>&copy; ${new Date().getFullYear()} KrishiBandhu. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Loan status email sent to ${user.email} for loan ID: ${loan._id}`);
    console.log("Message ID:", info.messageId);
    
    return info;
  } catch (error) {
    console.error("Error sending loan status email:", error);
    return null;
  }
};

module.exports = {
  verifyEmailConfig,
  sendLoanStatusEmail
};
