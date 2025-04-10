// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated, if not redirect to login page
    checkUserAuthentication();

    // Initialize and load data from localStorage
    initializeLocalStorage();

    // Add animation classes to elements when the page loads
    animateElementsOnLoad();

    // Set up section navigation and visibility
    setupSectionNavigation();

    // Add form validation with enhanced feedback
    setupFormValidation();

    // Add hover effects for sidebar menu items
    setupMenuInteractions();

    // Set up operation buttons and warehouse selectors
    setupWarehouseOperations();

    // Add smooth scrolling for the page
    enableSmoothScrolling();

    // Set up role-based permissions
    setupRoleBasedPermissions();

    // Set up data tables and search functionality
    setupInventoryData();

    // Ensure icons are visible
    fixIconDisplay();

    // Initialize all components
    initializeAnimations();
    initializeToastSystem();
    initializeAccordions();
    initializeRippleEffect();
    initializeNotifications();
    initializeOperationCards();
    initializeWarehouseTabs();
    initializeFormValidation();
    initializeSearchFunctionality();
    initializeDirectionAwareCards();
    initializeModalSystem();
    initializeKeyboardNavigation();
    initializeReports();

    // Set up user profile and logout functionality
    setupUserProfile();

    // Add page transition animations
    document.body.classList.add('fade-in');
});

// Function to check if user is authenticated using Auth module
function checkUserAuthentication() {
    if (!Auth.isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        // Update the UI with user information
        const currentUser = Auth.getCurrentUser();
        updateUserInfo(currentUser);
    }
}

// Function to update user information in the UI
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

// Toggle user menu
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
                <span>${getRoleDisplayName(currentUser.role)}</span>
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
            showModal('الملف الشخصي', `
                <div class="user-profile">
                    <img src="assets/img/user-avatar.png" alt="صورة المستخدم" class="profile-avatar">
                    <h3>${currentUser.name}</h3>
                    <p>اسم المستخدم: ${currentUser.username}</p>
                    <p>الصلاحية: ${getRoleDisplayName(currentUser.role)}</p>
                    <p>تاريخ آخر تسجيل دخول: ${formatDate(new Date(currentUser.loginTime))}</p>
                </div>
            `);
        });

        document.getElementById('changePassword').addEventListener('click', (e) => {
            e.preventDefault();
            showModal('تغيير كلمة المرور', `
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
            `,
                () => {
                    // Setup form validation after modal is shown
                    const form = document.getElementById('passwordChangeForm');
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const currentPassword = document.getElementById('currentPassword').value;
                        const newPassword = document.getElementById('newPassword').value;
                        const confirmPassword = document.getElementById('confirmPassword').value;

                        if (newPassword !== confirmPassword) {
                            showToast('كلمة المرور الجديدة وتأكيدها غير متطابقين', 'error');
                            return;
                        }

                        // Use Auth module to change password
                        const result = Auth.changePassword(currentUser.username, currentPassword, newPassword);

                        if (result.success) {
                            showToast(result.message, 'success');
                            closeModal();
                        } else {
                            showToast(result.message, 'error');
                        }
                    });
                });
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

// Get display name for role
function getRoleDisplayName(role) {
    const roleNames = {
        'dean': 'عميد الكلية',
        'director': 'مدير الكلية',
        'storekeeper': 'أمين المخزن',
        'staff': 'موظف المخازن'
    };

    return roleNames[role] || role;
}

// Format date in Arabic
function formatDate(date) {
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Setup user profile and logout functionality
function setupUserProfile() {
    const logoutLink = document.querySelector('.nav-menu li:last-child a');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// Log out user (using Auth module)
function logout() {
    showConfirmModal('تسجيل الخروج', 'هل أنت متأكد من رغبتك في تسجيل الخروج؟', () => {
        // Use Auth module to logout
        Auth.logout();

        // Show logout toast
        showToast('تم تسجيل الخروج بنجاح', 'info');

        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    });
}

// Initialize local storage with sample data if needed
function initializeLocalStorage() {
    // Initialize inventory data
    if (!localStorage.getItem('inventoryData')) {
        const initialInventoryData = {
            durable: [
                { code: 'D001', name: 'جهاز حاسوب HP', quantity: 15, unit: 'جهاز', lastUpdate: '2025/04/05', status: 'متوفر' },
                { code: 'D002', name: 'طابعة ليزر', quantity: 8, unit: 'جهاز', lastUpdate: '2025/04/01', status: 'متوفر' },
                { code: 'D003', name: 'كرسي مكتبي', quantity: 25, unit: 'قطعة', lastUpdate: '2025/03/28', status: 'متوفر' },
                { code: 'D004', name: 'مكتب خشبي', quantity: 12, unit: 'قطعة', lastUpdate: '2025/03/20', status: 'متوفر' }
            ],
            consumable: [
                { code: 'C001', name: 'ورق تصوير A4', quantity: 150, unit: 'رزمة', lastUpdate: '2025/04/09', status: 'متوفر' },
                { code: 'C002', name: 'أقلام حبر', quantity: 200, unit: 'قطعة', lastUpdate: '2025/04/07', status: 'متوفر' },
                { code: 'C003', name: 'حبر طابعة أسود', quantity: 30, unit: 'عبوة', lastUpdate: '2025/04/02', status: 'منخفض' },
                { code: 'C004', name: 'ملفات بلاستيكية', quantity: 300, unit: 'قطعة', lastUpdate: '2025/03/15', status: 'متوفر' }
            ],
            damaged: [
                { code: 'X001', name: 'كراسي مكسورة', quantity: 8, unit: 'قطعة', lastUpdate: '2025/04/07', status: 'للإتلاف' },
                { code: 'X002', name: 'أجهزة حاسوب معطلة', quantity: 3, unit: 'جهاز', lastUpdate: '2025/03/15', status: 'للإصلاح' },
                { code: 'X003', name: 'طابعة معطلة', quantity: 2, unit: 'جهاز', lastUpdate: '2025/02/20', status: 'للإتلاف' }
            ]
        };

        localStorage.setItem('inventoryData', JSON.stringify(initialInventoryData));
    }

    // Initialize operations log
    if (!localStorage.getItem('operationsLog')) {
        const initialOperationsLog = [
            { id: 1052, type: 'إضافة', warehouse: 'المستهلك', item: 'ورق تصوير A4', quantity: '25', unit: 'رزمة', date: '2025/04/09', user: 'أحمد حسن' },
            { id: 1051, type: 'سحب', warehouse: 'المستديم', item: 'جهاز حاسوب', quantity: '2', unit: 'جهاز', date: '2025/04/08', user: 'محمد سعيد' },
            { id: 1050, type: 'إسترجاع', warehouse: 'المستهلك', item: 'حبر طابعة', quantity: '5', unit: 'عبوات', date: '2025/04/07', user: 'عبد الله قاسم' },
            { id: 1049, type: 'إتلاف', warehouse: 'التالف', item: 'كراسي مكتب', quantity: '8', unit: 'كرسي', date: '2025/04/07', user: 'سعيد كمال' }
        ];

        localStorage.setItem('operationsLog', JSON.stringify(initialOperationsLog));
    }

    // Initialize next operation ID
    if (!localStorage.getItem('nextOperationId')) {
        localStorage.setItem('nextOperationId', '1053');
    }
}

// Function to animate elements when the page loads
function animateElementsOnLoad() {
    // Add fade-in animation to the main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.8s ease-in-out, transform 0.8s ease-out';
        mainContent.style.transform = 'translateY(20px)';

        setTimeout(() => {
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }, 200);
    }

    // Animate dashboard cards to appear one after another
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
    });

    // Animate form elements to appear one after another
    const formRows = document.querySelectorAll('.form-row');
    formRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(20px)';
        row.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';

        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, 300 + (index * 100));
    });

    // Add subtle animation to the sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.style.opacity = '0';
        sidebar.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-out';
        sidebar.style.transform = 'translateX(-20px)';

        setTimeout(() => {
            sidebar.style.opacity = '1';
            sidebar.style.transform = 'translateX(0)';
        }, 100);
    }

    // Add pulse animation to action buttons
    const actionButtons = document.querySelectorAll('.btn-primary');
    actionButtons.forEach(button => {
        setTimeout(() => {
            button.classList.add('pulse-animation');

            // Remove pulse after 3 seconds
            setTimeout(() => {
                button.classList.remove('pulse-animation');
            }, 3000);
        }, 1500);
    });

    // Animate operation buttons
    const operationBtns = document.querySelectorAll('.operation-btn');
    operationBtns.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'scale(0.9)';
        btn.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.transform = 'scale(1)';
        }, 500 + (index * 100));
    });
}

