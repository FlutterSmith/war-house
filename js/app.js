/**
 * Main Application Module
 * Entry point for the warehouse management system
 */

// Import page modules
import DashboardModule from './pages/dashboard.js';
import InventoryModule from './pages/inventory.js';
import OperationsModule from './pages/operations.js';
import ReportsModule from './pages/reports.js';
import SettingsModule from './pages/settings.js';

// Import components
import Modal from './components/modal.js';
import Toast from './components/toast.js';

// Import utilities
import Auth from './auth/auth.js';
import Animations from './utils/animations.js';
import Permissions from './utils/permissions.js';

/**
 * Application initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Setup UI components
    setupUI();

    // Initialize page modules
    initializePages();

    // Setup navigation
    setupNavigation();

    // Apply permissions
    applyRoleBasedPermissions();

    // Initialize page animations
    Animations.initPageAnimations();

    // Show welcome toast
    const currentUser = Auth.getCurrentUser();
    if (currentUser) {
        Toast.showToast(`مرحباً ${currentUser.name}! تم تسجيل الدخول بنجاح`, 'success');
    }
});

/**
 * Setup UI components and event handlers
 */
function setupUI() {
    // Setup sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Setup user role selector
    setupRoleSelector();

    // Setup logout functionality
    setupLogout();

    // Apply theme settings
    applyTheme();
}

/**
 * Initialize all page modules
 */
function initializePages() {
    // Initialize dashboard module
    DashboardModule.initialize();

    // Initialize inventory module
    InventoryModule.initialize();

    // Initialize operations module (will be initialized on demand)

    // Initialize reports module (will be initialized on demand)

    // Initialize settings module (will be initialized on demand)
}

/**
 * Setup navigation between sections
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('main section');
    const pageTitle = document.getElementById('currentPageTitle');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.parentElement.classList.remove('active'));

            // Add active class to clicked link
            this.parentElement.classList.add('active');

            // Get section ID
            const sectionId = this.getAttribute('data-section');

            // Hide all sections
            sections.forEach(section => section.classList.add('hidden'));

            // Show selected section
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
        });
    });
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
            Modal.showModal('تغيير الصلاحية', `
                <div class="confirmation-message">
                    <p>هل أنت متأكد من تغيير الصلاحية إلى "${getRoleName(newRole)}"؟</p>
                    <div class="button-group">
                        <button class="btn-primary confirm-btn">نعم، تغيير الصلاحية</button>
                        <button class="btn-secondary cancel-btn">إلغاء</button>
                    </div>
                </div>
            `, (modal) => {
                const confirmBtn = modal.querySelector('.confirm-btn');
                const cancelBtn = modal.querySelector('.cancel-btn');

                confirmBtn.addEventListener('click', () => {
                    // Change role
                    changeUserRole(newRole);
                    Modal.closeModal();
                });

                cancelBtn.addEventListener('click', () => {
                    // Reset selector to current role
                    roleSelector.value = Auth.getCurrentUser().role;
                    Modal.closeModal();
                });
            });
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
    applyRoleBasedPermissions();

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
 * Setup logout functionality
 */
function setupLogout() {
    const logoutButton = document.querySelector('.logout-item a');

    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();

            // Show confirmation modal
            Modal.showModal('تسجيل الخروج', `
                <div class="confirmation-message">
                    <p>هل أنت متأكد من تسجيل الخروج من النظام؟</p>
                    <div class="button-group">
                        <button class="btn-primary confirm-btn">نعم، تسجيل الخروج</button>
                        <button class="btn-secondary cancel-btn">إلغاء</button>
                    </div>
                </div>
            `, (modal) => {
                const confirmBtn = modal.querySelector('.confirm-btn');
                const cancelBtn = modal.querySelector('.cancel-btn');

                confirmBtn.addEventListener('click', () => {
                    // Logout
                    Auth.logout();
                    window.location.href = 'login.html';
                });

                cancelBtn.addEventListener('click', () => {
                    Modal.closeModal();
                });
            });
        });
    }
}

