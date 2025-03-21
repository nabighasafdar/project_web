document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm")
    const successAlert = document.getElementById("successAlert")
  
    // Form validation and submission
    form.addEventListener("submit", (event) => {
      event.preventDefault()
  
      // Reset previous validation
      resetValidation()
  
      // Validate form
      if (validateForm()) {
        // Form is valid, show success message
        showSuccessMessage()
  
        // Reset form after delay
        setTimeout(() => {
          form.reset()
          successAlert.style.display = "none"
        }, 3000)
      }
    })
  
    // Input event listeners for real-time validation
    const inputs = form.querySelectorAll("input")
    inputs.forEach((input) => {
      input.addEventListener("input", function () {
        // Clear validation state when user starts typing
        this.classList.remove("is-invalid")
      })
    })
  
    // Form validation function
    function validateForm() {
      let isValid = true
  
      // First name validation
      const firstName = document.getElementById("firstName")
      if (!firstName.value.trim()) {
        setInvalid(firstName, "First name is required")
        isValid = false
      }
  
      // Last name validation
      const lastName = document.getElementById("lastName")
      if (!lastName.value.trim()) {
        setInvalid(lastName, "Last name is required")
        isValid = false
      }
  
      // Age validation
      const age = document.getElementById("age")
      if (!age.value || isNaN(age.value) || Number.parseInt(age.value) <= 0) {
        setInvalid(age, "Please enter a valid age")
        isValid = false
      }
  
      // Email validation
      const email = document.getElementById("email")
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email.value.trim() || !emailRegex.test(email.value)) {
        setInvalid(email, "Please enter a valid email")
        isValid = false
      }
  
      // Password validation
      const password = document.getElementById("password")
      if (!password.value || password.value.length < 6) {
        setInvalid(password, "Password must be at least 6 characters")
        isValid = false
      }
  
      // Confirm password validation
      const confirmPassword = document.getElementById("confirmPassword")
      if (!confirmPassword.value) {
        setInvalid(confirmPassword, "Please confirm your password")
        isValid = false
      } else if (password.value !== confirmPassword.value) {
        setInvalid(confirmPassword, "Passwords do not match")
        isValid = false
      }
  
      return isValid
    }
  
    // Helper function to set invalid state
    function setInvalid(element, message) {
      element.classList.add("is-invalid")
      const feedback = element.nextElementSibling
      if (feedback && feedback.classList.contains("invalid-feedback")) {
        feedback.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`
      }
    }
  
    // Reset validation state
    function resetValidation() {
      const invalidInputs = form.querySelectorAll(".is-invalid")
      invalidInputs.forEach((input) => {
        input.classList.remove("is-invalid")
      })
    }
  
    // Show success message
    function showSuccessMessage() {
      successAlert.style.display = "flex"
  
      // Log form data (in a real application, you would send this to a server)
      const formData = new FormData(form)
      const formDataObj = {}
      formData.forEach((value, key) => {
        formDataObj[key] = value
      })
      console.log("Form submitted:", formDataObj)
    }
  })
  
  