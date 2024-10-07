# Phishing Awareness Backend

## Overview
This is the backend for the Phishing Awareness web application. It provides user authentication using JWT, phishing email handling, and tracks phishing attempts. The backend is built using **Node.js**, **Express.js**, **MongoDB**, and **Nodemailer**.

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (locally or cloud instance)
- Gmail or other SMTP email service for sending emails (used by Nodemailer)

## Installation

1. Clone the repository and navigate to the backend folder:

   ```bash
   git clone https://github.com/your-repo/phishing-awareness-app.git
   cd phishing-awareness-app/backend
   npm install
   Create a .env file in the backend folder with the following variables:
    JWT_SECRET=your_jwt_secret
    MONGO_URI=mongodb://localhost:27017/phishingApp
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_email_password
2. To start the server:
    npm start


