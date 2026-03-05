const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cinehub')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'CineHub API is running...' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/user', require('./routes/userRoutes.js'));
app.use('/api/watchlist', require('./routes/watchlistRoutes.js'));
app.use('/api/admin', require('./routes/adminRoutes.js'));
app.use('/api/ratings', require('./routes/ratingRoutes.js'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
