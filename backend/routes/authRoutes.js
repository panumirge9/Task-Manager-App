const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser); 

router.get('/', async (req, res) => {
    try {
        
        const User = require('../models/User'); 
        const employees = await User.find({ role: 'employee' }).select('-password');
        
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Server error fetching employees" });
    }
});
module.exports = router;