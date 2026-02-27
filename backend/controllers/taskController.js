const Task = require('../models/Task');

// CREATE Task
exports.createTask = async (req, res) => {
    try {
        // req.body will now automatically include priority and dueDate from the frontend
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// READ All Tasks
exports.getTasks = async (req, res) => {
    try {
        // .sort({ createdAt: -1 }) ensures the newest tasks appear at the top of the table
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE Task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // runValidators ensures schema rules (like 'required') are checked on update
        );
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// DELETE Task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};