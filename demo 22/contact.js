// Contact Form Functionality

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.submit-btn');
    
    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form
        if (validateForm(data)) {
            submitForm(data);
        }
    });
    
    // Form validation
    function validateForm(data) {
        let isValid = true;
        
        // Clear previous error states
        clearErrors();
        
        // Validate full name
        if (!data.fullName || data.fullName.trim().length < 2) {
            showError('fullName', 'Please enter a valid full name');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate subject
        if (!data.subject || data.subject.trim().length < 3) {
            showError('subject', 'Please enter a message subject');
            isValid = false;
        }
        
        // Validate message
        if (!data.message || data.message.trim().length < 10) {
            showError('message', 'Please enter a message (at least 10 characters)');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Show error message
    function showError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const formGroup = field.closest('.form-group');
        
        // Add error class
        field.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        // Insert error message
        formGroup.appendChild(errorElement);
    }
    
    // Clear all errors
    function clearErrors() {
        const errorFields = document.querySelectorAll('.form-input.error, .form-textarea.error');
        const errorMessages = document.querySelectorAll('.error-message');
        
        errorFields.forEach(field => field.classList.remove('error'));
        errorMessages.forEach(message => message.remove());
    }
    
    // Submit form (simulate API call)
    function submitForm(data) {
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Your Inquiry...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            showSuccessMessage();
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Log form data (in real app, this would be sent to server)
            console.log('Form submitted:', data);
        }, 2000);
    }
    
    // Show success message
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We'll get back to you within 2 hours.</p>
            </div>
        `;
        
        // Insert success message
        const formSection = document.querySelector('.contact-form-section');
        formSection.insertBefore(successDiv, contactForm);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
    
    // Real-time validation
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    // Validate individual field
    function validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const formGroup = field.closest('.form-group');
        
        // Clear existing error
        field.classList.remove('error');
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validate based on field type
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldName) {
            case 'fullName':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Please enter a valid full name';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'subject':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'Please enter a message subject';
                }
                break;
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Please enter a message (at least 10 characters)';
                }
                break;
        }
        
        if (!isValid) {
            showError(fieldName, errorMessage);
        }
        
        return isValid;
    }
    
    // Phone number and email click handlers
    const contactValues = document.querySelectorAll('.contact-value, .contact-link');
    contactValues.forEach(element => {
        if (element.textContent.includes('+256')) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', function() {
                window.open(`tel:${this.textContent}`, '_self');
            });
        }
        
        if (element.textContent.includes('@')) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', function() {
                window.open(`mailto:${this.textContent}`, '_self');
            });
        }
        
        if (element.textContent.includes('OPEN MAPS')) {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                // Open Google Maps with the office location
                const address = "Plot 45, Kampala Road, Workers House, Level 4, Kampala, Uganda";
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                window.open(mapsUrl, '_blank');
            });
        }
    });
});