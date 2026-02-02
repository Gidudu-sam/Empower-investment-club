// Join Modal Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Create modal HTML
    createJoinModal();
    
    // Get modal elements
    const modalOverlay = document.getElementById('joinModalOverlay');
    const joinModal = document.getElementById('joinModal');
    const closeBtn = document.querySelector('.modal-close');
    const joinForm = document.getElementById('joinForm');
    const fileUploadArea = document.querySelector('.file-upload-area');
    const fileInput = document.getElementById('fileInput');
    const submitBtn = document.querySelector('.submit-application');
    
    // Join button click handlers
    const joinButtons = document.querySelectorAll('.join-btn, .cta-button, .cta-primary, .join-trigger');
    joinButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    });
    
    // Close modal handlers
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
    
    // File upload handlers
    fileUploadArea.addEventListener('click', () => fileInput.click());
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('dragleave', handleDragLeave);
    fileUploadArea.addEventListener('drop', handleFileDrop);
    fileInput.addEventListener('change', handleFileSelect);
    
    // Form submission
    joinForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    const formInputs = document.querySelectorAll('.join-form-input');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    function createJoinModal() {
        const modalHTML = `
            <div id="joinModalOverlay" class="modal-overlay">
                <div id="joinModal" class="join-modal">
                    <div class="modal-header">
                        <button class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                        <h2 class="modal-title">Join Empower Investment Club</h2>
                        <p class="modal-subtitle">Start your journey to financial empowerment today</p>
                    </div>
                    
                    <div class="subscription-info">
                        <div class="subscription-icon">
                            <i class="fas fa-info-circle"></i>
                        </div>
                        <div class="subscription-text">
                            <div class="subscription-title">Subscription Required</div>
                            <div class="subscription-description">
                                Join this organization with an UGX 50,000 subscription to unlock your financial potential and enjoy all club benefits.
                            </div>
                        </div>
                    </div>
                    
                    <form id="joinForm" class="modal-form">
                        <div class="form-grid">
                            <div class="join-form-group">
                                <label class="join-form-label">Full Name</label>
                                <input type="text" name="fullName" class="join-form-input" placeholder="John Doe" required>
                            </div>
                            
                            <div class="join-form-group">
                                <label class="join-form-label">Email Address</label>
                                <input type="email" name="email" class="join-form-input" placeholder="john@example.com" required>
                            </div>
                            
                            <div class="join-form-group">
                                <label class="join-form-label">Phone Number</label>
                                <input type="tel" name="phone" class="join-form-input" placeholder="+256 700 000 000" required>
                            </div>
                            
                            <div class="join-form-group">
                                <label class="join-form-label">National ID/NIN</label>
                                <input type="text" name="nationalId" class="join-form-input" placeholder="CM12345678901234" required>
                            </div>
                            
                            <div class="join-form-group">
                                <label class="join-form-label">Date of Birth</label>
                                <input type="date" name="dateOfBirth" class="join-form-input" required>
                            </div>
                            
                            <div class="join-form-group">
                                <label class="join-form-label">Next of Kin</label>
                                <input type="text" name="nextOfKin" class="join-form-input" placeholder="Jane Doe" required>
                            </div>
                        </div>
                        
                        <div class="file-upload-section">
                            <label class="join-form-label">Upload Payment Proof (UGX 50k)</label>
                            <div class="file-upload-area">
                                <div class="upload-icon">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                </div>
                                <div class="upload-text">Click to upload or drag and drop</div>
                                <div class="upload-subtext">PNG, JPG, PDF up to 10MB</div>
                                <input type="file" id="fileInput" class="file-input" accept=".png,.jpg,.jpeg,.pdf" required>
                            </div>
                            <div id="uploadedFile" class="uploaded-file" style="display: none;">
                                <div class="file-info">
                                    <i class="fas fa-file file-icon"></i>
                                    <span class="file-name"></span>
                                </div>
                                <button type="button" class="remove-file">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        
                        <button type="submit" class="submit-application">
                            Submit Application
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    function openModal() {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form after a delay
        setTimeout(() => {
            resetForm();
        }, 300);
    }
    
    function resetForm() {
        joinForm.reset();
        clearErrors();
        hideUploadedFile();
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    }
    
    function handleDragLeave(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
    }
    
    function handleFileDrop(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }
    
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    }
    
    function handleFile(file) {
        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a PNG, JPG, or PDF file.');
            return;
        }
        
        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB.');
            return;
        }
        
        // Show uploaded file
        showUploadedFile(file.name);
    }
    
    function showUploadedFile(fileName) {
        const uploadedFileDiv = document.getElementById('uploadedFile');
        const fileNameSpan = uploadedFileDiv.querySelector('.file-name');
        const removeBtn = uploadedFileDiv.querySelector('.remove-file');
        
        fileNameSpan.textContent = fileName;
        uploadedFileDiv.style.display = 'flex';
        
        removeBtn.onclick = hideUploadedFile;
    }
    
    function hideUploadedFile() {
        const uploadedFileDiv = document.getElementById('uploadedFile');
        uploadedFileDiv.style.display = 'none';
        fileInput.value = '';
    }
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Clear existing error
        clearFieldError(field);
        
        // Validate based on field type
        switch (fieldName) {
            case 'fullName':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Please enter your full name';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'phone':
                const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
            case 'nationalId':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Please enter a valid National ID';
                }
                break;
            case 'dateOfBirth':
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                if (age < 18) {
                    isValid = false;
                    errorMessage = 'You must be at least 18 years old';
                }
                break;
            case 'nextOfKin':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Please enter next of kin name';
                }
                break;
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'join-error-message';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.join-error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function clearErrors() {
        const errorFields = document.querySelectorAll('.join-form-input.error');
        const errorMessages = document.querySelectorAll('.join-error-message');
        
        errorFields.forEach(field => field.classList.remove('error'));
        errorMessages.forEach(message => message.remove());
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });
        
        // Check if file is uploaded
        if (!fileInput.files.length) {
            alert('Please upload payment proof to complete your application.');
            isFormValid = false;
        }
        
        if (isFormValid) {
            submitApplication();
        }
    }
    
    function submitApplication() {
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Application...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showSuccessState();
        }, 3000);
    }
    
    function showSuccessState() {
        const modalContent = joinModal.innerHTML;
        
        joinModal.innerHTML = `
            <div class="success-state">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 class="success-title">Application Submitted!</h2>
                <p class="success-message">
                    Thank you for joining Empower Investment Club. We'll review your application and contact you within 24 hours to complete your membership setup.
                </p>
                <div class="success-actions">
                    <button class="success-btn primary" onclick="closeModal()">
                        <i class="fas fa-home"></i>
                        Back to Home
                    </button>
                    <a href="contact.html" class="success-btn secondary">
                        <i class="fas fa-phone"></i>
                        Contact Us
                    </a>
                </div>
            </div>
        `;
        
        // Auto close after 10 seconds
        setTimeout(() => {
            closeModal();
            // Restore original modal content
            setTimeout(() => {
                joinModal.innerHTML = modalContent;
                // Re-bind event listeners
                bindModalEvents();
            }, 300);
        }, 10000);
    }
    
    function bindModalEvents() {
        // Re-create the modal to restore all functionality
        modalOverlay.remove();
        createJoinModal();
        
        // Re-get elements and bind events
        const newModalOverlay = document.getElementById('joinModalOverlay');
        const newJoinModal = document.getElementById('joinModal');
        const newCloseBtn = newJoinModal.querySelector('.modal-close');
        const newJoinForm = document.getElementById('joinForm');
        const newFileUploadArea = newJoinModal.querySelector('.file-upload-area');
        const newFileInput = document.getElementById('fileInput');
        
        // Re-bind all event listeners
        newCloseBtn.addEventListener('click', closeModal);
        newModalOverlay.addEventListener('click', function(e) {
            if (e.target === newModalOverlay) {
                closeModal();
            }
        });
        
        newFileUploadArea.addEventListener('click', () => newFileInput.click());
        newFileUploadArea.addEventListener('dragover', handleDragOver);
        newFileUploadArea.addEventListener('dragleave', handleDragLeave);
        newFileUploadArea.addEventListener('drop', handleFileDrop);
        newFileInput.addEventListener('change', handleFileSelect);
        newJoinForm.addEventListener('submit', handleFormSubmit);
        
        // Re-bind validation
        const newFormInputs = newJoinModal.querySelectorAll('.join-form-input');
        newFormInputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });
    }
});