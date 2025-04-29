const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    employee1_name: {
        type: String
    },
    employee2_name: {
        type: String
    },
    employee3_name: {
        type: String
    },
    employee1_id: {
        type: String
    },
    employee2_id: {
        type: String
    },
    employee3_id: {
        type: String
    }
});

module.exports = mongoose.model('organization',orgSchema);