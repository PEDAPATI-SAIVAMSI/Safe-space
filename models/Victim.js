const mongoose = require('mongoose');

const victimSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problemType: { type: String, required: true },
    proofs: [{ type: String }], // Array of file paths
    incidentDetails: {
        description: String,
        time: String,
        date: String,
        place: String,
    },
    supportType: { type: String, enum: ['Mental', 'Physical', 'Legal', 'Others'],  },
    assignedCounsellor: { type: mongoose.Schema.Types.ObjectId, ref: 'Counsellor' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Victim', victimSchema);