/**
 * Apply role-based permissions
 */
function applyRoleBasedPermissions() {
    const currentUser = Auth.getCurrentUser();

    if (currentUser) {
        Permissions.applyPermissions(currentUser.role);
    }
}

/**
 * Apply theme settings from localStorage
 */
function applyTheme() {
    const theme = localStorage.getItem('theme') || 'light';

    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        // Auto theme based on system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.add('light-theme');
        }
    }
}

/**
 * Initialize dummy data for testing
 */
function initializeDummyData() {
    // Check if data already exists
    if (localStorage.getItem('inventoryData')) {
        return;
    }

    // Inventory data
    const inventoryData = {
        durable: [
            { code: "D001", name: "حاسوب مكتبي", quantity: 15, unit: "جهاز", lastUpdate: "2025/02/15", status: "متوفر" },
            { code: "D002", name: "شاشة LCD", quantity: 20, unit: "قطعة", lastUpdate: "2025/03/01", status: "متوفر" },
            { code: "D003", name: "طابعة ليزر", quantity: 5, unit: "جهاز", lastUpdate: "2025/01/20", status: "منخفض" },
            { code: "D004", name: "ماسح ضوئي", quantity: 3, unit: "جهاز", lastUpdate: "2024/12/10", status: "منخفض" },
            { code: "D005", name: "كرسي مكتبي", quantity: 25, unit: "قطعة", lastUpdate: "2025/03/15", status: "متوفر" }
        ],
        consumable: [
            { code: "C001", name: "ورق A4", quantity: 150, unit: "رزمة", lastUpdate: "2025/03/20", status: "متوفر" },
            { code: "C002", name: "أقلام جافة", quantity: 200, unit: "قطعة", lastUpdate: "2025/02/25", status: "متوفر" },
            { code: "C003", name: "حبر طابعة أسود", quantity: 5, unit: "عبوة", lastUpdate: "2025/01/10", status: "منخفض" },
            { code: "C004", name: "دباسة", quantity: 30, unit: "قطعة", lastUpdate: "2024/12/15", status: "متوفر" },
            { code: "C005", name: "ملفات بلاستيكية", quantity: 100, unit: "قطعة", lastUpdate: "2025/03/05", status: "متوفر" }
        ],
        damaged: [
            { code: "D006", name: "حاسوب محمول", quantity: 2, unit: "جهاز", lastUpdate: "2024/11/20", status: "للإصلاح" },
            { code: "D007", name: "طابعة نافثة للحبر", quantity: 1, unit: "جهاز", lastUpdate: "2025/01/05", status: "للإتلاف" },
            { code: "C006", name: "حبر طابعة ملون", quantity: 3, unit: "عبوة", lastUpdate: "2024/12/20", status: "للإتلاف" }
        ]
    };

    // Operations data
    const operationsData = [
        { id: "OP001", type: "إضافة", warehouse: "المستديم", item: "حاسوب مكتبي", quantity: 5, unit: "جهاز", date: "2025/01/15", user: "أحمد محمد", notes: "توريد جديد" },
        { id: "OP002", type: "سحب", warehouse: "المستهلك", item: "ورق A4", quantity: 10, unit: "رزمة", date: "2025/02/01", user: "سارة أحمد", notes: "لقسم شؤون الطلاب" },
        { id: "OP003", type: "إتلاف", warehouse: "المستهلك", item: "حبر طابعة ملون", quantity: 2, unit: "عبوة", date: "2025/02/10", user: "محمد علي", notes: "منتهي الصلاحية" },
        { id: "OP004", type: "نقل", warehouse: "المستديم", item: "طابعة ليزر", quantity: 1, unit: "جهاز", date: "2025/03/05", user: "فاطمة حسن", notes: "نقل لقسم المحاسبة" }
    ];

    // Save data to localStorage
    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
    localStorage.setItem('operationsData', JSON.stringify(operationsData));
    localStorage.setItem('dataInitialized', 'true');
}

// Initialize dummy data
initializeDummyData();