// Login Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const signinBtn = document.querySelector('.signin-btn');

    // Password visibility toggle
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle icon
        const icon = this.querySelector('i');
        if (type === 'text') {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            this.setAttribute('aria-label', 'Hide password');
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            this.setAttribute('aria-label', 'Show password');
        }
    });

    // Form validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateForm() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        const isValid = validateEmail(email) && password.length >= 6;
        
        signinBtn.disabled = !isValid;
        signinBtn.style.opacity = isValid ? '1' : '0.6';
        
        return isValid;
    }

    // Real-time validation
    emailInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showMessage('Please fill in all fields correctly.', 'error');
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Show loading state
        signinBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        signinBtn.disabled = true;

        // Simulate login process
        setTimeout(() => {
            // Demo credentials check
            if (email === 'admin@empower.ug' && password === 'empower123') {
                showMessage('Login successful! Redirecting to dashboard...', 'success');
                setTimeout(() => {
                    // Redirect to dashboard (placeholder)
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showMessage('Invalid credentials. Please try again.', 'error');
                signinBtn.innerHTML = 'Sign In Securely';
                signinBtn.disabled = false;
            }
        }, 2000);
    });

    // Show message function
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.login-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `login-message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;

        // Insert message before form
        loginForm.parentNode.insertBefore(messageDiv, loginForm);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Initial validation
    validateForm();

    // Demo credentials hint
    setTimeout(() => {
        showMessage('Demo: Use admin@empower.ug / empower123', 'info');
    }, 1000);
});

// Add message styles dynamically
const messageStyles = `
    .login-message {
        padding: 1rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.9rem;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    }

    .login-message.success {
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
        color: #22c55e;
    }

    .login-message.error {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
    }

    .login-message.info {
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        color: #3b82f6;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = messageStyles;
document.head.appendChild(styleSheet);