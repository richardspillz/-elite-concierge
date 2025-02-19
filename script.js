// Mobile menu functionality
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Enhanced Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollBy({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

// Stat Counter Animation with fixed values
const homePageStats = {
    'Member to Manager Ratio': '4:1',
    'Global Service': '24/7',
    'Discretion': '100%'
};

const aboutPageStats = {
    'Years of Excellence': '15+',
    'Network': 'Global',
    'Dedicated Service': '24/7'
};

let hasAnimated = {};

function animateStatNumbers(section) {
    const sectionId = section.closest('section').id || section.closest('section').className;
    if (hasAnimated[sectionId]) return; // Only animate once per section
    
    const stats = section.querySelectorAll('.stat');
    
    stats.forEach(stat => {
        const numberElement = stat.querySelector('.number');
        const labelText = stat.querySelector('.label').textContent;
        const targetValue = homePageStats[labelText] || aboutPageStats[labelText];
        
        if (!targetValue) return; // Skip if no matching value found
        
        // Add visible class to stat for CSS animations
        stat.classList.add('visible');
        
        // Handle different formats of numbers
        if (targetValue.includes(':')) {
            // Handle ratio format (e.g., 4:1)
            const [first, second] = targetValue.split(':');
            animateRatio(numberElement, parseInt(first), parseInt(second));
        } else if (targetValue.includes('/')) {
            // Handle 24/7 format
            animateTimeFormat(numberElement, targetValue);
        } else if (targetValue.includes('%')) {
            // Handle percentage format
            animatePercentage(numberElement, parseInt(targetValue));
        } else if (targetValue.includes('+')) {
            // Handle years format (e.g., 15+)
            animateYears(numberElement, parseInt(targetValue), true);
        } else if (targetValue === 'Global') {
            // Handle text value
            numberElement.textContent = targetValue;
        }
    });
    
    hasAnimated[sectionId] = true;
}

function animateRatio(element, firstNum, secondNum) {
    let startTime = null;
    const duration = 2000;
    
    // Set initial state
    element.textContent = '0:1';
    
    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smoother animation
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * firstNum;
        
        if (progress < 1) {
            // During animation, show one decimal place for smoother appearance
            element.textContent = `${Math.min(firstNum, Number(current.toFixed(1)))}:1`;
            requestAnimationFrame(animate);
        } else {
            // At the end, show the final ratio
            element.textContent = `${firstNum}:${secondNum}`;
        }
    }
    
    requestAnimationFrame(animate);
}

function animateTimeFormat(element, target) {
    let current = 0;
    const duration = 2000;
    const steps = 24;
    const increment = 24 / steps;
    const interval = duration / steps;
    
    const updateTime = () => {
        current += increment;
        if (current < 24) {
            element.textContent = `${Math.round(current)}/7`;
            setTimeout(updateTime, interval);
        } else {
            element.textContent = target;
        }
    };
    
    updateTime();
}

function animatePercentage(element, target) {
    let current = 0;
    const duration = 2000;
    const steps = 50;
    const increment = target / steps;
    const interval = duration / steps;
    
    const updatePercentage = () => {
        current += increment;
        if (current < target) {
            element.textContent = `${Math.round(current)}%`;
            setTimeout(updatePercentage, interval);
        } else {
            element.textContent = `${target}%`;
        }
    };
    
    updatePercentage();
}

function animateYears(element, target, hasPlus) {
    let current = 0;
    const duration = 2000;
    const steps = 30;
    const increment = target / steps;
    const interval = duration / steps;
    
    const updateYears = () => {
        current += increment;
        if (current < target) {
            element.textContent = `${Math.round(current)}${hasPlus ? '+' : ''}`;
            setTimeout(updateYears, interval);
        } else {
            element.textContent = `${target}${hasPlus ? '+' : ''}`;
        }
    };
    
    updateYears();
}

// Enhanced Intersection Observer for animations
const observerOptions = {
    root: null,
    threshold: 0.2, // Increased threshold for better timing
    rootMargin: '-50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Trigger stat counter animation when stats section is visible
            if (entry.target.classList.contains('stats-highlight')) {
                animateStatNumbers(entry.target);
            }
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('.content-section, .stats-highlight, .service').forEach(section => {
    observer.observe(section);
});

// Enhanced Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    lastScroll = currentScroll;
});

// Enhanced Form Handling
const handleFormSubmission = async (event, formType) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Add loading state with animation
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.innerHTML = '<span class="loading-spinner"></span> Sending...';
    submitButton.disabled = true;

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        form.reset();
        showNotification('Thank you for your submission. We will contact you shortly.', 'success');
        
        // Add success animation to form
        form.classList.add('submission-success');
        setTimeout(() => form.classList.remove('submission-success'), 1000);
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('There was an error submitting the form. Please try again later.', 'error');
        
        // Add error animation to form
        form.classList.add('submission-error');
        setTimeout(() => form.classList.remove('submission-error'), 1000);
    } finally {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    }
};

// Enhanced Notification System
const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add icon based on type
    const icon = type === 'success' ? '✓' : '⚠';
    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
};

// Form event listeners
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const membershipForm = document.getElementById('membership-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => handleFormSubmission(e, 'contact'));
    }

    if (membershipForm) {
        membershipForm.addEventListener('submit', (e) => handleFormSubmission(e, 'membership'));
    }
});