// Function to set up section navigation
function setupSectionNavigation() {
    const menuItems = document.querySelectorAll('.nav-menu li a[data-section]');
    const sections = document.querySelectorAll('main section');

    // Show dashboard section by default
    showSection('dashboard-section');

    // Add click event to each menu item that has data-section attribute
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Get the section to show
            const sectionId = item.getAttribute('data-section') + '-section';

            // Show the selected section and hide others
            showSection(sectionId);

            // Add active class to the clicked menu item
            document.querySelectorAll('.nav-menu li').forEach(li => {
                li.classList.remove('active');
            });
            item.parentElement.classList.add('active');
        });
    });

    // Set up quick action buttons on dashboard
    const operationButtons = document.querySelectorAll('.operation-btn');
    operationButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Navigate to operations section
            showSection('operations-section');

            // Set the active operation type based on button
            const operationType = btn.getAttribute('data-operation');
            setActiveOption('.operation-option', `[data-operation="${operationType}"]`);

            // Update menu active state
            document.querySelectorAll('.nav-menu li').forEach(li => {
                li.classList.remove('active');
                if (li.querySelector('a[data-section="operations"]')) {
                    li.classList.add('active');
                }
            });
        });
    });
}

// Function to show a specific section and hide others
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('main section').forEach(section => {
        section.classList.add('hidden');
    });

    // Show the selected section
    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
        sectionToShow.classList.remove('hidden');

        // Animate the section entry
        sectionToShow.style.opacity = '0';
        sectionToShow.style.transform = 'translateY(20px)';

        setTimeout(() => {
            sectionToShow.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            sectionToShow.style.opacity = '1';
            sectionToShow.style.transform = 'translateY(0)';
        }, 50);
    }
}

// Function to set up warehouse operations
function setupWarehouseOperations() {
    // Set up operation type selector
    setupOptionSelectors('.operation-option');

    // Set up warehouse selector
    setupOptionSelectors('.warehouse-option');

    // Set up warehouse tabs in inventory section
    setupOptionSelectors('.warehouse-tab');

    // Set up inventory form submission
    const inventoryForm = document.getElementById('inventoryOperationForm');
    if (inventoryForm) {
        inventoryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate all inputs before proceeding
            let isValid = validateOperationForm();
            if (!isValid) {
                showToast('يرجى إدخال جميع الحقول المطلوبة بشكل صحيح', 'error');
                return;
            }

            // Get the active operation and warehouse
            const activeOperation = document.querySelector('.operation-option.active').getAttribute('data-operation');
            const activeWarehouseEl = document.querySelector('.warehouse-option.active');
            const activeWarehouseType = activeWarehouseEl.getAttribute('data-warehouse');
            const activeWarehouseName = activeWarehouseEl.textContent;

            // Get form data
            const itemCode = document.getElementById('itemCode').value;
            const itemName = document.getElementById('itemName').value;
            const itemQuantity = parseInt(document.getElementById('itemQuantity').value);
            const itemUnitEl = document.getElementById('itemUnit');
            const itemUnit = itemUnitEl.options[itemUnitEl.selectedIndex].text;
            const notes = document.getElementById('operationNotes').value;

            // Create operation data
            const operationData = {
                itemCode: itemCode,
                itemName: itemName,
                itemQuantity: itemQuantity,
                itemUnit: itemUnit,
                notes: notes,
                operation: activeOperation,
                warehouse: activeWarehouseType
            };

            // Show confirmation modal before proceeding
            const operationMessage = getOperationMessage(activeOperation, itemName, itemQuantity, itemUnit, activeWarehouseName);

            showConfirmModal('تأكيد العملية', operationMessage, () => {
                // Process the operation
                processInventoryOperation(operationData);

                // Show success message
                showToast(getOperationSuccessMessage(activeOperation), 'success');

                // Reset form
                inventoryForm.reset();

                // Update the UI - refresh tables and stats
                refreshInventoryDisplay(activeWarehouseType);
                updateDashboardStats();
            });
        });
    }

    // Add auto-complete for item selection
    const itemCodeInput = document.getElementById('itemCode');
    const itemNameInput = document.getElementById('itemName');

    if (itemCodeInput && itemNameInput) {
        // When item code is entered, try to auto-fill the name
        itemCodeInput.addEventListener('blur', () => {
            const code = itemCodeInput.value.trim();
            if (code) {
                const item = findItemByCode(code);
                if (item) {
                    itemNameInput.value = item.name;
                }
            }
        });

        // When item name is entered, try to auto-fill the code
        itemNameInput.addEventListener('blur', () => {
            const name = itemNameInput.value.trim();
            if (name) {
                const item = findItemByName(name);
                if (item) {
                    itemCodeInput.value = item.code;
                }
            }
        });
    }
}

// Find an item by its code in any warehouse
function findItemByCode(code) {
    const inventoryData = JSON.parse(localStorage.getItem('inventoryData'));

    for (const warehouseType in inventoryData) {
        const items = inventoryData[warehouseType];
        const foundItem = items.find(item => item.code === code);
        if (foundItem) {
            return foundItem;
        }
    }

    return null;
}

// Find an item by its name in any warehouse
function findItemByName(name) {
    const inventoryData = JSON.parse(localStorage.getItem('inventoryData'));

    for (const warehouseType in inventoryData) {
        const items = inventoryData[warehouseType];
        const foundItem = items.find(item => item.name === name);
        if (foundItem) {
            return foundItem;
        }
    }

    return null;
}

// Validate the operation form
function validateOperationForm() {
    const itemCode = document.getElementById('itemCode').value.trim();
    const itemName = document.getElementById('itemName').value.trim();
    const itemQuantity = document.getElementById('itemQuantity').value.trim();

    let isValid = true;

    if (!itemCode) {
        showError(document.getElementById('itemCode'), 'رقم الصنف مطلوب');
        isValid = false;
    } else if (!/^[A-Z0-9]+$/i.test(itemCode)) {
        showError(document.getElementById('itemCode'), 'رقم الصنف يجب أن يحتوي على أحرف وأرقام فقط');
        isValid = false;
    }

    if (!itemName) {
        showError(document.getElementById('itemName'), 'اسم الصنف مطلوب');
        isValid = false;
    }

    if (!itemQuantity) {
        showError(document.getElementById('itemQuantity'), 'الكمية مطلوبة');
        isValid = false;
    } else if (parseInt(itemQuantity) <= 0) {
        showError(document.getElementById('itemQuantity'), 'الكمية يجب أن تكون أكبر من صفر');
        isValid = false;
    }

    return isValid;
}

// Get appropriate confirmation message based on operation type
function getOperationMessage(operation, itemName, quantity, unit, warehouse) {
    let operationVerb;
    switch (operation) {
        case 'add':
            operationVerb = 'إضافة';
            break;
        case 'withdraw':
            operationVerb = 'سحب';
            break;
        case 'return':
            operationVerb = 'إسترجاع';
            break;
        case 'dispose':
            operationVerb = 'إتلاف';
            break;
        default:
            operationVerb = 'معالجة';
    }

    return `هل أنت متأكد من ${operationVerb} ${quantity} ${unit} من ${itemName} ${operation === 'add' ? 'إلى' : 'من'} مخزن ${warehouse}؟`;
}

// Process inventory operation
function processInventoryOperation(operationData) {
    // Get current inventory data
    const inventoryData = JSON.parse(localStorage.getItem('inventoryData'));
    const operationsLog = JSON.parse(localStorage.getItem('operationsLog'));
    let nextOpId = parseInt(localStorage.getItem('nextOperationId'));

    // Get current user data
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userName = currentUser ? currentUser.name : 'مستخدم النظام';

    // Create operation log entry
    const operationLog = {
        id: nextOpId,
        type: getOperationTypeName(operationData.operation),
        warehouse: getWarehouseName(operationData.warehouse),
        item: operationData.itemName,
        quantity: operationData.itemQuantity.toString(),
        unit: operationData.itemUnit,
        date: formatDateShort(new Date()),
        user: userName,
        notes: operationData.notes
    };

    // Add operation to log
    operationsLog.unshift(operationLog); // Add to beginning of array
    localStorage.setItem('operationsLog', JSON.stringify(operationsLog));
    localStorage.setItem('nextOperationId', (nextOpId + 1).toString());

    // Update inventory data based on operation type
    const warehouseItems = inventoryData[operationData.warehouse];
    let existingItemIndex = warehouseItems.findIndex(item => item.code === operationData.itemCode);

    switch (operationData.operation) {
        case 'add':
            if (existingItemIndex >= 0) {
                // Item exists, update quantity
                warehouseItems[existingItemIndex].quantity += operationData.itemQuantity;
                warehouseItems[existingItemIndex].lastUpdate = formatDateShort(new Date());
            } else {
                // New item
                warehouseItems.push({
                    code: operationData.itemCode,
                    name: operationData.itemName,
                    quantity: operationData.itemQuantity,
                    unit: operationData.itemUnit,
                    lastUpdate: formatDateShort(new Date()),
                    status: 'متوفر'
                });
            }
            break;

        case 'withdraw':
            if (existingItemIndex >= 0) {
                // Update quantity
                warehouseItems[existingItemIndex].quantity -= operationData.itemQuantity;

                // Check if quantity is low
                if (warehouseItems[existingItemIndex].quantity <= 5) {
                    warehouseItems[existingItemIndex].status = 'منخفض';
                }

                warehouseItems[existingItemIndex].lastUpdate = formatDateShort(new Date());
            }
            break;

        case 'return':
            if (existingItemIndex >= 0) {
                // Update quantity
                warehouseItems[existingItemIndex].quantity += operationData.itemQuantity;

                // Check if quantity is no longer low
                if (warehouseItems[existingItemIndex].quantity > 5 && warehouseItems[existingItemIndex].status === 'منخفض') {
                    warehouseItems[existingItemIndex].status = 'متوفر';
                }

                warehouseItems[existingItemIndex].lastUpdate = formatDateShort(new Date());
            }
            break;

        case 'dispose':
            // For disposal, move the item to the 'damaged' warehouse
            if (existingItemIndex >= 0) {
                // Remove item from current warehouse or reduce quantity
                if (warehouseItems[existingItemIndex].quantity <= operationData.itemQuantity) {
                    warehouseItems.splice(existingItemIndex, 1);
                } else {
                    warehouseItems[existingItemIndex].quantity -= operationData.itemQuantity;
                    warehouseItems[existingItemIndex].lastUpdate = formatDateShort(new Date());
                }

                // Add to damaged warehouse
                const damagedItems = inventoryData.damaged;
                const existingDamagedIndex = damagedItems.findIndex(item => item.code === operationData.itemCode);

                if (existingDamagedIndex >= 0) {
                    damagedItems[existingDamagedIndex].quantity += operationData.itemQuantity;
                    damagedItems[existingDamagedIndex].lastUpdate = formatDateShort(new Date());
                } else {
                    damagedItems.push({
                        code: operationData.itemCode,
                        name: operationData.itemName,
                        quantity: operationData.itemQuantity,
                        unit: operationData.itemUnit,
                        lastUpdate: formatDateShort(new Date()),
                        status: 'للإتلاف'
                    });
                }
            }
            break;
    }

    // Save updated inventory data
    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));

    // Refresh recent activities display
    updateRecentActivities();
}

