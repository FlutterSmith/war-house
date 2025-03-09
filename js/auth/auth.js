/**
 * Authentication Module
 * Handles user authentication, authorization, and permissions
 */

import Toast from '../components/toast.js';

// Define user roles and their permissions
const ROLES = {
    admin: {
        name: 'مدير النظام',
        permissions: ['viewInventory', 'editInventory', 'viewReports', 'manageUsers', 'accessSettings']
    },
    manager: {
        name: 'مدير',
        permissions: ['viewInventory', 'editInventory', 'viewReports', 'accessSettings']
    },
    employee: {
        name: 'موظف',
        permissions: ['viewInventory', 'editInventory']
    },
    viewer: {
        name: 'مشاهد',
        permissions: ['viewInventory', 'viewReports']
    }
};

/**
 * Authenticate a user by username and password
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {Object} Authentication result
 */
function login(username, password) {
    // In a real app, this would call an API endpoint
    // For this demo, we'll use hardcoded users
    const users = getUsers();
    
    // Find user by username
    const user = users.find(u => u.username === username);
    
    // Check if user exists and password is correct
    if (user && user.password === password) {
        // Create user session
        const userSession = {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            loginTime: new Date().toISOString()
        };
        
        // Store user session in localStorage
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        
        return {
            success: true,
            message: 'تم تسجيل الدخول بنجاح'
        };
    }
    
    return {
        success: false,
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
    };
}

/**
 * Log out the current user
 */
function logout() {
    localStorage.removeItem('currentUser');
}

/**
 * Check if a user is authenticated
 * @returns {boolean} Whether user is authenticated
 */
function isAuthenticated() {
    const currentUser = getCurrentUser();
    return !!currentUser;
}

/**
 * Check if user has a specific permission
 * @param {string} permission - The permission to check
 * @returns {boolean} Whether user has the permission
 */
function hasPermission(permission) {
    const currentUser = getCurrentUser();
    
    if (!currentUser || !currentUser.role) {
        return false;
    }
    
    const rolePermissions = ROLES[currentUser.role]?.permissions || [];
    return rolePermissions.includes(permission);
}

/**
 * Get the current authenticated user
 * @returns {Object|null} Current user or null if not authenticated
 */
function getCurrentUser() {
    try {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}

/**
 * Register a new user
 * @param {Object} userData - User data
 * @returns {Object} Registration result
 */
function registerUser(userData) {
    // In a real app, this would call an API endpoint
    try {
        const users = getUsers();
        
        // Check if username already exists
        if (users.some(u => u.username === userData.username)) {
            return {
                success: false,
                message: 'اسم المستخدم موجود بالفعل'
            };
        }
        
        // Create new user
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            username: userData.username,
            password: userData.password,
            name: userData.name,
            role: userData.role || 'employee'
        };
        
        // Add user to users array
        users.push(newUser);
        
        // Save updated users
        localStorage.setItem('users', JSON.stringify(users));
        
        return {
            success: true,
            message: 'تم إنشاء المستخدم بنجاح'
        };
    } catch (error) {
        console.error('Error registering user:', error);
        return {
            success: false,
            message: 'حدث خطأ أثناء إنشاء المستخدم'
        };
    }
}

/**
 * Change user password
 * @param {string} username - The username
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Object} Password change result
 */
function changePassword(username, currentPassword, newPassword) {
    try {
        const users = getUsers();
        
        // Find user
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex === -1) {
            return {
                success: false,
                message: 'المستخدم غير موجود'
            };
        }
        
        // Check current password
        if (users[userIndex].password !== currentPassword) {
            return {
                success: false,
                message: 'كلمة المرور الحالية غير صحيحة'
            };
        }
        
        // Update password
        users[userIndex].password = newPassword;
        
        // Save updated users
        localStorage.setItem('users', JSON.stringify(users));
        
        return {
            success: true,
            message: 'تم تغيير كلمة المرور بنجاح'
        };
    } catch (error) {
        console.error('Error changing password:', error);
        return {
            success: false,
            message: 'حدث خطأ أثناء تغيير كلمة المرور'
        };
    }
}

/**
 * Get all users
 * @returns {Array} Array of users
 */
function getUsers() {
    try {
        const usersJson = localStorage.getItem('users');
        
        if (!usersJson) {
            // Initialize with default users if none exist
            const defaultUsers = [
                {
                    id: 1,
                    username: 'admin',
                    password: 'admin123',
                    name: 'مدير النظام',
                    role: 'admin'
                },
                {
                    id: 2,
                    username: 'manager',
                    password: 'manager123',
                    name: 'محمد المدير',
                    role: 'manager'
                },
                {
                    id: 3,
                    username: 'employee',
                    password: 'employee123',
                    name: 'أحمد الموظف',
                    role: 'employee'
                }
            ];
            
            localStorage.setItem('users', JSON.stringify(defaultUsers));
            return defaultUsers;
        }
        
        return JSON.parse(usersJson);
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
}

/**
 * Get all available roles
 * @returns {Array} Array of roles with name and permissions
 */
function getRoles() {
    return Object.entries(ROLES).map(([id, role]) => ({
        id,
        name: role.name,
        permissions: role.permissions
    }));
}

/**
 * Get role display name
 * @param {string} roleId - Role ID
 * @returns {string} Role display name
 */
function getRoleDisplayName(roleId) {
    return ROLES[roleId]?.name || roleId;
}

// Export auth module
const Auth = {
    login,
    logout,
    isAuthenticated,
    hasPermission,
    getCurrentUser,
    registerUser,
    changePassword,
    getUsers,
    getRoles,
    getRoleDisplayName,
    ROLES
};

export default Auth;