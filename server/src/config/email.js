const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!user || !pass) {
    console.warn('[Email Warning] SMTP_USER or SMTP_PASSWORD is not configured in .env. Outgoing emails will be simulated in console.');
    return null;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    },
    // Optional timeout settings
    connectionTimeout: 10000,
    greetingTimeout: 10000
  });

  return transporter;
};

let transporterInstance = null;

const getTransporter = () => {
  if (!transporterInstance) {
    transporterInstance = createTransporter();
  }
  return transporterInstance;
};

module.exports = {
  getTransporter,
  createTransporter
};
