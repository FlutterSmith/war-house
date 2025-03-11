/**
 * Inventory Page Module
 * Handles functionality for the inventory page
 */

import InventoryService from '../services/inventory-service.js';
import Toast from '../components/toast.js';
import Modal from '../components/modal.js';
import I18n from '../utils/i18n.js';

/**
 * Initialize the inventory page
 */
function initialize() {
    // Set up warehouse tabs
    setupWarehouseTabs();

    // Set up search functionality
    setupSearchFunctionality();

    // Load initial inventory data (default: durable warehouse)
    loadInventoryData('durable');

    // Set up action buttons for inventory items
    setupActionButtons();
}

/**
 * Set up inventory tabs for different warehouses
 */
function setupWarehouseTabs() {
    const warehouseTabs = document.querySelectorAll('.warehouse-tab');

    warehouseTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            warehouseTabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Get warehouse type from data attribute
            const warehouseType = tab.getAttribute('data-warehouse');

            // Load inventory data for selected warehouse
            loadInventoryData(warehouseType);
        });
    });
}

/**
 * Set up search functionality
 */
function setupSearchFunctionality() {
    const searchInput = document.getElementById('inventorySearch');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            const activeWarehouse = document.querySelector('.warehouse-tab.active');

            if (activeWarehouse) {
                const warehouseType = activeWarehouse.getAttribute('data-warehouse');
                filterAndDisplayInventory(warehouseType, searchTerm);
            }
        });
    }
}

/**
 * Filter and display inventory based on warehouse type and search term
 * @param {string} warehouseType - The warehouse type
 * @param {string} searchTerm - The search term
 */
function filterAndDisplayInventory(warehouseType, searchTerm = '') {
    // Get filtered inventory items
    const filteredItems = InventoryService.filterInventoryData(warehouseType, searchTerm);

    // Render the inventory table with the filtered data
    renderInventoryTable(filteredItems);
}

/**
 * Load inventory data for a specific warehouse
 * @param {string} warehouseType - The warehouse type to load
 */
function loadInventoryData(warehouseType) {
    // Get search term (if any)
    const searchInput = document.getElementById('inventorySearch');
    const searchTerm = searchInput ? searchInput.value.trim() : '';

    // Filter and display inventory
    filterAndDisplayInventory(warehouseType, searchTerm);

    // Update warehouse name display
    const warehouseNameElement = document.querySelector('.warehouse-name');
    if (warehouseNameElement) {
        warehouseNameElement.textContent = I18n.getWarehouseName(warehouseType);
    }
}

/**
 * Render inventory data to the table
 * @param {Array} data - The inventory items to render
 */
function renderInventoryTable(data) {
    const tableBody = document.querySelector('.inventory-table tbody');
    if (!tableBody) return;

    // Clear existing table rows
    tableBody.innerHTML = '';

    // Show message if no items found
    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="no-data">لا توجد أصناف في هذا المخزن</td>
            </tr>
        `;
        return;
    }

    // Add rows for each item
    data.forEach(item => {
        const row = document.createElement('tr');
        row.dataset.itemCode = item.code;

        row.innerHTML = `
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            <td>${item.lastUpdate}</td>
            <td class="${getStatusClass(item.status)}">${item.status}</td>
            <td class="actions">
                <button class="btn-icon view-item" title="عرض التفاصيل">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon edit-item" title="تعديل">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Reattach event listeners for action buttons
    setupActionButtons();
}

/**
 * Get CSS class based on item status
 * @param {string} status - The item status
 * @returns {string} The CSS class
 */
function getStatusClass(status) {
    switch (status) {
        case 'متوفر':
            return 'status-available';
        case 'منخفض':
            return 'status-low';
        case 'للإتلاف':
        case 'للإصلاح':
            return 'status-damaged';
        default:
            return '';
    }
}

/**
 * Set up action buttons in the inventory table
 */
function setupActionButtons() {
    // View item buttons
    document.querySelectorAll('.view-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('tr');
            const itemCode = row.dataset.itemCode;
            viewItemDetails(itemCode);
        });
    });

    // Edit item buttons
    document.querySelectorAll('.edit-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('tr');
            const itemCode = row.dataset.itemCode;
            editItemDetails(itemCode);
        });
    });
}

/**
 * View item details in a modal
 * @param {string} itemCode - The item code
 */
