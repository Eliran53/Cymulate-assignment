const express = require('express');
const { sendPhishingEmail, trackPhishingClick, getAllPhishingAttempts } = require('../controllers/phishingController');
const { verifyToken } = require('../controllers/authController');

const router = express.Router();

router.post('/send', verifyToken, sendPhishingEmail);

router.get('/clicked', trackPhishingClick);

router.get('/attempts', verifyToken, getAllPhishingAttempts);

module.exports = router;
