const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({

    companyName: {
        type : String,
        required : true,
        
    },
    companyEmail:{
        type: String ,
        required: true,
        max: 255,
        min: 6
    },
    phoneNumber: {
        type : String,
        required : true,
        max: 10
    },
    companyAdress: {
        type : String,
        required : true,
        min: 6
    },
    companyCity: {
        type : String,
        required : true,
        
    },
    zipcode: {
        type : String,
        required : true,
        max: 5
    },

    date: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'users',
         required : true},


});

module.exports = mongoose.model('Company',companySchema);