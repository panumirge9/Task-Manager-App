const User = require('../models/User');
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        console.log(`\n--- NEW REGISTRATION RECEIVED ---`);
        console.log(`Attempting to save user: ${username}, ${email}, Role: ${role}`);

        
        if (role === 'admin' && username !== 'Panu') {
            console.log("BLOCKED: Unauthorized admin registration attempt.");
            return res.status(403).json({ message: 'Security Alert: Only Panu is authorized to register as an Administrator.' });
        }

    
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already in use.' });
        }

    
        const newUser = new User({ username, email, password, role });
        await newUser.save();

        res.status(201).json({ message: 'Registration successful!' });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        console.log(`Login Attempt -> Username: "${username}", Password: "${password}", Role: "${role}"`);

        
        if (role === 'admin' && username !== 'Panu') {
            console.log("BLOCKED: Unauthorized admin login attempt.");
            return res.status(403).json({ message: 'Security Alert: Only Panu is authorized to log in as an Administrator.' });
        }

    
        const user = await User.findOne({ username });
        console.log(`Found in Database ->`, user);


        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

    
        if (user.role !== role) {
            return res.status(403).json({ message: `Access denied. You are not a registered ${role}.` });
        }

        
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