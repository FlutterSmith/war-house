/**
 * Settings Page Module
 * Handles functionality for application settings and preferences
 */

import Toast from '../components/toast.js';
import Modal from '../components/modal.js';
import I18n from '../utils/i18n.js';
import FormValidator from '../utils/form-validator.js';

/**
 * Initialize the settings page
 */
function initialize() {
    // Set up theme settings
    setupThemeSettings();
    
    // Set up language settings
    setupLanguageSettings();
    
    // Set up notification settings
    setupNotificationSettings();
    
    // Set up system settings
    setupSystemSettings();
    
    // Set up data backup and restore
    setupDataBackupRestore();
}

/**
 * Set up theme settings
 */
function setupThemeSettings() {
    const themeSelector = document.getElementById('themeSelector');
    
    if (themeSelector) {
        // Set initial value from localStorage
        const currentTheme = localStorage.getItem('theme') || 'light';
        themeSelector.value = currentTheme;
        
        // Apply theme on change
        themeSelector.addEventListener('change', () => {
            const selectedTheme = themeSelector.value;
            applyTheme(selectedTheme);
        });
    }
    
    const fontSizeSelector = document.getElementById('fontSizeSelector');
    
    if (fontSizeSelector) {
        // Set initial value from localStorage
        const currentFontSize = localStorage.getItem('fontSize') || 'normal';
        fontSizeSelector.value = currentFontSize;
        
        // Apply font size on change
        fontSizeSelector.addEventListener('change', () => {
            const selectedFontSize = fontSizeSelector.value;
            applyFontSize(selectedFontSize);
        });
    }
}

/**
 * Apply selected theme
 * @param {string} theme - The theme name to apply
 */
function applyTheme(theme) {
    // Remove old theme classes
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-custom');
    
    // Add new theme class
    document.body.classList.add(`theme-${theme}`);
    
    // Save theme setting to localStorage
    localStorage.setItem('theme', theme);
    
    Toast.showToast('تم تغيير سمة التطبيق بنجاح', 'success');
}

/**
 * Apply selected font size
 * @param {string} fontSize - The font size to apply
 */
function applyFontSize(fontSize) {
    // Remove old font size classes
    document.body.classList.remove('font-small', 'font-normal', 'font-large');
    
    // Add new font size class
    document.body.classList.add(`font-${fontSize}`);
    
    // Save font size setting to localStorage
    localStorage.setItem('fontSize', fontSize);
    
    Toast.showToast('تم تغيير حجم الخط بنجاح', 'success');
}

/**
 * Set up language settings
 */
function setupLanguageSettings() {
    const languageSelector = document.getElementById('languageSelector');
    
    if (languageSelector) {
        // Set initial value based on current HTML dir attribute
        const currentDir = document.documentElement.getAttribute('dir') || 'rtl';
        languageSelector.value = currentDir === 'rtl' ? 'ar' : 'en';
        
        // Change language on change
        languageSelector.addEventListener('change', () => {
            const selectedLanguage = languageSelector.value;
            changeLanguage(selectedLanguage);
        });
    }
    
    const rtlToggle = document.getElementById('rtlToggle');
    
    if (rtlToggle) {
        // Set initial state
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        rtlToggle.checked = isRtl;
        
        // Toggle RTL/LTR on change
        rtlToggle.addEventListener('change', () => {
            const newDir = rtlToggle.checked ? 'rtl' : 'ltr';
            document.documentElement.setAttribute('dir', newDir);
            localStorage.setItem('textDirection', newDir);
            
            Toast.showToast('تم تغيير اتجاه النص بنجاح', 'success');
        });
    }
}

/**
 * Change application language
 * @param {string} language - Language code ('ar' for Arabic, 'en' for English)
 */
function changeLanguage(language) {
    const direction = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.lang = language;
    
    localStorage.setItem('language', language);
    localStorage.setItem('textDirection', direction);
    
    // Toggle RTL toggle if it exists
    const rtlToggle = document.getElementById('rtlToggle');
    if (rtlToggle) {
        rtlToggle.checked = direction === 'rtl';
    }
    
    Toast.showToast('تم تغيير لغة التطبيق بنجاح', 'success');
}

/**
 * Set up notification settings
 */
function setupNotificationSettings() {
    const notifyOperations = document.getElementById('notifyOperations');
    const notifyLowStock = document.getElementById('notifyLowStock');
    const notifySystem = document.getElementById('notifySystem');
    
    if (notifyOperations) {
        // Set initial value
        notifyOperations.checked = localStorage.getItem('notifyOperations') !== 'false';
        
        // Save setting on change
        notifyOperations.addEventListener('change', () => {
            localStorage.setItem('notifyOperations', notifyOperations.checked);
        });
    }
    
    if (notifyLowStock) {
        // Set initial value
        notifyLowStock.checked = localStorage.getItem('notifyLowStock') !== 'false';
        
        // Save setting on change
        notifyLowStock.addEventListener('change', () => {
            localStorage.setItem('notifyLowStock', notifyLowStock.checked);
        });
    }
    
    if (notifySystem) {
        // Set initial value
        notifySystem.checked = localStorage.getItem('notifySystem') !== 'false';
        
        // Save setting on change
        notifySystem.addEventListener('change', () => {
            localStorage.setItem('notifySystem', notifySystem.checked);
        });
    }
    
    // Test notification button
    const testNotifButton = document.getElementById('testNotification');
    if (testNotifButton) {
        testNotifButton.addEventListener('click', () => {
            Toast.showToast('هذا اختبار للإشعارات', 'info');
        });
    }
}

