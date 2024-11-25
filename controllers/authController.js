const User = require('../models/User');
const Counsellor = require('../models/Counsellor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
const registerUser = async (req, res) => {
    const { firstName, lastName, email, phone, password, role, gender, dateOfBirth, specialization, experience, typeOfService } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password,
            role,
            gender,
            dateOfBirth,
        });

        if (role === 'counsellor') {
            await Counsellor.create({
                user: user._id,
                specialization,
                experience,
                typeOfService,
            });
        }

        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        res.json({
            _id: user.id,
            firstName: user.firstName,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { registerUser, loginUser };
