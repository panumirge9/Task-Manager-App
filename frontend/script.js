const API_URL = "http://localhost:5000/api/tasks";

// DOM Elements
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const taskModal = document.getElementById("taskModal");
const openModalBtn = document.getElementById("openTaskModal");
const closeModalBtn = document.querySelector(".close-modal");

// --- NAVIGATION LOGIC ---
const navLinks = document.querySelectorAll('.sidebar .nav-links li');
const sections = {
    'Dashboard': document.getElementById('dashboardSection'),
    'Employees': document.getElementById('employeesSection'),
    'Tasks': document.getElementById('tasksSection')
};
const pageTitle = document.getElementById('pageTitle');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const linkText = e.target.innerText.trim();
        
        if (sections[linkText]) {
            e.preventDefault();
            
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.closest('li').classList.add('active');
            
            Object.values(sections).forEach(sec => sec.classList.add('hidden'));
            sections[linkText].classList.remove('hidden');
            
            pageTitle.innerText = linkText;
            if (linkText === 'Tasks') {
                openModalBtn.style.display = 'block';
            } else {
                openModalBtn.style.display = 'none';
            }
        }
    });
});

// Modal UI Controls
openModalBtn.addEventListener("click", () => taskModal.classList.remove("hidden"));
closeModalBtn.addEventListener("click", () => taskModal.classList.add("hidden"));
window.addEventListener("click", (e) => {
    if (e.target === taskModal) taskModal.classList.add("hidden");
});

function getStatusClass(status) {
    if (status === 'Pending') return 'status-pending';
    if (status === 'In Progress') return 'status-inprogress';
    if (status === 'Completed') return 'status-completed';
    return '';
}

// --- FETCH & CALCULATE DATA ---
async function fetchTasks() {
    try {
        const res = await fetch(API_URL);
        const tasks = await res.json();
        
        renderTaskTable(tasks);
        updateDashboardStats(tasks);
        renderEmployeeGrid(tasks);

    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// 1. Render Tasks Table
function renderTaskTable(tasks) {
    taskList.innerHTML = "";
    tasks.forEach(task => {
        const tr = document.createElement("tr");
        const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A';
        const priority = task.priority || 'Medium';

        tr.innerHTML = `
            <td><strong>${task.title}</strong></td>
            <td style="text-transform: capitalize;">${task.assignedTo}</td>
            <td>${priority}</td>
            <td>${formattedDate}</td>
            <td><span class="badge ${getStatusClass(task.status)}">${task.status}</span></td>
            <td>
                <button class="btn-danger" onclick="deleteTask('${task._id}')">Delete</button>
            </td>
        `;
        taskList.appendChild(tr);
    });
}

// 2. Update Dashboard Statistics
function updateDashboardStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;

    document.getElementById('statTotalTasks').innerText = total;
    document.getElementById('statCompleted').innerText = completed;
    document.getElementById('statPending').innerText = pending;
}

// 3. Render Employee Grid
function renderEmployeeGrid(tasks) {
    const employeeGrid = document.getElementById('employeeGrid');
    if (!employeeGrid) return; // Safety check in case HTML is missing
    
    employeeGrid.innerHTML = "";

    const employees = [
        { 
            name: 'Shivraj', 
            username: 'shivraj_kadam_134',
            image: 'images/shiv.jpeg'
        },
        { 
            name: 'Om', 
            username: 'om_kadam_1369',
            image: 'images/om.jpeg'
        },
        { 
            name: 'Pranav', 
            username: 'vip_panu',
            image: 'images/panu.jpeg'
        }
    ];

    employees.forEach(emp => {
        const empTasks = tasks.filter(t => t.assignedTo === emp.username);
        const activeCount = empTasks.filter(t => t.status !== 'Completed').length;
        const compCount = empTasks.filter(t => t.status === 'Completed').length;

        const card = document.createElement('div');
        card.className = 'employee-card';
        card.innerHTML = `
            <div class="emp-avatar">
                <img src="${emp.image}" alt="${emp.name}'s Profile Photo" onerror="this.src='https://via.placeholder.com/80?text=No+Img'">
            </div>
            <h3>${emp.name}</h3>
            <p class="role">@${emp.username}</p>
            <div class="emp-stats">
                <div class="emp-stat-item">
                    <span>${activeCount}</span>
                    <span>Active Tasks</span>
                </div>
                <div class="emp-stat-item">
                    <span>${compCount}</span>
                    <span>Completed</span>
                </div>
            </div>
        `;
        employeeGrid.appendChild(card);
    });
}

// Add new task
taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskData = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        assignedTo: document.getElementById("assignedTo").value,
        priority: document.getElementById("priority").value,
        dueDate: document.getElementById("dueDate").value,
        status: document.getElementById("status").value
    };

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData)
        });
        taskForm.reset();
        taskModal.classList.add("hidden");
        fetchTasks(); 
    } catch (error) {
        console.error("Error adding task:", error);
    }
});

// Delete task
async function deleteTask(id) {
    if(confirm("Are you sure you want to delete this task?")) {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            fetchTasks(); 
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }
}

// Logout
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
fetchTasks();