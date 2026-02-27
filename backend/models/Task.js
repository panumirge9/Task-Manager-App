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
        default: "Pending" // Capitalized to match the frontend dropdown
    },
    assignedTo: {
        type: String,
        required: true
    },
    priority: {            // Added comma above and inserted priority
        type: String,
        default: "Medium"
    },
    dueDate: {             // Inserted dueDate
        type: Date
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);