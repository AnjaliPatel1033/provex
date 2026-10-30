const { getTransporter } = require('../config/email');

/**
 * Generates the HTML body for the admin notification email.
 */
const generateEmailTemplate = ({ fullName, email, phoneNumber, company, subject, message, createdAt }) => {
  const formattedDate = new Date(createdAt || Date.now()).toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
    }
    .wrapper {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 24px 30px;
      text-align: left;
    }
    .header h1 {
      margin: 0 0 6px 0;
      font-size: 20px;
      letter-spacing: 0.5px;
      color: #38bdf8;
    }
    .header p {
      margin: 0;
      font-size: 13px;
      color: #94a3b8;
    }
    .content {
      padding: 30px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: 9999px;
      background-color: #e0f2fe;
      color: #0369a1;
      margin-bottom: 20px;
    }
    .table-details {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .table-details th,
    .table-details td {
      padding: 10px 12px;
      text-align: left;
      font-size: 14px;
      vertical-align: top;
      border-bottom: 1px solid #f1f5f9;
    }
    .table-details th {
      width: 30%;
      color: #64748b;
      font-weight: 600;
      background-color: #f8fafc;
    }
    .table-details td {
      color: #0f172a;
    }
    .message-box {
      background-color: #f8fafc;
      border-left: 4px solid #0284c7;
      padding: 16px;
      border-radius: 0 6px 6px 0;
      margin-top: 15px;
      white-space: pre-wrap;
      font-size: 14px;
      color: #1e293b;
    }
    .footer {
      background-color: #f8fafc;
      padding: 16px 30px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>PROVEX ENGINEERING</h1>
      <p>Contact Us Form Notification</p>
    </div>
    <div class="content">
      <span class="badge">New Enquiry</span>
      
      <table class="table-details">
        <tr>
          <th>Customer Name</th>
          <td><strong>${fullName}</strong></td>
        </tr>
        <tr>
          <th>Email Address</th>
          <td><a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a></td>
        </tr>
        <tr>
          <th>Phone Number</th>
          <td><a href="tel:${phoneNumber}" style="color: #0284c7; text-decoration: none;">${phoneNumber}</a></td>
        </tr>
        ${company ? `<tr><th>Company</th><td>${company}</td></tr>` : ''}
        <tr>
          <th>Subject / Service</th>
          <td>${subject}</td>
        </tr>
        <tr>
          <th>Submission Date</th>
          <td>${formattedDate}</td>
        </tr>
      </table>

      <h3 style="font-size: 14px; color: #475569; margin: 20px 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em;">Message</h3>
      <div class="message-box">${message}</div>
    </div>
    <div class="footer">
      <p>This email was automatically generated from the Provex website contact form.</p>
      <p>Click "Reply" to respond directly to ${fullName} (${email}).</p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

/**
 * Sends notification email to administrator.
 * Gracefully handles failure so database records remain intact.
 */
const sendAdminNotification = async (submissionData) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@provexinds.com';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'no-reply@provexinds.com';

  const transporter = getTransporter();

  // If no SMTP credentials are configured, log the notification to stdout (development simulation)
  if (!transporter) {
    console.log('\n================== SIMULATED ADMIN EMAIL ==================');
    console.log(`To: ${adminEmail}`);
    console.log(`From: ${fromEmail}`);
    console.log(`Reply-To: ${submissionData.fullName} <${submissionData.email}>`);
    console.log(`Subject: New Contact Form Submission – Website: ${submissionData.subject}`);
    console.log(`Name: ${submissionData.fullName}`);
    console.log(`Email: ${submissionData.email}`);
    console.log(`Phone: ${submissionData.phoneNumber}`);
    console.log(`Subject: ${submissionData.subject}`);
    console.log(`Message: ${submissionData.message}`);
    console.log('===========================================================\n');
    return { success: true, simulated: true };
  }

  const mailOptions = {
    from: `"Provex Website" <${fromEmail}>`,
    to: adminEmail,
    replyTo: `"${submissionData.fullName}" <${submissionData.email}>`,
    subject: `New Contact Form Submission – Website: ${submissionData.subject}`,
    text: `
New Contact Form Submission - Provex Website

Customer Name: ${submissionData.fullName}
Email Address: ${submissionData.email}
Phone Number: ${submissionData.phoneNumber}
Company: ${submissionData.company || 'N/A'}
Subject: ${submissionData.subject}
Submission Date: ${new Date(submissionData.createdAt || Date.now()).toISOString()}

Message:
${submissionData.message}
    `.trim(),
    html: generateEmailTemplate(submissionData)
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Sent] Admin notification sent successfully to ${adminEmail} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Error] Failed to send admin notification email: ${error.message}`);
    // Non-blocking: record remains safely in DB
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendAdminNotification,
  generateEmailTemplate
};
