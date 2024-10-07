require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const phishingRoutes = require('./routes/phishingRoutes');

const app = express();
app.use(express.json());
app.use(cors());

connectDB(process.env.MONGO_URI);

app.use('/api/user', authRoutes);
app.use('/api/phishing', phishingRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
