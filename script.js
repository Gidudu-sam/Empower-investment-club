// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 22, 40, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 22, 40, 0.95)';
    }
});

// Animate stats on scroll
const animateStats = () => {
    const statCards = document.querySelectorAll('.stat-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValue = entry.target.querySelector('.stat-value');
                const finalValue = statValue.textContent;
                
                if (finalValue.includes('%')) {
                    animateNumber(statValue, 0, parseInt(finalValue), '%');
                } else if (finalValue.includes('+')) {
                    animateNumber(statValue, 0, parseInt(finalValue), '+');
                }
            }
        });
    }, { threshold: 0.5 });

    statCards.forEach(card => observer.observe(card));
};

// Number animation function
const animateNumber = (element, start, end, suffix = '') => {
    const duration = 2000;
    const startTime = performance.now();
    
    const updateNumber = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * easeOutQuart(progress));
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    };
    
    requestAnimationFrame(updateNumber);
};

// Easing function
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

// Button hover effects
document.querySelectorAll('.cta-button, .secondary-button, .join-btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Mobile menu toggle functionality
const initMobileMenu = () => {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
            
            // Toggle hamburger icon
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('mobile-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close mobile menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('mobile-active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
};

// Mobile menu toggle (for future implementation)
const createMobileMenu = () => {
    const navbar = document.querySelector('.nav-container');
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Add mobile menu functionality here when needed
    // This is a placeholder for mobile menu implementation
};

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu(); // Initialize mobile menu functionality
    animateStats();
    animateNewsCards();
    
    // Add entrance animations
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 300);
    
    setTimeout(() => {
        heroVisual.style.opacity = '1';
        heroVisual.style.transform = 'translateY(0)';
    }, 600);
});

// Animate news cards on scroll
const animateNewsCards = () => {
    const newsCards = document.querySelectorAll('.news-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.2 });

    newsCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
};

// Feature items hover effects
document.addEventListener('DOMContentLoaded', () => {
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon');
            icon.style.transform = 'translateY(-10px) scale(1.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon');
            icon.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // News card hover effects
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add initial styles for animations
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .hero-content, .hero-visual {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }
        
        .stat-card {
            transition: all 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px) scale(1.05);
        }
    `;
    document.head.appendChild(style);
});

// Form validation and interaction handlers
const handleFormSubmissions = () => {
    // Join button click handler
    document.querySelector('.cta-button').addEventListener('click', () => {
        console.log('Join button clicked');
    });
    
    // Login button click handler
    document.querySelector('.login-btn').addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Login button clicked');
    });
    
    // Join now button click handler
    document.querySelector('.join-btn').addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Join now button clicked');
    });
    
    // CTA section buttons - handled by join.js now
    // Register as Member button opens join modal
    // Talk to Secretary button links to contact page
};

// CTA section animations
const animateCTASection = () => {
    const ctaCard = document.querySelector('.cta-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, { threshold: 0.3 });

    if (ctaCard) {
        ctaCard.style.opacity = '0';
        ctaCard.style.transform = 'translateY(50px) scale(0.95)';
        ctaCard.style.transition = 'all 0.8s ease';
        observer.observe(ctaCard);
    }
};

// Initialize form handlers
document.addEventListener('DOMContentLoaded', () => {
    handleFormSubmissions();
    animateCTASection();
});