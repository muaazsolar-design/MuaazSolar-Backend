// routes/analysis.js
const express = require('express');
const router = express.Router();
const AnalysisRequest = require('../models/AnalysisRequest');

// @route   POST /api/analysis
// @desc    Submit analysis request
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, propertyType, address, monthlyBill, roofSize, additionalInfo } = req.body;

        // Calculate estimates
        const avgCostPerWatt = 2.8;
        const systemSizeKW = (monthlyBill * 12) / 1200;
        const estimatedPanels = Math.ceil(systemSizeKW * 1000 / 350);
        const estimatedCost = systemSizeKW * 1000 * avgCostPerWatt;
        const estimatedSavings = monthlyBill * 12 * 0.92;

        const analysisRequest = await AnalysisRequest.create({
            name,
            email,
            phone,
            propertyType,
            address,
            monthlyBill,
            roofSize,
            additionalInfo,
            estimatedCost: Math.round(estimatedCost),
            estimatedPanels,
            estimatedSavings: Math.round(estimatedSavings)
        });

        res.status(201).json({
            success: true,
            message: 'Analysis request submitted successfully',
            request: analysisRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/analysis
// @desc    Get all analysis requests
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        
        const requests = await AnalysisRequest.find(query)
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: requests.length,
            requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;

// routes/installation.js
const express2 = require('express');
const router2 = express2.Router();
const InstallationBooking = require('../models/InstallationBooking');

// @route   POST /api/installation
// @desc    Book installation
router2.post('/', async (req, res) => {
    try {
        const booking = await InstallationBooking.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Installation booked successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/installation
// @desc    Get all installation bookings
router2.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        
        const bookings = await InstallationBooking.find(query)
            .populate('assignedEngineer', 'name email phone')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   PUT /api/installation/:id
// @desc    Update installation booking
router2.put('/:id', async (req, res) => {
    try {
        const booking = await InstallationBooking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            message: 'Booking updated successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router2;

// routes/maintenance.js
const express3 = require('express');
const router3 = express3.Router();
const MaintenanceSubscription = require('../models/MaintenanceSubscription');

// @route   POST /api/maintenance
// @desc    Create maintenance subscription
router3.post('/', async (req, res) => {
    try {
        const { plan, preferredDate } = req.body;

        // Calculate dates based on plan
        const startDate = new Date(preferredDate);
        const expiryDate = new Date(startDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        const subscription = await MaintenanceSubscription.create({
            ...req.body,
            startDate,
            expiryDate,
            nextServiceDate: startDate
        });

        res.status(201).json({
            success: true,
            message: 'Maintenance subscription created successfully',
            subscription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/maintenance
// @desc    Get all maintenance subscriptions
router3.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        
        const subscriptions = await MaintenanceSubscription.find(query)
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: subscriptions.length,
            subscriptions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   POST /api/maintenance/:id/service
// @desc    Add service record to subscription
router3.post('/:id/service', async (req, res) => {
    try {
        const { date, type, notes, performedBy } = req.body;

        const subscription = await MaintenanceSubscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            });
        }

        subscription.serviceHistory.push({
            date,
            type,
            notes,
            performedBy
        });

        subscription.lastServiceDate = date;

        // Calculate next service date based on plan
        const nextDate = new Date(date);
        if (subscription.plan === 'basic') {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
        } else if (subscription.plan === 'premium') {
            nextDate.setMonth(nextDate.getMonth() + 6);
        } else if (subscription.plan === 'enterprise') {
            nextDate.setMonth(nextDate.getMonth() + 3);
        }
        subscription.nextServiceDate = nextDate;

        await subscription.save();

        res.json({
            success: true,
            message: 'Service record added successfully',
            subscription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router3;