// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', async (req, res) => {
    try {
        const { userId, items, shippingAddress, paymentMethod, notes } = req.body;

        // Validate items and calculate total
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            totalAmount += product.price * item.quantity;

            // Update stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Create order
        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod,
            notes
        });

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order
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

// @route   GET /api/orders
// @desc    Get all orders for a user
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;

        const orders = await Order.find({ user: userId })
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            orders
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

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product')
            .populate('user', 'name email phone');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order
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

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', async (req, res) => {
    try {
        const { orderStatus, paymentStatus, trackingNumber } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (trackingNumber) order.trackingNumber = trackingNumber;

        await order.save();

        res.json({
            success: true,
            message: 'Order updated successfully',
            order
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

// @route   DELETE /api/orders/:id
// @desc    Cancel order
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.orderStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Can only cancel pending orders'
            });
        }

        // Restore stock
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        order.orderStatus = 'cancelled';
        await order.save();

        res.json({
            success: true,
            message: 'Order cancelled successfully'
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

module.exports = router;