// Get operation type name in Arabic
function getOperationTypeName(operation) {
    switch (operation) {
        case 'add':
            return 'إضافة';
        case 'withdraw':
            return 'سحب';
        case 'return':
            return 'إسترجاع';
        case 'dispose':
            return 'إتلاف';
        default:
            return operation;
    }
}

// Get warehouse name in Arabic
function getWarehouseName(warehouseType) {
    switch (warehouseType) {
        case 'durable':
            return 'المستديم';
        case 'consumable':
            return 'المستهلك';
        case 'damaged':
            return 'التالف';
        default:
            return warehouseType;
    }
}

// Format date for display in tables
function formatDateShort(date) {
    return date.toISOString().slice(0, 10).replace(/-/g, '/');
}

// Refresh inventory display after an operation
function refreshInventoryDisplay(warehouseType) {
    const inventoryData = JSON.parse(localStorage.getItem('inventoryData'));
    loadInventoryData(warehouseType, inventoryData);
}

// Update dashboard stats after an operation
function updateDashboardStats() {
    const inventoryData = JSON.parse(localStorage.getItem('inventoryData'));

    // Update stats for each warehouse
    const durableCount = inventoryData.durable.reduce((sum, item) => sum + item.quantity, 0);
    const consumableCount = inventoryData.consumable.reduce((sum, item) => sum + item.quantity, 0);
    const damagedCount = inventoryData.damaged.reduce((sum, item) => sum + item.quantity, 0);
    const totalCount = durableCount + consumableCount + damagedCount;

    // Update stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        const cardTitle = card.querySelector('h3').textContent;
        const statNumber = card.querySelector('.stat-number');

        if (cardTitle === 'المستديم') {
            updateStatWithAnimation(statNumber, durableCount);
        } else if (cardTitle === 'المستهلك') {
            updateStatWithAnimation(statNumber, consumableCount);
        } else if (cardTitle === 'التالف') {
            updateStatWithAnimation(statNumber, damagedCount);
        } else if (cardTitle === 'إجمالي العناصر') {
            updateStatWithAnimation(statNumber, totalCount);
        }
    });
}

// Animate stat number updates
function updateStatWithAnimation(element, newValue) {
    const currentValue = parseInt(element.textContent);
    if (currentValue === newValue) return;

    // Add animation class
    element.classList.add('updating');

    // Animate the count change
    const step = 10;
    const delay = 1000 / step;
    const diff = newValue - currentValue;
    const increment = Math.ceil(diff / step);

    let current = currentValue;
    const timer = setInterval(() => {
        current += increment;

        if ((increment > 0 && current >= newValue) ||
            (increment < 0 && current <= newValue)) {
            clearInterval(timer);
            element.textContent = newValue;

            setTimeout(() => {
                element.classList.remove('updating');
            }, 300);
        } else {
            element.textContent = current;
        }
    }, delay);
}

// Update recent activities table in dashboard
function updateRecentActivities() {
    // Get the most recent operations
    const operationsLog = JSON.parse(localStorage.getItem('operationsLog'));
    const recentOps = operationsLog.slice(0, 4); // Get the 4 most recent operations

    // Find the recent activities table
    const recentActivitiesTable = document.querySelector('.recent-activities table tbody');
    if (recentActivitiesTable) {
        // Clear existing content
        recentActivitiesTable.innerHTML = '';

        // Add new rows
        recentOps.forEach(op => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${op.id}</td>
                <td>${op.type}</td>
                <td>${op.warehouse}</td>
                <td>${op.item}</td>
                <td>${op.quantity} ${op.unit}</td>
                <td>${op.date}</td>
                <td>${op.user}</td>
            `;
            recentActivitiesTable.appendChild(row);
        });
    }
}

// Helper function to set up option selectors (operations, warehouses, tabs)
function setupOptionSelectors(selector) {
    const options = document.querySelectorAll(selector);

    options.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options in the same group
            const parent = option.parentElement;
            parent.querySelectorAll(selector).forEach(opt => {
                opt.classList.remove('active');
            });

            // Add active class to clicked option
            option.classList.add('active');
        });
    });
}

// Helper function to set active option by selector
function setActiveOption(groupSelector, itemSelector) {
    // Remove active class from all options in the group
    document.querySelectorAll(groupSelector).forEach(opt => {
        opt.classList.remove('active');
    });

    // Add active class to the target option
    const targetOption = document.querySelector(groupSelector + itemSelector);
    if (targetOption) {
        targetOption.classList.add('active');
    }
}

// Helper to get success message based on operation type
function getOperationSuccessMessage(operation) {
    switch (operation) {
        case 'add':
            return 'تمت إضافة العنصر بنجاح!';
        case 'withdraw':
            return 'تم سحب العنصر بنجاح!';
        case 'return':
            return 'تم استرجاع العنصر بنجاح!';
        case 'dispose':
            return 'تم إتلاف العنصر بنجاح!';
        default:
            return 'تمت العملية بنجاح!';
    }
}

// Function to set up inventory data and search functionality
function setupInventoryData() {
    // Get inventory data from localStorage instead of using hardcoded data
    const inventoryData = JSON.parse(localStorage.getItem('inventoryData')) || {
        durable: [],
        consumable: [],
        damaged: []
    };

    // Set up inventory tabs click handlers
    const warehouseTabs = document.querySelectorAll('.warehouse-tab');
    warehouseTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const warehouseType = tab.getAttribute('data-warehouse');
            loadInventoryData(warehouseType, inventoryData);
        });
    });

    // Set up search functionality
    const searchInput = document.getElementById('inventorySearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeWarehouse = document.querySelector('.warehouse-tab.active').getAttribute('data-warehouse');
            const searchTerm = e.target.value.toLowerCase();

            // Filter data based on search term
            const filteredData = inventoryData[activeWarehouse].filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.code.toLowerCase().includes(searchTerm)
            );

            // Render the filtered data
            renderInventoryTable(filteredData);
        });
    }

    // Load initial inventory data (durable warehouse by default)
    loadInventoryData('durable', inventoryData);
}

// Function to load inventory data for a specific warehouse
function loadInventoryData(warehouseType, inventoryData) {
    renderInventoryTable(inventoryData[warehouseType]);
}

// Function to render inventory data to the table
function renderInventoryTable(data) {
    const tableBody = document.getElementById('inventory-table-body');
    if (!tableBody) return;

    // Clear current table content
    tableBody.innerHTML = '';

    // If no data or empty array, show message
    if (!data || data.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="7" style="text-align: center;">لا توجد عناصر في المخزون</td>`;
        tableBody.appendChild(emptyRow);
        return;
    }

    // Add each data row
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            <td>${item.lastUpdate}</td>
            <td><span class="status-badge status-${item.status === 'متوفر' ? 'available' : (item.status === 'منخفض' ? 'low' : 'damaged')}">${item.status}</span></td>
            <td>
                <button class="action-btn view-btn">عرض</button>
                <button class="action-btn edit-btn">تعديل</button>
                <button class="action-btn delete-btn">حذف</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners for action buttons
    setupActionButtons();
}

// Function to set up action buttons in the inventory table
function setupActionButtons() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const itemName = row.cells[1].textContent;
            alert(`عرض تفاصيل العنصر: ${itemName}`);
        });
    });

    editButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const itemName = row.cells[1].textContent;
            alert(`تعديل العنصر: ${itemName}`);
        });
    });

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const itemName = row.cells[1].textContent;
            if (confirm(`هل أنت متأكد من حذف العنصر: ${itemName}؟`)) {
                row.style.opacity = '0';
                setTimeout(() => row.remove(), 300);
            }
        });
    });
}

