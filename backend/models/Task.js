const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        default: "Pending" 
    },
    assignedTo: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        default: "Medium"
    },
    dueDate: {
        type: Date
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);