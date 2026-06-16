// This proves the file is successfully connected to your HTML!
console.log("✅ The main.js file is loaded and ready!");

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const toast = document.getElementById('toastMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            // 1. STOP the page from refreshing!
            e.preventDefault(); 
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            // Hide any old error messages
            toast.className = "feedback-toast hidden";

            try {
                // 2. Send the data to your Node.js backend
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.success) {
                    // 3. Login successful! Save the token and role.
                    sessionStorage.setItem('active_token', data.token);
                    sessionStorage.setItem('user_role', data.role);
                    
                    // 4. Redirect to the Dashboard
                    window.location.href = '/html/dashboard.html';
                } else {
                    displayError(data.message || 'Access authorization denied.');
                }
            } catch (err) {
                console.error("Network Error:", err);
                displayError('Could not contact the backend server engine.');
            }
        });
    }

    function displayError(msg) {
        toast.textContent = msg;
        toast.className = "feedback-toast error";
    }
});