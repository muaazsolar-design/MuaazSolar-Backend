// scripts/seedProducts.js - Run this to populate initial products
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const products = [
    {
        name: "Premium Monocrystalline Solar Panel",
        category: "panels",
        price: 299,
        image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600",
        description: "High-efficiency 400W monocrystalline solar panel with premium grade silicon cells.",
        specs: ["Power: 400W", "Efficiency: 21.5%", "Warranty: 25 years", "Dimensions: 75.5 x 39.4 inches"],
        stock: 50,
        featured: true
    },
    {
        name: "Standard Polycrystalline Panel",
        category: "panels",
        price: 199,
        image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600",
        description: "Reliable 300W polycrystalline solar panel offering great value for money.",
        specs: ["Power: 300W", "Efficiency: 17.5%", "Warranty: 20 years", "Dimensions: 65.0 x 39.0 inches"],
        stock: 75,
        featured: false
    },
    {
        name: "Bifacial Solar Panel",
        category: "panels",
        price: 399,
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600",
        description: "Advanced bifacial technology captures sunlight from both sides.",
        specs: ["Power: 450W", "Efficiency: 22.8%", "Warranty: 30 years", "Dimensions: 82.0 x 40.0 inches"],
        stock: 30,
        featured: true
    },
    {
        name: "Lithium Battery Storage System",
        category: "batteries",
        price: 4999,
        image: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600",
        description: "10kWh lithium-ion battery storage with intelligent energy management.",
        specs: ["Capacity: 10kWh", "Voltage: 48V", "Warranty: 10 years", "Cycles: 6000+"],
        stock: 20,
        featured: true
    },
    {
        name: "Home Battery Backup",
        category: "batteries",
        price: 3499,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
        description: "Compact 5kWh battery system perfect for homes.",
        specs: ["Capacity: 5kWh", "Voltage: 48V", "Warranty: 8 years", "Weight: 110 lbs"],
        stock: 35,
        featured: false
    },
    {
        name: "Hybrid Solar Inverter",
        category: "inverters",
        price: 1499,
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600",
        description: "5kW hybrid inverter with built-in MPPT charge controller.",
        specs: ["Power: 5kW", "Efficiency: 97.5%", "Warranty: 10 years", "Max Input: 600V"],
        stock: 40,
        featured: true
    },
    {
        name: "Grid-Tie Micro Inverter",
        category: "inverters",
        price: 299,
        image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600",
        description: "High-efficiency micro inverter for individual panel optimization.",
        specs: ["Power: 300W", "Efficiency: 96.5%", "Warranty: 15 years", "IP67 Rated"],
        stock: 100,
        featured: false
    },
    {
        name: "Off-Grid Power Inverter",
        category: "inverters",
        price: 1899,
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600",
        description: "6kW pure sine wave inverter designed for off-grid systems.",
        specs: ["Power: 6kW", "Surge: 12kW", "Warranty: 8 years", "Output: Pure Sine Wave"],
        stock: 25,
        featured: false
    },
    {
        name: "Solar Mounting Kit",
        category: "accessories",
        price: 149,
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600",
        description: "Complete mounting system for roof installation.",
        specs: ["Material: Aluminum", "Panels: Up to 6", "Warranty: 15 years", "Corrosion resistant"],
        stock: 60,
        featured: false
    },
    {
        name: "Solar Cable Kit",
        category: "accessories",
        price: 89,
        image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600",
        description: "Professional grade solar cables with MC4 connectors.",
        specs: ["Length: 50ft", "Gauge: 10AWG", "Voltage: 600V", "Temperature: -40°C to 90°C"],
        stock: 150,
        featured: false
    },
    {
        name: "Charge Controller MPPT",
        category: "accessories",
        price: 349,
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600",
        description: "Maximum Power Point Tracking charge controller.",
        specs: ["Current: 40A", "Voltage: 12/24/48V", "Efficiency: 98%", "LCD Display"],
        stock: 45,
        featured: false
    },
    {
        name: "Solar Monitoring System",
        category: "accessories",
        price: 199,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
        description: "Real-time monitoring system with mobile app.",
        specs: ["Connectivity: WiFi", "App: iOS/Android", "Data Logging: Cloud", "Alerts: Email/SMS"],
        stock: 80,
        featured: false
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 MongoDB Connected for seeding...');

        // Clear existing products
        await Product.deleteMany();
        console.log('🗑️  Cleared existing products');

        // Insert new products
        await Product.insertMany(products);
        console.log('✅ Products seeded successfully!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();

// middleware/auth.js - Protect routes that require authentication
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Not authorized as admin'
        });
    }
};

const engineer = (req, res, next) => {
    if (req.user && (req.user.role === 'engineer' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Not authorized as engineer'
        });
    }
};

module.exports = { protect, admin, engineer };

// Usage example in routes:
/*
const { protect, admin } = require('../middleware/auth');

// Protected route (requires login)
router.get('/profile', protect, (req, res) => {
    res.json({ user: req.user });
});

// Admin only route
router.delete('/users/:id', protect, admin, (req, res) => {
    // Delete user logic
});
*/