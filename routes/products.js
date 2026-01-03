// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, sort, search, featured } = req.query;
        
        // Build query
        let query = {};
        
        if (category && category !== 'all') {
            query.category = category;
        }
        
        if (featured === 'true') {
            query.featured = true;
        }
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Build sort
        let sortOptions = {};
        if (sort === 'price-low') {
            sortOptions.price = 1;
        } else if (sort === 'price-high') {
            sortOptions.price = -1;
        } else if (sort === 'name') {
            sortOptions.name = 1;
        } else {
            sortOptions.createdAt = -1; // Default: newest first
        }
        
        const products = await Product.find(query).sort(sortOptions);
        
        res.json({
            success: true,
            count: products.length,
            products
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

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            product
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

// @route   POST /api/products
// @desc    Create new product (Admin only)
// @access  Private/Admin
router.post('/', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
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

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private/Admin
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Product updated successfully',
            product
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

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
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