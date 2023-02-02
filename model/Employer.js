const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({

    Firstname: {
        type: String,
        required: true,
    },
    Lastname: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    phoneNumber: {
        type: String,
        required: true,
        max: 10
    },
    address: {
        type: String,
        required: true,
        min: 6
    },
    city: {
        type: String,
        required: true,

    },
    zipcode: {
        type: String,
        required: true,
        max: 5
    },
    jobs: {
        level: {
            type: String,
            required: true,

        },
        companyjob: {
            type: String,
            required: true,
        },
        startdate: {
            type: Date,
            
        },
        endDate: {
            type: Date,

        },

    },

    avatar: {
        type: String,
        default: ''

    },
        
    
    date: {
        type: Date,
        default: Date.now
    },
    createdByu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    companyBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'companies',
        required: true
    },

});

module.exports = mongoose.model('Employer', employerSchema);