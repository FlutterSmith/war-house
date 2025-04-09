/**
 * Toast Component
 * Provides notification toast functionality for the application
 */

/**
 * Initialize toast notification system
 */
function initializeToastSystem() {
    // Create toast container if it doesn't exist
    if (!document.querySelector('.toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

/**
 * Show toast notification
 * @param {string} message - The message to display
 * @param {string} [type='info'] - The type of toast (info, success, error, warning)
 * @param {number} [duration=3000] - How long to display the toast in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    initializeToastSystem();
    const toastContainer = document.querySelector('.toast-container');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Show the toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Hide and remove the toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, duration);
}

// Export toast functions
const Toast = {
    initializeToastSystem,
    showToast
};

export default Toast;