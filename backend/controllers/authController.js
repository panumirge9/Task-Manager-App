const User = require('../models/User');

// =======================
// REGISTER User
// =======================
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        console.log(`\n--- NEW REGISTRATION RECEIVED ---`);
        console.log(`Attempting to save user: ${username}, ${email}, Role: ${role}`);

        // --- NEW SECURITY CHECK: Only 'Panu' can be admin ---
        if (role === 'admin' && username !== 'Panu') {
            console.log("BLOCKED: Unauthorized admin registration attempt.");
            return res.status(403).json({ message: 'Security Alert: Only Panu is authorized to register as an Administrator.' });
        }

        // 1. Check if the username or email already exists
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already in use.' });
        }

        // 2. Create and save the new user
        const newUser = new User({ username, email, password, role });
        await newUser.save();

        res.status(201).json({ message: 'Registration successful!' });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// =======================
// LOGIN User
// =======================
exports.loginUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        console.log(`Login Attempt -> Username: "${username}", Password: "${password}", Role: "${role}"`);

        // --- NEW SECURITY CHECK: Only 'Panu' can log in as admin ---
        if (role === 'admin' && username !== 'Panu') {
            console.log("BLOCKED: Unauthorized admin login attempt.");
            return res.status(403).json({ message: 'Security Alert: Only Panu is authorized to log in as an Administrator.' });
        }

        // 1. Find user
        const user = await User.findOne({ username });
        console.log(`Found in Database ->`, user);

        // 2. Check password
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // 3. Security Check (Role mismatch)
        if (user.role !== role) {
            return res.status(403).json({ message: `Access denied. You are not a registered ${role}.` });
        }

        // 4. Success
        res.status(200).json({
            message: 'Login successful',
            user: { 
                username: user.username, 
                role: user.role 
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};