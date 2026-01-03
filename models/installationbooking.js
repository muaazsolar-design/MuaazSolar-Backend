// models/InstallationBooking.js
const mongoose = require('mongoose');

const installationBookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    systemSize: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    preferredDate: {
        type: Date,
        required: true
    },
    roofType: {
        type: String,
        required: true,
        enum: ['Asphalt Shingle', 'Metal', 'Tile', 'Flat', 'Other']
    },
    additionalNotes: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    assignedEngineer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    scheduledDate: {
        type: Date
    },
    completionDate: {
        type: Date
    },
    estimatedCost: {
        type: Number
    },
    actualCost: {
        type: Number
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('InstallationBooking', installationBookingSchema);