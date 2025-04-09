/**
 * Reports Page Module
 * Handles functionality for the reports page
 */

import ReportsService from '../services/reports-service.js';
import Modal from '../components/modal.js';
import Toast from '../components/toast.js';
import DateFormatter from '../utils/date-formatter.js';
import I18n from '../utils/i18n.js';

// Store for chart instances to prevent memory leaks
let currentChart = null;

/**
 * Initialize the reports page
 */
function initialize() {
    // Set up report type selector
    setupReportTypeSelector();

    // Set up report generation button
    setupGenerateReportButton();

    // Set up export and print buttons
    setupExportButtons();

    // Generate default report (inventory status)
    generateReport('inventory-status', 'all');
}

/**
 * Set up report type selector
 */
function setupReportTypeSelector() {
    const reportTypeSelector = document.getElementById('report-type');

    if (reportTypeSelector) {
        reportTypeSelector.addEventListener('change', () => {
            const reportType = reportTypeSelector.value;

            // Show/hide date inputs based on report type
            toggleDateInputs(reportType);

            // Update report title
            updateReportTitle(reportType);
        });
    }
}

/**
 * Toggle date input visibility based on report type
 * @param {string} reportType - The report type
 */
function toggleDateInputs(reportType) {
    const dateRangeContainer = document.querySelector('.date-range');

    if (dateRangeContainer) {
        if (reportType === 'inventory-status' || reportType === 'low-stock') {
            dateRangeContainer.classList.add('hidden');
        } else {
            dateRangeContainer.classList.remove('hidden');
        }
    }
}

/**
 * Update report title based on selected type
 * @param {string} reportType - The report type
 */
function updateReportTitle(reportType) {
    const titleElement = document.getElementById('report-title');
    const warehouseFilter = document.getElementById('warehouse-filter');

    if (titleElement && warehouseFilter) {
        const warehouseType = warehouseFilter.value;
        const title = I18n.getReportTitle(reportType, warehouseType);
        titleElement.textContent = title;
    }
}

/**
 * Set up report generation button
 */
function setupGenerateReportButton() {
    const generateButton = document.getElementById('generate-report');

    if (generateButton) {
        generateButton.addEventListener('click', () => {
            const reportType = document.getElementById('report-type').value;
            const warehouseType = document.getElementById('warehouse-filter').value;
            const dateFrom = document.getElementById('date-from').value;
            const dateTo = document.getElementById('date-to').value;

            generateReport(reportType, warehouseType, dateFrom, dateTo);
        });
    }
}

/**
 * Set up export and print buttons
 */
function setupExportButtons() {
    // Export to PDF button
    const exportButton = document.getElementById('export-report');
    if (exportButton) {
        exportButton.addEventListener('click', () => {
            exportReportToPDF();
        });
    }

    // Print report button
    const printButton = document.getElementById('print-report');
    if (printButton) {
        printButton.addEventListener('click', () => {
            printReport();
        });
    }
}

/**
 * Generate a report based on selected options
 * @param {string} reportType - The report type
 * @param {string} warehouseType - The warehouse type
 * @param {string} dateFrom - Start date (optional)
 * @param {string} dateTo - End date (optional)
 */
function generateReport(reportType, warehouseType, dateFrom = '', dateTo = '') {
    // Update report title
    updateReportTitle(reportType);

    // Update report date
    const reportDateElement = document.getElementById('report-date');
    if (reportDateElement) {
        reportDateElement.textContent = 'التاريخ: ' + DateFormatter.formatDateShort(new Date());
    }

    // Generate report based on type
    let reportData;

    switch (reportType) {
        case 'inventory-status':
            reportData = ReportsService.generateInventoryStatusReport(warehouseType);
            renderInventoryStatusReport(reportData);
            break;
        case 'operations-summary':
            reportData = ReportsService.generateOperationsSummaryReport(dateFrom, dateTo, warehouseType);
            renderOperationsSummaryReport(reportData);
            break;
        case 'item-movement':
            reportData = ReportsService.generateItemMovementReport(dateFrom, dateTo, warehouseType);
            renderItemMovementReport(reportData);
            break;
        case 'low-stock':
            reportData = ReportsService.generateLowStockReport(warehouseType);
            renderLowStockReport(reportData);
            break;
    }

    // Show success toast
    Toast.showToast('تم توليد التقرير بنجاح', 'success');
}

/**
 * Render inventory status report
 * @param {Object} reportData - The report data
 */
