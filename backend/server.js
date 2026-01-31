const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/taskdb')
.then(() => {
    console.log('MongoDB Connected Successfully');
})
.catch((error) => {
    console.log('MongoDB Connection Error:', error);
});



// Routes
app.use('/api/tasks', taskRoutes);

// Server Start
app.listen(5000, () => {
console.log('Server running on port 5000');
});
