/**
 * Operations Service
 * Provides business logic for inventory operations
 */

import LocalStorageAPI from '../api/localStorage.js';
import InventoryService from './inventory-service.js';
import Auth from '../auth/auth.js';
import I18n from '../utils/i18n.js';

/**
 * Perform an inventory operation
 * @param {Object} operationData - The operation data
 * @param {Function} [successCallback] - Callback to execute on success
 * @returns {boolean} Whether the operation was successful
 */
function performOperation(operationData, successCallback) {
    // Check if user has permission to perform this operation
    if (!Auth.hasPermission('editInventory')) {
        return false;
    }
    
    // Process the operation
    const success = InventoryService.processInventoryOperation(operationData);
    
    if (success && typeof successCallback === 'function') {
        successCallback();
    }
    
    return success;
}

/**
 * Get recent operations for the dashboard
 * @param {number} limit - Maximum number of operations to return
 * @returns {Array} Recent operations
 */
function getRecentOperations(limit = 4) {
    const operationsLog = LocalStorageAPI.getOperationsLog();
    return operationsLog.slice(0, limit);
}

/**
 * Filter operations log
 * @param {Object} filters - The filters to apply
 * @param {string} [filters.operationType='all'] - Operation type filter
 * @param {string} [filters.warehouseType='all'] - Warehouse type filter
 * @param {string} [filters.dateFrom=''] - Start date filter
 * @param {string} [filters.dateTo=''] - End date filter
 * @param {string} [filters.searchTerm=''] - Search term
 * @returns {Array} Filtered operations
 */
function filterOperationsLog(filters) {
    const {
        operationType = 'all',
        warehouseType = 'all',
        dateFrom = '',
        dateTo = '',
        searchTerm = ''
    } = filters;

    let filteredLogs = LocalStorageAPI.getOperationsLog();

    // Filter by operation type
    if (operationType !== 'all') {
        const operationName = I18n.getOperationTypeName(operationType);
        filteredLogs = filteredLogs.filter(log => log.type === operationName);
    }

    // Filter by warehouse
    if (warehouseType !== 'all') {
        const warehouseName = I18n.getWarehouseName(warehouseType);
        filteredLogs = filteredLogs.filter(log => log.warehouse === warehouseName);
    }

    // Filter by date range
    if (dateFrom) {
        const fromDate = new Date(dateFrom.replace(/\//g, '-'));
        filteredLogs = filteredLogs.filter(log => {
            const logDate = new Date(log.date.replace(/\//g, '-'));
            return logDate >= fromDate;
        });
    }

    if (dateTo) {
        const toDate = new Date(dateTo.replace(/\//g, '-'));
        toDate.setDate(toDate.getDate() + 1); // Include the end date
        filteredLogs = filteredLogs.filter(log => {
            const logDate = new Date(log.date.replace(/\//g, '-'));
            return logDate <= toDate;
        });
    }

    // Filter by search term
    if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filteredLogs = filteredLogs.filter(log =>
            log.item.toLowerCase().includes(lowerSearchTerm) ||
            log.id.toString().includes(lowerSearchTerm)
        );
    }

    return filteredLogs;
}

/**
 * Get operation log by ID
 * @param {string|number} logId - The log ID to find
 * @returns {Object|null} The operation log or null if not found
 */
function getOperationLogById(logId) {
    const operationsLog = LocalStorageAPI.getOperationsLog();
    return operationsLog.find(entry => entry.id.toString() === logId.toString()) || null;
}

// Export operations service functions
const OperationsService = {
    performOperation,
    getRecentOperations,
    filterOperationsLog,
    getOperationLogById
};

export default OperationsService;