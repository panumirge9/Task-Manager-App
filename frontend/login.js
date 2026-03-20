// Get DOM Elements
const signUpButton = document.getElementById('signUpBtn');
const signInButton = document.getElementById('signInBtn');
const container = document.getElementById('authContainer');

// Toggle Slide Animation
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// Handle Login
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    try {
        // Ask the backend to verify the user
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });

        const data = await response.json();

        // If the backend says OK (Status 200)
        if (response.ok) {
            // ONLY set localStorage if the login was successful
            localStorage.setItem('currentUser', data.user.username);
            localStorage.setItem('userRole', data.user.role);

            // Redirect based on role
            if (data.user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'employee.html';
            }
        } else {
            // Show the error message from the backend (e.g., "Invalid password")
            alert(`Login Failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert("Failed to connect to the server.");
    }
});

// Handle Registration
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const role = document.getElementById('regRole').value;

    try {
        // THIS IS THE CRUCIAL PART: Actually sending data to the backend
        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            alert("SUCCESS: " + data.message); // Changed the alert text so we know it's the real one!
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