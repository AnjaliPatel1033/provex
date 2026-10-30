const contactService = require('../services/contact.service');
const emailService = require('../services/email.service');

/**
 * Handles incoming contact form submission.
 * 1. Saves valid submission to the database.
 * 2. Triggers asynchronous email notification to admin.
 * 3. Gracefully responds to client even if email delivery fails.
 */
const submitContactForm = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, subject, company, message } = req.body;

    // Step 1: Save submission in MongoDB
    const savedContact = await contactService.createSubmission({
      fullName,
      email,
      phoneNumber,
      subject,
      company,
      message
    });

    console.log(`[Contact] New submission saved in database: ID=${savedContact.id}, Email=${savedContact.email}`);

    // Step 2: Trigger admin notification email
    // Handled safely so failures don't roll back the DB record
    const emailResult = await emailService.sendAdminNotification({
      fullName: savedContact.fullName,
      email: savedContact.email,
      phoneNumber: savedContact.phoneNumber,
      company: savedContact.company,
      subject: savedContact.subject,
      message: savedContact.message,
      createdAt: savedContact.createdAt
    });

    // Step 3: Return consistent API response
    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received and our team will get back to you shortly.',
      data: {
        id: savedContact.id,
        fullName: savedContact.fullName,
        email: savedContact.email,
        phoneNumber: savedContact.phoneNumber,
        subject: savedContact.subject,
        status: savedContact.status,
        createdAt: savedContact.createdAt
      },
      emailDelivered: emailResult.success
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Optional endpoint for checking service health and recent submissions
 */
const getContactHealth = async (req, res, next) => {
  try {
    res.json({
      success: true,
      service: 'Provex Contact API',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactForm,
  getContactHealth
};
