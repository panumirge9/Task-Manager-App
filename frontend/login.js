
const signUpButton = document.getElementById('signUpBtn');
const signInButton = document.getElementById('signInBtn');
const container = document.getElementById('authContainer');


signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});


document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    try {

        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem('currentUser', data.user.username);
            localStorage.setItem('userRole', data.user.role);

        
            if (data.user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'employee.html';
            }
        } else {
            
            alert(`Login Failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert("Failed to connect to the server.");
    }
});


document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const role = document.getElementById('regRole').value;

    try {
        
        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            alert("SUCCESS: " + data.message); 
            document.getElementById('registerForm').reset();
            container.classList.remove("right-panel-active");
        } else {
            alert(`Error from server: ${data.message}`);
        }
    } catch (error) {
        console.error("Error registering:", error);
        alert("CRITICAL: Failed to connect to the Node server.");
    }
});