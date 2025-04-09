/**
 * Reports Service
 * Provides business logic for generating inventory reports
 */

import LocalStorageAPI from '../api/localStorage.js';
import DateFormatter from '../utils/date-formatter.js';
import I18n from '../utils/i18n.js';

/**
 * Generate inventory status report
 * @param {Object} inventoryData - The inventory data
 * @param {string} warehouseType - The warehouse type ('all' or specific type)
 * @returns {Object} The generated report data
 */
function generateInventoryStatusReport(warehouseType = 'all') {
    const inventoryData = LocalStorageAPI.getInventoryData();
    
    const result = {
        labels: [],
        data: [],
        colors: ['#4CAF50', '#2196F3', '#FF9800'],
        totalItems: 0,
        estimatedValue: 0,
        lowStockItems: 0,
        lastUpdate: DateFormatter.formatDateShort(new Date())
    };

    // Calculate totals and percentages
    const warehouses = warehouseType === 'all' ? ['durable', 'consumable', 'damaged'] : [warehouseType];

    warehouses.forEach((warehouse, index) => {
        const items = inventoryData[warehouse];
        const count = items.length;
        const warehouseName = I18n.getWarehouseName(warehouse);

        result.labels.push(warehouseName);
        result.data.push(count);

        result.totalItems += count;

        // Calculate estimated value (mock data for demonstration)
        if (warehouse === 'durable') {
            result.estimatedValue += count * 3000; // Average 3000 per item
        } else if (warehouse === 'consumable') {
            result.estimatedValue += count * 200; // Average 200 per item
        }

        // Count low stock items
        result.lowStockItems += items.filter(item => item.status === 'منخفض').length;
    });

    return result;
}

/**
 * Generate operations summary report
 * @param {string} dateFrom - Start date
 * @param {string} dateTo - End date
 * @param {string} warehouseType - The warehouse type
 * @returns {Object} The generated report data
 */
