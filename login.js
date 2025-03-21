document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('remember-me');
    const loginButton = document.getElementById('login-button');
    const buttonText = document.getElementById('button-text');
    const spinner = document.getElementById('spinner');
    const errorAlert = document.getElementById('error-alert');
    const errorMessage = document.getElementById('error-message');
    const togglePasswordButton = document.querySelector('.toggle-password');
    const forgotPasswordLink = document.getElementById('forgot-password');

    // Toggle password visibility
    togglePasswordButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        const eyeIcon = this.querySelector('i');
        eyeIcon.classList.toggle('fa-eye');
        eyeIcon.classList.toggle('fa-eye-slash');
    });

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset error states
        hideError();
        
        // Get form values
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeCheckbox.checked;
        
        // Validate form
        if (!validateForm(email, password)) {
            return;
        }
        
        // Show loading state
        setLoading(true);
        
        // Simulate API call for authentication
        setTimeout(() => {
            // In a real application, this would be an actual API call
            authenticateUser(email, password, rememberMe);
        }, 1500);
    });

    // Forgot password handler
    forgotPasswordLink.addEventListener('click', function() {
        window.location.href = "forgot-password.html";
    });
    
    // Form validation
    function validateForm(email, password) {
        if (!email) {
            showError('Email is required');
            emailInput.focus();
            return false;
        }
        
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            emailInput.focus();
            return false;
        }
        
        if (!password) {
            showError('Password is required');
            passwordInput.focus();
            return false;
        }
        
        return true;
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Authentication function (simulated)
    function authenticateUser(email, password, rememberMe) {
        // In a real application, this would be an API call to your backend
        
        // Simulate a successful login for demo purposes
        // In a real app, you would check the response from your server
        if (email === 'user@example.com' && password === 'password123') {
            // Successful login
            
            // In a real application, the server would return a JWT token
            const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
            
            // Store the JWT token in localStorage or sessionStorage
            localStorage.setItem('authToken', mockJwtToken);
            
            // If remember me is checked, set a cookie with longer expiration
            if (rememberMe) {
                // In a real application, this would be handled securely by the server
                // This is just for demonstration purposes
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 30); // 30 days
                document.cookie = `rememberUser=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
                
                console.log('Remember me enabled - cookie set for 30 days');
            }
            
            // Show success message and redirect
            showSuccess('Login successful!');
            
            // In a real application, redirect to dashboard or home page
            setTimeout(() => {
                alert('In a real application, you would be redirected to the dashboard');
                // window.location.href = '/dashboard';
            }, 1000);
        } else {
            // Failed login
            showError('Invalid email or password');
            setLoading(false);
        }
    }

    // UI Helper Functions
    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.classList.remove('d-none');
    }
    
    function hideError() {
        errorAlert.classList.add('d-none');
    }
    
    function showSuccess(message) {
        // You could add a success alert here
        console.log(message);
    }
    
    function setLoading(isLoading) {
        if (isLoading) {
            buttonText.textContent = 'Signing in...';
            spinner.classList.remove('d-none');
            loginButton.disabled = true;
        } else {
            buttonText.textContent = 'Sign in';
            spinner.classList.add('d-none');
            loginButton.disabled = false;
        }
    }

    // Check if user has a remember me cookie (for demo purposes)
    function checkRememberMeCookie() {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('rememberUser=')) {
                // In a real application, you would check for a valid JWT token as well
                emailInput.value = 'user@example.com'; // For demo purposes
                rememberMeCheckbox.checked = true;
                break;
            }
        }
    }

    // Initialize
    checkRememberMeCookie();
});

/*
 * IMPLEMENTATION NOTES:
 * 
 * 1. JWT Token Implementation:
 *    - In a real application, the server would generate a JWT token upon successful authentication
 *    - The token would be sent back to the client and stored securely
 *    - For subsequent requests, the token would be included in the Authorization header
 *    - Example server-side code (Node.js with Express):
 *      
 *      const jwt = require('jsonwebtoken');
 *      
 *      app.post('/api/login', (req, res) => {
 *        const { email, password } = req.body;
 *        
 *        // Validate credentials against database
 *        // ...
 *        
 *        // Generate JWT token
 *        const token = jwt.sign(
 *          { userId: user.id, email: user.email },
 *          process.env.JWT_SECRET,
 *          { expiresIn: '1h' }
 *        );
 *        
 *        // Send token to client
 *        res.json({ token });
 *      });
 * 
 * 2. Nodemailer Implementation:
 *    - Used for sending password reset emails, verification emails, etc.
 *    - Example server-side code (Node.js):
 *      
 *      const nodemailer = require('nodemailer');
 *      
 *      app.post('/api/forgot-password', async (req, res) => {
 *        const { email } = req.body;
 *        
 *        // Generate reset token
 *        const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
 *        
 *        // Create transporter
 *        const transporter = nodemailer.createTransport({
 *          host: process.env.EMAIL_HOST,
 *          port: process.env.EMAIL_PORT,
 *          secure: true,
 *          auth: {
 *            user: process.env.EMAIL_USER,
 *            pass: process.env.EMAIL_PASS
 *          }
 *        });
 *        
 *        // Send email
 *        await transporter.sendMail({
 *          from: '"Your App" <noreply@yourapp.com>',
 *          to: email,
 *          subject: "Password Reset",
 *          html: `<p>Click <a href="${process.env.APP_URL}/reset-password?token=${resetToken}">here</a> to reset your password.</p>`
 *        });
 *        
 *        res.json({ message: 'Password reset email sent' });
 *      });
 * 
 * 3. Cookies Implementation:
 *    - Used for "Remember Me" functionality and session management
 *    - In a real application, HTTP-only cookies would be set by the server for better security
 *    - Example server-side code (Node.js with Express):
 *      
 *      app.post('/api/login', (req, res) => {
 *        // ... authentication logic
 *        
 *        // Set JWT in HTTP-only cookie
 *        res.cookie('authToken', token, {
 *          httpOnly: true,
 *          secure: process.env.NODE_ENV === 'production',
 *          maxAge: req.body.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
 *          sameSite: 'strict'
 *        });
 *        
 *        res.json({ success: true });
 *      });
 * 
 * 4. CRUD Operations:
 *    - Create: Register new users, create new resources
 *    - Read: Fetch user data, get resources
 *    - Update: Update user profile, modify resources
 *    - Delete: Delete account, remove resources
 *    
 *    - These operations would be implemented as API endpoints protected by JWT authentication
 *    - Example client-side code for a protected API call:
 *      
 *      async function fetchUserData() {
 *        const token = localStorage.getItem('authToken');
 *        
 *        const response = await fetch('/api/user/profile', {
 *          headers: {
 *            'Authorization': `Bearer ${token}`
 *          }
 *        });
 *        
 *        return response.json();
 *      }
 */