document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Check if the user actually logged in
    const activeToken = sessionStorage.getItem('active_token');
    
    if (!activeToken) {
        // Trespasser detected! Kick them back to login.
        window.location.replace('/html/login.html');
        return; 
    }

    // 2. Personalize the Dashboard with their role
    const userRole = sessionStorage.getItem('user_role');
    const greetingElement = document.getElementById('userGreeting');
    
    if (greetingElement && userRole) {
        greetingElement.textContent = `Welcome, ${userRole}`;
    }

    // 3. Make the Logout button work
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.clear(); // Destroy the key
            window.location.replace('/html/login.html'); // Send back to login
        });
    }
});