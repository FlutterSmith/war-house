/**
 * Form Validator Utility
 * Provides form validation functionality throughout the application
 */

/**
 * Show error message for a form field
 * @param {HTMLElement} input - The input element
 * @param {string} message - The error message
 */
function showError(input, message) {
    // Remove any existing error message
    removeError(input);

    // Add error class to input
    input.classList.add('error');

    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;

    // Insert after the input
    input.parentNode.insertBefore(errorElement, input.nextSibling);
}

/**
 * Remove error message from a form field
 * @param {HTMLElement} input - The input element
 */
function removeError(input) {
    // Remove error class from input
    input.classList.remove('error');

    // Remove error message if it exists
    const nextElement = input.nextElementSibling;
    if (nextElement && nextElement.classList.contains('error-message')) {
        nextElement.remove();
    }
}

/**
 * Show success message for a form
 * @param {HTMLElement} form - The form element
 * @param {string} message - The success message
 */
function showSuccessMessage(form, message) {
    // Remove any existing success message
    const existingMessage = form.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = message;
    successMessage.style.opacity = '0';

    form.appendChild(successMessage);

    setTimeout(() => {
        successMessage.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        successMessage.style.opacity = '0';
        setTimeout(() => successMessage.remove(), 300);
    }, 3000);
}

/**
 * Validate if a form input is not empty
 * @param {string} value - The input value
 * @returns {boolean} Whether the input is valid
 */
function validateRequired(value) {
    return value.trim() !== '';
}

/**
 * Validate if a form input matches a pattern
 * @param {string} value - The input value
 * @param {RegExp} pattern - The pattern to match
 * @returns {boolean} Whether the input is valid
 */
function validatePattern(value, pattern) {
    return pattern.test(value);
}

/**
 * Validate if a numeric input is greater than a minimum value
 * @param {number} value - The input value
 * @param {number} min - The minimum allowed value
 * @returns {boolean} Whether the input is valid
 */
function validateMinValue(value, min) {
    return parseFloat(value) > min;
}

/**
 * Set up validation for an inventory operation form
 * @param {HTMLFormElement} form - The form to validate
 * @returns {Function} A function that returns whether the form is valid
 */
function setupInventoryFormValidation(form) {
    const itemCodeInput = form.querySelector('#itemCode');
    const itemNameInput = form.querySelector('#itemName');
    const itemQuantityInput = form.querySelector('#itemQuantity');

    // Validate item code
    if (itemCodeInput) {
        itemCodeInput.addEventListener('blur', () => {
            if (!validateRequired(itemCodeInput.value)) {
                showError(itemCodeInput, 'رقم الصنف مطلوب');
            } else if (!validatePattern(itemCodeInput.value, /^[A-Z0-9]+$/i)) {
                showError(itemCodeInput, 'رقم الصنف يجب أن يحتوي على أحرف وأرقام فقط');
            } else {
                removeError(itemCodeInput);
            }
        });
    }

    // Validate item name
    if (itemNameInput) {
        itemNameInput.addEventListener('blur', () => {
            if (!validateRequired(itemNameInput.value)) {
                showError(itemNameInput, 'اسم الصنف مطلوب');
            } else {
                removeError(itemNameInput);
            }
        });
    }

    // Validate quantity
    if (itemQuantityInput) {
        itemQuantityInput.addEventListener('blur', () => {
            if (!validateRequired(itemQuantityInput.value)) {
                showError(itemQuantityInput, 'الكمية مطلوبة');
            } else if (!validateMinValue(itemQuantityInput.value, 0)) {
                showError(itemQuantityInput, 'الكمية يجب أن تكون أكبر من صفر');
            } else {
                removeError(itemQuantityInput);
            }
        });
    }

    // Return validation function
    return function validateForm() {
        let isValid = true;

        // Validate item code
        if (itemCodeInput) {
            if (!validateRequired(itemCodeInput.value)) {
                showError(itemCodeInput, 'رقم الصنف مطلوب');
                isValid = false;
            } else if (!validatePattern(itemCodeInput.value, /^[A-Z0-9]+$/i)) {
                showError(itemCodeInput, 'رقم الصنف يجب أن يحتوي على أحرف وأرقام فقط');
                isValid = false;
            }
        }

        // Validate item name
        if (itemNameInput && !validateRequired(itemNameInput.value)) {
            showError(itemNameInput, 'اسم الصنف مطلوب');
            isValid = false;
        }

        // Validate quantity
        if (itemQuantityInput) {
            if (!validateRequired(itemQuantityInput.value)) {
                showError(itemQuantityInput, 'الكمية مطلوبة');
                isValid = false;
            } else if (!validateMinValue(itemQuantityInput.value, 0)) {
                showError(itemQuantityInput, 'الكمية يجب أن تكون أكبر من صفر');
                isValid = false;
            }
        }

        return isValid;
    };
}

// Export form validator functions
const FormValidator = {
    showError,
    removeError,
    showSuccessMessage,
    validateRequired,
    validatePattern,
    validateMinValue,
    setupInventoryFormValidation
};

export default FormValidator;