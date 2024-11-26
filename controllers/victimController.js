const Victim = require('../models/Victim');
const Case = require('../models/Case');
const Counsellor = require('../models/Counsellor');

// Submit Incident Report
const submitIncident = async (req, res) => {
    const { problemType, incidentDetails, supportType } = req.body;
    try {
        const victim = await Victim.create({
            user: req.user.id,
            problemType,
            incidentDetails,
            supportType,
            proofs: req.files ? req.files.map(file => file.path) : [],
        });
        res.status(201).json(victim);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Victim's Cases
const getCases = async (req, res) => {
    try {
        const cases = await Case.find({ victim: req.user.id }).populate('counsellor');
        res.json(cases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Select Support Type and Assign Counsellor
const assignSupportAndCounsellor = async (req, res) => {
    const { supportType } = req.body;

    try {
        // Step 1: Validate the victim
        const victim = await Victim.findOne({ user: req.user.id });
        console.log('Victim:', victim);

        if (!victim) {
            console.log('Victim record not found.');
            return res.status(404).json({ message: 'Victim record not found.' });
        }

        // Update victim's support type
        victim.supportType = supportType;
        await victim.save();

        // Step 2: Fetch the appropriate counselor based on specialization
        const specialization = supportType || null;
        let counsellor = null;

        if (specialization) {
            counsellor = await Counsellor.findOne({ specialization });
        }

        // If no counselor found with specialization, fallback to any available counselor
        if (!counsellor) {
            console.log(`No counselor found for specialization: ${specialization}. Assigning any available counselor.`);
            counsellor = await Counsellor.findOne();
        }

        console.log('Counselor selected:', counsellor);

        if (!counsellor) {
            console.log('No counselors available in the database.');
            return res.status(404).json({ message: 'No counselors available for assignment.' });
        }

        // Step 3: Assign the counselor to the victim

        victim.assignedCounsellor = counsellor._id;
        await victim.save();

        console.log('Assigned Counselor:', victim.assignedCounsellor);


        // Step 4: Create a new case
        const newCase = await Case.create({
            victim: victim._id,
            counsellor: counsellor._id,
            status: 'In Progress', // Add a status field for clarity
        });

        console.log('New Case Created:', newCase);

        // Step 5: Return the success response
        res.status(200).json({ 
            message: 'Support assigned successfully.', 
            case: newCase 
        });

    } catch (err) {
        // Catch block for error handling
        console.error('Error in assigning support:', err);
        res.status(500).json({ message: 'Failed to assign support and counselor.', error: err.message });
    }
};


const fetchCounsellorsBySupportType = async (req, res) => {
    const { supportType } = req.body;

    try {
        const counselors = await Counsellor.find({ specialization: supportType });

        if (!counselors || counselors.length === 0) {
            return res.status(404).json({ message: 'No counselors available for the selected support type' });
        }

        res.status(200).json(counselors);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching counselors' });
    }
};


// Submit Feedback
const submitFeedback = async (req, res) => {
    const { feedback } = req.body;
    try {
        // For simplicity, store feedback as part of Victim model
        const victim = await Victim.findOne({ user: req.user.id });
        if (!victim) return res.status(404).json({ message: 'Victim record not found' });

        victim.feedback = feedback;
        await victim.save();

        res.json({ message: 'Feedback submitted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { submitIncident, getCases, assignSupportAndCounsellor,
    fetchCounsellorsBySupportType, submitFeedback };
