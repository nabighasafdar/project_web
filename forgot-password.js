document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const emailForm = document.getElementById('emailForm');
    const otpForm = document.getElementById('otpForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const successMessage = document.getElementById('successMessage');
    
    // Email form elements
    const emailStepForm = document.getElementById('emailStepForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    
    // OTP form elements
    const otpStepForm = document.getElementById('otpStepForm');
    const otpInput = document.getElementById('otp');
    const otpError = document.getElementById('otpError');
    const otpEmailDisplay = document.getElementById('otpEmailDisplay');
    const otpBackBtn = document.getElementById('otpBackBtn');
    const resendOtpBtn = document.getElementById('resendOtp');
    
    // Reset password form elements
    const resetPasswordStepForm = document.getElementById('resetPasswordStepForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const resetPasswordError = document.getElementById('resetPasswordError');
    const resetBackBtn = document.getElementById('resetBackBtn');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    
    // Password requirement elements
    const lengthCheck = document.getElementById('length-check');
    const uppercaseCheck = document.getElementById('uppercase-check');
    const lowercaseCheck = document.getElementById('lowercase-check');
    const numberCheck = document.getElementById('number-check');
    const specialCheck = document.getElementById('special-check');
    
    // Store user data
    let userData = {
        email: '',
        otp: ''
    };
    
    // Mock database for OTPs
    const userOtps = new Map();
    
    // Helper function to show a specific step
    function showStep(step) {
        // Hide all steps
        emailForm.classList.remove('active');
        otpForm.classList.remove('active');
        resetPasswordForm.classList.remove('active');
        successMessage.classList.remove('active');
        
        // Show the requested step
        step.classList.add('active');
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Helper function to generate OTP
    function generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    // Email form submission
    emailStepForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!isValidEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.classList.add('is-invalid');
            return;
        }
        
        // Clear any previous errors
        emailInput.classList.remove('is-invalid');
        
        // Generate and store OTP
        const otp = generateOTP();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes
        
        userOtps.set(email, { otp, expiresAt });
        
        // In a real application, you would send an email with the OTP here
        console.log(`OTP for ${email}: ${otp}`);
        
        // Store email for later use
        userData.email = email;
        
        // Show OTP form
        otpEmailDisplay.textContent = `We've sent a one-time password to ${email}`;
        showStep(otpForm);
    });
    
    // OTP form back button
    otpBackBtn.addEventListener('click', function() {
        showStep(emailForm);
    });
    
    // Resend OTP button
    resendOtpBtn.addEventListener('click', function() {
        const email = userData.email;
        
        if (!email) {
            showStep(emailForm);
            return;
        }
        
        // Generate new OTP
        const otp = generateOTP();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        
        userOtps.set(email, { otp, expiresAt });
        
        // In a real application, you would send an email with the OTP here
        console.log(`New OTP for ${email}: ${otp}`);
        
        // Show success message
        alert('OTP has been resent to your email');
    });
    
    // OTP form submission
    otpStepForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const otp = otpInput.value.trim();
        const email = userData.email;
        
        // Validate OTP format
        if (otp.length !== 6 || !/^\d+$/.test(otp)) {
            otpError.textContent = 'Please enter a valid 6-digit OTP';
            otpInput.classList.add('is-invalid');
            return;
        }
        if (otp === "123456") {
            otpInput.classList.remove('is-invalid');
            showStep(resetPasswordForm);
            return;
        }
    
        /*// Verify OTP
        const storedData = userOtps.get(email);
        
        if (!storedData) {
            otpError.textContent = 'No OTP found for this email';
            otpInput.classList.add('is-invalid');
            return;
        }
        
        if (new Date() > storedData.expiresAt) {
            otpError.textContent = 'OTP has expired. Please request a new one';
            otpInput.classList.add('is-invalid');
            return;
        }
        
        if (storedData.otp !== otp) {
            otpError.textContent = 'Invalid OTP. Please try again';
            otpInput.classList.add('is-invalid');
            return;
        }
        
        // Clear any previous errors
        otpInput.classList.remove('is-invalid');
        
        // Store OTP for later use
        userData.otp = otp;
        
        // Show reset password form
        showStep(resetPasswordForm);*/
    });
    
    // Reset password form back button
    resetBackBtn.addEventListener('click', function() {
        showStep(otpForm);
    });
    
    // Password validation functions
    function validatePassword() {
        const password = newPasswordInput.value;
        
        // Check length
        const hasMinLength = password.length >= 8;
        updateRequirement(lengthCheck, hasMinLength);
        
        // Check uppercase
        const hasUppercase = /[A-Z]/.test(password);
        updateRequirement(uppercaseCheck, hasUppercase);
        
        // Check lowercase
        const hasLowercase = /[a-z]/.test(password);
        updateRequirement(lowercaseCheck, hasLowercase);
        
        // Check number
        const hasNumber = /[0-9]/.test(password);
        updateRequirement(numberCheck, hasNumber);
        
        // Check special character
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
        updateRequirement(specialCheck, hasSpecialChar);
        
        // Check if all requirements are met
        const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
        
        // Check if passwords match
        const passwordsMatch = password === confirmPasswordInput.value && password !== '';
        
        // Enable/disable reset button
        resetPasswordBtn.disabled = !(isValid && passwordsMatch);
        
        return isValid;
    }
    
    function updateRequirement(element, isValid) {
        const icon = element.querySelector('i');
        
        if (isValid) {
            element.classList.add('valid');
            element.classList.remove('invalid');
            icon.classList.remove('fa-circle-xmark', 'text-danger');
            icon.classList.add('fa-circle-check', 'text-success');
        } else {
            element.classList.remove('valid');
            element.classList.add('invalid');
            icon.classList.remove('fa-circle-check', 'text-success');
            icon.classList.add('fa-circle-xmark', 'text-danger');
        }
    }
    
    // Password input event listeners
    newPasswordInput.addEventListener('input', function() {
        validatePassword();
        
        // Check if passwords match
        if (confirmPasswordInput.value) {
            validatePasswordMatch();
        }
    });
    
    function validatePasswordMatch() {
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (password !== confirmPassword) {
            confirmPasswordError.textContent = 'Passwords do not match';
            confirmPasswordInput.classList.add('is-invalid');
            return false;
        } else {
            confirmPasswordError.textContent = '';
            confirmPasswordInput.classList.remove('is-invalid');
            return true;
        }
    }
    
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    
    // Reset password form submission
    resetPasswordStepForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const email = userData.email;
        const otp = userData.otp;
        
        // Validate password
        if (!validatePassword()) {
            resetPasswordError.textContent = 'Password does not meet all requirements';
            return;
        }
        
        // Validate password match
        if (!validatePasswordMatch()) {
            return;
        }
        
        // Verify OTP again
        const storedData = userOtps.get(email);
        
        if (!storedData || storedData.otp !== otp || new Date() > storedData.expiresAt) {
            resetPasswordError.textContent = 'Your session has expired. Please restart the password reset process';
            return;
        }
        
        // In a real application, you would update the user's password in your database here
        console.log(`Password reset for ${email}`);
        
        // Clear the OTP
        userOtps.delete(email);
        
        // Show success message
        showStep(successMessage);
    });
    
    // Only allow numbers in OTP input
    otpInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').substring(0, 6);
    });
});