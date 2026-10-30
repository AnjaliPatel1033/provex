require('dotenv').config();
const { getTransporter } = require('../config/email');
const { sendAdminNotification } = require('../services/email.service');

const runEmailTest = async () => {
  console.log('Testing Nodemailer SMTP configuration...');
  const transporter = getTransporter();

  if (!transporter) {
    console.log('No SMTP credentials found in .env. Outgoing email will run in simulation mode.');
    return;
  }

  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP Server connection verified successfully!');

    console.log('Sending test email notification...');
    const result = await sendAdminNotification({
      fullName: 'Test User',
      email: 'test@example.com',
      phoneNumber: '+91 9876543210',
      company: 'Test Corp',
      subject: 'Product Design',
      message: 'This is a test message to verify the email notification system.',
      createdAt: new Date()
    });

    console.log('Result:', result);
  } catch (error) {
    console.error('SMTP Verification Failed:', error.message);
  }
};

runEmailTest();