// Function to set up role-based permissions
function setupRoleBasedPermissions() {
    const roleSelector = document.getElementById('userRoleSelector');
    if (roleSelector) {
        roleSelector.addEventListener('change', () => {
            applyPermissions(roleSelector.value);
        });

        // Apply default permissions based on initial role
        const currentUser = Auth.getCurrentUser();
        if (currentUser) {
            applyPermissions(currentUser.role);
        }
    }
}

// Function to apply permissions based on role
function applyPermissions(role) {
    // Use Auth module's hasPermission feature for more granular control

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
        const section = btn.closest('section').id.replace('-section', '');
        const permissionNeeded = editPermissions[section];
        const canEdit = permissionNeeded ? Auth.hasPermission(permissionNeeded) : false;

        btn.disabled = !canEdit;
        btn.style.opacity = canEdit ? '1' : '0.5';
        btn.style.cursor = canEdit ? 'pointer' : 'not-allowed';
    });

    // Show a notification about the role change
    showRoleChangeNotification(role);
}

// Show notification for role change
function showRoleChangeNotification(role) {
    let roleName;
    switch (role) {
        case 'dean':
            roleName = 'عميد الكلية';
            break;
        case 'director':
            roleName = 'مدير الكلية';
            break;
        case 'storekeeper':
            roleName = 'أمين المخزن';
            break;
        case 'staff':
            roleName = 'موظف المخازن';
            break;
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'role-notification';
    notification.textContent = `تم تغيير الصلاحيات إلى: ${roleName}`;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '20px';
    notification.style.backgroundColor = '#333';
    notification.style.color = '#fff';
    notification.style.padding = '10px 15px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }, 100);
}

// Function to set up form validation
function setupFormValidation() {
    const form = document.querySelector('.inventory-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            // Form validation is handled in setupWarehouseOperations
        });
    }

    // Add validation for item code and quantity
    const itemCodeInput = document.getElementById('itemCode');
    const quantityInput = document.getElementById('itemQuantity');

    if (itemCodeInput) {
        itemCodeInput.addEventListener('blur', () => {
            if (itemCodeInput.value.trim() === '') {
                showError(itemCodeInput, 'رقم الصنف مطلوب');
            } else if (!/^[A-Z0-9]+$/i.test(itemCodeInput.value)) {
                showError(itemCodeInput, 'رقم الصنف يجب أن يحتوي على أحرف وأرقام فقط');
            } else {
                removeError(itemCodeInput);
            }
        });
    }

    if (quantityInput) {
        quantityInput.addEventListener('blur', () => {
            if (quantityInput.value.trim() === '') {
                showError(quantityInput, 'الكمية مطلوبة');
            } else if (parseInt(quantityInput.value) <= 0) {
                showError(quantityInput, 'الكمية يجب أن تكون أكبر من صفر');
            } else {
                removeError(quantityInput);
            }
        });
    }
}

// Show error message for form fields
function showError(input, message) {
    const formRow = input.parentElement;
    let errorDiv = formRow.querySelector('.error-message');

    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        formRow.appendChild(errorDiv);
    }

    errorDiv.textContent = message;
    errorDiv.style.opacity = '0';
    input.classList.add('error');

    setTimeout(() => {
        errorDiv.style.opacity = '1';
    }, 10);
}

// Remove error message
function removeError(input) {
    const formRow = input.parentElement;
    const errorDiv = formRow.querySelector('.error-message');

    if (errorDiv) {
        errorDiv.remove();
    }

    input.classList.remove('error');
}

// Show success message
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

// Add interactive effects to menu
function setupMenuInteractions() {
    const menuItems = document.querySelectorAll('.nav-menu li a');

    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('img');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });

        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('img');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });

        item.addEventListener('click', (e) => {
            if (!item.parentElement.classList.contains('active')) {
                // Add ripple effect
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                item.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 800);
            }
        });
    });
}

// Enable smooth scrolling
function enableSmoothScrolling() {
    document.documentElement.style.scrollBehavior = 'smooth';
}

// DOM Elements
const langToggleBtn = document.getElementById('langToggle');
const userRoleSelector = document.getElementById('userRoleSelector');
const navLinks = document.querySelectorAll('.nav-menu a');
const menuIcons = document.querySelectorAll('.icon-wrapper img');

// Language/Direction Switcher
langToggleBtn.addEventListener('click', function () {
    const htmlElement = document.documentElement;
    const isRtl = htmlElement.dir === 'rtl';

    // Toggle direction
    htmlElement.dir = isRtl ? 'ltr' : 'rtl';
    htmlElement.lang = isRtl ? 'en' : 'ar';

    // Update language display
    const currentLangElement = this.querySelector('.current-lang');
    currentLangElement.textContent = isRtl ? 'EN' : 'AR';

    // Update layout classes
    document.body.classList.toggle('ltr-layout');
    document.body.classList.toggle('rtl-layout');

    // Update menu item animation direction
    document.querySelectorAll('.nav-menu li a').forEach(link => {
        link.style.transform = 'none'; // Reset transform
    });

    // Fix icon visibility if needed
    fixIconDisplay();
});

// Make sure icons are always visible
function fixIconDisplay() {
    menuIcons.forEach(icon => {
        icon.style.display = 'block';

        // Force reflow/repaint
        void icon.offsetWidth;

        // If icon has zero width/height, try to restore it
        if (icon.offsetWidth === 0 || icon.offsetHeight === 0) {
            icon.style.width = '24px';
            icon.style.height = '24px';
            icon.style.opacity = '1';
            icon.style.visibility = 'visible';
        }
    });
}

// Navigation menu functionality
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        const sectionId = this.getAttribute('data-section');

        // If this is a section link, prevent default behavior
        if (sectionId) {
            e.preventDefault();

            // Remove active class from all menu items
            document.querySelectorAll('.nav-menu li').forEach(item => {
                item.classList.remove('active');
            });

            // Add active class to clicked menu item
            this.closest('li').classList.add('active');

            // Hide all sections
            document.querySelectorAll('main > section').forEach(section => {
                section.classList.add('hidden');
            });

            // Show the selected section
            document.getElementById(sectionId + '-section').classList.remove('hidden');
        }

        // Ripple effect for menu items
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

        setTimeout(() => {
            ripple.remove();
        }, 800);
    });
});

// Run on page load to ensure icons are visible
document.addEventListener('DOMContentLoaded', function () {
    fixIconDisplay();
});

// Additional event listeners to ensure icons remain visible during transitions
window.addEventListener('resize', fixIconDisplay);

// Fix any visibility issues when CSS transitions complete
document.addEventListener('transitionend', function (e) {
    if (e.target.classList.contains('icon-wrapper') ||
        e.target.classList.contains('sidebar') ||
        e.target.tagName === 'IMG') {
        fixIconDisplay();
    }
});

// Initialize animations on elements
function initializeAnimations() {
    // Add animation classes to main elements
    document.querySelectorAll('.stats-container .stat-card').forEach((card, index) => {
        card.style.animationDelay = (index * 0.1) + 's';
        card.classList.add('fade-in');
    });

    document.querySelectorAll('.operations-card, .recent-activities').forEach((section, index) => {
        section.style.animationDelay = (index * 0.15 + 0.3) + 's';
        section.classList.add('slide-in');
    });

    // Animate nav menu items
    document.querySelectorAll('.nav-menu li').forEach((item, index) => {
        item.style.animationDelay = (index * 0.05) + 's';
        item.classList.add('fade-in');

        // Add ripple effect to nav items
        item.addEventListener('click', createRipple);
    });
}

// Ripple effect for buttons and clickable elements
function initializeRippleEffect() {
    const buttons = document.querySelectorAll('.btn-primary, .operation-btn, .warehouse-tab');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    ripple.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    ripple.classList.add('ripple');

    // Remove existing ripples
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }

    button.appendChild(ripple);

    // Remove ripple after animation completes
    setTimeout(() => {
        ripple.remove();
    }, 800);
}

// Toast notification system
function initializeToastSystem() {
    // Create toast container if it doesn't exist
    if (!document.querySelector('.toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.querySelector('.toast-container');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Show the toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Hide and remove the toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, duration);
}

// Initialize accordions
function initializeAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const accordion = header.parentElement;
            accordion.classList.toggle('active');
        });
    });
}

// Initialize notification system
function initializeNotifications() {
    // Simulate notifications (in a real app, these would come from backend)
    const notificationItems = document.querySelectorAll('.nav-menu li');

    // Add a notification badge to the first item
    if (notificationItems.length > 0) {
        const badge = document.createElement('span');
        badge.className = 'notification-badge';
        notificationItems[2].querySelector('a').appendChild(badge);
    }
}

