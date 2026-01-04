
const mongoose = require('mongoose');

const analysisRequestSchema = new mongoose.Schema({
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
    propertyType: {
        type: String,
        required: true,
        enum: ['Residential', 'Commercial', 'Industrial']
    },
    address: {
        type: String,
        required: true
    },
    monthlyBill: {
        type: Number,
        required: true
    },
    roofSize: {
        type: Number
    },
    additionalInfo: {
        type: String
    },
    estimatedCost: {
        type: Number
    },
    estimatedPanels: {
        type: Number
    },
    estimatedSavings: {
        type: Number
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AnalysisRequest', analysisRequestSchema);