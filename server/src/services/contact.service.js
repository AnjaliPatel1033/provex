const Contact = require('../models/Contact');

/**
 * Creates and persists a new contact form submission.
 */
const createSubmission = async (contactData) => {
  const { fullName, email, phoneNumber, subject, company, message } = contactData;

  const newContact = new Contact({
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phoneNumber: phoneNumber.trim(),
    subject: subject.trim(),
    company: company ? company.trim() : '',
    message: message.trim(),
    status: 'New'
  });

  return await newContact.save();
};

/**
 * Fetches recent submissions (useful for admin or verification).
 */
const getSubmissions = async (limit = 20) => {
  return await Contact.find().sort({ createdAt: -1 }).limit(limit);
};

module.exports = {
  createSubmission,
  getSubmissions
};
