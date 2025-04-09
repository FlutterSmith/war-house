/**
 * Main Application Entry Point
 * Initializes the application and coordinates all modules
 */

import Auth from './auth/auth.js';
import LocalStorageAPI from './api/localStorage.js';
import Modal from './components/modal.js';
import Toast from './components/toast.js';
import Animations from './utils/animations.js';
import Permissions from './utils/permissions.js';
import DateFormatter from './utils/date-formatter.js';
import I18n from './utils/i18n.js';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initialize();
});

/**
 * Initialize the application
 */
function initialize() {
    // Check if user is authenticated, if not redirect to login page
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize and load data from localStorage
    LocalStorageAPI.initializeLocalStorage();

    // Initialize components
    Modal.initializeModalSystem();
    Toast.initializeToastSystem();

    // Add animation classes to elements when the page loads
    Animations.animateElementsOnLoad();

    // Setup user profile information
    setupUserProfile();

    // Add smooth scrolling for the page
    enableSmoothScrolling();

    // Page transition animations
    document.body.classList.add('fade-in');

    // Ensure icons are visible
    Animations.fixIconDisplay();

    // Initialize all modules
    initializeModules();

    // Log successful initialization
    console.log('Application initialized successfully');
}

/**
 * Initialize all application modules
 * This function will be responsible for initializing all page modules when they are created
 */
function initializeModules() {
    // These will be imported and initialized as they're implemented:
    // DashboardModule.initialize();
    // InventoryModule.initialize();
    // OperationsModule.initialize();
    // ReportsModule.initialize();
    // SettingsModule.initialize();
    
    // For now, display a toast to show the app is loaded
    Toast.showToast('تم تحميل النظام بنجاح', 'success');
    
    // Set up role-based permissions
    setupRoleBasedPermissions();
}

/**
 * Set up role-based permissions
 */
function setupRoleBasedPermissions() {
    const roleSelector = document.getElementById('userRoleSelector');
    if (roleSelector) {
        roleSelector.addEventListener('change', () => {
            Permissions.applyPermissions(roleSelector.value);
        });

        // Apply default permissions based on initial role
        const currentUser = Auth.getCurrentUser();
        if (currentUser) {
            Permissions.applyPermissions(currentUser.role);
        }
    }
}

/**
 * Setup user profile and logout functionality
 */
function setupUserProfile() {
    const currentUser = Auth.getCurrentUser();
    
    if (!currentUser) {
        return;
    }
    
    // Update user info in the UI
    updateUserInfo(currentUser);
    
    // Set up logout functionality
    const logoutLink = document.querySelector('.nav-menu li:last-child a');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

/**
 * Update user information in the UI
 * @param {Object} user - The user object
 */
function updateUserInfo(user) {
    const avatarElement = document.querySelector('.avatar');
    const roleSelector = document.getElementById('userRoleSelector');

    if (avatarElement) {
        // Add user name as tooltip
        avatarElement.setAttribute('title', user.name);

        // Set up dropdown menu for the avatar
        avatarElement.addEventListener('click', (e) => {
            e.preventDefault();
            toggleUserMenu();
        });
    }

    // Set the role selector to match the user's role
    if (roleSelector) {
        roleSelector.value = user.role;
    }
}

/**
 * Toggle user menu
 */
function toggleUserMenu() {
    let userMenu = document.querySelector('.user-menu');

    if (!userMenu) {
        // Create user menu if it doesn't exist
        const currentUser = Auth.getCurrentUser();
        userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
            <div class="user-menu-header">
                <strong>${currentUser.name}</strong>
                <span>${I18n.getRoleDisplayName(currentUser.role)}</span>
            </div>
            <ul>
                <li><a href="#" id="viewProfile"><i class="fas fa-user"></i> عرض الملف الشخصي</a></li>
                <li><a href="#" id="changePassword"><i class="fas fa-key"></i> تغيير كلمة المرور</a></li>
                <li><a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> تسجيل الخروج</a></li>
            </ul>
        `;

        document.querySelector('.topbar-right').appendChild(userMenu);

        // Add event listeners for menu items
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });

        document.getElementById('viewProfile').addEventListener('click', (e) => {
            e.preventDefault();
            showUserProfile();
        });

        document.getElementById('changePassword').addEventListener('click', (e) => {
            e.preventDefault();
            showChangePasswordModal();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu') && !e.target.closest('.avatar')) {
                userMenu.classList.remove('show');
            }
        });
    } else {
        // Toggle menu visibility
        userMenu.classList.toggle('show');
    }
}

/**
 * Show user profile modal
 */
function showUserProfile() {
    const currentUser = Auth.getCurrentUser();
    
    Modal.showModal('الملف الشخصي', `
        <div class="user-profile">
            <img src="assets/img/user-avatar.png" alt="صورة المستخدم" class="profile-avatar">
            <h3>${currentUser.name}</h3>
            <p>اسم المستخدم: ${currentUser.username}</p>
            <p>الصلاحية: ${I18n.getRoleDisplayName(currentUser.role)}</p>
            <p>تاريخ آخر تسجيل دخول: ${DateFormatter.formatDate(new Date(currentUser.loginTime))}</p>
        </div>
    `);
}

/**
 * Show change password modal
 */
function showChangePasswordModal() {
    const currentUser = Auth.getCurrentUser();
    
    Modal.showModal('تغيير كلمة المرور', `
        <form id="passwordChangeForm" class="form-vertical">
            <div class="form-row">
                <label for="currentPassword">كلمة المرور الحالية</label>
                <input type="password" id="currentPassword" required>
            </div>
            <div class="form-row">
                <label for="newPassword">كلمة المرور الجديدة</label>
                <input type="password" id="newPassword" required>
            </div>
            <div class="form-row">
                <label for="confirmPassword">تأكيد كلمة المرور</label>
                <input type="password" id="confirmPassword" required>
            </div>
            <div class="form-row btn-container">
                <button type="submit" class="btn-primary">تغيير كلمة المرور</button>
            </div>
        </form>
    `, () => {
        // Setup form validation after modal is shown
        const form = document.getElementById('passwordChangeForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                Toast.showToast('كلمة المرور الجديدة وتأكيدها غير متطابقين', 'error');
                return;
            }

            // Use Auth module to change password
            const result = Auth.changePassword(currentUser.username, currentPassword, newPassword);

            if (result.success) {
                Toast.showToast(result.message, 'success');
                Modal.closeModal();
            } else {
                Toast.showToast(result.message, 'error');
            }
        });
    });
}

/**
 * Log out user
 */
function logout() {
    Modal.showConfirmModal('تسجيل الخروج', 'هل أنت متأكد من رغبتك في تسجيل الخروج؟', () => {
        // Use Auth module to logout
        Auth.logout();

        // Show logout toast
        Toast.showToast('تم تسجيل الخروج بنجاح', 'info');

        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    });
}

/**
 * Enable smooth scrolling
 */
function enableSmoothScrolling() {
    document.documentElement.style.scrollBehavior = 'smooth';
}

// Export app module for use in other files
export {
    initialize
};