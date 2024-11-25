const Counsellor = require('../models/Counsellor');
const Victim = require('../models/Victim');
const Case = require('../models/Case');

// Get Assigned Cases
const getAssignedCases = async (req, res) => {
    try {
        const cases = await Case.find({ counsellor: req.user.id }).populate('victim').populate('counsellor');
        res.json(cases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Assign Counsellor to Victim
const assignCounsellor = async (req, res) => {
    const { victimId } = req.params;
    try {
        const victim = await Victim.findById(victimId);
        if (!victim) return res.status(404).json({ message: 'Victim not found' });

        victim.assignedCounsellor = req.user.id;
        await victim.save();

        // Create a new case
        const newCase = await Case.create({
            victim: victim._id,
            counsellor: req.user.id,
        });

        res.json(newCase);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Send Message in Case Chat
const sendMessage = async (req, res) => {
    const { caseId } = req.params;
    const { message } = req.body;
    try {
        const caseData = await Case.findById(caseId);
        if (!caseData) return res.status(404).json({ message: 'Case not found' });

        // Ensure the counsellor is assigned to this case
        if (caseData.counsellor.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to send messages in this case' });
        }

        caseData.messages.push({
            sender: req.user.id,
            message,
        });
        await caseData.save();

        res.json(caseData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAssignedCases, assignCounsellor, sendMessage };
