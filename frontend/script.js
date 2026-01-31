const API_URL = "http://localhost:5000/api/tasks"; // Change port if needed

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

// Fetch all tasks
async function fetchTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    taskList.innerHTML = "";
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${task.title} - ${task.status}</span>
            <div>
                <button onclick="deleteTask('${task._id}')">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Add new task
taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const status = document.getElementById("status").value;

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, status })
    });

    taskForm.reset();
    fetchTasks();
});

// Delete task
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
}

// Initial load
fetchTasks();
