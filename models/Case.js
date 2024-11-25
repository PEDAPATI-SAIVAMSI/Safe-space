const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    victim: { type: mongoose.Schema.Types.ObjectId, ref: 'Victim', required: true },
    counsellor: { type: mongoose.Schema.Types.ObjectId, ref: 'Counsellor', required: true },
    messages: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        timestamp: { type: Date, default: Date.now },
    }],
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
}, { timestamps: true });

module.exports = mongoose.model('Case', caseSchema);