// Initialize operation cards
function initializeOperationCards() {
    document.querySelectorAll('.operation-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const operationType = this.classList[1].split('-')[0]; // e.g., add, withdraw, etc.

            // Show a toast message
            showToast(`${operationType} operation selected`, 'info');

            // Add pulse animation to the button
            this.classList.add('pulse-animation');

            // Remove the animation after a delay
            setTimeout(() => {
                this.classList.remove('pulse-animation');
            }, 1500);
        });
    });
}

// Initialize warehouse tabs
function initializeWarehouseTabs() {
    document.querySelectorAll('.warehouse-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active class from all tabs
            document.querySelectorAll('.warehouse-tab').forEach(t => {
                t.classList.remove('active');
            });

            // Add active class to the clicked tab
            this.classList.add('active');

            // In a real app, this would show the selected warehouse's inventory
            // For now, just show a toast
            showToast(`Selected warehouse: ${this.textContent}`, 'info');
        });
    });
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            let isValid = true;
            const formData = {};

            // Validate required fields
            form.querySelectorAll('input, select, textarea').forEach(field => {
                if (field.hasAttribute('required') && !field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');

                    // Add error message if it doesn't exist
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'This field is required';
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
                    }
                } else {
                    field.classList.remove('error');
                    if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                        field.nextElementSibling.remove();
                    }

                    // Collect form data
                    formData[field.name] = field.value;
                }
            });

            if (isValid) {
                // Show loading spinner
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;

                const spinner = document.createElement('div');
                spinner.className = 'loading-spinner';
                spinner.style.width = '20px';
                spinner.style.height = '20px';
                spinner.style.display = 'inline-block';
                spinner.style.marginLeft = '10px';
                submitBtn.appendChild(spinner);

                // Simulate form submission
                setTimeout(() => {
                    // Remove spinner
                    spinner.remove();

                    // Show success message
                    showToast('Form submitted successfully!', 'success');

                    // Reset form
                    form.reset();
                }, 1500);
            } else {
                showToast('Please fill in all required fields', 'error');
            }
        });

        // Remove error state on input
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', function () {
                this.classList.remove('error');
                if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                    this.nextElementSibling.remove();
                }
            });
        });
    });
}

// Search functionality
function initializeSearchFunctionality() {
    const searchInputs = document.querySelectorAll('.inventory-search input');

    searchInputs.forEach(input => {
        input.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();

            // In a real app, this would filter the table rows
            // For now, we'll just show a toast message after a short delay
            clearTimeout(this.searchTimeout);

            this.searchTimeout = setTimeout(() => {
                if (searchTerm) {
                    showToast(`Searching for: ${searchTerm}`, 'info');
                }
            }, 500);
        });
    });
}

// Direction-aware card hover effects
function initializeDirectionAwareCards() {
    document.querySelectorAll('.direction-aware-card').forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const overlay = this.querySelector('.direction-aware-overlay');
            if (!overlay) return;

            const x = e.offsetX;
            const y = e.offsetY;
            const cardWidth = this.offsetWidth;
            const cardHeight = this.offsetHeight;

            const centerX = cardWidth / 2;
            const centerY = cardHeight / 2;

            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;

            overlay.style.transform = `translate(${percentX * 10}px, ${percentY * 10}px)`;
        });

        card.addEventListener('mouseleave', function () {
            const overlay = this.querySelector('.direction-aware-overlay');
            if (!overlay) return;

            overlay.style.transform = 'translate(0, 0)';
        });
    });
}

// Toggle language between RTL and LTR
function toggleLanguage() {
    const htmlElement = document.documentElement;
    const currentDir = htmlElement.getAttribute('dir') || 'rtl';

    if (currentDir === 'rtl') {
        htmlElement.setAttribute('dir', 'ltr');
        showToast('Switched to left-to-right layout', 'info');
    } else {
        htmlElement.setAttribute('dir', 'rtl');
        showToast('Switched to right-to-left layout', 'info');
    }
}

// Add a global progress indicator for page loads and AJAX requests
function initializeProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar progress-indeterminate';

    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';

    progressBar.appendChild(progressFill);
    document.body.prepend(progressBar);

    // Hide the progress bar initially
    progressBar.style.opacity = '0';

    // Show the progress bar when a page is loading or an AJAX request is made
    document.addEventListener('readystatechange', () => {
        if (document.readyState === 'loading') {
            progressBar.style.opacity = '1';
        } else {
            progressBar.style.opacity = '0';
        }
    });

    // Simulate progress updates for AJAX requests
    window.addEventListener('load', () => {
        progressBar.style.opacity = '0';
    });
}

// Initialize modal system
function initializeModalSystem() {
    // Create modal container if it doesn't exist
    if (!document.querySelector('.modal-container')) {
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        document.body.appendChild(modalContainer);
    }
}

// Show modal with custom content
function showModal(title, content, callback) {
    const modalContainer = document.querySelector('.modal-container');

    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button type="button" class="modal-close" aria-label="إغلاق">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;

    modalContainer.appendChild(modal);

    // Show modal with fade-in animation
    setTimeout(() => {
        modal.classList.add('show');

        // Focus first focusable element in modal
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }, 10);

    // Set up close button
    modal.querySelector('.modal-close').addEventListener('click', () => {
        closeModal(modal);
    });

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', function modalEscHandler(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal(modal);
            document.removeEventListener('keydown', modalEscHandler);
        }
    });

    // Trap focus inside modal
    modal.addEventListener('keydown', function trapFocus(e) {
        if (e.key === 'Tab') {
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });

    // Execute callback if provided
    if (callback && typeof callback === 'function') {
        callback(modal);
    }

    return modal;
}

// Show confirmation modal
function showConfirmModal(title, message, confirmCallback, cancelCallback) {
    const content = `
        <p class="confirm-message">${message}</p>
        <div class="button-group">
            <button type="button" class="btn-secondary" id="modal-cancel">إلغاء</button>
            <button type="button" class="btn-primary" id="modal-confirm">تأكيد</button>
        </div>
    `;

    const modal = showModal(title, content);

    // Set up confirm button
    const confirmBtn = modal.querySelector('#modal-confirm');
    confirmBtn.focus();
    confirmBtn.addEventListener('click', () => {
        closeModal(modal);
        if (confirmCallback && typeof confirmCallback === 'function') {
            confirmCallback();
        }
    });

    // Set up cancel button
    const cancelBtn = modal.querySelector('#modal-cancel');
    cancelBtn.addEventListener('click', () => {
        closeModal(modal);
        if (cancelCallback && typeof cancelCallback === 'function') {
            cancelCallback();
        }
    });
}

// Close modal
function closeModal(modalEl) {
    const modal = modalEl || document.querySelector('.modal.show');
    if (modal) {
        modal.classList.remove('show');

        // Return focus to the element that opened the modal
        if (document.activeElement) {
            document.activeElement.blur();
        }

        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Initialize keyboard navigation
function initializeKeyboardNavigation() {
    // Add focus states for keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');

    focusableElements.forEach(el => {
        el.addEventListener('focus', () => {
            el.classList.add('keyboard-focus');
        });

        el.addEventListener('blur', () => {
            el.classList.remove('keyboard-focus');
        });

        el.addEventListener('mousedown', () => {
            el.classList.remove('keyboard-focus');
        });
    });

    // Add skip-to-content link for accessibility
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'الانتقال إلى المحتوى الرئيسي';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Mark the main content area
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('tabindex', '-1');
    }

    // Add keyboard shortcut for operations section navigation
    document.addEventListener('keydown', (e) => {
        // Alt + 1-5 for quick navigation
        if (e.altKey && !e.ctrlKey && !e.shiftKey) {
            const navLinks = document.querySelectorAll('.nav-menu li a[data-section]');

            switch (e.key) {
                case '1': // Dashboard
                    e.preventDefault();
                    navLinks[0].click();
                    break;
                case '2': // Operations
                    e.preventDefault();
                    navLinks[1].click();
                    break;
                case '3': // Inventory
                    e.preventDefault();
                    navLinks[2].click();
                    break;
                case '4': // Reports
                    e.preventDefault();
                    navLinks[3].click();
                    break;
                case '5': // Settings
                    e.preventDefault();
                    navLinks[4].click();
                    break;
            }
        }
    });
}

// Reports section functionality
function initializeReports() {
    const generateReportBtn = document.getElementById('generate-report');
    const exportReportBtn = document.getElementById('export-report');
    const reportTypeSelect = document.getElementById('report-type');

    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }

    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', exportReportToPdf);
    }

    if (reportTypeSelect) {
        reportTypeSelect.addEventListener('change', () => {
            updateReportPreview(reportTypeSelect.value);
        });
    }

    // Set default dates for the date picker
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const dateFromInput = document.getElementById('date-from');
    const dateToInput = document.getElementById('date-to');

    if (dateFromInput && dateToInput) {
        dateFromInput.valueAsDate = oneMonthAgo;
        dateToInput.valueAsDate = today;
    }

    // Initialize the default report
    if (reportTypeSelect) {
        updateReportPreview(reportTypeSelect.value);
    }
}