function viewItemDetails(itemCode) {
    const item = findItemByCode(itemCode);

    if (item) {
        Modal.showModal('تفاصيل الصنف', `
            <div class="item-details">
                <div class="detail-row">
                    <span class="detail-label">رقم الصنف:</span>
                    <span class="detail-value">${item.code}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">اسم الصنف:</span>
                    <span class="detail-value">${item.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">الكمية:</span>
                    <span class="detail-value">${item.quantity} ${item.unit}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">الحالة:</span>
                    <span class="detail-value ${getStatusClass(item.status)}">${item.status}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">تاريخ آخر تحديث:</span>
                    <span class="detail-value">${item.lastUpdate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">المخزن:</span>
                    <span class="detail-value">${I18n.getWarehouseName(item.warehouseType)}</span>
                </div>
            </div>
        `);
    } else {
        Toast.showToast('لم يتم العثور على الصنف', 'error');
    }
}

/**
 * Edit item details
 * @param {string} itemCode - The item code
 */
function editItemDetails(itemCode) {
    const item = findItemByCode(itemCode);

    if (item) {
        Modal.showModal('تعديل بيانات الصنف', `
            <form id="edit-item-form" class="form-vertical">
                <div class="form-row">
                    <label for="edit-item-code">رقم الصنف</label>
                    <input type="text" id="edit-item-code" value="${item.code}" disabled>
                </div>
                <div class="form-row">
                    <label for="edit-item-name">اسم الصنف</label>
                    <input type="text" id="edit-item-name" value="${item.name}" required>
                </div>
                <div class="form-row">
                    <label for="edit-item-quantity">الكمية</label>
                    <input type="number" id="edit-item-quantity" value="${item.quantity}" min="0" required>
                </div>
                <div class="form-row">
                    <label for="edit-item-unit">الوحدة</label>
                    <select id="edit-item-unit" required>
                        <option value="قطعة" ${item.unit === 'قطعة' ? 'selected' : ''}>قطعة</option>
                        <option value="جهاز" ${item.unit === 'جهاز' ? 'selected' : ''}>جهاز</option>
                        <option value="رزمة" ${item.unit === 'رزمة' ? 'selected' : ''}>رزمة</option>
                        <option value="عبوة" ${item.unit === 'عبوة' ? 'selected' : ''}>عبوة</option>
                    </select>
                </div>
                <div class="form-row">
                    <label for="edit-item-status">الحالة</label>
                    <select id="edit-item-status" required>
                        <option value="متوفر" ${item.status === 'متوفر' ? 'selected' : ''}>متوفر</option>
                        <option value="منخفض" ${item.status === 'منخفض' ? 'selected' : ''}>منخفض</option>
                        <option value="للإصلاح" ${item.status === 'للإصلاح' ? 'selected' : ''}>للإصلاح</option>
                        <option value="للإتلاف" ${item.status === 'للإتلاف' ? 'selected' : ''}>للإتلاف</option>
                    </select>
                </div>
                <div class="form-row btn-container">
                    <button type="submit" class="btn-primary">حفظ التغييرات</button>
                </div>
            </form>
        `, () => {
            // Form submission handler
            const form = document.getElementById('edit-item-form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                saveItemChanges(item.warehouseType, {
                    code: item.code,
                    name: document.getElementById('edit-item-name').value,
                    quantity: parseInt(document.getElementById('edit-item-quantity').value),
                    unit: document.getElementById('edit-item-unit').value,
                    status: document.getElementById('edit-item-status').value,
                    lastUpdate: new Date().toLocaleDateString('en-CA').replace(/-/g, '/')
                });
            });
        });
    } else {
        Toast.showToast('لم يتم العثور على الصنف', 'error');
    }
}

/**
 * Save changes made to an item
 * @param {string} warehouseType - The warehouse type
 * @param {Object} updatedItem - The updated item data
 */
function saveItemChanges(warehouseType, updatedItem) {
    // Get current inventory data
    const inventoryData = JSON.parse(localStorage.getItem('inventoryData'));

    // Find the item in the inventory
    const items = inventoryData[warehouseType];
    const itemIndex = items.findIndex(item => item.code === updatedItem.code);

    if (itemIndex >= 0) {
        // Update the item
        items[itemIndex] = updatedItem;

        // Save updated inventory data
        localStorage.setItem('inventoryData', JSON.stringify(inventoryData));

        // Reload inventory data
        loadInventoryData(warehouseType);

        // Close modal
        Modal.closeModal();

        // Show success message
        Toast.showToast('تم تحديث بيانات الصنف بنجاح', 'success');
    }
}

/**
 * Find an item by its code
 * @param {string} code - The item code
 * @returns {Object|null} The item object or null if not found
 */
function findItemByCode(code) {
    // Get current inventory data
    const inventoryData = JSON.parse(localStorage.getItem('inventoryData'));

    // Check all warehouses
    for (const warehouseType in inventoryData) {
        const foundItem = inventoryData[warehouseType].find(item => item.code === code);
        if (foundItem) {
            return { ...foundItem, warehouseType };
        }
    }

    return null;
}

// Export inventory module
const InventoryModule = {
    initialize,
    loadInventoryData
};

export default InventoryModule;