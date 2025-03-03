/**
 * Dashboard Page Module
 * Handles functionality for the dashboard page
 */

import InventoryService from '../services/inventory-service.js';
import OperationsService from '../services/operations-service.js';
import Animations from '../utils/animations.js';

/**
 * Initialize the dashboard page
 */
function initialize() {
    // Update dashboard statistics
    updateDashboardStats();
    
    // Update recent activities
    updateRecentActivities();
    
    // Initialize dashboard UI interactions
    initializeDashboardInteractions();
}

/**
 * Update dashboard statistics
 */
function updateDashboardStats() {
    const stats = InventoryService.calculateDashboardStats();
    
    // Update stat cards with animation
    updateStatCard('total-count', stats.totalCount);
    updateStatCard('durable-count', stats.durableCount);
    updateStatCard('consumable-count', stats.consumableCount);
    updateStatCard('damaged-count', stats.damagedCount);
    updateStatCard('low-stock-count', stats.lowStockCount);
}

/**
 * Update a stat card with animation
 * @param {string} elementId - The ID of the stat element
 * @param {number} newValue - The new value to display
 */
function updateStatCard(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (element) {
        Animations.updateStatWithAnimation(element, newValue);
    }
}

/**
 * Update recent activities table in dashboard
 */
function updateRecentActivities() {
    // Get the most recent operations
    const recentOps = OperationsService.getRecentOperations(4);

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

/**
 * Initialize dashboard UI interactions
 */
function initializeDashboardInteractions() {
    // Set up quick action buttons
    setupQuickActionButtons();
}

/**
 * Set up quick action buttons on dashboard
 */
function setupQuickActionButtons() {
    const operationButtons = document.querySelectorAll('.operation-btn');
    
    operationButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const operationType = this.classList[1].split('-')[0]; // e.g., add, withdraw, etc.
            
            // Navigate to operations section with correct operation type selected
            navigateToOperations(operationType);
            
            // Add pulse animation to the button
            this.classList.add('pulse-animation');
            
            // Remove the animation after a delay
            setTimeout(() => {
                this.classList.remove('pulse-animation');
            }, 1500);
        });
    });
}

/**
 * Navigate to operations section with a specific operation type
 * @param {string} operationType - The operation type to select
 */
function navigateToOperations(operationType) {
    // Get the operations section and navigation link
    const operationsSection = document.getElementById('operations-section');
    const operationsLink = document.querySelector('.nav-menu li a[data-section="operations"]');
    
    if (operationsSection && operationsLink) {
        // First trigger the navigation menu item click to show operations section
        operationsLink.click();
        
        // Then find and click the appropriate operation type button
        const operationOption = document.querySelector(`.operation-option[data-operation="${operationType}"]`);
        if (operationOption) {
            operationOption.click();
        }
    }
}

// Export dashboard module
const DashboardModule = {
    initialize,
    updateDashboardStats,
    updateRecentActivities
};

export default DashboardModule;