// Generate a report based on selected options
function generateReport() {
    // Show loading state
    const reportCard = document.querySelector('.report-card');
    reportCard.classList.add('loading');

    // Get report parameters
    const reportType = document.getElementById('report-type').value;
    const warehouseType = document.getElementById('report-warehouse').value;
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;

    // Update report title and date
    document.getElementById('report-title').textContent = getReportTitle(reportType, warehouseType);
    document.getElementById('report-date').textContent = new Date().toLocaleDateString('ar-SA');

    // Simulate API call delay
    setTimeout(() => {
        // Generate report data based on type
        generateReportData(reportType, warehouseType, dateFrom, dateTo);

        // Remove loading state
        reportCard.classList.remove('loading');

        // Show success message
        showToast('تم توليد التقرير بنجاح', 'success');
    }, 1000);
}

// Get report title based on type and warehouse
function getReportTitle(reportType, warehouseType) {
    let title = '';

    switch (reportType) {
        case 'inventory-status':
            title = 'حالة المخزون';
            break;
        case 'operations-summary':
            title = 'ملخص العمليات';
            break;
        case 'item-movement':
            title = 'حركة الأصناف';
            break;
        case 'low-stock':
            title = 'الأصناف منخفضة المخزون';
            break;
        default:
            title = 'تقرير';
    }

    if (warehouseType !== 'all') {
        title += ' - ' + getWarehouseName(warehouseType);
    } else {
        title += ' - جميع المخازن';
    }

    return title;
}

// Generate report data based on report type
function generateReportData(reportType, warehouseType, dateFrom, dateTo) {
    // Get inventory data from localStorage
    const inventoryData = JSON.parse(localStorage.getItem('inventoryData'));
    const operationsLog = JSON.parse(localStorage.getItem('operationsLog'));

    let reportData = {};
    let tableHeaders = [];
    let tableRows = [];

    switch (reportType) {
        case 'inventory-status':
            reportData = generateInventoryStatusReport(inventoryData, warehouseType);
            tableHeaders = ['المخزن', 'عدد الأصناف', 'النسبة المئوية', 'آخر تحديث'];
            tableRows = generateInventoryStatusTable(reportData);
            break;

        case 'operations-summary':
            reportData = generateOperationsSummaryReport(operationsLog, dateFrom, dateTo, warehouseType);
            tableHeaders = ['نوع العملية', 'عدد العمليات', 'النسبة المئوية'];
            tableRows = generateOperationsSummaryTable(reportData);
            break;

        case 'item-movement':
            reportData = generateItemMovementReport(operationsLog, dateFrom, dateTo, warehouseType);
            tableHeaders = ['الصنف', 'الإضافة', 'السحب', 'الإسترجاع', 'الإتلاف', 'الرصيد'];
            tableRows = generateItemMovementTable(reportData);
            break;

        case 'low-stock':
            reportData = generateLowStockReport(inventoryData, warehouseType);
            tableHeaders = ['رقم الصنف', 'اسم الصنف', 'المخزن', 'الكمية الحالية', 'الحد الأدنى'];
            tableRows = generateLowStockTable(reportData);
            break;
    }

    // Update the summary values
    updateReportSummary(reportData, reportType);

    // Update the table
    updateReportTable(tableHeaders, tableRows);

    // Update the chart
    updateReportChart(reportData, reportType);
}

// Generate inventory status report
function generateInventoryStatusReport(inventoryData, warehouseType) {
    const result = {
        labels: [],
        data: [],
        colors: ['#4CAF50', '#2196F3', '#FF9800'],
        totalItems: 0,
        estimatedValue: 0,
        lowStockItems: 0,
        lastUpdate: formatDateShort(new Date())
    };

    // Calculate totals and percentages
    const warehouses = warehouseType === 'all' ? ['durable', 'consumable', 'damaged'] : [warehouseType];

    warehouses.forEach((warehouse, index) => {
        const items = inventoryData[warehouse];
        const count = items.length;
        const warehouseName = getWarehouseName(warehouse);

        result.labels.push(warehouseName);
        result.data.push(count);

        result.totalItems += count;

        // Calculate estimated value (mock data for demo)
        if (warehouse === 'durable') {
            result.estimatedValue += count * 3000; // Average 3000 per item
        } else if (warehouse === 'consumable') {
            result.estimatedValue += count * 500; // Average 500 per item
        }

        // Count low stock items
        result.lowStockItems += items.filter(item => item.status === 'منخفض').length;
    });

    return result;
}

