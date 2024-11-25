const express = require('express');
const { getAllVictims, getAllCounsellors } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/victims', protect, authorize('admin'), getAllVictims);
router.get('/counsellors', protect, authorize('admin'), getAllCounsellors);

module.exports = router;
