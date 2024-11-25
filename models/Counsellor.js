const mongoose = require('mongoose');

const counsellorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true }, // in years
    casesSolved: { type: Number, default: 0 },
    typeOfService: { type: String, enum: ['Online', 'Offline', 'Both'], required: true },
    photo: { type: String }, // Path to uploaded photo
}, { timestamps: true });

module.exports = mongoose.model('Counsellor', counsellorSchema);
