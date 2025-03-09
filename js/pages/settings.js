/**
 * Settings Page Module
 * Handles functionality for the settings page
 */

import Modal from '../components/modal.js';
import Toast from '../components/toast.js';
import LocalStorageAPI from '../api/localStorage.js';

/**
 * Initialize the settings page
 */
function initialize() {
    // Setup tab navigation
    setupTabNavigation();
    
    // Setup theme selector
    setupThemeSelector();
    
    // Setup general settings form
    setupGeneralSettings();
}

/**
 * Set up tab navigation in settings
 */
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-navigation button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding tab content
            const tabName = button.getAttribute('data-tab');
            showTabContent(tabName);
        });
    });
}

/**
 * Show tab content based on tab name
 * @param {string} tabName - The name of the tab to show
 */
function showTabContent(tabName) {
    // Hide all forms first
    const forms = document.querySelectorAll('.tab-content form');
    forms.forEach(form => form.style.display = 'none');
    
    // Show the selected form
    const selectedForm = document.getElementById(`${tabName}SettingsForm`);
    if (selectedForm) {
        selectedForm.style.display = 'block';
    }
}

/**
 * Set up theme selector
 */
function setupThemeSelector() {
    const themeSelector = document.getElementById('theme-selector');
    
    if (themeSelector) {
        // Set theme selector to match current theme
        const currentTheme = localStorage.getItem('theme') || 'light';
        themeSelector.value = currentTheme;
        
        // Add event listener for theme change
        themeSelector.addEventListener('change', () => {
            const selectedTheme = themeSelector.value;
            changeTheme(selectedTheme);
        });
    }
}

/**
 * Change application theme
 * @param {string} theme - The theme to set
 */
function changeTheme(theme) {
    // Save theme preference
    localStorage.setItem('theme', theme);
    
    // Apply theme
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    } else if (theme === 'light') {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
    } else {
        // Auto theme based on system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    }
    
    // Show toast
    Toast.showToast('تم تغيير سمة النظام', 'success');
}

/**
 * Set up general settings form
 */
function setupGeneralSettings() {
    const generalSettingsForm = document.getElementById('generalSettingsForm');
    
    if (generalSettingsForm) {
        // Load current settings
        loadGeneralSettings();
        
        // Add event listener for form submission
        generalSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveGeneralSettings();
        });
    }
}

/**
 * Load general settings from storage
 */
function loadGeneralSettings() {
    // Get current settings from localStorage
    const settings = LocalStorageAPI.getAppSettings();
    
    // Update form fields with current settings
    const systemNameInput = document.getElementById('system-name');
    const itemsPerPageSelect = document.getElementById('items-per-page');
    
    if (systemNameInput && settings.systemName) {
        systemNameInput.value = settings.systemName;
    }
    
    if (itemsPerPageSelect && settings.itemsPerPage) {
        itemsPerPageSelect.value = settings.itemsPerPage;
    }
}

/**
 * Save general settings to storage
 */
function saveGeneralSettings() {
    // Get values from form
    const systemName = document.getElementById('system-name').value;
    const itemsPerPage = document.getElementById('items-per-page').value;
    
    // Save settings
    const settings = {
        systemName,
        itemsPerPage
    };
    
    // Update logo if new one is selected
    const logoInput = document.getElementById('system-logo');
    if (logoInput && logoInput.files && logoInput.files.length > 0) {
        handleLogoUpload(logoInput.files[0], settings);
    } else {
        // Save settings without logo update
        saveSettingsToStorage(settings);
    }
}

/**
 * Handle logo file upload
 * @param {File} file - The logo file
 * @param {Object} settings - The settings object to update
 */
function handleLogoUpload(file, settings) {
    // In a real application, this would upload the file to a server
    // For this demo, we'll use a mock upload
    
    // Check file type
    if (!file.type.match('image.*')) {
        Toast.showToast('يرجى اختيار ملف صورة صالح', 'error');
        return;
    }
    
    // Show loading toast
    Toast.showToast('جارٍ رفع الشعار الجديد...', 'info');
    
    // Simulate upload delay
    setTimeout(() => {
        // Mock successful upload
        settings.logoUrl = 'assets/img/logo-new.png';
        
        // Save settings
        saveSettingsToStorage(settings);
        
        // Show success toast
        Toast.showToast('تم تحديث الشعار بنجاح', 'success');
    }, 1500);
}

/**
 * Save settings to storage
 * @param {Object} settings - The settings to save
 */
function saveSettingsToStorage(settings) {
    // Save to localStorage
    LocalStorageAPI.saveAppSettings(settings);
    
    // Update UI with new settings
    updateUIWithNewSettings(settings);
    
    // Show success toast
    Toast.showToast('تم حفظ الإعدادات بنجاح', 'success');
}

/**
 * Update UI with new settings
 * @param {Object} settings - The new settings
 */
function updateUIWithNewSettings(settings) {
    // Update system name in UI
    if (settings.systemName) {
        const systemNameElements = document.querySelectorAll('.logo h2');
        systemNameElements.forEach(el => {
            el.textContent = settings.systemName;
        });
    }
    
    // Update logo if changed
    if (settings.logoUrl) {
        const logoImages = document.querySelectorAll('.logo img');
        logoImages.forEach(img => {
            img.src = settings.logoUrl;
        });
    }
}

/**
 * Show account settings tab
 */
function showAccountSettings() {
    const accountTab = document.querySelector('.tab-navigation button[data-tab="account"]');
    if (accountTab) {
        accountTab.click();
    }
}

/**
 * Show notifications settings tab
 */
function showNotificationsSettings() {
    const notificationsTab = document.querySelector('.tab-navigation button[data-tab="notifications"]');
    if (notificationsTab) {
        notificationsTab.click();
    }
}

// Export settings module
const SettingsModule = {
    initialize,
    showAccountSettings,
    showNotificationsSettings
};

export default SettingsModule;