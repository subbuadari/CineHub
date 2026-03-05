const Rating = require('../models/Rating');

// @desc    Add or update a rating
// @route   POST /api/ratings
exports.addRating = async (req, res) => {
    const { movieId, rating } = req.body;
    const userId = req.user._id;

    console.log(`Adding/updating rating for movie: ${movieId}, rating: ${rating}, user: ${userId}`);

    try {
        if (rating < 1 || rating > 10) {
            return res.status(400).json({ message: 'Rating must be between 1 and 10' });
        }

        // Use findOneAndUpdate with upsert to create or replace
        // Compound index { userId: 1, movieId: 1 } ensures uniqueness
        const movieRating = await Rating.findOneAndUpdate(
            { userId, movieId },
            { rating },
            { new: true, upsert: true, runValidators: true }
        );

        console.log('Rating saved successfully:', movieRating._id);
        res.status(200).json(movieRating);
    } catch (error) {
        console.error('CRITICAL RATING ERROR:', error);
        res.status(500).json({ message: 'Database Error: ' + error.message });
    }
};

// @desc    Get user's rating for a movie
// @route   GET /api/ratings/:movieId
exports.getUserRating = async (req, res) => {
    try {
        const rating = await Rating.findOne({
            userId: req.user._id,
            movieId: req.params.movieId
        });
        res.json(rating || { rating: 0 });
    } catch (error) {
        console.error('GetUserRating Error:', error);
        res.status(500).json({ message: error.message });
    }
};
