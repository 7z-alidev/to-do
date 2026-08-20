const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text, otpCode }) => {
  // Console logging for instant dev verification
  console.log('\n=================================================');
  console.log(`✉️  EMAIL VERIFICATION OTP SENT TO: ${to}`);
  console.log(`🔑  VERIFICATION OTP CODE IS: ${otpCode}`);
  console.log('=================================================\n');

  try {
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      // Create ethereal test account if no custom SMTP configured
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const info = await transporter.sendMail({
      from: `"TaskPulse Security" <${process.env.SMTP_FROM || 'noreply@taskpulse.app'}>`,
      to,
      subject,
      text,
      html
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`🔗 Ethereal Email Preview URL: ${previewUrl}`);
    }

    return info;
  } catch (error) {
    console.error('Failed to send email:', error.message);
    // Don't throw error in dev mode so flow proceeds smoothly using console log
    return null;
  }
};

module.exports = sendEmail;
