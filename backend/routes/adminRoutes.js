const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, getRatingsDistribution } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All routes here require both authentication and admin role
router.use(protect);
router.use(adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/ratings-distribution', getRatingsDistribution);

module.exports = router;
