const mongoose = require('mongoose');

const phishingAttemptSchema = new mongoose.Schema({
  email: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['pending', 'clicked'], default: 'pending' },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PhishingAttempt', phishingAttemptSchema);