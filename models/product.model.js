// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['panels', 'batteries', 'inverters', 'accessories']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    specs: [{
        type: String
    }],
    image: {
        type: String,
        required: [true, 'Image URL is required']
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required'],
        min: 0,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);