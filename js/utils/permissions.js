/**
 * Permissions Utility
 * Provides role-based access control functionality throughout the application
 */

import Auth from '../auth/auth.js';

/**
 * Apply permissions based on user role
 * @param {string} role - The user role
 */
function applyPermissions(role) {
    // Define sections and their corresponding permissions
    const sectionPermissions = {
        'dashboard': 'viewDashboard',
        'operations': 'viewInventory',
        'inventory': 'viewInventory',
        'reports': 'viewReports',
        'settings': 'viewSettings'
    };

    // Define edit permissions for sections
    const editPermissions = {
        'operations': 'editInventory',
        'inventory': 'editInventory',
        'settings': 'editSettings'
    };

    // Apply view permissions to menu items
    document.querySelectorAll('.nav-menu li a[data-section]').forEach(item => {
        const section = item.getAttribute('data-section');
        const permissionNeeded = sectionPermissions[section];
        const canView = Auth.hasPermission(permissionNeeded);

        item.parentElement.style.display = canView ? 'block' : 'none';
    });

    // Apply edit permissions to action buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
        const section = btn.closest('section')?.id?.replace('-section', '') || '';
        const permissionNeeded = editPermissions[section];
        const canEdit = permissionNeeded ? Auth.hasPermission(permissionNeeded) : false;

        btn.disabled = !canEdit;
        btn.style.opacity = canEdit ? '1' : '0.5';
        btn.style.cursor = canEdit ? 'pointer' : 'not-allowed';
    });

    // Show a notification about the role change
    showRoleChangeNotification(role);
}

/**
 * Show notification when user role changes
 * @param {string} role - The user role
 */
function showRoleChangeNotification(role) {
    const roleDisplayName = Auth.getCurrentUser()?.role === role
        ? 'صلاحياتك الحالية'
        : 'الصلاحيات المعروضة حالياً';

    const notificationEl = document.createElement('div');
    notificationEl.className = 'role-notification';
    notificationEl.innerHTML = `
        <i class="fas fa-user-shield"></i>
        <span>${roleDisplayName}: ${getRoleDisplayName(role)}</span>
    `;

    document.body.appendChild(notificationEl);
    setTimeout(() => {
        notificationEl.classList.add('show');
    }, 100);

    setTimeout(() => {
        notificationEl.classList.remove('show');
        setTimeout(() => {
            notificationEl.remove();
        }, 500);
    }, 3000);
}

/**
 * Get display name for role (temporary function to avoid circular dependency)
 * @param {string} role - The role code
 * @returns {string} The localized role name
 */
function getRoleDisplayName(role) {
    const roleNames = {
        'dean': 'عميد الكلية',
        'director': 'مدير الكلية',
        'storekeeper': 'أمين المخزن',
        'staff': 'موظف المخازن'
    };

    return roleNames[role] || role;
}

// Export permissions functions
const Permissions = {
    applyPermissions,
    showRoleChangeNotification
};

export default Permissions;