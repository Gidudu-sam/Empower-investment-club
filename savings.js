// Savings Page Functionality
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

    // File upload functionality
    setupFileUpload();

    // Copy functionality for payment details
    setupCopyButtons();

    // Form validation and submission
    setupDepositForm();

    // Setup payment history functionality
    setupPaymentHistory();

    // Amount input formatting
    setupAmountFormatting();
});

// Payment History Setup
function setupPaymentHistory() {
    const periodFilter = document.getElementById('periodFilter');
    const statusFilter = document.getElementById('statusFilter');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    // Filter functionality
    periodFilter.addEventListener('change', filterTransactions);
    statusFilter.addEventListener('change', filterTransactions);
    
    // Load more functionality
    loadMoreBtn.addEventListener('click', loadMoreTransactions);
    
    function filterTransactions() {
        const period = periodFilter.value;
        const status = statusFilter.value;
        const transactions = document.querySelectorAll('.transaction-item');
        
        transactions.forEach(transaction => {
            let showTransaction = true;
            
            // Filter by status
            if (status !== 'all') {
                const transactionStatus = transaction.classList.contains(status);
                if (!transactionStatus) {
                    showTransaction = false;
                }
            }
            
            // Filter by period (simplified - in real app would use actual dates)
            if (period !== 'all') {
                const dateText = transaction.querySelector('.transaction-date').textContent;
                // Simple date filtering logic (in real app, would parse actual dates)
                if (period === '30' && !dateText.includes('Jan 2024')) {
                    showTransaction = false;
                } else if (period === '90' && dateText.includes('2023') && !dateText.includes('Dec 2023')) {
                    showTransaction = false;
                }
            }
            
            transaction.style.display = showTransaction ? 'flex' : 'none';
        });
        
        updateTransactionStats();
    }
    
    function loadMoreTransactions() {
        // Simulate loading more transactions
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            addMoreTransactions();
            loadMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Load More Transactions';
            loadMoreBtn.disabled = false;
        }, 1500);
    }
    
    function addMoreTransactions() {
        const transactionsList = document.getElementById('transactionsList');
        const moreTransactions = [
            {
                title: 'Weekly Deposit',
                method: 'Mobile Money - MTN',
                date: 'Dec 4, 2023 • 3:15 PM',
                amount: '+UGX 20,000',
                status: 'completed'
            },
            {
                title: 'Emergency Contribution',
                method: 'Equity Bank Transfer',
                date: 'Nov 27, 2023 • 8:45 AM',
                amount: '+UGX 75,000',
                status: 'completed'
            },
            {
                title: 'Weekly Deposit',
                method: 'Mobile Money - Airtel',
                date: 'Nov 20, 2023 • 5:30 PM',
                amount: '+UGX 20,000',
                status: 'completed'
            }
        ];
        
        moreTransactions.forEach(transaction => {
            const transactionElement = createTransactionElement(transaction);
            transactionsList.appendChild(transactionElement);
        });
        
        updateTransactionStats();
    }
    
    function createTransactionElement(transaction) {
        const div = document.createElement('div');
        div.className = `transaction-item ${transaction.status}`;
        
        const iconClass = transaction.status === 'completed' ? 'fa-arrow-down' : 
                         transaction.status === 'pending' ? 'fa-clock' : 'fa-times';
        
        div.innerHTML = `
            <div class="transaction-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="transaction-details">
                <h4 class="transaction-title">${transaction.title}</h4>
                <p class="transaction-method">${transaction.method}</p>
                <span class="transaction-date">${transaction.date}</span>
            </div>
            <div class="transaction-amount">
                <span class="amount">${transaction.amount}</span>
                <span class="status ${transaction.status}">${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
            </div>
        `;
        
        // Add animation
        div.style.opacity = '0';
        div.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            div.style.transition = 'all 0.3s ease';
            div.style.opacity = '1';
            div.style.transform = 'translateY(0)';
        }, 100);
        
        return div;
    }
    
    function updateTransactionStats() {
        const visibleTransactions = document.querySelectorAll('.transaction-item:not([style*="display: none"])');
        const completedTransactions = Array.from(visibleTransactions).filter(t => t.classList.contains('completed'));
        
        // Update transaction count
        const transactionCountStat = document.querySelector('.stat-item:last-child .stat-value');
        transactionCountStat.textContent = visibleTransactions.length;
        
        // Calculate total from visible completed transactions (simplified)
        let total = 0;
        completedTransactions.forEach(transaction => {
            const amountText = transaction.querySelector('.amount').textContent;
            const amount = parseInt(amountText.replace(/[^\d]/g, ''));
            if (!isNaN(amount)) total += amount;
        });
        
        // Update total deposits stat (simplified calculation)
        const totalStat = document.querySelector('.stat-item:first-child .stat-value');
        totalStat.textContent = `UGX ${total.toLocaleString()}`;
    }
}

