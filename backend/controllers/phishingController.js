require('dotenv').config();
const nodemailer = require('nodemailer');
const PhishingAttempt = require('../models/PhishingAttempt');

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, 
  },
});

const sendPhishingEmail = async (req, res) => {
  const { email } = req.body;
  console.log(`Sending phishing email to: ${email}`); 

  const phishingLink = `http://localhost:5000/api/phishing/clicked?email=${email}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Phishing Awareness Test',
    html: `<p>This is a phishing test. <a href="${phishingLink}">Click here</a> to fail the test.</p>`,
  };

  console.log(`Mail options prepared for: ${email}`);

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.error(`Failed to send email to ${email}. Error:`, error.message);
      return res.status(500).json({ message: 'Failed to send email', error: error.message });
    }

    console.log(`Email sent successfully to ${email}. Response:`, info.response); 

    const attempt = new PhishingAttempt({ email, content: mailOptions.html });
    await attempt.save();
    console.log(`Phishing attempt saved to database for email: ${email}`); 

    res.json({ message: 'Phishing email sent', attempt });
  });
};

const trackPhishingClick = async (req, res) => {
  const { email } = req.query;
  console.log(`Phishing link clicked by: ${email}`);

  const attempt = await PhishingAttempt.findOne({ email, status: 'pending' });
  if (attempt) {
    attempt.status = 'clicked';
    await attempt.save();
    console.log(`Phishing attempt status updated to 'clicked' for email: ${email}`); 
    res.send('Phishing link clicked, status updated');
  } else {
    console.warn(`No pending phishing attempt found for email: ${email}`);
    res.status(404).send('No pending phishing attempt found');
  }
};

const getAllPhishingAttempts = async (req, res) => {
  console.log(`Fetching all phishing attempts from the database`); 
  const attempts = await PhishingAttempt.find().sort({ date: -1 });
  console.log(`Found ${attempts.length} phishing attempts`); 
  res.json(attempts);
};


module.exports = {
  sendPhishingEmail,
  trackPhishingClick,
  getAllPhishingAttempts,
};
