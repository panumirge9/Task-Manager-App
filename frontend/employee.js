const API_URL = "http://localhost:5000/api/tasks";

// Get the current logged-in user from local storage
const currentUser = localStorage.getItem('currentUser');
const userRole = localStorage.getItem('userRole');

// Security check: Redirect to login if they aren't logged in or aren't an employee
if (!currentUser || userRole !== 'employee') {
    window.location.href = 'index.html';
}

// Personalize the dashboard header
document.getElementById('welcomeMessage').innerText = `${currentUser}'s Tasks`;

const employeeTaskList = document.getElementById("employeeTaskList");

// Helper function to colorize status
function getStatusClass(status) {
    if (status === 'Pending') return 'status-pending';
    if (status === 'In Progress') return 'status-inprogress';
    if (status === 'Completed') return 'status-completed';
    return '';
}

// Fetch and Render Tasks for the specific employee
async function fetchMyTasks() {
    try {
        const res = await fetch(API_URL);
        const allTasks = await res.json();
        
        // Filter tasks so the employee only sees their own
        const myTasks = allTasks.filter(task => 
            task.assignedTo.toLowerCase() === currentUser.toLowerCase()
        );

        employeeTaskList.innerHTML = "";
        
        if (myTasks.length === 0) {
            employeeTaskList.innerHTML = `<tr><td colspan="5" style="text-align: center;">No tasks assigned to you right now!</td></tr>`;
            return;
        }

        myTasks.forEach(task => {
            const tr = document.createElement("tr");
            const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A';
            const priority = task.priority || 'Medium';

            tr.innerHTML = `
                <td><strong>${task.title}</strong></td>
                <td>${priority}</td>
                <td>${formattedDate}</td>
                <td><span class="badge ${getStatusClass(task.status)}">${task.status}</span></td>
                <td>
                    <select onchange="updateTaskStatus('${task._id}', this.value)" style="padding: 5px; border-radius: 4px;">
                        <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </td>
            `;
            employeeTaskList.appendChild(tr);
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// Update task status
async function updateTaskStatus(id, newStatus) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });
        
        // Refresh the table to show the new badge color
        fetchMyTasks();
    } catch (error) {
        console.error("Error updating status:", error);
    }
}

// --- Logout Functionality ---
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userRole');
        window.location.href = 'index.html';
    });
}

// Initial load
fetchMyTasks();