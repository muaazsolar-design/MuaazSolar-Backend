// routes/contact.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// @route   POST /api/contact
// @desc    Send contact form email
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Email to admin
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New Contact Form: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        // Confirmation email to user
        const confirmationOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting MuaazSolar',
            html: `
                <h2>Thank you for contacting us!</h2>
                <p>Dear ${name},</p>
                <p>We have received your message and will get back to you within 24 hours.</p>
                <p><strong>Your message:</strong></p>
                <p>${message}</p>
                <br>
                <p>Best regards,</p>
                <p>MuaazSolar Team</p>
            `
        };

        await transporter.sendMail(confirmationOptions);

        res.json({
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
});

module.exports = router;

// routes/admin.js
const express2 = require('express');
const router2 = express2.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const AnalysisRequest = require('../models/AnalysisRequest');
const InstallationBooking = require('../models/InstallationBooking');
const MaintenanceSubscription = require('../models/MaintenanceSubscription');

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
router2.get('/dashboard', async (req, res) => {
    try {
        // Get counts
        const totalUsers = await User.countDocuments({ role: 'customer' });
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const pendingAnalysis = await AnalysisRequest.countDocuments({ status: 'pending' });
        const activeInstallations = await InstallationBooking.countDocuments({ 
            status: { $in: ['confirmed', 'in_progress'] } 
        });
        const activeSubscriptions = await MaintenanceSubscription.countDocuments({ status: 'active' });

        // Calculate revenue
        const orders = await Order.find({ paymentStatus: 'completed' });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        // Low stock products
        const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
            .sort({ stock: 1 })
            .limit(5);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalOrders,
                totalProducts,
                pendingAnalysis,
                activeInstallations,
                activeSubscriptions,
                totalRevenue
            },
            recentOrders,
            lowStockProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/admin/users
// @desc    Get all users
router2.get('/users', async (req, res) => {
    try {
        const { role, search } = req.query;
        
        let query = {};
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user (role, status, etc.)
router2.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
router2.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/admin/reports/sales
// @desc    Get sales report
router2.get('/reports/sales', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let query = { paymentStatus: 'completed' };
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const orders = await Order.find(query).populate('items.product');

        // Calculate totals
        const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = orders.length;

        // Group by product
        const productSales = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const productId = item.product._id.toString();
                if (!productSales[productId]) {
                    productSales[productId] = {
                        product: item.product.name,
                        quantity: 0,
                        revenue: 0
                    };
                }
                productSales[productId].quantity += item.quantity;
                productSales[productId].revenue += item.price * item.quantity;
            });
        });

        res.json({
            success: true,
            report: {
                totalSales,
                totalOrders,
                averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
                productSales: Object.values(productSales)
            }
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