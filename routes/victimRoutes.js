const express = require('express');
const { submitIncident, getCases, assignSupportAndCounsellor,fetchCounsellorsBySupportType, submitFeedback } = require('../controllers/victimController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

// Submit Incident Report with file uploads
router.post('/report-incident', protect, authorize('victim'), upload.array('proofs', 5), submitIncident);



// Assign support type and counselor
router.post('/assign-support',protect, authorize('victim'), assignSupportAndCounsellor);

// Fetch counselors by support type
router.post('/fetch-counsellors', fetchCounsellorsBySupportType);

// Get Victim's Cases
router.get('/cases', protect, authorize('victim'), getCases);

// Submit Feedback
router.post('/feedback', protect, authorize('victim'), submitFeedback);

module.exports = router;
