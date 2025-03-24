/**
 * Compatibility script to maintain legacy code functionality
 * This script serves as a bridge between the old monolithic code and the new modular structure
 */

// Import all necessary modules
import DashboardModule from './js/pages/dashboard.js';
import InventoryModule from './js/pages/inventory.js';
import OperationsModule from './js/pages/operations.js';
import ReportsModule from './js/pages/reports.js';
import SettingsModule from './js/pages/settings.js';

import Modal from './js/components/modal.js';
import Toast from './js/components/toast.js';

import Auth from './js/auth/auth.js';
import Animations from './js/utils/animations.js';
import Permissions from './js/utils/permissions.js';
import LocalStorageAPI from './js/api/localStorage.js';
import FormValidator from './js/utils/form-validator.js';
import I18n from './js/utils/i18n.js';

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Legacy script.js initialized');
    
    // Check authentication (redirect to login if not authenticated)
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize modal system
    Modal.initializeModalSystem();
    
    // Initialize local storage with sample data if needed
    LocalStorageAPI.initializeLocalStorage();
    
    // Setup UI components
    setupUI();
    
    // Setup navigation
    setupNavigation();
    
    // Initialize page modules
    initializeModules();
    
    // Show welcome toast
    const currentUser = Auth.getCurrentUser();
    if (currentUser) {
        Toast.showToast(`مرحباً ${currentUser.name}! تم تسجيل الدخول بنجاح`, 'success');
    }
    
    // Initialize animations
    Animations.animateElementsOnLoad();
});

/**
 * Initialize all page modules
 */
function initializeModules() {
    // Initialize dashboard module
    DashboardModule.initialize();
    
    // Initialize inventory module
    InventoryModule.initialize();
}

/**
 * Setup UI components
 */
function setupUI() {
    // Setup sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.classList.toggle('expanded');
            }
        });
    }
    
    // Setup user role selector
    setupRoleSelector();
    
    // Setup logout functionality
    setupLogout();
    
    // Setup user profile
    setupUserProfile();
    
    // Fix icon display
    Animations.fixIconDisplay();
}

/**
 * Setup navigation between sections
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('main section');
    const pageTitle = document.getElementById('currentPageTitle');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const sectionId = this.getAttribute('data-section');
            
            // If this is a section link, handle navigation
            if (sectionId) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.parentElement.classList.remove('active'));
                
                // Add active class to clicked link
                this.parentElement.classList.add('active');
                
                // Hide all sections
                sections.forEach(section => section.classList.add('hidden'));
                
                // Show the selected section
                const targetSection = document.getElementById(`${sectionId}-section`);
                if (targetSection) {
                    targetSection.classList.remove('hidden');
                    
                    // Update page title
                    if (pageTitle) {
                        pageTitle.textContent = this.querySelector('span').textContent;
                    }
                    
                    // Initialize module on first access
                    initializeModuleOnFirstAccess(sectionId);
                    
                    // Add fade-in animation
                    targetSection.classList.add('fade-in');
                    setTimeout(() => {
                        targetSection.classList.remove('fade-in');
                    }, 500);
                }
            }
        });
    });
    
    // Setup quick operation buttons on dashboard
    setupQuickOperationButtons();
}

/**
 * Initialize module on first access
 * @param {string} sectionId - The section ID
 */
function initializeModuleOnFirstAccess(sectionId) {
    switch (sectionId) {
        case 'operations':
            // Lazy initialize operations module
            OperationsModule.initialize();
            break;
            
        case 'reports':
            // Lazy initialize reports module
            ReportsModule.initialize();
            break;
            
        case 'settings':
            // Lazy initialize settings module
            SettingsModule.initialize();
            break;
    }
}

/**
 * Setup quick operation buttons on dashboard
 */
function setupQuickOperationButtons() {
    const operationButtons = document.querySelectorAll('.operation-btn');
    
    operationButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get operation type from button class
            const btnClass = Array.from(this.classList).find(cls => cls.endsWith('-btn'));
            const operationType = btnClass ? btnClass.replace('-btn', '') : '';
            
            // Navigate to operations section
            const operationsLink = document.querySelector('.nav-menu a[data-section="operations"]');
            if (operationsLink) {
                operationsLink.click();
                
                // Set active operation type
                setTimeout(() => {
                    OperationsModule.setActiveOperation(operationType);
                }, 100);
            }
        });
    });
}

/**
 * Setup user role selector
 */
