const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        trim: true
    },

    position: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: ['Applied', 'Technical Interview', 'Onsiite', 'Offer', 'Rejected'],
        default: 'Applied'
    },

    appliedDate: {
        type: Date,
        default: Date.now
    },

    notes: {
        type: String,
        default: ''
    },

    followUpDate: {
        type: Date
    }}, 
    
    {timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Application', applicationSchema);