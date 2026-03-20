const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes'); 

const app = express();


app.use(cors());
app.use(express.json());

app.use('/frontend', express.static(path.join(__dirname, 'frontend'))); 

mongoose.connect('mongodb://127.0.0.1:27017/taskdb')
    .then(() => {
        console.log('MongoDB Connected Successfully');
    })
    .catch((error) => {
        console.error('MongoDB Connection Error:', error);
    });

app.use('/api/tasks', taskRoutes);
app.use('/api/users', authRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});