// Generate operations summary report
function generateOperationsSummaryReport(operationsLog, dateFrom, dateTo, warehouseType) {
    const result = {
        labels: ['إضافة', 'سحب', 'إسترجاع', 'إتلاف'],
        data: [0, 0, 0, 0],
        colors: ['#4CAF50', '#F44336', '#2196F3', '#FF9800'],
        totalOperations: 0,
        topOperation: '',
        recentOperation: ''
    };

    // Filter operations by date range and warehouse
    const filteredOperations = operationsLog.filter(op => {
        const opDate = new Date(op.date.replace(/\//g, '-'));
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        toDate.setDate(toDate.getDate() + 1); // Include the end date

        return opDate >= fromDate && opDate <= toDate &&
            (warehouseType === 'all' || getWarehouseTypeByName(op.warehouse) === warehouseType);
    });

    // Count operations by type
    filteredOperations.forEach(op => {
        switch (op.type) {
            case 'إضافة':
                result.data[0]++;
                break;
            case 'سحب':
                result.data[1]++;
                break;
            case 'إسترجاع':
                result.data[2]++;
                break;
            case 'إتلاف':
                result.data[3]++;
                break;
        }

        result.totalOperations++;
    });

    // Find the most common operation type
    const maxIndex = result.data.indexOf(Math.max(...result.data));
    result.topOperation = result.labels[maxIndex];

    // Find the most recent operation
    if (filteredOperations.length > 0) {
        const recentOp = filteredOperations[0];
        result.recentOperation = `${recentOp.type} - ${recentOp.item} (${recentOp.date})`;
    }

    return result;
}

// Generate item movement report
function generateItemMovementReport(operationsLog, dateFrom, dateTo, warehouseType) {
    // This is a more complex report that shows how items move between warehouses
    // For demonstration, we'll create a simplified version
    const result = {
        labels: [],
        data: [],
        colors: [],
        totalMovements: 0,
        mostMovedItem: '',
        lastMovement: ''
    };

    // Filter operations by date range
    const filteredOperations = operationsLog.filter(op => {
        const opDate = new Date(op.date.replace(/\//g, '-'));
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        toDate.setDate(toDate.getDate() + 1); // Include the end date

        return opDate >= fromDate && opDate <= toDate &&
            (warehouseType === 'all' || getWarehouseTypeByName(op.warehouse) === warehouseType);
    });

    // Group operations by item
    const itemMovements = {};

    filteredOperations.forEach(op => {
        if (!itemMovements[op.item]) {
            itemMovements[op.item] = {
                add: 0,
                withdraw: 0,
                return: 0,
                dispose: 0,
                total: 0
            };
        }

        switch (op.type) {
            case 'إضافة':
                itemMovements[op.item].add += parseInt(op.quantity);
                break;
            case 'سحب':
                itemMovements[op.item].withdraw += parseInt(op.quantity);
                break;
            case 'إسترجاع':
                itemMovements[op.item].return += parseInt(op.quantity);
                break;
            case 'إتلاف':
                itemMovements[op.item].dispose += parseInt(op.quantity);
                break;
        }

        itemMovements[op.item].total++;
        result.totalMovements++;
    });

    // Get the top 5 items with most movements
    const sortedItems = Object.entries(itemMovements)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 5);

    sortedItems.forEach(([itemName, movements], index) => {
        result.labels.push(itemName);
        result.data.push(movements.total);
        // Generate a color based on index
        result.colors.push(`hsl(${index * 60}, 70%, 50%)`);
    });

    // Find the most moved item
    if (sortedItems.length > 0) {
        result.mostMovedItem = sortedItems[0][0];
    }

    // Find the last movement
    if (filteredOperations.length > 0) {
        const lastOp = filteredOperations[0];
        result.lastMovement = `${lastOp.type} - ${lastOp.item} (${lastOp.date})`;
    }

    return result;
}

// Generate low stock report
function generateLowStockReport(inventoryData, warehouseType) {
    const result = {
        labels: [],
        data: [],
        colors: [],
        totalLowStock: 0,
        criticalItems: 0,
        warningItems: 0
    };

    // Filter warehouses based on selection
    const warehouses = warehouseType === 'all' ? ['durable', 'consumable', 'damaged'] : [warehouseType];

    // Find low stock items
    const lowStockItems = [];

    warehouses.forEach(warehouse => {
        const items = inventoryData[warehouse];

        items.forEach(item => {
            if (item.status === 'منخفض') {
                lowStockItems.push({
                    code: item.code,
                    name: item.name,
                    warehouse: getWarehouseName(warehouse),
                    quantity: item.quantity,
                    minStock: 5 // Hardcoded for demo
                });

                if (item.quantity <= 2) {
                    result.criticalItems++;
                } else {
                    result.warningItems++;
                }

                result.totalLowStock++;
            }
        });
    });

    // Sort low stock items by quantity (ascending)
    lowStockItems.sort((a, b) => a.quantity - b.quantity);

    // Get the top 5 lowest stock items for the chart
    const topLowStock = lowStockItems.slice(0, 5);

    topLowStock.forEach((item, index) => {
        result.labels.push(item.name);
        result.data.push(item.quantity);

        // Color is more red for lower stock
        const hue = 40 - (index * 8); // From orange-red to deep red
        result.colors.push(`hsl(${hue}, 100%, 50%)`);
    });

    result.allItems = lowStockItems;

    return result;
}

// Update report table with headers and rows
function updateReportTable(headers, rows) {
    const tableHead = document.getElementById('report-table-head');
    const tableBody = document.getElementById('report-table-body');

    if (tableHead && tableBody) {
        // Update headers
        let headerRow = '<tr>';
        headers.forEach(header => {
            headerRow += `<th>${header}</th>`;
        });
        headerRow += '</tr>';
        tableHead.innerHTML = headerRow;

        // Update rows
        tableBody.innerHTML = '';
        rows.forEach(row => {
            tableBody.appendChild(row);
        });
    }
}

// Generate table rows for inventory status report
function generateInventoryStatusTable(reportData) {
    const rows = [];

    reportData.labels.forEach((label, index) => {
        const row = document.createElement('tr');
        const count = reportData.data[index];
        const percentage = (count / reportData.totalItems * 100).toFixed(1);

        row.innerHTML = `
            <td>${label}</td>
            <td>${count}</td>
            <td>${percentage}%</td>
            <td>${reportData.lastUpdate}</td>
        `;

        rows.push(row);
    });

    return rows;
}

// Generate table rows for operations summary report
function generateOperationsSummaryTable(reportData) {
    const rows = [];

    reportData.labels.forEach((label, index) => {
        const row = document.createElement('tr');
        const count = reportData.data[index];
        const percentage = reportData.totalOperations > 0 ?
            (count / reportData.totalOperations * 100).toFixed(1) : '0.0';

        row.innerHTML = `
            <td>${label}</td>
            <td>${count}</td>
            <td>${percentage}%</td>
        `;

        rows.push(row);
    });

    return rows;
}

// Generate table rows for item movement report
function generateItemMovementTable(reportData) {
    // In a real app, this would show detailed movement data per item
    // For demo, we'll show the top items with most operations
    const rows = [];

    reportData.labels.forEach((label, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${label}</td>
            <td>5</td>
            <td>3</td>
            <td>1</td>
            <td>0</td>
            <td>3</td>
        `;

        rows.push(row);
    });

    return rows;
}

// Generate table rows for low stock report
function generateLowStockTable(reportData) {
    const rows = [];

    if (reportData.allItems) {
        reportData.allItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.warehouse}</td>
                <td>${item.quantity}</td>
                <td>${item.minStock}</td>
            `;

            rows.push(row);
        });
    }

    return rows;
}

// Update report summary values
function updateReportSummary(reportData, reportType) {
    const totalItems = document.getElementById('total-items');
    const estimatedValue = document.getElementById('estimated-value');
    const lowStockItems = document.getElementById('low-stock-items');

    switch (reportType) {
        case 'inventory-status':
            totalItems.textContent = reportData.totalItems;
            estimatedValue.textContent = formatCurrency(reportData.estimatedValue);
            lowStockItems.textContent = reportData.lowStockItems;
            break;

        case 'operations-summary':
            totalItems.textContent = reportData.totalOperations;
            estimatedValue.textContent = reportData.topOperation || '-';
            lowStockItems.textContent = reportData.recentOperation || '-';
            break;

        case 'item-movement':
            totalItems.textContent = reportData.totalMovements;
            estimatedValue.textContent = reportData.mostMovedItem || '-';
            lowStockItems.textContent = reportData.lastMovement || '-';
            break;

        case 'low-stock':
            totalItems.textContent = reportData.totalLowStock;
            estimatedValue.textContent = reportData.criticalItems;
            lowStockItems.textContent = reportData.warningItems;
            break;
    }
}

// Format currency value
function formatCurrency(value) {
    return new Intl.NumberFormat('ar-SA', {
        style: 'decimal',
        maximumFractionDigits: 0
    }).format(value) + ' ر.س';
}

// Update the chart visualization based on report data
function updateReportChart(reportData, reportType) {
    // Mock chart update - in a real app, this would use a charting library like Chart.js
    const chartContainer = document.querySelector('.chart-container');

    if (chartContainer) {
        chartContainer.innerHTML = '';

        // Create a simple canvas element
        const canvas = document.createElement('canvas');
        canvas.id = 'report-chart';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        chartContainer.appendChild(canvas);

        // Create a simple bar chart visualization using canvas
        const ctx = canvas.getContext('2d');
        const chartWidth = canvas.width = chartContainer.clientWidth;
        const chartHeight = canvas.height = chartContainer.clientHeight;

        // Draw chart background
        ctx.fillStyle = '#f8f8f8';
        ctx.fillRect(0, 0, chartWidth, chartHeight);

        // Set up chart dimensions
        const padding = 40;
        const chartAreaWidth = chartWidth - (padding * 2);
        const chartAreaHeight = chartHeight - (padding * 2);

        // Draw bars if we have data
        if (reportData.data && reportData.data.length > 0) {
            const barCount = reportData.data.length;
            const barWidth = chartAreaWidth / (barCount * 2);
            const maxValue = Math.max(...reportData.data);

            // Draw bars
            reportData.data.forEach((value, index) => {
                const barHeight = (value / maxValue) * chartAreaHeight;
                const x = padding + (index * (barWidth * 2)) + barWidth / 2;
                const y = chartHeight - padding - barHeight;

                // Bar
                ctx.fillStyle = reportData.colors[index] || '#7f3ac2';
                ctx.fillRect(x, y, barWidth, barHeight);

                // Label
                ctx.fillStyle = '#333';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';

                // Truncate label if too long
                let label = reportData.labels[index];
                if (label.length > 10) {
                    label = label.substring(0, 10) + '...';
                }

                ctx.fillText(label, x + barWidth / 2, chartHeight - padding + 15);

                // Value
                ctx.fillText(value, x + barWidth / 2, y - 10);
            });
        } else {
            // No data message
            ctx.fillStyle = '#999';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('لا توجد بيانات متاحة', chartWidth / 2, chartHeight / 2);
        }
    }
}

// Export report to PDF 
function exportReportToPdf() {
    // Show loading notification
    showToast('جاري تصدير التقرير إلى PDF...', 'info');

    try {
        // Get report data
        const reportTitle = document.getElementById('report-title').textContent;
        const reportDate = document.getElementById('report-date').textContent;
        const tableHeaders = Array.from(document.querySelectorAll('#report-table-head th')).map(th => th.textContent);
        const tableRows = Array.from(document.querySelectorAll('#report-table-body tr')).map(row =>
            Array.from(row.querySelectorAll('td')).map(td => td.textContent)
        );

        // Create new PDF document (RTL supported)
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Set RTL mode for Arabic text
        pdf.setR2L(true);

        // Add custom Arabic font
        pdf.addFont('https://fonts.gstatic.com/s/cairo/v20/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hGA-W1ToLQ-HmkA.woff', 'Cairo', 'normal');
        pdf.setFont('Cairo');

        // Add header
        pdf.setFontSize(22);
        pdf.text(reportTitle, pdf.internal.pageSize.width / 2, 20, { align: 'center' });

        // Add date
        pdf.setFontSize(12);
        pdf.text(`التاريخ: ${reportDate}`, pdf.internal.pageSize.width - 20, 30, { align: 'right' });

        // Add logo placeholder
        pdf.rect(20, 15, 30, 15);
        pdf.setFontSize(8);
        pdf.text('شعار الجامعة', 35, 25, { align: 'center' });

        // Add table using autotable plugin
        pdf.autoTable({
            head: [tableHeaders],
            body: tableRows,
            startY: 40,
            headStyles: {
                fillColor: [127, 58, 194],
                textColor: [255, 255, 255],
                halign: 'center'
            },
            bodyStyles: {
                halign: 'right'
            },
            theme: 'grid',
            styles: {
                font: 'Cairo',
                fontSize: 10
            },
            didDrawPage: function (data) {
                // Add footer
                pdf.setFontSize(10);
                pdf.text('تقرير تم إنشاؤه بواسطة نظام إدارة المخازن - جامعة الملك سعود',
                    pdf.internal.pageSize.width / 2,
                    pdf.internal.pageSize.height - 10,
                    { align: 'center' });

                // Add page number
                pdf.text(`صفحة ${pdf.internal.getCurrentPageInfo().pageNumber}`,
                    pdf.internal.pageSize.width - 20,
                    pdf.internal.pageSize.height - 10,
                    { align: 'right' });
            }
        });

        // Save the PDF with a custom name
        const filename = reportTitle.replace(/ /g, '_') + '_' +
            new Date().toISOString().slice(0, 10).replace(/-/g, '') + '.pdf';
        pdf.save(filename);

        // Show success notification
        showToast('تم تصدير التقرير بنجاح', 'success');
    } catch (error) {
        console.error('Error exporting PDF:', error);
        showToast('حدث خطأ أثناء تصدير التقرير', 'error');
    }
}

// Get warehouse type from its Arabic name
function getWarehouseTypeByName(warehouseName) {
    switch (warehouseName) {
        case 'المستديم':
            return 'durable';
        case 'المستهلك':
            return 'consumable';
        case 'التالف':
            return 'damaged';
        default:
            return warehouseName;
    }
}

// Update report preview based on selected type
function updateReportPreview(reportType) {
    const reportTitle = document.getElementById('report-title');

    if (reportTitle) {
        switch (reportType) {
            case 'inventory-status':
                reportTitle.textContent = 'حالة المخزون الحالي';
                break;
            case 'operations-summary':
                reportTitle.textContent = 'ملخص العمليات';
                break;
            case 'item-movement':
                reportTitle.textContent = 'حركة الأصناف';
                break;
            case 'low-stock':
                reportTitle.textContent = 'الأصناف منخفضة المخزون';
                break;
        }
    }
}

// Initialize operations logs functionality
function initializeLogs() {
    // Load logs from localStorage
    loadOperationsLogs();

    // Set up filter buttons
    const applyFiltersBtn = document.getElementById('apply-log-filters');
    const resetFiltersBtn = document.getElementById('reset-log-filters');

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            loadOperationsLogs();
            showToast('تم تطبيق عوامل التصفية', 'info');
        });
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('log-operation').value = 'all';
            document.getElementById('log-warehouse').value = 'all';
            document.getElementById('log-date-from').value = '';
            document.getElementById('log-date-to').value = '';
            document.getElementById('log-search').value = '';

            loadOperationsLogs();
            showToast('تم إعادة تعيين عوامل التصفية', 'info');
        });
    }

    // Set up pagination
    const pageBtns = document.querySelectorAll('.page-btn');
    pageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const direction = btn.getAttribute('data-page');
            changePage(direction);
        });
    });
}