/**
 * Set up system settings
 */
function setupSystemSettings() {
    const lowStockThreshold = document.getElementById('lowStockThreshold');
    
    if (lowStockThreshold) {
        // Set initial value
        lowStockThreshold.value = localStorage.getItem('lowStockThreshold') || 5;
        
        // Save setting on change
        lowStockThreshold.addEventListener('change', () => {
            const value = parseInt(lowStockThreshold.value);
            if (!isNaN(value) && value > 0) {
                localStorage.setItem('lowStockThreshold', value);
                Toast.showToast('تم تحديث حد المخزون المنخفض بنجاح', 'success');
            } else {
                Toast.showToast('يرجى إدخال قيمة صالحة', 'error');
                lowStockThreshold.value = localStorage.getItem('lowStockThreshold') || 5;
            }
        });
    }
    
    const autoLogout = document.getElementById('autoLogout');
    
    if (autoLogout) {
        // Set initial value
        autoLogout.value = localStorage.getItem('autoLogout') || 60;
        
        // Save setting on change
        autoLogout.addEventListener('change', () => {
            const value = parseInt(autoLogout.value);
            if (!isNaN(value) && value >= 0) {
                localStorage.setItem('autoLogout', value);
                Toast.showToast('تم تحديث مدة تسجيل الخروج التلقائي بنجاح', 'success');
            } else {
                Toast.showToast('يرجى إدخال قيمة صالحة', 'error');
                autoLogout.value = localStorage.getItem('autoLogout') || 60;
            }
        });
    }
}

/**
 * Set up data backup and restore functionality
 */
function setupDataBackupRestore() {
    const backupButton = document.getElementById('backupData');
    const restoreButton = document.getElementById('restoreData');
    const resetButton = document.getElementById('resetData');
    
    if (backupButton) {
        backupButton.addEventListener('click', () => {
            backupData();
        });
    }
    
    if (restoreButton) {
        restoreButton.addEventListener('click', () => {
            Modal.showModal('استعادة البيانات', `
                <form id="restoreForm">
                    <div class="form-row">
                        <label for="backupFile">ملف النسخ الاحتياطي</label>
                        <input type="file" id="backupFile" accept=".json">
                    </div>
                    <div class="form-row btn-container">
                        <button type="submit" class="btn-primary">استعادة البيانات</button>
                    </div>
                </form>
            `, () => {
                const form = document.getElementById('restoreForm');
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const file = document.getElementById('backupFile').files[0];
                    if (file) {
                        restoreData(file);
                    } else {
                        Toast.showToast('يرجى اختيار ملف النسخ الاحتياطي', 'error');
                    }
                });
            });
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            Modal.showConfirmModal(
                'إعادة ضبط البيانات',
                'هل أنت متأكد من رغبتك في إعادة ضبط البيانات؟ سيتم حذف جميع البيانات المخزنة.',
                resetData,
                null
            );
        });
    }
}

/**
 * Back up application data
 */
function backupData() {
    // Collect all localStorage data
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
    }
    
    // Convert to JSON
    const jsonData = JSON.stringify(data);
    
    // Create download link
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `warehouse-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    Toast.showToast('تم إنشاء نسخة احتياطية للبيانات بنجاح', 'success');
}

/**
 * Restore data from backup file
 * @param {File} file - The backup file
 */
function restoreData(file) {
    const reader = new FileReader();
    
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            
            // Validate data structure
            if (!data || typeof data !== 'object') {
                throw new Error('ملف النسخ الاحتياطي غير صالح');
            }
            
            // Restore data to localStorage
            for (const key in data) {
                localStorage.setItem(key, data[key]);
            }
            
            Toast.showToast('تم استعادة البيانات بنجاح', 'success');
            Modal.closeModal();
            
            // Reload page to reflect changes
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            Toast.showToast('فشل في استعادة البيانات: ' + error.message, 'error');
        }
    };
    
    reader.onerror = () => {
        Toast.showToast('فشل في قراءة الملف', 'error');
    };
    
    reader.readAsText(file);
}

/**
 * Reset all application data
 */
function resetData() {
    // Clear all localStorage data except user session
    const userSession = localStorage.getItem('currentUser');
    
    localStorage.clear();
    
    // Restore user session to prevent logout
    if (userSession) {
        localStorage.setItem('currentUser', userSession);
    }
    
    Toast.showToast('تم إعادة ضبط البيانات بنجاح', 'success');
    
    // Reload page to reflect changes
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

// Export settings module
const SettingsModule = {
    initialize,
    applyTheme,
    applyFontSize,
    changeLanguage
};

export default SettingsModule;