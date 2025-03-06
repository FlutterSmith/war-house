/**
 * Operations Page Module
 * Handles functionality for inventory operations
 */

import InventoryService from '../services/inventory-service.js';
import OperationsService from '../services/operations-service.js';
import LocalStorageAPI from '../api/localStorage.js';
import FormValidator from '../utils/form-validator.js';
import I18n from '../utils/i18n.js';
import Modal from '../components/modal.js';
import Toast from '../components/toast.js';
import DashboardModule from './dashboard.js';

/**
 * Initialize the operations page
 */
function initialize() {
    // Set up operation type selector
    setupOperationTypeSelector();

    // Set up warehouse selector
    setupWarehouseSelector();

    // Set up inventory form submission
    setupInventoryForm();

    // Add autocomplete for item selection
    setupAutoComplete();
}

/**
 * Set up operation type selector
 */
function setupOperationTypeSelector() {
    const operationOptions = document.querySelectorAll('.operation-option');

    operationOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            operationOptions.forEach(opt => {
                opt.classList.remove('active');
            });

            // Add active class to clicked option
            option.classList.add('active');

            // Update operation title and instructions
            updateOperationInstructions();
        });
    });
}

/**
 * Set up warehouse selector
 */
function setupWarehouseSelector() {
    const warehouseOptions = document.querySelectorAll('.warehouse-option');

    warehouseOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            warehouseOptions.forEach(opt => {
                opt.classList.remove('active');
            });

            // Add active class to clicked option
            option.classList.add('active');

            // Update warehouse display
            updateWarehouseDisplay();
        });
    });
}

/**
 * Update operation instructions based on selected operation type
 */
function updateOperationInstructions() {
    const activeOperation = document.querySelector('.operation-option.active');
    const instructionsElement = document.querySelector('.operation-instructions');
    
    if (activeOperation && instructionsElement) {
        const operationType = activeOperation.getAttribute('data-operation');
        
        // Set operation title
        const operationTitle = document.querySelector('.operation-title');
        if (operationTitle) {
            operationTitle.textContent = I18n.getOperationTypeName(operationType);
        }
        
        // Set operation instructions
        switch (operationType) {
            case 'add':
                instructionsElement.textContent = 'قم بإدخال بيانات الصنف المراد إضافته إلى المخزن.';
                break;
            case 'withdraw':
                instructionsElement.textContent = 'قم بإدخال بيانات الصنف المراد سحبه من المخزن.';
                break;
            case 'return':
                instructionsElement.textContent = 'قم بإدخال بيانات الصنف المراد إسترجاعه إلى المخزن.';
                break;
            case 'transfer':
                instructionsElement.textContent = 'قم بإدخال بيانات الصنف المراد نقله بين المخازن.';
                // Add target warehouse selector for transfer operations
                enableTransferOptions();
                break;
            case 'dispose':
                instructionsElement.textContent = 'قم بإدخال بيانات الصنف المراد إتلافه من المخزن.';
                break;
        }
        
        // Hide target warehouse selector if not a transfer operation
        if (operationType !== 'transfer') {
            disableTransferOptions();
        }
    }
}

/**
 * Enable transfer-specific options in the form
 */
function enableTransferOptions() {
    const targetWarehouseRow = document.querySelector('.target-warehouse-row');
    if (targetWarehouseRow) {
        targetWarehouseRow.style.display = 'flex';
    }
}

/**
 * Disable transfer-specific options in the form
 */
function disableTransferOptions() {
    const targetWarehouseRow = document.querySelector('.target-warehouse-row');
    if (targetWarehouseRow) {
        targetWarehouseRow.style.display = 'none';
    }
}

/**
 * Update warehouse display name
 */
function updateWarehouseDisplay() {
    const activeWarehouse = document.querySelector('.warehouse-option.active');
    const warehouseNameElement = document.querySelector('.warehouse-name');
    
    if (activeWarehouse && warehouseNameElement) {
        const warehouseType = activeWarehouse.getAttribute('data-warehouse');
        warehouseNameElement.textContent = I18n.getWarehouseName(warehouseType);
    }
}

/**
 * Set up inventory operation form
 */
