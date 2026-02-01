const mongoose = require('mongoose');

const AIInterviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resumeText: {
        type: String,
        required: true
    },
    interviewType: {
        type: String,
        enum: ['HR', 'Technical', 'Behavioral'],
        default: 'HR'
    },
    messages: [{
        role: {
            type: String, // 'user' or 'ai'
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AIInterview', AIInterviewSchema);