function generateOperationsSummaryReport(dateFrom, dateTo, warehouseType = 'all') {
    const operationsLog = LocalStorageAPI.getOperationsLog();
    
    const result = {
        labels: [],
        data: [],
        colors: ['#4CAF50', '#FF5722', '#2196F3', '#FFC107', '#9C27B0'],
        totalOperations: 0,
        lastOperation: '',
        mostCommonOperation: ''
    };

    // Filter operations by date range
    const filteredOperations = operationsLog.filter(op => {
        const opDate = new Date(op.date.replace(/\//g, '-'));
        const fromDate = dateFrom ? new Date(dateFrom.replace(/\//g, '-')) : new Date(0);
        const toDate = dateTo ? new Date(dateTo.replace(/\//g, '-')) : new Date();
        toDate.setDate(toDate.getDate() + 1); // Include end date

        return opDate >= fromDate && opDate <= toDate &&
            (warehouseType === 'all' || op.warehouse === I18n.getWarehouseName(warehouseType));
    });

    // Group operations by type and count them
    const operationCounts = {};
    
    filteredOperations.forEach(op => {
        operationCounts[op.type] = (operationCounts[op.type] || 0) + 1;
    });

    // Convert to array and sort by count (descending)
    const sortedOperations = Object.entries(operationCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([type, count]) => ({ type, count }));

    // Populate result
    sortedOperations.forEach(op => {
        result.labels.push(op.type);
        result.data.push(op.count);
    });

    result.totalOperations = filteredOperations.length;
    
    // Get last operation and most common operation
    if (filteredOperations.length > 0) {
        result.lastOperation = filteredOperations[0].type;
    }
    
    if (sortedOperations.length > 0) {
        result.mostCommonOperation = sortedOperations[0].type;
    }

    return result;
}

/**
 * Generate item movement report
 * @param {string} dateFrom - Start date
 * @param {string} dateTo - End date
 * @param {string} warehouseType - The warehouse type
 * @returns {Object} The generated report data
 */
function generateItemMovementReport(dateFrom, dateTo, warehouseType = 'all') {
    const operationsLog = LocalStorageAPI.getOperationsLog();
    
    const result = {
        labels: [],
        data: [],
        colors: ['#4CAF50', '#FF5722', '#2196F3', '#FFC107', '#9C27B0'],
        totalMovements: 0,
        mostMovedItem: '',
        lastMovement: ''
    };

    // Filter operations by date range
    const filteredOperations = operationsLog.filter(op => {
        const opDate = new Date(op.date.replace(/\//g, '-'));
        const fromDate = dateFrom ? new Date(dateFrom.replace(/\//g, '-')) : new Date(0);
        const toDate = dateTo ? new Date(dateTo.replace(/\//g, '-')) : new Date();
        toDate.setDate(toDate.getDate() + 1); // Include end date

        return opDate >= fromDate && opDate <= toDate &&
            (warehouseType === 'all' || op.warehouse === I18n.getWarehouseName(warehouseType));
    });

    // Group operations by item and count them
    const itemMovements = {};
    
    filteredOperations.forEach(op => {
        if (!itemMovements[op.item]) {
            itemMovements[op.item] = {
                count: 0,
                adds: 0,
                withdraws: 0,
                returns: 0,
                disposes: 0
            };
        }
        
        itemMovements[op.item].count++;
        
        // Count by operation type
        if (op.type === 'إضافة') {
            itemMovements[op.item].adds++;
        } else if (op.type === 'سحب') {
            itemMovements[op.item].withdraws++;
        } else if (op.type === 'إسترجاع') {
            itemMovements[op.item].returns++;
        } else if (op.type === 'إتلاف') {
            itemMovements[op.item].disposes++;
        }
    });

    // Convert to array and sort by total movements (descending)
    const sortedItems = Object.entries(itemMovements)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5) // Take top 5 for the report
        .map(([item, stats]) => ({ item, ...stats }));

    // Populate result
    sortedItems.forEach(item => {
        result.labels.push(item.item);
        result.data.push(item.count);
    });

    result.totalMovements = filteredOperations.length;
    
    // Get most moved item
    if (sortedItems.length > 0) {
        result.mostMovedItem = sortedItems[0].item;
    }
    
    // Get last movement
    if (filteredOperations.length > 0) {
        result.lastMovement = `${filteredOperations[0].type} ${filteredOperations[0].item}`;
    }

    return result;
}

/**
 * Generate low stock report
 * @param {string} warehouseType - The warehouse type
 * @returns {Object} The generated report data
 */
function generateLowStockReport(warehouseType = 'all') {
    const inventoryData = LocalStorageAPI.getInventoryData();
    
    const result = {
        labels: [],
        data: [],
        colors: ['#FF5722', '#FFC107', '#F44336'],
        totalItems: 0,
        warningItems: 0,
        criticalItems: 0,
        lastUpdate: DateFormatter.formatDateShort(new Date())
    };

    // Get all warehouses or just the specified one
    const warehouses = warehouseType === 'all' ? ['durable', 'consumable'] : [warehouseType];
    
    // Find all low stock items
    let lowStockItems = [];
    
    warehouses.forEach(warehouse => {
        if (warehouse !== 'damaged') { // Skip damaged warehouse
            const items = inventoryData[warehouse];
            lowStockItems = [...lowStockItems, ...items.filter(item => item.status === 'منخفض')];
        }
    });

    // Sort items by quantity (ascending)
    lowStockItems.sort((a, b) => a.quantity - b.quantity);
    
    // Take top 10 for the report
    const topItems = lowStockItems.slice(0, 10);
    
    // Populate result
    topItems.forEach(item => {
        result.labels.push(item.name);
        result.data.push(item.quantity);
    });

    result.totalItems = lowStockItems.length;
    
    // Categorize by severity
    result.warningItems = lowStockItems.filter(item => item.quantity > 0).length;
    result.criticalItems = lowStockItems.filter(item => item.quantity === 0).length;

    return result;
}

// Export reports service functions
const ReportsService = {
    generateInventoryStatusReport,
    generateOperationsSummaryReport,
    generateItemMovementReport,
    generateLowStockReport
};

export default ReportsService;