// File Upload Setup
function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('proofUpload');
    const uploadText = uploadArea.querySelector('.upload-text');
    const uploadIcon = uploadArea.querySelector('.upload-icon');

    // Click to upload
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    // File selection
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    function handleFileUpload(file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            showMessage('Please upload an image (JPG, PNG) or PDF file.', 'error');
            return;
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            showMessage('File size must be less than 5MB.', 'error');
            return;
        }

        // Update UI to show file selected
        uploadIcon.className = 'fas fa-check-circle upload-icon';
        uploadIcon.style.color = 'var(--success-green)';
        uploadText.textContent = `Selected: ${file.name}`;
        uploadArea.style.borderColor = 'var(--success-green)';
        uploadArea.style.background = 'rgba(16, 185, 129, 0.1)';

        showMessage('File uploaded successfully!', 'success');
    }
}

// Copy Button Setup
function setupCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const textToCopy = this.getAttribute('data-copy');
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Visual feedback
                const originalIcon = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.style.background = 'var(--success-green)';
                this.style.color = 'white';
                
                setTimeout(() => {
                    this.innerHTML = originalIcon;
                    this.style.background = 'rgba(244, 180, 0, 0.1)';
                    this.style.color = 'var(--gold)';
                }, 1500);
                
                showMessage(`Copied: ${textToCopy}`, 'success');
            }).catch(() => {
                showMessage('Failed to copy. Please try again.', 'error');
            });
        });
    });
}

// Deposit Form Setup
function setupDepositForm() {
    const form = document.getElementById('depositForm');
    const amountInput = document.getElementById('depositAmount');
    const fileInput = document.getElementById('proofUpload');
    const submitBtn = document.querySelector('.deposit-btn');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = parseInt(amountInput.value);
        const file = fileInput.files[0];

        // Validation
        if (!amount || amount < 20000) {
            showMessage('Minimum deposit amount is UGX 20,000.', 'error');
            return;
        }

        if (!file) {
            showMessage('Please upload proof of payment.', 'error');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        // Simulate form submission
        setTimeout(() => {
            showMessage('Deposit submitted successfully! It will be processed within 24 hours.', 'success');
            
            // Reset form
            form.reset();
            resetUploadArea();
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Submit Deposit';
        }, 2000);
    });

    function resetUploadArea() {
        const uploadArea = document.getElementById('uploadArea');
        const uploadText = uploadArea.querySelector('.upload-text');
        const uploadIcon = uploadArea.querySelector('.upload-icon');
        
        uploadIcon.className = 'fas fa-cloud-upload-alt upload-icon';
        uploadIcon.style.color = 'var(--gold)';
        uploadText.textContent = 'Click to upload receipt';
        uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.02)';
    }
}

// Amount Input Formatting
function setupAmountFormatting() {
    const amountInput = document.getElementById('depositAmount');
    
    amountInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/,/g, '');
        
        if (value && !isNaN(value)) {
            // Format with commas
            e.target.value = parseInt(value).toLocaleString();
        }
    });

    amountInput.addEventListener('blur', function(e) {
        let value = e.target.value.replace(/,/g, '');
        
        if (value && !isNaN(value)) {
            const numValue = parseInt(value);
            if (numValue < 20000) {
                showMessage('Minimum deposit amount is UGX 20,000.', 'warning');
            }
        }
    });
}

// Message Display Function
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.savings-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `savings-message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${getMessageIcon(type)}"></i>
        ${message}
    `;

    // Insert message at top of main content
    const mainContent = document.querySelector('.savings-container');
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
    .savings-message {
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

    .savings-message.success {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #10b981;
    }

    .savings-message.error {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
    }

    .savings-message.warning {
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