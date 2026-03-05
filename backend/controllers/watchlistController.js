const User = require('../models/User');

// @desc    Get user watchlist
// @route   GET /api/watchlist
exports.getWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json(user.watchlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add movie to watchlist
// @route   POST /api/watchlist
exports.addToWatchlist = async (req, res) => {
    const { movieId, title, posterPath } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Check if movie already in watchlist
            const exists = user.watchlist.find(m => m.movieId === movieId);
            if (exists) {
                return res.status(400).json({ message: 'Movie already in watchlist' });
            }

            user.watchlist.push({ movieId, title, posterPath });
            await user.save();
            res.status(201).json(user.watchlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove movie from watchlist
// @route   DELETE /api/watchlist/:id
exports.removeFromWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.watchlist = user.watchlist.filter(m => m.movieId !== req.params.id);
            await user.save();
            res.json(user.watchlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
