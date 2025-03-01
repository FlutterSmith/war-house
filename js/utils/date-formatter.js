/**
 * Date Formatter Utility
 * Provides consistent date formatting functionality throughout the application
 */

/**
 * Format date in Arabic with detailed formatting
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

/**
 * Format date in short format (YYYY/MM/DD)
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDateShort(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

/**
 * Parse date string into Date object
 * @param {string} dateString - Date string in format YYYY/MM/DD
 * @returns {Date} Date object
 */
function parseDate(dateString) {
    return new Date(dateString.replace(/\//g, '-'));
}

// Export date formatter functions
const DateFormatter = {
    formatDate,
    formatDateShort,
    parseDate
};

export default DateFormatter;