// Current page for pagination
let currentLogsPage = 1;
const logsPerPage = 10;

// Load and filter operations logs
function loadOperationsLogs() {
    // Reset pagination to first page
    currentLogsPage = 1;
    updatePaginationUI();

    // Get logs from localStorage
    const operationsLog = JSON.parse(localStorage.getItem('operationsLog')) || [];

    // Get filter values
    const operationType = document.getElementById('log-operation').value;
    const warehouseType = document.getElementById('log-warehouse').value;
    const dateFrom = document.getElementById('log-date-from').value;
    const dateTo = document.getElementById('log-date-to').value;
    const searchTerm = document.getElementById('log-search').value.toLowerCase();

    // Apply filters
    let filteredLogs = operationsLog;

    // Filter by operation type
    if (operationType !== 'all') {
        const operationName = getOperationTypeName(operationType);
        filteredLogs = filteredLogs.filter(log => log.type === operationName);
    }

    // Filter by warehouse
    if (warehouseType !== 'all') {
        const warehouseName = getWarehouseName(warehouseType);
        filteredLogs = filteredLogs.filter(log => log.warehouse === warehouseName);
    }

    // Filter by date range
    if (dateFrom) {
        const fromDate = new Date(dateFrom);
        filteredLogs = filteredLogs.filter(log => {
            const logDate = new Date(log.date.replace(/\//g, '-'));
            return logDate >= fromDate;
        });
    }

    if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setDate(toDate.getDate() + 1); // Include the end date
        filteredLogs = filteredLogs.filter(log => {
            const logDate = new Date(log.date.replace(/\//g, '-'));
            return logDate <= toDate;
        });
    }

    // Filter by search term
    if (searchTerm) {
        filteredLogs = filteredLogs.filter(log =>
            log.item.toLowerCase().includes(searchTerm) ||
            log.id.toString().includes(searchTerm)
        );
    }

    // Store filtered logs for pagination
    window.filteredOperationsLogs = filteredLogs;

    // Update logs table
    renderLogsPage();

    // Update pagination
    updatePaginationUI();
}

// Render current page of logs
function renderLogsPage() {
    const logsTableBody = document.getElementById('logs-table-body');
    if (!logsTableBody) return;

    // Clear current content
    logsTableBody.innerHTML = '';

    // Get logs for current page
    const logs = window.filteredOperationsLogs || [];
    const startIndex = (currentLogsPage - 1) * logsPerPage;
    const pageItems = logs.slice(startIndex, startIndex + logsPerPage);

    // If no logs, show message
    if (pageItems.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="8" style="text-align: center;">لا توجد سجلات متاحة</td>`;
        logsTableBody.appendChild(emptyRow);
        return;
    }

    // Add logs to table
    pageItems.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.id}</td>
            <td>${log.type}</td>
            <td>${log.warehouse}</td>
            <td>${log.item}</td>
            <td>${log.quantity} ${log.unit}</td>
            <td>${log.date}</td>
            <td>${log.user}</td>
            <td>
                <button class="action-btn view-btn" data-id="${log.id}">عرض</button>
            </td>
        `;
        logsTableBody.appendChild(row);
    });

    // Add click handlers for view buttons
    document.querySelectorAll('.logs-table .view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const logId = btn.getAttribute('data-id');
            viewLogDetails(logId);
        });
    });
}

// View log details
function viewLogDetails(logId) {
    // Find log entry
    const operationsLog = JSON.parse(localStorage.getItem('operationsLog')) || [];
    const log = operationsLog.find(entry => entry.id.toString() === logId);

    if (log) {
        // Show log details in a modal
        const modalContent = `
            <div class="log-details">
                <div class="detail-row">
                    <span class="detail-label">رقم العملية:</span>
                    <span class="detail-value">${log.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">نوع العملية:</span>
                    <span class="detail-value">${log.type}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">المخزن:</span>
                    <span class="detail-value">${log.warehouse}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">الصنف:</span>
                    <span class="detail-value">${log.item}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">الكمية:</span>
                    <span class="detail-value">${log.quantity} ${log.unit}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">التاريخ:</span>
                    <span class="detail-value">${log.date}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">بواسطة:</span>
                    <span class="detail-value">${log.user}</span>
                </div>
                ${log.notes ? `
                <div class="detail-row">
                    <span class="detail-label">ملاحظات:</span>
                    <span class="detail-value">${log.notes}</span>
                </div>
                ` : ''}
            </div>
        `;

        showModal(`تفاصيل العملية #${log.id}`, modalContent);
    }
}

// Change page in logs pagination
function changePage(direction) {
    const totalLogs = window.filteredOperationsLogs?.length || 0;
    const totalPages = Math.ceil(totalLogs / logsPerPage);

    if (direction === 'next' && currentLogsPage < totalPages) {
        currentLogsPage++;
    } else if (direction === 'prev' && currentLogsPage > 1) {
        currentLogsPage--;
    }

    renderLogsPage();
    updatePaginationUI();
}

// Update pagination display
function updatePaginationUI() {
    const totalLogs = window.filteredOperationsLogs?.length || 0;
    const totalPages = Math.max(1, Math.ceil(totalLogs / logsPerPage));

    document.querySelector('.current-page').textContent = currentLogsPage;
    document.querySelector('.total-pages').textContent = totalPages;

    // Disable/enable pagination buttons
    const prevBtn = document.querySelector('.page-btn[data-page="prev"]');
    const nextBtn = document.querySelector('.page-btn[data-page="next"]');

    if (prevBtn) {
        prevBtn.disabled = currentLogsPage === 1;
        prevBtn.classList.toggle('disabled', currentLogsPage === 1);
    }

    if (nextBtn) {
        nextBtn.disabled = currentLogsPage === totalPages;
        nextBtn.classList.toggle('disabled', currentLogsPage === totalPages);
    }
}

// Initialize settings tab navigation
function initializeSettings() {
    const tabButtons = document.querySelectorAll('.tab-navigation button');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding tab content
            const tabId = button.getAttribute('data-tab');

            // In a real app, this would show/hide different tab contents
            // For demo, just show a toast message
            showToast(`تم تحديد قسم الإعدادات: ${tabId}`, 'info');
        });
    });

    // Set up settings form submission
    const generalSettingsForm = document.getElementById('generalSettingsForm');
    if (generalSettingsForm) {
        generalSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Show success message
            showToast('تم حفظ الإعدادات بنجاح', 'success');
        });
    }
}

// Handle print report functionality
document.getElementById('print-report').addEventListener('click', () => {
    printReport();
});

// Print the current report
function printReport() {
    // Show loading notification
    showToast('جاري تحضير الطباعة...', 'info');

    // Use the browser's print functionality
    window.print();
}

// Update navigation to include reports section
document.addEventListener('DOMContentLoaded', function () {
    // Setup section navigation
    const reportLink = document.querySelector('.nav-menu li a[data-section="reports"]');
    if (reportLink) {
        reportLink.addEventListener('click', function (e) {
            e.preventDefault();
            showSection('reports-section');

            // Update active menu item
            document.querySelectorAll('.nav-menu li').forEach(li => {
                li.classList.remove('active');
            });
            this.parentElement.classList.add('active');
        });
    }
});
