const mongoose = require('mongoose');

const purchaseSchema = {
    product_id: {
        type: String,
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    product_price: {
        type: String,
        required: true
    },
    buyer_type: {
        type: Number,
        required: true
    },
    buyer_name: {
        type: String,
        required: true
    },
    employee_id:{
        type: String
    },
    employee_name:{
        type:String
    },
    purchased_for:{
        type: String
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    delivery_address: {
        type: String,
        required: true
    }
}

module.exports = mongoose.model('purchase',purchaseSchema);