document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const role = document.getElementById('role').value;

    // Store the username in localStorage so the next page knows who logged in
    localStorage.setItem('currentUser', username);
    localStorage.setItem('userRole', role);

    // Redirect based on role
    if (role === 'admin') {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'employee.html';
    }
});