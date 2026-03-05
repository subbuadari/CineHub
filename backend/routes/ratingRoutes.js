const express = require('express');
const router = express.Router();
const { addRating, getUserRating } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', addRating);
router.get('/:movieId', getUserRating);

module.exports = router;