function setupRoleSelector() {
    const roleSelector = document.getElementById('userRoleSelector');
    
    if (roleSelector) {
        // Set current user's role
        const currentUser = Auth.getCurrentUser();
        if (currentUser && currentUser.role) {
            roleSelector.value = currentUser.role;
        }
        
        // Add change event listener
        roleSelector.addEventListener('change', () => {
            const newRole = roleSelector.value;
            
            // Confirm role change
            Modal.showConfirmModal(
                'تغيير الصلاحية',
                `هل أنت متأكد من تغيير الصلاحية إلى "${getRoleName(newRole)}"؟`,
                () => {
                    // Change role
                    changeUserRole(newRole);
                },
                () => {
                    // Reset selector to current role
                    roleSelector.value = Auth.getCurrentUser().role;
                }
            );
        });
    }
}

/**
 * Change user role and update permissions
 * @param {string} newRole - The new role
 */
function changeUserRole(newRole) {
    // Update user role
    Auth.updateUserRole(newRole);
    
    // Apply new permissions
    Permissions.applyPermissions(newRole);
    
    // Show toast notification
    Toast.showToast(`تم تغيير الصلاحية إلى "${getRoleName(newRole)}" بنجاح`, 'success');
}

/**
 * Get human-readable role name
 * @param {string} role - The role code
 * @returns {string} The human-readable role name
 */
function getRoleName(role) {
    const roleNames = {
        'dean': 'عميد الكلية',
        'director': 'مدير الكلية',
        'storekeeper': 'أمين المخزن',
        'staff': 'موظف المخازن'
    };
    
    return roleNames[role] || role;
}

/**
 * Setup user profile and logout functionality
 */
function setupUserProfile() {
    const avatar = document.querySelector('.avatar');
    
    if (avatar) {
        avatar.addEventListener('click', () => {
            toggleUserMenu();
        });
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
                <span>${getRoleName(currentUser.role)}</span>
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
            setupLogout();
        });
        
        document.getElementById('viewProfile').addEventListener('click', (e) => {
            e.preventDefault();
            showUserProfile(currentUser);
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
    }
    
    // Toggle menu visibility
    userMenu.classList.toggle('show');
}

/**
 * Show user profile modal
 * @param {Object} user - The user object
 */
function showUserProfile(user) {
    Modal.showModal('الملف الشخصي', `
        <div class="user-profile">
            <img src="assets/img/user-avatar.png" alt="صورة المستخدم" class="profile-avatar">
            <h3>${user.name}</h3>
            <p>اسم المستخدم: ${user.username}</p>
            <p>الصلاحية: ${getRoleName(user.role)}</p>
            <p>تاريخ آخر تسجيل دخول: ${new Date(user.loginTime).toLocaleDateString('ar-SA')}</p>
        </div>
    `);
}

/**
 * Show change password modal
 */
function showChangePasswordModal() {
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
            <div class="form-actions">
                <button type="submit" class="btn-primary">تغيير كلمة المرور</button>
            </div>
        </form>
    `, (modal) => {
        // Setup form validation after modal is shown
        const form = document.getElementById('passwordChangeForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handlePasswordChange(form);
        });
    });
}

/**
 * Handle password change form submission
 * @param {HTMLFormElement} form - The password change form
 */
function handlePasswordChange(form) {
    const currentUser = Auth.getCurrentUser();
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
}

/**
 * Setup logout functionality
 */
function setupLogout() {
    const logoutButton = document.querySelector('.logout-item a');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Show confirmation modal
            Modal.showConfirmModal(
                'تسجيل الخروج',
                'هل أنت متأكد من تسجيل الخروج من النظام؟',
                () => {
                    // Logout
                    Auth.logout();
                    window.location.href = 'login.html';
                }
            );
        });
    } else {
        // Alternative logic for the logout button in the user menu
        Modal.showConfirmModal(
            'تسجيل الخروج',
            'هل أنت متأكد من تسجيل الخروج من النظام؟',
            () => {
                // Logout
                Auth.logout();
                window.location.href = 'login.html';
            }
        );
    }
}

// Export functions and modules to make them available globally
window.DashboardModule = DashboardModule;
window.InventoryModule = InventoryModule;
window.OperationsModule = OperationsModule;
window.ReportsModule = ReportsModule;
window.SettingsModule = SettingsModule;
window.Modal = Modal;
window.Toast = Toast;
window.Auth = Auth;
window.Animations = Animations;
window.Permissions = Permissions;
window.LocalStorageAPI = LocalStorageAPI;
