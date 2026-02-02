// Loans Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Check member eligibility and setup page
    checkMemberEligibility();

    // Setup loan calculator
    setupLoanCalculator();

    // Setup loan form
    setupLoanForm();

    // Setup loan history filtering
    setupLoanHistory();

    // Amount input formatting
    setupAmountFormatting();
});

// Member Eligibility Check
function checkMemberEligibility() {
    // Simulate member data (in real app, this would come from API)
    const memberData = {
        membershipPaid: true, // Change to false to test
        hasActiveLoan: false, // Change to true to test
        isAccountBlocked: false, // Change to true to test overdue scenario
        overduePayments: false,
        memberSince: '2023-01-15',
        lastPayment: '2024-01-15'
    };

    const eligibilityStatus = document.getElementById('eligibilityStatus');
    const applicationStatus = document.getElementById('applicationStatus');
    const submitBtn = document.getElementById('submitBtn');
    const loanForm = document.getElementById('loanForm');

    // Check eligibility conditions
    let isEligible = true;
    let statusMessage = '';
    let statusClass = '';
    let blockApplication = false;

    if (!memberData.membershipPaid) {
        isEligible = false;
        statusMessage = 'Membership fee payment required before applying for loans.';
        statusClass = 'ineligible';
        blockApplication = true;
    } else if (memberData.isAccountBlocked || memberData.overduePayments) {
        isEligible = false;
        statusMessage = 'Account blocked due to overdue payments. Please clear outstanding dues to continue.';
        statusClass = 'blocked';
        blockApplication = true;
    } else if (memberData.hasActiveLoan) {
        isEligible = false;
        statusMessage = 'You have an active loan. Complete current loan repayment before applying for a new loan.';
        statusClass = 'ineligible';
        blockApplication = true;
    } else {
        isEligible = true;
        statusMessage = 'Eligible for loan application';
        statusClass = 'eligible';
    }

    // Update eligibility display
    eligibilityStatus.className = `eligibility-status ${statusClass}`;
    eligibilityStatus.innerHTML = `
        <div class="eligibility-title">
            <i class="fas fa-${isEligible ? 'check-circle' : statusClass === 'blocked' ? 'exclamation-triangle' : 'times-circle'}"></i>
            ${isEligible ? 'APPROVED' : statusClass === 'blocked' ? 'BLOCKED' : 'NOT ELIGIBLE'}
        </div>
        <div class="eligibility-message">${statusMessage}</div>
    `;

    // Handle application form based on eligibility
    if (blockApplication) {
        // Show application status alert
        applicationStatus.style.display = 'flex';
        applicationStatus.className = `application-status ${statusClass === 'blocked' ? 'blocked' : 'warning'}`;
        applicationStatus.innerHTML = `
            <i class="fas fa-${statusClass === 'blocked' ? 'ban' : 'exclamation-triangle'}"></i>
            <span>${statusMessage}</span>
        `;

        // Disable form
        disableLoanForm();
    } else {
        // Hide application status alert
        applicationStatus.style.display = 'none';
        
        // Enable form
        enableLoanForm();
    }
}

function disableLoanForm() {
    const form = document.getElementById('loanForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Disable all form inputs
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.disabled = true;
        input.style.opacity = '0.5';
    });
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.innerHTML = '<i class="fas fa-ban"></i> Application Blocked';
}

function enableLoanForm() {
    const form = document.getElementById('loanForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Enable all form inputs
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.disabled = false;
        input.style.opacity = '1';
    });
    
    // Enable submit button
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Submit Application';
}

// Loan Calculator Setup
function setupLoanCalculator() {
    const loanAmountInput = document.getElementById('loanAmount');
    const loanPeriodSelect = document.getElementById('loanPeriod');
    
    // Update calculator when inputs change
    loanAmountInput.addEventListener('input', updateCalculator);
    loanPeriodSelect.addEventListener('change', updateCalculator);
    
    function updateCalculator() {
        const amount = parseFloat(loanAmountInput.value.replace(/,/g, '')) || 0;
        const period = parseInt(loanPeriodSelect.value) || 0;
        const monthlyRate = 0.015; // 1.5% per month
        
        if (amount > 0 && period > 0) {
            // Calculate monthly payment using compound interest
            const totalInterest = amount * monthlyRate * period;
            const totalRepayment = amount + totalInterest;
            const monthlyPayment = totalRepayment / period;
            
            // Update display
            document.getElementById('calcLoanAmount').textContent = `UGX ${amount.toLocaleString()}`;
            document.getElementById('calcLoanPeriod').textContent = `${period} months`;
            document.getElementById('totalInterest').textContent = `UGX ${totalInterest.toLocaleString()}`;
            document.getElementById('monthlyRepayment').textContent = `UGX ${Math.round(monthlyPayment).toLocaleString()}`;
            document.getElementById('totalRepayment').textContent = `UGX ${Math.round(totalRepayment).toLocaleString()}`;
        } else {
            // Reset display
            document.getElementById('calcLoanAmount').textContent = 'UGX 0';
            document.getElementById('calcLoanPeriod').textContent = '0 months';
            document.getElementById('totalInterest').textContent = 'UGX 0';
            document.getElementById('monthlyRepayment').textContent = 'UGX 0';
            document.getElementById('totalRepayment').textContent = 'UGX 0';
        }
    }
}

