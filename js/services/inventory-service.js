/**
 * Inventory Service
 * Provides business logic for inventory management
 */

import LocalStorageAPI from '../api/localStorage.js';
import DateFormatter from '../utils/date-formatter.js';
import I18n from '../utils/i18n.js';
import Toast from '../components/toast.js';

// Minimum quantity threshold for low stock warning
const MIN_STOCK_LEVEL = 5;

/**
 * Process an inventory operation (add, withdraw, return, dispose)
 * @param {Object} operationData - The operation data
 * @param {string} operationData.operation - The operation type (add, withdraw, return, dispose)
 * @param {string} operationData.warehouse - The warehouse type
 * @param {string} operationData.itemCode - The item code
 * @param {string} operationData.itemName - The item name
 * @param {number} operationData.itemQuantity - The item quantity
 * @param {string} operationData.itemUnit - The item unit
 * @param {string} operationData.notes - Optional notes
 * @returns {boolean} Whether the operation was successful
 */
function processInventoryOperation(operationData) {
    // Get current inventory data
    const inventoryData = LocalStorageAPI.getInventoryData();
    
    // Get current user data
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userName = currentUser ? currentUser.name : 'مستخدم النظام';

    // Add operation to log with translated names
    const operationLogData = {
        ...operationData,
        operationTypeName: I18n.getOperationTypeName(operationData.operation),
        warehouseName: I18n.getWarehouseName(operationData.warehouse)
    };
    
    LocalStorageAPI.addOperationLog(operationLogData, userName);

    // Update inventory data based on operation type
    const warehouseItems = inventoryData[operationData.warehouse];
    let existingItemIndex = warehouseItems.findIndex(item => item.code === operationData.itemCode);

    switch (operationData.operation) {
        case 'add':
            if (existingItemIndex >= 0) {
                // Item exists, update quantity
                warehouseItems[existingItemIndex].quantity += operationData.itemQuantity;
                warehouseItems[existingItemIndex].lastUpdate = DateFormatter.formatDateShort(new Date());
            } else {
                // New item
                warehouseItems.push({
                    code: operationData.itemCode,
                    name: operationData.itemName,
                    quantity: operationData.itemQuantity,
                    unit: operationData.itemUnit,
                    lastUpdate: DateFormatter.formatDateShort(new Date()),
                    status: 'متوفر'
                });
            }
            break;

        case 'withdraw':
            if (existingItemIndex >= 0) {
                // Update quantity
                warehouseItems[existingItemIndex].quantity -= operationData.itemQuantity;

                // Check if quantity is low
                if (warehouseItems[existingItemIndex].quantity <= MIN_STOCK_LEVEL) {
                    warehouseItems[existingItemIndex].status = 'منخفض';
                }

                warehouseItems[existingItemIndex].lastUpdate = DateFormatter.formatDateShort(new Date());
            }
            break;

        case 'return':
            if (existingItemIndex >= 0) {
                // Update quantity
                warehouseItems[existingItemIndex].quantity += operationData.itemQuantity;

                // Check if quantity is no longer low
                if (warehouseItems[existingItemIndex].quantity > MIN_STOCK_LEVEL && 
                    warehouseItems[existingItemIndex].status === 'منخفض') {
                    warehouseItems[existingItemIndex].status = 'متوفر';
                }

                warehouseItems[existingItemIndex].lastUpdate = DateFormatter.formatDateShort(new Date());
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
                    warehouseItems[existingItemIndex].lastUpdate = DateFormatter.formatDateShort(new Date());
                }

                // Add to damaged warehouse
                const damagedItems = inventoryData.damaged;
                const existingDamagedIndex = damagedItems.findIndex(item => item.code === operationData.itemCode);

                if (existingDamagedIndex >= 0) {
                    damagedItems[existingDamagedIndex].quantity += operationData.itemQuantity;
                    damagedItems[existingDamagedIndex].lastUpdate = DateFormatter.formatDateShort(new Date());
                } else {
                    damagedItems.push({
                        code: operationData.itemCode,
                        name: operationData.itemName,
                        quantity: operationData.itemQuantity,
                        unit: operationData.itemUnit,
                        lastUpdate: DateFormatter.formatDateShort(new Date()),
                        status: 'للإتلاف'
                    });
                }
            }
            break;
    }

    // Save updated inventory data
    LocalStorageAPI.saveInventoryData(inventoryData);
    
    return true;
}

/**
 * Calculate dashboard statistics
 * @returns {Object} Dashboard statistics
 */
function calculateDashboardStats() {
    const inventoryData = LocalStorageAPI.getInventoryData();

    // Calculate stats for each warehouse
    const durableCount = inventoryData.durable.reduce((sum, item) => sum + item.quantity, 0);
    const consumableCount = inventoryData.consumable.reduce((sum, item) => sum + item.quantity, 0);
    const damagedCount = inventoryData.damaged.reduce((sum, item) => sum + item.quantity, 0);
    const totalCount = durableCount + consumableCount + damagedCount;

    // Calculate low stock items
    const lowStockCount = [
        ...inventoryData.durable.filter(item => item.status === 'منخفض'),
        ...inventoryData.consumable.filter(item => item.status === 'منخفض')
    ].length;

    return {
        durableCount,
        consumableCount,
        damagedCount,
        totalCount,
        lowStockCount
    };
}

/**
 * Filter inventory data by warehouse and search term
 * @param {string} warehouseType - The warehouse type
 * @param {string} searchTerm - The search term
 * @returns {Array} Filtered inventory items
 */
function filterInventoryData(warehouseType, searchTerm = '') {
    const inventoryData = LocalStorageAPI.getInventoryData();
    
    if (!inventoryData || !inventoryData[warehouseType]) {
        return [];
    }
    
    const items = inventoryData[warehouseType];
    
    if (!searchTerm) {
        return items;
    }
    
    // Filter by search term
    const lowerSearchTerm = searchTerm.toLowerCase();
    return items.filter(item =>
        item.name.toLowerCase().includes(lowerSearchTerm) ||
        item.code.toLowerCase().includes(lowerSearchTerm)
    );
}

// Export inventory service functions
const InventoryService = {
    processInventoryOperation,
    calculateDashboardStats,
    filterInventoryData,
    MIN_STOCK_LEVEL
};

export default InventoryService;