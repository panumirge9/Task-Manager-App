const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true // Prevents duplicate usernames
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        required: true,
        enum: ['admin', 'employee'] // Ensures only valid roles are saved
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);