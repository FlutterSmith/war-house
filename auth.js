/**
 * Authentication System
 * Provides authentication functionality for the warehouse management system.
 */

// Mock user data - in a real application, this would be stored in a database
const USERS = {
    'admin': { password: 'admin123', name: 'المسؤول', role: 'dean' },
    'director': { password: 'dir123', name: 'مدير الكلية', role: 'director' },
    'store': { password: 'store123', name: 'خالد محمد', role: 'storekeeper' },
    'staff': { password: 'staff123', name: 'أحمد علي', role: 'staff' }
};

// Session expiry time in milliseconds (8 hours)
const SESSION_EXPIRY = 8 * 60 * 60 * 1000;

/**
 * Authenticate a user with username and password
 * @param {string} username - The username
 * @param {string} password - The password
 * @param {string} role - The selected role
 * @returns {Object} Authentication result with status and user data if successful
 */
function authenticate(username, password, role) {
    if (!username || !password || !role) {
        return { success: false, message: 'يجب إدخال اسم المستخدم وكلمة المرور والصلاحية' };
    }

    const user = USERS[username];

    if (!user) {
        return { success: false, message: 'اسم المستخدم غير موجود' };
    }

    if (user.password !== password) {
        return { success: false, message: 'كلمة المرور غير صحيحة' };
    }

    if (user.role !== role) {
        return { success: false, message: 'الصلاحية المختارة غير مطابقة لحسابك' };
    }

    // Create session data
    const sessionData = {
        username: username,
        name: user.name,
        role: user.role,
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
        expiryTime: new Date(Date.now() + SESSION_EXPIRY).toISOString()
    };

    // Store session
    saveSession(sessionData);

    return {
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        user: {
            username: username,
            name: user.name,
            role: user.role
        }
    };
}

/**
 * Check if a user session is valid
 * @returns {boolean} Whether the user is authenticated
 */
function isAuthenticated() {
    const session = getSession();

    if (!session || !session.isLoggedIn) {
        return false;
    }

    // Check if session has expired
    const now = new Date();
    const expiryTime = new Date(session.expiryTime);

    if (now > expiryTime) {
        // Session expired, clear it
        clearSession();
        return false;
    }

    // Session is valid, extend its expiry time
    extendSession();
    return true;
}

/**
 * Save user session to localStorage
 * @param {Object} sessionData - User session data
 */
function saveSession(sessionData) {
    localStorage.setItem('currentUser', JSON.stringify(sessionData));
}

/**
 * Get current user session from localStorage
 * @returns {Object|null} The user session or null if not found
 */
function getSession() {
    const sessionData = localStorage.getItem('currentUser');
    return sessionData ? JSON.parse(sessionData) : null;
}

/**
 * Clear user session from localStorage
 */
function clearSession() {
    localStorage.removeItem('currentUser');
}

/**
 * Extend the current session's expiry time
 */
function extendSession() {
    const session = getSession();
    if (session) {
        session.expiryTime = new Date(Date.now() + SESSION_EXPIRY).toISOString();
        saveSession(session);
    }
}

/**
 * Log out the current user
 * @returns {boolean} Whether logout was successful
 */
function logout() {
    const wasLoggedIn = isAuthenticated();
    clearSession();
    return wasLoggedIn;
}

/**
 * Get the current user's information
 * @returns {Object|null} User information or null if not authenticated
 */
function getCurrentUser() {
    if (!isAuthenticated()) {
        return null;
    }

    const session = getSession();
    return {
        username: session.username,
        name: session.name,
        role: session.role,
        loginTime: session.loginTime
    };
}

/**
 * Change user password
 * @param {string} username - The username
 * @param {string} currentPassword - The current password
 * @param {string} newPassword - The new password
 * @returns {Object} Result with success status and message
 */
function changePassword(username, currentPassword, newPassword) {
    if (!username || !currentPassword || !newPassword) {
        return { success: false, message: 'جميع الحقول مطلوبة' };
    }

    const user = USERS[username];

    if (!user) {
        return { success: false, message: 'المستخدم غير موجود' };
    }

    if (user.password !== currentPassword) {
        return { success: false, message: 'كلمة المرور الحالية غير صحيحة' };
    }

    // In a real app, this would update the password in a database
    USERS[username].password = newPassword;

    return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
}

/**
 * Check if user has specific permission
 * @param {string} permission - The permission to check
 * @returns {boolean} Whether the user has the permission
 */
function hasPermission(permission) {
    if (!isAuthenticated()) {
        return false;
    }

    const session = getSession();
    const role = session.role;

    // Define role-based permissions
    const permissions = {
        dean: ['viewDashboard', 'viewInventory', 'viewReports', 'viewSettings',
            'editInventory', 'editSettings', 'approveRequests'],

        director: ['viewDashboard', 'viewInventory', 'viewReports',
            'editInventory', 'approveRequests'],

        storekeeper: ['viewDashboard', 'viewInventory', 'viewReports',
            'editInventory', 'createRequests'],

        staff: ['viewDashboard', 'viewInventory', 'createRequests']
    };

    return permissions[role] && permissions[role].includes(permission);
}

// Export Auth module for use in other files
const Auth = {
    authenticate,
    isAuthenticated,
    logout,
    getCurrentUser,
    changePassword,
    hasPermission
};

// Support both older browsers and module imports
if (typeof window !== 'undefined') {
    window.Auth = Auth;
}

export default Auth;