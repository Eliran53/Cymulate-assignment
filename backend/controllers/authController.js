require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

const signup = async (req, res) => {
  const { username, password } = req.body;
  console.log(`Signup attempt for user: ${username}`);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });

    console.log(`User created successfully: ${username}`);
    res.json({ message: 'User created successfully'});
  } catch (err) {
    console.error(`Failed to create user: ${username}. Error: ${err.message}`);
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt for user: ${username}`);

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.warn(`Invalid login credentials for user: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });
    console.log(`User logged in successfully: ${username}`);

    res.json({ token });
  } catch (error) {
    console.error(`Login failed for user: ${username}. Error: ${error.message}`);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  console.log('Verifying JWT token');

  if (!token) {
    console.warn(' No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(`Token verified successfully`);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(`Invalid token. Error: ${error.message}`);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = {
  signup,
  login,
  verifyToken,
};