function renderInventoryStatusReport(reportData) {
    // Create chart
    createChart('doughnut',
        reportData.labels,
        reportData.data,
        'توزيع الأصناف حسب المخازن',
        reportData.colors
    );

    // Create summary
    const summaryHTML = `
        <h4>ملخص التقرير</h4>
        <div class="summary-stats">
            <div class="summary-stat">
                <span class="stat-label">عدد الأصناف الإجمالي:</span>
                <span class="stat-value">${reportData.totalItems}</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">القيمة التقديرية:</span>
                <span class="stat-value">${reportData.estimatedValue.toLocaleString()} ر.س</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">أصناف منخفضة المخزون:</span>
                <span class="stat-value">${reportData.lowStockItems}</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">آخر تحديث:</span>
                <span class="stat-value">${reportData.lastUpdate}</span>
            </div>
        </div>
    `;

    renderReportSummary(summaryHTML);
}

/**
 * Render operations summary report
 * @param {Object} reportData - The report data
 */
function renderOperationsSummaryReport(reportData) {
    // Create chart
    createChart('bar',
        reportData.labels,
        reportData.data,
        'ملخص العمليات حسب النوع',
        reportData.colors
    );

    // Create summary
    const summaryHTML = `
        <h4>ملخص التقرير</h4>
        <div class="summary-stats">
            <div class="summary-stat">
                <span class="stat-label">عدد العمليات الإجمالي:</span>
                <span class="stat-value">${reportData.totalOperations}</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">آخر عملية:</span>
                <span class="stat-value">${reportData.lastOperation || 'لا يوجد'}</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">العملية الأكثر تكراراً:</span>
                <span class="stat-value">${reportData.mostCommonOperation || 'لا يوجد'}</span>
            </div>
        </div>
    `;

    renderReportSummary(summaryHTML);
}

/**
 * Render item movement report
 * @param {Object} reportData - The report data
 */
function renderItemMovementReport(reportData) {
    // Create chart
    createChart('horizontalBar',
        reportData.labels,
        reportData.data,
        'حركة الأصناف (الأكثر تداولاً)',
        reportData.colors
    );

    // Create summary
    const summaryHTML = `
        <h4>ملخص التقرير</h4>
        <div class="summary-stats">
            <div class="summary-stat">
                <span class="stat-label">عدد العمليات الإجمالي:</span>
                <span class="stat-value">${reportData.totalMovements}</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">الصنف الأكثر تداولاً:</span>
                <span class="stat-value">${reportData.mostMovedItem || 'لا يوجد'}</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">آخر عملية:</span>
                <span class="stat-value">${reportData.lastMovement || 'لا يوجد'}</span>
            </div>
        </div>
    `;

    renderReportSummary(summaryHTML);
}

/**
 * Render low stock report
 * @param {Object} reportData - The report data
 */
function renderLowStockReport(reportData) {
    // Create chart
    createChart('horizontalBar',
        reportData.labels,
        reportData.data,
        'الأصناف منخفضة المخزون',
        reportData.colors
    );

    // Create summary
    const summaryHTML = `
        <h4>ملخص التقرير</h4>
        <div class="summary-stats">
            <div class="summary-stat">
                <span class="stat-label">عدد الأصناف منخفضة المخزون:</span>
                <span class="stat-value">${reportData.totalItems}</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">أصناف تحتاج تنبيه:</span>
                <span class="stat-value">${reportData.warningItems}</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">أصناف نفذت من المخزون:</span>
                <span class="stat-value">${reportData.criticalItems}</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">آخر تحديث:</span>
                <span class="stat-value">${reportData.lastUpdate}</span>
            </div>
        </div>
    `;

    renderReportSummary(summaryHTML);
}

/**
 * Create a chart using Chart.js (mock implementation)
 * @param {string} type - The chart type
 * @param {Array} labels - The chart labels
 * @param {Array} data - The chart data
 * @param {string} title - The chart title
 * @param {Array} colors - The chart colors
 */
function createChart(type, labels, data, title, colors) {
    const chartContainer = document.getElementById('report-chart-container');
    const chartCanvas = document.getElementById('report-chart');

    if (chartContainer && chartCanvas) {
        // Mock Chart.js implementation - in a real application, you would use Chart.js
        chartContainer.innerHTML = '';
        chartContainer.innerHTML = `
            <div class="chart-mockup">
                <h4>${title}</h4>
                <div class="chart-visualization ${type}-chart">
                    ${createChartVisualization(type, labels, data, colors)}
                </div>
            </div>
        `;
    }
}