function setupInventoryForm() {
    const inventoryForm = document.getElementById('inventoryOperationForm');
    
    if (inventoryForm) {
        // Initialize form validation
        const validateForm = FormValidator.setupInventoryFormValidation(inventoryForm);
        
        // Set up form submission handler
        inventoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                Toast.showToast('يرجى إدخال جميع الحقول المطلوبة بشكل صحيح', 'error');
                return;
            }
            
            // Get active operation and warehouse
            const activeOperation = document.querySelector('.operation-option.active').getAttribute('data-operation');
            const activeWarehouse = document.querySelector('.warehouse-option.active');
            const activeWarehouseType = activeWarehouse.getAttribute('data-warehouse');
            const activeWarehouseName = activeWarehouse.textContent.trim();
            
            // Get form data
            const itemCode = document.getElementById('itemCode').value;
            const itemName = document.getElementById('itemName').value;
            const itemQuantity = parseInt(document.getElementById('itemQuantity').value);
            const itemUnitSelect = document.getElementById('itemUnit');
            const itemUnit = itemUnitSelect.options[itemUnitSelect.selectedIndex].text;
            const notes = document.getElementById('operationNotes').value;
            
            // For transfer operations, get target warehouse
            let targetWarehouse = null;
            if (activeOperation === 'transfer') {
                const targetWarehouseSelect = document.getElementById('targetWarehouse');
                if (targetWarehouseSelect) {
                    targetWarehouse = targetWarehouseSelect.value;
                }
            }
            
            // Create operation data
            const operationData = {
                operation: activeOperation,
                warehouse: activeWarehouseType,
                targetWarehouse: targetWarehouse,
                itemCode: itemCode,
                itemName: itemName,
                itemQuantity: itemQuantity,
                itemUnit: itemUnit,
                notes: notes
            };
            
            // Show confirmation modal
            showOperationConfirmation(operationData, activeWarehouseName);
        });
    }
}

/**
 * Show operation confirmation modal
 * @param {Object} operationData - The operation data
 * @param {string} warehouseName - The source warehouse display name
 */
function showOperationConfirmation(operationData, warehouseName) {
    const message = I18n.getOperationMessage(
        operationData.operation,
        operationData.itemName,
        operationData.itemQuantity,
        operationData.itemUnit,
        warehouseName
    );
    
    // Show confirmation modal
    Modal.showConfirmModal('تأكيد العملية', message, () => {
        // Process the operation
        processOperation(operationData);
    });
}

/**
 * Process the inventory operation
 * @param {Object} operationData - The operation data
 */
function processOperation(operationData) {
    // Use the operations service to perform the operation
    const success = OperationsService.performOperation(operationData, () => {
        // Show success message
        Toast.showToast(I18n.getOperationSuccessMessage(operationData.operation), 'success');
        
        // Reset form
        document.getElementById('inventoryOperationForm').reset();
        
        // Update dashboard stats
        DashboardModule.updateDashboardStats();
        DashboardModule.updateRecentActivities();
    });
    
    if (!success) {
        Toast.showToast('فشلت العملية، يرجى التحقق من صلاحياتك', 'error');
    }
}

/**
 * Set up autocomplete for item code and name
 */
function setupAutoComplete() {
    const itemCodeInput = document.getElementById('itemCode');
    const itemNameInput = document.getElementById('itemName');
    
    if (itemCodeInput && itemNameInput) {
        // When item code is entered, auto-fill the name
        itemCodeInput.addEventListener('blur', () => {
            const code = itemCodeInput.value.trim();
            if (code) {
                const item = LocalStorageAPI.findItemByCode(code);
                if (item) {
                    itemNameInput.value = item.name;
                    
                    // Also set the unit if available
                    const unitSelect = document.getElementById('itemUnit');
                    if (unitSelect) {
                        // Find and select the matching option
                        for (let i = 0; i < unitSelect.options.length; i++) {
                            if (unitSelect.options[i].text === item.unit) {
                                unitSelect.selectedIndex = i;
                                break;
                            }
                        }
                    }
                }
            }
        });
        
        // When item name is entered, auto-fill the code
        itemNameInput.addEventListener('blur', () => {
            const name = itemNameInput.value.trim();
            if (name) {
                const item = LocalStorageAPI.findItemByName(name);
                if (item) {
                    itemCodeInput.value = item.code;
                    
                    // Also set the unit if available
                    const unitSelect = document.getElementById('itemUnit');
                    if (unitSelect) {
                        // Find and select the matching option
                        for (let i = 0; i < unitSelect.options.length; i++) {
                            if (unitSelect.options[i].text === item.unit) {
                                unitSelect.selectedIndex = i;
                                break;
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Set active operation type
 * @param {string} operation - The operation type to set as active
 */
function setActiveOperation(operation) {
    const operationOption = document.querySelector(`.operation-option[data-operation="${operation}"]`);
    if (operationOption) {
        // Remove active class from all options
        document.querySelectorAll('.operation-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        // Add active class to selected option
        operationOption.classList.add('active');
        
        // Update operation instructions
        updateOperationInstructions();
    }
}

/**
 * Set active warehouse
 * @param {string} warehouse - The warehouse type to set as active
 */
function setActiveWarehouse(warehouse) {
    const warehouseOption = document.querySelector(`.warehouse-option[data-warehouse="${warehouse}"]`);
    if (warehouseOption) {
        // Remove active class from all options
        document.querySelectorAll('.warehouse-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        // Add active class to selected option
        warehouseOption.classList.add('active');
        
        // Update warehouse display
        updateWarehouseDisplay();
    }
}

// Export operations module
const OperationsModule = {
    initialize,
    setActiveOperation,
    setActiveWarehouse
};

export default OperationsModule;