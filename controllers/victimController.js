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
        const victim = await Victim.findOne({ user: req.user.id });
        if (!victim) return res.status(404).json({ message: 'Victim record not found' });

        victim.supportType = supportType;
        await victim.save();

        let counsellor;
        if (supportType === 'Mental') {
            counsellor = await Counsellor.findOne({ specialization: 'Mental' });
        } else if (supportType === 'Physical') {
            counsellor = await Counsellor.findOne({ specialization: 'Physical' });
        } else if (supportType === 'Legal') {
            counsellor = await Counsellor.findOne({ specialization: 'Legal' });
        } else {
            counsellor = await Counsellor.findOne(); // Assign any counsellor
        }

        if (counsellor) {
            victim.assignedCounsellor = counsellor._id;
            await victim.save();

            const newCase = await Case.create({
                victim: victim._id,
                counsellor: counsellor._id,
            });

            res.json({ message: 'Support assigned', case: newCase });
        } else {
            res.status(404).json({ message: 'No counsellor available for the selected support type' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
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