/**
 * Create a simple chart visualization (mock)
 * @param {string} type - The chart type
 * @param {Array} labels - The chart labels
 * @param {Array} data - The chart data
 * @param {Array} colors - The chart colors
 * @returns {string} HTML representation of the chart
 */
function createChartVisualization(type, labels, data, colors) {
    if (type === 'doughnut' || type === 'pie') {
        return createPieChartVisualization(labels, data, colors);
    } else {
        return createBarChartVisualization(labels, data, colors, type === 'horizontalBar');
    }
}

/**
 * Create a pie/doughnut chart visualization (mock)
 * @param {Array} labels - The chart labels
 * @param {Array} data - The chart data
 * @param {Array} colors - The chart colors
 * @returns {string} HTML representation of the chart
 */
function createPieChartVisualization(labels, data, colors) {
    const total = data.reduce((sum, val) => sum + val, 0) || 1; // Avoid division by zero

    let segments = '';
    let legend = '';

    for (let i = 0; i < labels.length; i++) {
        const percentage = ((data[i] / total) * 100).toFixed(1);
        const color = colors[i % colors.length];

        segments += `
            <div class="pie-segment" style="
                --percentage: ${percentage}%;
                --color: ${color};
                --index: ${i};
            "></div>
        `;

        legend += `
            <div class="legend-item">
                <span class="legend-color" style="background-color: ${color}"></span>
                <span class="legend-label">${labels[i]}</span>
                <span class="legend-value">${data[i]} (${percentage}%)</span>
            </div>
        `;
    }

    return `
        <div class="pie-chart-container">
            <div class="pie-chart">
                ${segments}
                <div class="pie-center"></div>
            </div>
            <div class="chart-legend">
                ${legend}
            </div>
        </div>
    `;
}

/**
 * Create a bar chart visualization (mock)
 * @param {Array} labels - The chart labels
 * @param {Array} data - The chart data
 * @param {Array} colors - The chart colors
 * @param {boolean} horizontal - Whether the bars should be horizontal
 * @returns {string} HTML representation of the chart
 */
function createBarChartVisualization(labels, data, colors, horizontal = false) {
    const maxValue = Math.max(...data, 1); // Avoid division by zero

    let bars = '';

    for (let i = 0; i < labels.length; i++) {
        const percentage = ((data[i] / maxValue) * 100).toFixed(1);
        const color = colors[i % colors.length];

        bars += `
            <div class="bar-item">
                <div class="bar-label">${labels[i]}</div>
                <div class="bar-container">
                    <div class="bar" style="
                        ${horizontal ? 'width' : 'height'}: ${percentage}%;
                        background-color: ${color};
                    "></div>
                    <div class="bar-value">${data[i]}</div>
                </div>
            </div>
        `;
    }

    return `
        <div class="bar-chart-container ${horizontal ? 'horizontal' : 'vertical'}">
            ${bars}
        </div>
    `;
}

/**
 * Render report summary
 * @param {string} summaryHTML - The HTML for the summary
 */
function renderReportSummary(summaryHTML) {
    const summaryContainer = document.getElementById('report-summary');

    if (summaryContainer) {
        summaryContainer.innerHTML = summaryHTML;
    }
}

/**
 * Export current report to PDF
 */
function exportReportToPDF() {
    // Mock PDF export functionality
    Toast.showToast('جارٍ تصدير التقرير كملف PDF...', 'info');

    // Simulate processing delay
    setTimeout(() => {
        Modal.showModal('تصدير التقرير', `
            <div class="export-success">
                <i class="fas fa-file-pdf"></i>
                <h3>تم تصدير التقرير بنجاح</h3>
                <p>تم حفظ الملف في المسار الافتراضي للتنزيلات.</p>
                <button class="btn-primary modal-close-btn">موافق</button>
            </div>
        `, (modal) => {
            modal.querySelector('.modal-close-btn').addEventListener('click', () => {
                Modal.closeModal(modal);
            });
        });
    }, 1500);
}

/**
 * Print current report
 */
function printReport() {
    // Mock print functionality
    Toast.showToast('جارٍ إرسال التقرير إلى الطابعة...', 'info');

    // Simulate processing delay
    setTimeout(() => {
        Toast.showToast('تم إرسال التقرير إلى الطابعة بنجاح', 'success');
    }, 1000);
}

// Export reports module
const ReportsModule = {
    initialize
};

export default ReportsModule;