// Loan Form Setup
function setupLoanForm() {
    const form = document.getElementById('loanForm');
    const submitBtn = document.querySelector('.submit-btn');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const loanData = {
            amount: formData.get('loanAmount'),
            period: formData.get('loanPeriod'),
            purpose: formData.get('loanPurpose'),
            guarantor1: formData.get('guarantor1'),
            guarantor1Phone: formData.get('guarantor1Phone'),
            guarantor2: formData.get('guarantor2'),
            guarantor2Phone: formData.get('guarantor2Phone')
        };
        
        // Validation
        if (!validateLoanForm(loanData)) {
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Application...';
        
        // Simulate form submission
        setTimeout(() => {
            showMessage('Loan application submitted successfully! You will receive a response within 48 hours.', 'success');
            
            // Add new pending loan to history
            addPendingLoanToHistory(loanData);
            
            // Reset form
            form.reset();
            updateCalculator();
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Submit Application';
        }, 3000);
    });
    
    function validateLoanForm(data) {
        // First check member eligibility again
        const memberData = getMemberData();
        
        if (!memberData.membershipPaid) {
            showMessage('Membership fee must be paid before applying for loans.', 'error');
            return false;
        }
        
        if (memberData.hasActiveLoan) {
            showMessage('Cannot apply for new loan while having an active loan.', 'error');
            return false;
        }
        
        if (memberData.isAccountBlocked || memberData.overduePayments) {
            showMessage('Account is blocked due to overdue payments. Please clear dues first.', 'error');
            return false;
        }
        
        const amount = parseFloat(data.amount.replace(/,/g, ''));
        
        if (!amount || amount < 50000) {
            showMessage('Minimum loan amount is UGX 50,000.', 'error');
            return false;
        }
        
        if (amount > 2000000) {
            showMessage('Maximum loan amount is UGX 2,000,000.', 'error');
            return false;
        }
        
        if (!data.period) {
            showMessage('Please select a loan period.', 'error');
            return false;
        }
        
        if (!data.purpose) {
            showMessage('Please select the loan purpose.', 'error');
            return false;
        }
        
        if (!data.guarantor1 || !data.guarantor1Phone) {
            showMessage('Please provide details for Guarantor 1.', 'error');
            return false;
        }
        
        if (!data.guarantor2 || !data.guarantor2Phone) {
            showMessage('Please provide details for Guarantor 2.', 'error');
            return false;
        }
        
        // Phone number validation
        const phoneRegex = /^[0-9]{10,}$/;
        if (!phoneRegex.test(data.guarantor1Phone.replace(/\s/g, ''))) {
            showMessage('Please provide a valid phone number for Guarantor 1.', 'error');
            return false;
        }
        
        if (!phoneRegex.test(data.guarantor2Phone.replace(/\s/g, ''))) {
            showMessage('Please provide a valid phone number for Guarantor 2.', 'error');
            return false;
        }
        
        // Check if guarantors are different
        if (data.guarantor1.toLowerCase().trim() === data.guarantor2.toLowerCase().trim()) {
            showMessage('Guarantors must be different persons.', 'error');
            return false;
        }
        
        if (data.guarantor1Phone.replace(/\s/g, '') === data.guarantor2Phone.replace(/\s/g, '')) {
            showMessage('Guarantors must have different phone numbers.', 'error');
            return false;
        }
        
        return true;
    }
}

