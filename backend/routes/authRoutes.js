const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define Auth Routes
router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser); // <-- Uncommented this line
// GET /api/users - Fetch all employees
router.get('/', async (req, res) => {
    try {
        // We only want to fetch users who are employees, not admins.
        // The .select('-password') ensures we NEVER send passwords to the frontend!
        const User = require('../models/User'); // Ensure your User model is required
        const employees = await User.find({ role: 'employee' }).select('-password');
        
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Server error fetching employees" });
    }
});
module.exports = router;