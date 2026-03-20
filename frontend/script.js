const API_URL = "http://localhost:5000/api/tasks";
const USERS_API_URL = "http://localhost:5000/api/users"; 

let employees = []; 
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const taskModal = document.getElementById("taskModal");
const openModalBtn = document.getElementById("openTaskModal");
const closeModalBtn = document.querySelector(".close-modal");


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
async function fetchEmployees() {
    try {
        const res = await fetch(USERS_API_URL);
        employees = await res.json();
        
        populateAssignDropdown();
        fetchTasks(); 
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
}

function populateAssignDropdown() {
    const assignSelect = document.getElementById("assignedTo");
    if (!assignSelect) return;
    
    assignSelect.innerHTML = ""; 
    
    if (employees.length === 0) {
        assignSelect.innerHTML = `<option value="" disabled selected>No employees found</option>`;
        return;
    }

    employees.forEach(emp => {
        const option = document.createElement("option");
        option.value = emp.username; 
        option.textContent = emp.username; 
        assignSelect.appendChild(option);
    });
}

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


function updateDashboardStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;

    document.getElementById('statTotalTasks').innerText = total;
    document.getElementById('statCompleted').innerText = completed;
    document.getElementById('statPending').innerText = pending;
    
    
    document.getElementById('statTeamSize').innerText = employees.length; 
}

function renderEmployeeGrid(tasks) {
    const employeeGrid = document.getElementById('employeeGrid');
    if (!employeeGrid) return; 
    
    employeeGrid.innerHTML = "";

    employees.forEach(emp => {
        
        const empTasks = tasks.filter(t => t.assignedTo === emp.username);
        const activeCount = empTasks.filter(t => t.status !== 'Completed').length;
        const compCount = empTasks.filter(t => t.status === 'Completed').length;

        
        const avatarUrl = `https://ui-avatars.com/api/?name=${emp.username}&background=random&color=fff`;

        const card = document.createElement('div');
        card.className = 'employee-card';
        card.innerHTML = `
            <div class="emp-avatar">
                <img src="${avatarUrl}" alt="${emp.username}'s Profile Photo">
            </div>
            <h3 style="text-transform: capitalize;">${emp.username}</h3>
            <p class="role">${emp.email || 'Employee'}</p>
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


fetchEmployees();