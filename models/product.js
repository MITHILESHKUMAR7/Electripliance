const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        data: Buffer,
        contentType: String
    },
    price: {
        type: String,
        required: true
    }
});

module.exports = new mongoose.model('product',productSchema);