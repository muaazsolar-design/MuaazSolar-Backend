// server.js - Main Express Server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');

// Import Routes
const authRoutes = require('./routes/auth');
const analysisRoutes = require('./routes/analysis');
const installationRoutes = require('./routes/installation');
const maintenanceRoutes = require('./routes/maintenance');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/installation', installationRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Root Route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to MuaazSolar API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            analysis: '/api/analysis',
            installation: '/api/installation',
            maintenance: '/api/maintenance',
            products: '/api/products',
            orders: '/api/orders',
            contact: '/api/contact',
            admin: '/api/admin'
        }
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});