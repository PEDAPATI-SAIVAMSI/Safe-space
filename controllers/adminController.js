const User = require('../models/User');
const Counsellor = require('../models/Counsellor');
const Victim = require('../models/Victim');

// Get All Victims
const getAllVictims = async (req, res) => {
    try {
        const victims = await Victim.find().populate('user', 'firstName lastName email phone');
        res.json(victims);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get All Counsellors
const getAllCounsellors = async (req, res) => {
    try {
        const counsellors = await Counsellor.find().populate('user', 'firstName lastName email phone');
        res.json(counsellors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllVictims, getAllCounsellors };
