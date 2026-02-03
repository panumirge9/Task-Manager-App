const Task = require('../models/Task');

// CREATE Task
exports.createTask = async (req, res) => {
try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
} catch (error) {
    res.status(400).json({ error: error.message });
}
};

// READ All Tasks
exports.getTasks = async (req, res) => {
const tasks = await Task.find();
res.json(tasks);
};

// UPDATE Task
exports.updateTask = async (req, res) => {
const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
);
res.json(task);
};

// DELETE Task
exports.deleteTask = async (req, res) => {
await Task.findByIdAndDelete(req.params.id);
res.json({ message: 'Task deleted successfully' });
};
