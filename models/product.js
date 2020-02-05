const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: Number
    },
    city: {
        type: String,
        index: true
    },
    description: {
        type: String
    },
    pictures: {
        type: [String]
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;