// Get Member Data (simulate API call)
function getMemberData() {
    // In real application, this would be an API call
    return {
        membershipPaid: true, // Change to false to test membership requirement
        hasActiveLoan: false, // Change to true to test active loan policy
        isAccountBlocked: false, // Change to true to test account blocking
        overduePayments: false,
        memberSince: '2023-01-15',
        lastPayment: '2024-01-15',
        membershipFeeStatus: 'paid', // 'paid', 'pending', 'overdue'
        activeLoanAmount: 0,
        overdueAmount: 0
    };
}

// Loan History Setup
function setupLoanHistory() {
    const statusFilter = document.getElementById('statusFilter');
    
    statusFilter.addEventListener('change', filterLoans);
    
    function filterLoans() {
        const status = statusFilter.value;
        const loans = document.querySelectorAll('.loan-item');
        
        loans.forEach(loan => {
            let showLoan = true;
            
            if (status !== 'all') {
                const loanStatus = loan.classList.contains(status);
                if (!loanStatus) {
                    showLoan = false;
                }
            }
            
            loan.style.display = showLoan ? 'flex' : 'none';
        });
        
        updateLoanStats();
    }
    
    function updateLoanStats() {
        const visibleLoans = document.querySelectorAll('.loan-item:not([style*="display: none"])');
        const activeLoans = Array.from(visibleLoans).filter(l => l.classList.contains('active'));
        const completedLoans = Array.from(visibleLoans).filter(l => l.classList.contains('completed'));
        
        // Update stats (simplified calculation)
        const statsItems = document.querySelectorAll('.loans-stats .stat-value');
        if (statsItems.length >= 3) {
            statsItems[1].textContent = activeLoans.length; // Active loans
            statsItems[2].textContent = completedLoans.length; // Completed loans
        }
    }
}

// Amount Input Formatting
function setupAmountFormatting() {
    const amountInput = document.getElementById('loanAmount');
    
    amountInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/,/g, '');
        
        if (value && !isNaN(value)) {
            // Format with commas
            e.target.value = parseInt(value).toLocaleString();
        }
        
        // Update calculator
        updateCalculator();
    });
    
    amountInput.addEventListener('blur', function(e) {
        let value = e.target.value.replace(/,/g, '');
        
        if (value && !isNaN(value)) {
            const numValue = parseInt(value);
            if (numValue < 50000) {
                showMessage('Minimum loan amount is UGX 50,000.', 'warning');
            } else if (numValue > 2000000) {
                showMessage('Maximum loan amount is UGX 2,000,000.', 'warning');
            }
        }
    });
}

// Add Pending Loan to History
function addPendingLoanToHistory(loanData) {
    const loansList = document.getElementById('loansList');
    const amount = parseFloat(loanData.amount.replace(/,/g, ''));
    
    const purposeIcons = {
        'business': 'fa-business-time',
        'emergency': 'fa-exclamation-triangle',
        'education': 'fa-graduation-cap',
        'agriculture': 'fa-seedling',
        'personal': 'fa-user'
    };
    
    const loanElement = document.createElement('div');
    loanElement.className = 'loan-item pending';
    loanElement.innerHTML = `
        <div class="loan-icon">
            <i class="fas ${purposeIcons[loanData.purpose] || 'fa-hand-holding-usd'}"></i>
        </div>
        <div class="loan-details">
            <h4 class="loan-title">${loanData.purpose.charAt(0).toUpperCase() + loanData.purpose.slice(1)} Loan</h4>
            <p class="loan-info">UGX ${amount.toLocaleString()} • ${loanData.period} months • 1.5% monthly</p>
            <span class="loan-date">Applied: ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            })}</span>
        </div>
        <div class="loan-status">
            <span class="amount">UGX ${amount.toLocaleString()}</span>
            <span class="status pending">Under Review</span>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <span class="progress-text">Awaiting Approval</span>
        </div>
    `;
    
    // Add animation
    loanElement.style.opacity = '0';
    loanElement.style.transform = 'translateY(20px)';
    
    loansList.insertBefore(loanElement, loansList.firstChild);
    
    setTimeout(() => {
        loanElement.style.transition = 'all 0.3s ease';
        loanElement.style.opacity = '1';
        loanElement.style.transform = 'translateY(0)';
    }, 100);
    
    // Update stats
    updateLoanStats();
}

