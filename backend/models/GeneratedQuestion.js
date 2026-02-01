const mongoose = require('mongoose');

const GeneratedQuestionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'Multiple Choice'
        },
        difficulty: {
            type: String,
            default: 'Medium'
        },
        options: [{
            type: String
        }],
        basedOn: {
            type: String
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GeneratedQuestion', GeneratedQuestionSchema);
