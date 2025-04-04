const API_URL = "http://localhost:5000"; // Your backend server URL

// Signup Function
async function signup() {
    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Signup successful! Please log in.");
            window.location.href = "login.html"; // Redirect to login page
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Signup error:", error);
        alert("Error signing up. Please try again.");
    }
}

// Login Function
async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            localStorage.setItem("email", data.email);

            alert("Login successful!");
            window.location.href = "dashboard.html"; // Redirect after login
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Error logging in. Please try again.");
    }
}

// Fetch User Data for Dashboard
async function fetchUserDetails() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html"; // Redirect if not logged in
        return;
    }

    try {
        const response = await fetch(`${API_URL}/user`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("username").textContent = data.username;
            document.getElementById("email").textContent = data.email;
        } else {
            alert("Session expired! Please login again.");
            logout();
        }
    } catch (error) {
        console.error("Fetch user error:", error);
        logout();
    }
}

// Logout Function
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    window.location.href = "login.html"; // Redirect to login
}

// Add these functions to your script.js file
function buildResume() {
    // Check if user is logged in first
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to build a resume");
        window.location.href = "login.html";
        return;
    }
    
    window.location.href = "resumeBuilder.html";
}

function checkATSScore() {
    // Check if user is logged in first
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to check ATS score");
        window.location.href = "login.html";
        return;
    }
    
    // For now, just show a message (you can implement this feature later)
    alert("ATS Score checking feature coming soon!");
}

// Add function to view user's resumes
async function viewResumes() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to view your resumes");
        window.location.href = "login.html";
        return;
    }
    
    window.location.href = "my-resumes.html";
}

// Call fetchUserDetails on Dashboard Load
document.addEventListener("DOMContentLoaded", function () {
    if (document.body.contains(document.getElementById("username"))) {
        fetchUserDetails();
    }
});