// Message Display Function
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.loans-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `loans-message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${getMessageIcon(type)}"></i>
        ${message}
    `;

    // Insert message at top of main content
    const mainContent = document.querySelector('.loans-container');
    mainContent.insertBefore(messageDiv, mainContent.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function getMessageIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Add message styles
const messageStyles = `
    .loans-message {
        padding: 1rem 1.5rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.9rem;
        font-weight: 500;
        animation: slideDown 0.3s ease-out;
    }

    .loans-message.success {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #10b981;
    }

    .loans-message.error {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
    }

    .loans-message.warning {
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.3);
        color: #f59e0b;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject message styles
const styleSheet = document.createElement('style');
styleSheet.textContent = messageStyles;
document.head.appendChild(styleSheet);

// Responsive sidebar behavior
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
});

// Helper function to update calculator (make it global)
function updateCalculator() {
    const loanAmountInput = document.getElementById('loanAmount');
    const loanPeriodSelect = document.getElementById('loanPeriod');
    
    const amount = parseFloat(loanAmountInput.value.replace(/,/g, '')) || 0;
    const period = parseInt(loanPeriodSelect.value) || 0;
    const monthlyRate = 0.015; // 1.5% per month
    
    if (amount > 0 && period > 0) {
        // Calculate monthly payment using compound interest
        const totalInterest = amount * monthlyRate * period;
        const totalRepayment = amount + totalInterest;
        const monthlyPayment = totalRepayment / period;
        
        // Update display
        document.getElementById('calcLoanAmount').textContent = `UGX ${amount.toLocaleString()}`;
        document.getElementById('calcLoanPeriod').textContent = `${period} months`;
        document.getElementById('totalInterest').textContent = `UGX ${totalInterest.toLocaleString()}`;
        document.getElementById('monthlyRepayment').textContent = `UGX ${Math.round(monthlyPayment).toLocaleString()}`;
        document.getElementById('totalRepayment').textContent = `UGX ${Math.round(totalRepayment).toLocaleString()}`;
    } else {
        // Reset display
        document.getElementById('calcLoanAmount').textContent = 'UGX 0';
        document.getElementById('calcLoanPeriod').textContent = '0 months';
        document.getElementById('totalInterest').textContent = 'UGX 0';
        document.getElementById('monthlyRepayment').textContent = 'UGX 0';
        document.getElementById('totalRepayment').textContent = 'UGX 0';
    }
}

function updateLoanStats() {
    const visibleLoans = document.querySelectorAll('.loan-item:not([style*="display: none"])');
    const activeLoans = Array.from(visibleLoans).filter(l => l.classList.contains('active'));
    const completedLoans = Array.from(visibleLoans).filter(l => l.classList.contains('completed'));
    
    // Update stats (simplified calculation)
    const statsItems = document.querySelectorAll('.loans-stats .stat-value');
    if (statsItems.length >= 3) {
        statsItems[1].textContent = activeLoans.length; // Active loans
        statsItems[2].textContent = completedLoans.length; // Completed loans
    }
}
// Coming Soon Modal
function showComingSoon(feature) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'coming-soon-modal';
    modal.innerHTML = `
        <div class="modal-header">
            <h3 class="modal-title">${feature} - Coming Soon</h3>
            <button class="modal-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="coming-soon-icon">
                <i class="fas fa-rocket"></i>
            </div>
            <p class="modal-description">
                We're working hard to bring you the ${feature} feature. 
                Stay tuned for updates!
            </p>
            <div class="modal-actions">
                <button class="modal-btn primary">Got it</button>
            </div>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Add modal styles
    const modalStyles = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .coming-soon-modal {
            background: #1A2332;
            border-radius: 20px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            border: 1px solid rgba(244, 180, 0, 0.2);
            animation: slideUp 0.3s ease;
            text-align: center;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .modal-title {
            color: white;
            font-size: 1.3rem;
            font-weight: 700;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 6px;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            color: #F39C12;
            background: rgba(243, 156, 18, 0.1);
        }
        
        .coming-soon-icon {
            font-size: 3rem;
            color: var(--gold);
            margin-bottom: 1rem;
        }
        
        .modal-description {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        
        .modal-actions {
            display: flex;
            justify-content: center;
        }
        
        .modal-btn {
            padding: 0.75rem 2rem;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            font-family: 'Poppins', sans-serif;
        }
        
        .modal-btn.primary {
            background: #F39C12;
            color: white;
        }
        
        .modal-btn.primary:hover {
            background: #D68910;
            transform: translateY(-2px);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(30px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    // Inject modal styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
    
    // Close modal handlers
    const closeModal = () => {
        overlay.remove();
        styleSheet.remove();
    };
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeModal();
    });
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-btn.primary').addEventListener('click', closeModal);
}