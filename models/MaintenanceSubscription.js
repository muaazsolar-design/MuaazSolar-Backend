// models/MaintenanceSubscription.js
const mongoose = require('mongoose');

const maintenanceSubscriptionSchema = new mongoose.Schema({
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
    plan: {
        type: String,
        required: true,
        enum: ['basic', 'premium', 'enterprise']
    },
    address: {
        type: String,
        required: true
    },
    systemAge: {
        type: String,
        required: true
    },
    preferredDate: {
        type: Date,
        required: true
    },
    additionalNotes: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled', 'pending'],
        default: 'pending'
    },
    startDate: {
        type: Date
    },
    expiryDate: {
        type: Date
    },
    lastServiceDate: {
        type: Date
    },
    nextServiceDate: {
        type: Date
    },
    serviceHistory: [{
        date: {
            type: Date,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        notes: String,
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    paymentStatus: {
        type: String,
        enum: ['paid', 'pending', 'overdue'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MaintenanceSubscription', maintenanceSubscriptionSchema);