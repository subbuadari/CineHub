const User = require('../models/User');
const Rating = require('../models/Rating');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        // Aggregate watchlist data
        const users = await User.find({}, 'watchlist');
        let totalWatchlistSaves = 0;
        users.forEach(user => {
            totalWatchlistSaves += user.watchlist.length;
        });

        // Calculate Average Rating
        const ratings = await Rating.find({}, 'rating');
        const avgRating = ratings.length > 0
            ? (ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length).toFixed(1) + '/10'
            : '0/10';

        res.json({
            totalUsers,
            totalWatchlistSaves,
            topGenre: 'N/A',
            avgRating: avgRating,
            apiCalls: 'N/A',
            activeUsers: totalUsers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users for management
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get ratings distribution (1-10)
// @route   GET /api/admin/ratings-distribution
exports.getRatingsDistribution = async (req, res) => {
    try {
        const ratings = await Rating.find({}, 'rating');
        const dist = {};
        for (let i = 1; i <= 10; i++) dist[i] = 0;
        ratings.forEach(r => {
            const v = Math.round(r.rating);
            if (v >= 1 && v <= 10) dist[v]++;
        });
        res.json(dist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
