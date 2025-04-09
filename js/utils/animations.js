/**
 * Animations Utility
 * Provides animation functionality throughout the application
 */

/**
 * Create a ripple effect for a clicked element
 * @param {Event} event - The click event
 */
function createRipple(event) {
    const button = event.currentTarget;

    // Create ripple element
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    button.appendChild(ripple);

    // Get position and size for the ripple
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    // Position the ripple
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    ripple.classList.add('active');

    // Remove ripple after animation completes
    setTimeout(() => {
        ripple.remove();
    }, 800);
}

/**
 * Initialize ripple effect for elements
 * @param {string} selector - CSS selector for elements to apply ripple effect
 */
function initializeRippleEffect(selector = '.btn-primary, .nav-menu li a, .operation-btn') {
    document.querySelectorAll(selector).forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

/**
 * Animate elements when the page loads
 */
function animateElementsOnLoad() {
    // Add fade-in animation to the main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.8s ease-in-out, transform 0.8s ease-out';
        mainContent.style.transform = 'translateY(20px)';

        setTimeout(() => {
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }, 200);
    }

    // Animate dashboard cards to appear one after another
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
    });

    // Animate form elements to appear one after another
    const formRows = document.querySelectorAll('.form-row');
    formRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(20px)';
        row.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';

        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, 300 + (index * 100));
    });

    // Add subtle animation to the sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.style.opacity = '0';
        sidebar.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-out';
        sidebar.style.transform = 'translateX(-20px)';

        setTimeout(() => {
            sidebar.style.opacity = '1';
            sidebar.style.transform = 'translateX(0)';
        }, 100);
    }

    // Add pulse animation to action buttons
    const actionButtons = document.querySelectorAll('.btn-primary');
    actionButtons.forEach(button => {
        setTimeout(() => {
            button.classList.add('pulse-animation');

            // Remove pulse after 3 seconds
            setTimeout(() => {
                button.classList.remove('pulse-animation');
            }, 3000);
        }, 1500);
    });

    // Animate operation buttons
    const operationBtns = document.querySelectorAll('.operation-btn');
    operationBtns.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'scale(0.9)';
        btn.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.transform = 'scale(1)';
        }, 500 + (index * 100));
    });
}

/**
 * Update stat number with animation
 * @param {HTMLElement} element - The element to update
 * @param {number} newValue - The new value
 * @param {number} duration - Animation duration in milliseconds
 */
function updateStatWithAnimation(element, newValue, duration = 1000) {
    // Get current value
    const currentValue = parseInt(element.textContent) || 0;
    const difference = newValue - currentValue;
    const increment = difference / (duration / 16); // 60fps

    let currentCount = currentValue;
    const counter = setInterval(() => {
        currentCount += increment;

        // Check if we've reached the target
        if ((increment > 0 && currentCount >= newValue) ||
            (increment < 0 && currentCount <= newValue)) {
            clearInterval(counter);
            element.textContent = newValue;
        } else {
            element.textContent = Math.round(currentCount);
        }
    }, 16);
}

/**
 * Ensure icons are always visible
 */
function fixIconDisplay() {
    const menuIcons = document.querySelectorAll('.icon-wrapper img');

    menuIcons.forEach(icon => {
        icon.style.display = 'block';

        // Force reflow/repaint
        void icon.offsetWidth;

        // If icon has zero width/height, try to restore it
        if (icon.offsetWidth === 0 || icon.offsetHeight === 0) {
            icon.style.width = '24px';
            icon.style.height = '24px';
            icon.style.opacity = '1';
            icon.style.visibility = 'visible';
        }
    });
}

// Export animations functions
const Animations = {
    createRipple,
    initializeRippleEffect,
    animateElementsOnLoad,
    updateStatWithAnimation,
    fixIconDisplay
};

export default Animations;