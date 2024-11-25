const express = require('express');
const { getAssignedCases, assignCounsellor, sendMessage } = require('../controllers/counsellorController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();
const Counselor = require('../models/Counsellor');

// Route to fetch counselors
router.post('/fetch-counsellors', async (req, res) => {
    console.log('Incoming Request:', req.body); // Log incoming request data
    
    const { supportType } = req.body;

    try {
        console.log('Fetching counselors for support type:', supportType); // Log the supportType being searched
        // Fetch counselors based on supportType sent in the request
        const counselors = await Counselor.find({ specialization: supportType });

        if (!counselors || counselors.length === 0) {
            console.log('No counselors found for support type:', supportType); // Log if no counselors found
            return res.status(404).json({ message: 'No counselors available for the selected support type' });
        }

        console.log('Fetched Counselors:', counselors); // Log the fetched counselors
        
        // Send counselors in the response
        res.status(200).json(counselors);
    } catch (error) {
        console.error('Error:', error.message); // Log any errors
        res.status(500).json({ message: 'Error fetching counselors' });
    }
});


// Get Assigned Cases
router.get('/cases', protect, authorize('counsellor'), getAssignedCases);

// Assign Counsellor to a Victim (Admin action - optional)
router.post('/assign/:victimId', protect, authorize('counsellor'), assignCounsellor);

// Send Message in Case Chat
router.post('/case/:caseId/message', protect, authorize('counsellor'), sendMessage);

module.exports = router;
