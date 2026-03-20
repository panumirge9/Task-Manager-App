const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes'); // <-- 1. Import Auth Routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/frontend', express.static(path.join(__dirname, 'frontend'))); 

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/taskdb')
    .then(() => {
        console.log('MongoDB Connected Successfully');
    })
    .catch((error) => {
        console.error('MongoDB Connection Error:', error);
    });

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', authRoutes); // <-- 2. Tell the server to use the Auth Routes

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});