/**
 * LocalStorage API
 * Provides data storage and retrieval functionality for the application
 */

import DateFormatter from '../utils/date-formatter.js';

/**
 * Initialize localStorage with sample data if needed
 */
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

/**
 * Get all inventory data
 * @returns {Object} The inventory data object
 */
function getInventoryData() {
    const data = localStorage.getItem('inventoryData');
    return data ? JSON.parse(data) : null;
}

/**
 * Save inventory data
 * @param {Object} data - The inventory data object
 */
function saveInventoryData(data) {
    localStorage.setItem('inventoryData', JSON.stringify(data));
}

/**
 * Get operations log
 * @returns {Array} The operations log array
 */
function getOperationsLog() {
    const log = localStorage.getItem('operationsLog');
    return log ? JSON.parse(log) : [];
}

/**
 * Save operations log
 * @param {Array} log - The operations log array
 */
function saveOperationsLog(log) {
    localStorage.setItem('operationsLog', JSON.stringify(log));
}

/**
 * Get next operation ID
 * @returns {number} The next operation ID
 */
function getNextOperationId() {
    const id = localStorage.getItem('nextOperationId');
    return id ? parseInt(id) : 1000;
}

/**
 * Increment and save next operation ID
 * @returns {number} The incremented operation ID
 */
function incrementOperationId() {
    const nextId = getNextOperationId() + 1;
    localStorage.setItem('nextOperationId', nextId.toString());
    return nextId;
}

/**
 * Find an item by code in any warehouse
 * @param {string} code - The item code
 * @returns {Object|null} The item object or null if not found
 */
function findItemByCode(code) {
    const inventoryData = getInventoryData();
    if (!inventoryData) return null;

    const warehouseTypes = ['durable', 'consumable', 'damaged'];

    for (const type of warehouseTypes) {
        const items = inventoryData[type];
        const item = items.find(item => item.code === code);
        if (item) {
            return { ...item, warehouseType: type };
        }
    }

    return null;
}

/**
 * Find an item by name in any warehouse
 * @param {string} name - The item name
 * @returns {Object|null} The item object or null if not found
 */
function findItemByName(name) {
    const inventoryData = getInventoryData();
    if (!inventoryData) return null;

    const warehouseTypes = ['durable', 'consumable', 'damaged'];

    for (const type of warehouseTypes) {
        const items = inventoryData[type];
        const item = items.find(item => item.name === name);
        if (item) {
            return { ...item, warehouseType: type };
        }
    }

    return null;
}

/**
 * Add a new operation log
 * @param {Object} operationData - The operation data
 * @param {string} userName - The user who performed the operation
 * @returns {Object} The created operation log entry
 */
function addOperationLog(operationData, userName) {
    const operationsLog = getOperationsLog();
    const nextOpId = incrementOperationId();

    const operationLog = {
        id: nextOpId,
        type: operationData.operationTypeName,
        warehouse: operationData.warehouseName,
        item: operationData.itemName,
        quantity: operationData.itemQuantity.toString(),
        unit: operationData.itemUnit,
        date: DateFormatter.formatDateShort(new Date()),
        user: userName,
        notes: operationData.notes || ''
    };

    operationsLog.unshift(operationLog); // Add to beginning of array
    saveOperationsLog(operationsLog);

    return operationLog;
}

// Export localStorage API functions
const LocalStorageAPI = {
    initializeLocalStorage,
    getInventoryData,
    saveInventoryData,
    getOperationsLog,
    saveOperationsLog,
    getNextOperationId,
    incrementOperationId,
    findItemByCode,
    findItemByName,
    addOperationLog
};

export default LocalStorageAPI;