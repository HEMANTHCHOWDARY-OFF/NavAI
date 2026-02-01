const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ResumeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String
    },
    personalInfo: {
        name: String,
        phone: String,
        email: String,
        linkedin: String,
        github: String,
        portfolio: String,
        location: {
            city: String,
            country: String
        }
    },
    professionalSummary: String,
    skills: [{
        category: String,
        items: [String]
    }],
    workExperience: [{
        jobTitle: String,
        company: String,
        location: {
            city: String,
            country: String
        },
        duration: String,
        bullets: [String]
    }],
    projects: [{
        title: String,
        technologies: [String],
        bullets: [String]
    }],
    education: [{
        degree: String,
        institution: String,
        duration: String,
        graduationYear: String,
        cgpaPercentage: String
    }],
    certifications: [{
        name: String,
        authority: String,
        completionYear: String
    }],
    achievements: [{
        title: String,
        issuer: String,
        date: String
    }],
    volunteer: [{
        role: String,
        organization: String,
        duration: String,
        contributions: [String]
    }],
    languages: [{
        name: String,
        proficiency: String
    }],
    references: [{
        name: String,
        designation: String,
        company: String,
        email: String,
        phone: String
    }],
    generatedContent: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resume', ResumeSchema);
