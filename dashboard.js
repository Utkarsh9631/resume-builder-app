// Check authentication on page load
document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");
    
    if (token) {
        // User is logged in
        document.getElementById('loggedOutNav').style.display = 'none';
        document.getElementById('loggedInNav').style.display = 'block';
        document.getElementById('authenticatedContent').style.display = 'block';
        document.getElementById('guestContent').style.display = 'none';
        
        // Set username in navbar
        const username = localStorage.getItem("username");
        document.getElementById('navUsername').textContent = username || 'User';
        
        // Fetch user details
        fetchUserDetails();
    } else {
        // User is not logged in
        document.getElementById('loggedOutNav').style.display = 'block';
        document.getElementById('loggedInNav').style.display = 'none';
        document.getElementById('authenticatedContent').style.display = 'none';
        document.getElementById('guestContent').style.display = 'block';
    }
});

// Function handler that checks for authentication first
function handleFunction(functionName) {
    const token = localStorage.getItem("token");
    
    if (token) {
        // User is logged in, execute the requested function
        switch(functionName) {
            case 'buildResume':
                buildResume();
                break;
            case 'checkATSScore':
                checkATSScore();
                break;
            case 'viewResumes':
                viewResumes();
                break;
            case 'trackApplications':
                trackApplications();
                break;
            case 'openSettings':
                openSettings();
                break;
        }
    } else {
        // User is not logged in, show login modal
        showLoginModal();
    }
}

// Show login required modal
function showLoginModal() {
    document.getElementById('loginRequiredModal').style.display = 'block';
}

// Close login modal
function closeLoginModal() {
    document.getElementById('loginRequiredModal').style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('loginRequiredModal');
    if (event.target === modal) {
        closeLoginModal();
    }
}

// Settings function
function openSettings() {
    alert('Settings functionality coming soon!');
    // You can implement a settings page or modal later
}