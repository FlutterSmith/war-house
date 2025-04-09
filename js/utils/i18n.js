/**
 * Internationalization Utility
 * Provides translation and localization functions for the application
 */

/**
 * Get display name for user role
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

/**
 * Get operation type name in Arabic
 * @param {string} operation - The operation type code
 * @returns {string} The localized operation name
 */
function getOperationTypeName(operation) {
    const operationNames = {
        'add': 'إضافة',
        'withdraw': 'سحب',
        'return': 'إسترجاع',
        'transfer': 'نقل',
        'dispose': 'إتلاف'
    };

    return operationNames[operation] || operation;
}

/**
 * Get warehouse name in Arabic
 * @param {string} warehouseType - The warehouse type code
 * @returns {string} The localized warehouse name
 */
function getWarehouseName(warehouseType) {
    const warehouseNames = {
        'durable': 'المستديم',
        'consumable': 'المستهلك',
        'damaged': 'التالف'
    };

    return warehouseNames[warehouseType] || warehouseType;
}

/**
 * Get appropriate confirmation message based on operation type
 * @param {string} operation - The operation type
 * @param {string} itemName - The item name
 * @param {number} quantity - The quantity
 * @param {string} unit - The unit
 * @param {string} warehouse - The warehouse name
 * @returns {string} The confirmation message
 */
function getOperationMessage(operation, itemName, quantity, unit, warehouse) {
    switch (operation) {
        case 'add':
            return `هل أنت متأكد من إضافة ${quantity} ${unit} من ${itemName} إلى مخزن ${warehouse}؟`;
        case 'withdraw':
            return `هل أنت متأكد من سحب ${quantity} ${unit} من ${itemName} من مخزن ${warehouse}؟`;
        case 'return':
            return `هل أنت متأكد من إسترجاع ${quantity} ${unit} من ${itemName} إلى مخزن ${warehouse}؟`;
        case 'transfer':
            return `هل أنت متأكد من نقل ${quantity} ${unit} من ${itemName} من مخزن ${warehouse}؟`;
        case 'dispose':
            return `هل أنت متأكد من إتلاف ${quantity} ${unit} من ${itemName} من مخزن ${warehouse}؟`;
        default:
            return `هل أنت متأكد من تنفيذ العملية على ${quantity} ${unit} من ${itemName} في مخزن ${warehouse}؟`;
    }
}

/**
 * Get success message based on operation type
 * @param {string} operation - The operation type
 * @returns {string} The success message
 */
function getOperationSuccessMessage(operation) {
    switch (operation) {
        case 'add':
            return 'تمت إضافة الصنف بنجاح';
        case 'withdraw':
            return 'تم سحب الصنف بنجاح';
        case 'return':
            return 'تم إسترجاع الصنف بنجاح';
        case 'transfer':
            return 'تم نقل الصنف بنجاح';
        case 'dispose':
            return 'تم إتلاف الصنف بنجاح';
        default:
            return 'تمت العملية بنجاح';
    }
}

/**
 * Get report title based on type and warehouse
 * @param {string} reportType - The report type
 * @param {string} warehouseType - The warehouse type
 * @returns {string} The report title
 */
function getReportTitle(reportType, warehouseType) {
    let title = '';
    const warehouseName = warehouseType === 'all' ? 'كل المخازن' : getWarehouseName(warehouseType);

    switch (reportType) {
        case 'inventory-status':
            title = `تقرير حالة المخزون - ${warehouseName}`;
            break;
        case 'operations-summary':
            title = `ملخص العمليات - ${warehouseName}`;
            break;
        case 'item-movement':
            title = `حركة الأصناف - ${warehouseName}`;
            break;
        case 'low-stock':
            title = `تقرير الأصناف منخفضة المخزون - ${warehouseName}`;
            break;
        default:
            title = `تقرير المخزن - ${warehouseName}`;
    }

    return title;
}

/**
 * Toggle language between RTL and LTR
 * @returns {string} The new direction
 */
function toggleLanguage() {
    const htmlElement = document.documentElement;
    const currentDir = htmlElement.getAttribute('dir') || 'rtl';

    if (currentDir === 'rtl') {
        htmlElement.setAttribute('dir', 'ltr');
        htmlElement.lang = 'en';
        return 'ltr';
    } else {
        htmlElement.setAttribute('dir', 'rtl');
        htmlElement.lang = 'ar';
        return 'rtl';
    }
}

// Export i18n functions
const I18n = {
    getRoleDisplayName,
    getOperationTypeName,
    getWarehouseName,
    getOperationMessage,
    getOperationSuccessMessage,
    getReportTitle,
    toggleLanguage
};

export default I18n;