/**
 * Modal Component
 * Provides functionality for displaying modal dialogs
 */

/**
 * Initialize modal system
 */
function initializeModalSystem() {
    // Create modal container if it doesn't exist
    if (!document.querySelector('.modal-container')) {
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        document.body.appendChild(modalContainer);
    }
}

/**
 * Show modal with custom content
 * @param {string} title - The modal title
 * @param {string} content - The HTML content for the modal body
 * @param {Function} [callback] - Optional callback to execute after modal is shown
 * @returns {HTMLElement} The modal element
 */
function showModal(title, content, callback) {
    const modalContainer = document.querySelector('.modal-container');

    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button type="button" class="modal-close" aria-label="إغلاق">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;

    modalContainer.appendChild(modal);

    // Show modal with fade-in animation
    setTimeout(() => {
        modal.classList.add('show');

        // Focus first focusable element in modal
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }, 10);

    // Set up close button
    modal.querySelector('.modal-close').addEventListener('click', () => {
        closeModal(modal);
    });

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', function modalEscHandler(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal(modal);
            document.removeEventListener('keydown', modalEscHandler);
        }
    });

    // Trap focus inside modal
    modal.addEventListener('keydown', function trapFocus(e) {
        if (e.key === 'Tab') {
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });

    // Execute callback if provided
    if (callback && typeof callback === 'function') {
        callback(modal);
    }

    return modal;
}

/**
 * Show confirmation modal
 * @param {string} title - The modal title
 * @param {string} message - The confirmation message
 * @param {Function} confirmCallback - Function to call when confirmed
 * @param {Function} [cancelCallback] - Optional function to call when canceled
 */
function showConfirmModal(title, message, confirmCallback, cancelCallback) {
    const content = `
        <p class="confirm-message">${message}</p>
        <div class="button-group">
            <button type="button" class="btn-secondary" id="modal-cancel">إلغاء</button>
            <button type="button" class="btn-primary" id="modal-confirm">تأكيد</button>
        </div>
    `;

    const modal = showModal(title, content);

    // Set up confirm button
    const confirmBtn = modal.querySelector('#modal-confirm');
    confirmBtn.focus();
    confirmBtn.addEventListener('click', () => {
        closeModal(modal);
        if (confirmCallback && typeof confirmCallback === 'function') {
            confirmCallback();
        }
    });

    // Set up cancel button
    const cancelBtn = modal.querySelector('#modal-cancel');
    cancelBtn.addEventListener('click', () => {
        closeModal(modal);
        if (cancelCallback && typeof cancelCallback === 'function') {
            cancelCallback();
        }
    });
}

/**
 * Close modal
 * @param {HTMLElement} [modalEl] - The modal element to close
 */
function closeModal(modalEl) {
    const modal = modalEl || document.querySelector('.modal.show');
    if (modal) {
        modal.classList.remove('show');

        // Return focus to the element that opened the modal
        if (document.activeElement) {
            document.activeElement.blur();
        }

        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Export modal functions
const Modal = {
    initializeModalSystem,
    showModal,
    showConfirmModal,
    closeModal
};

export default Modal;