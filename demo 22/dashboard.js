// Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

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

    // Initialize wealth trajectory chart
    initializeWealthChart();

    // Action card click handlers
    setupActionCards();

    // AGM banner interaction
    setupAGMBanner();

    // Animate cards on load
    animateCards();
});

// Wealth Trajectory Chart
function initializeWealthChart() {
    const ctx = document.getElementById('wealthChart').getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 212, 170, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 212, 170, 0.05)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Wealth Growth',
                data: [800000, 1200000, 1500000, 1800000, 2100000, 2450000],
                borderColor: '#00D4AA',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#00D4AA',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            family: 'Poppins',
                            size: 12
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            family: 'Poppins',
                            size: 12
                        },
                        callback: function(value) {
                            return 'UGX ' + (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                point: {
                    hoverBackgroundColor: '#F4B400'
                }
            }
        }
    });
}

// Action Cards Setup
function setupActionCards() {
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.action-title').textContent;
            
            if (title.includes('Deposit')) {
                alert('Deposit Savings: Redirecting to savings deposit form...');
            } else if (title.includes('Loan')) {
                alert('Request Loan: Redirecting to loan application form...');
            }
        });

        // Add hover animation
        card.addEventListener('mouseenter', function() {
            const btn = this.querySelector('.action-btn');
            btn.style.transform = 'scale(1.1) rotate(90deg)';
        });

        card.addEventListener('mouseleave', function() {
            const btn = this.querySelector('.action-btn');
            btn.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// AGM Banner Setup
function setupAGMBanner() {
    const bannerBtn = document.querySelector('.banner-btn');
    
    bannerBtn.addEventListener('click', function() {
        alert('AGM 2024 Registration: Opening registration form...');
    });
}

// Card Animations
function animateCards() {
    const cards = document.querySelectorAll('.overview-card, .action-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

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