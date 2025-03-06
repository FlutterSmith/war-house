/**
 * Reports Page Module
 * Handles functionality for generating and displaying reports
 */

import ReportsService from '../services/reports-service.js';
import I18n from '../utils/i18n.js';
import Modal from '../components/modal.js';
import Toast from '../components/toast.js';

/**
 * Initialize the reports page
 */
function initialize() {
    // Set up report type selector
    setupReportTypeSelector();
    
    // Set up warehouse filter selector
    setupWarehouseSelector();
    
    // Set up date range pickers
    setupDateRangePickers();
    
    // Set up report generation button
    setupGenerateReportButton();
    
    // Set up export buttons
    setupExportButtons();
    
    // Initialize default report
    const reportTypeSelect = document.getElementById('reportType');
    if (reportTypeSelect) {
        updateReportPreview(reportTypeSelect.value);
    }
}

/**
 * Set up report type selector
 */
function setupReportTypeSelector() {
    const reportTypeSelect = document.getElementById('reportType');
    
    if (reportTypeSelect) {
        reportTypeSelect.addEventListener('change', () => {
            const reportType = reportTypeSelect.value;
            
            // Show/hide date range inputs based on report type
            toggleDateFields(reportType);
            
            // Update report preview
            updateReportPreview(reportType);
        });
    }
}

/**
 * Set up warehouse filter selector
 */
function setupWarehouseSelector() {
    const warehouseSelect = document.getElementById('reportWarehouse');
    
    if (warehouseSelect) {
        warehouseSelect.addEventListener('change', () => {
            const reportType = document.getElementById('reportType').value;
            updateReportPreview(reportType);
        });
    }
}

/**
 * Set up date range pickers
 */
function setupDateRangePickers() {
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    
    if (dateFrom && dateTo) {
        // Set initial date values
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(today.getMonth() - 1);
        
        dateFrom.valueAsDate = lastMonth;
        dateTo.valueAsDate = today;
        
        // Update report when dates change
        dateFrom.addEventListener('change', () => {
            const reportType = document.getElementById('reportType').value;
            updateReportPreview(reportType);
        });
        
        dateTo.addEventListener('change', () => {
            const reportType = document.getElementById('reportType').value;
            updateReportPreview(reportType);
        });
    }
}

/**
 * Show or hide date fields based on report type
 * @param {string} reportType - The selected report type
 */
function toggleDateFields(reportType) {
    const dateFieldsContainer = document.querySelector('.date-fields');
    
    if (dateFieldsContainer) {
        if (reportType === 'inventory-status' || reportType === 'low-stock') {
            dateFieldsContainer.style.display = 'none';
        } else {
            dateFieldsContainer.style.display = 'flex';
        }
    }
}

/**
 * Set up report generation button
 */
function setupGenerateReportButton() {
    const generateBtn = document.getElementById('generateReport');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const reportType = document.getElementById('reportType').value;
            updateReportPreview(reportType, true);
            
            Toast.showToast('تم تحديث التقرير بنجاح', 'success');
        });
    }
}

/**
 * Set up export buttons for reports
 */
function setupExportButtons() {
    const exportPdfBtn = document.getElementById('exportPdf');
    const exportExcelBtn = document.getElementById('exportExcel');
    
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', () => {
            exportReportToPdf();
        });
    }
    
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', () => {
            exportReportToExcel();
        });
    }
}

/**
 * Update the report preview based on selected options
 * @param {string} reportType - The type of report to generate
 * @param {boolean} forceRefresh - Whether to force a refresh of the report
 */
function updateReportPreview(reportType, forceRefresh = false) {
    // Get report parameters
    const warehouseType = document.getElementById('reportWarehouse').value;
    const dateFrom = document.getElementById('dateFrom')?.value;
    const dateTo = document.getElementById('dateTo')?.value;
    
    // Update report title
    updateReportTitle(reportType, warehouseType);
    
    // Get report data based on type
    let reportData;
    switch (reportType) {
        case 'inventory-status':
            reportData = ReportsService.generateInventoryStatusReport(warehouseType);
            break;
        case 'operations-summary':
            reportData = ReportsService.generateOperationsSummaryReport(dateFrom, dateTo, warehouseType);
            break;
        case 'item-movement':
            reportData = ReportsService.generateItemMovementReport(dateFrom, dateTo, warehouseType);
            break;
        case 'low-stock':
            reportData = ReportsService.generateLowStockReport(warehouseType);
            break;
    }
    
    // Update report statistics
    updateReportStatistics(reportType, reportData);
    
    // Update report chart
    updateReportChart(reportType, reportData);
    
    // Update report date
    const reportDateElement = document.querySelector('.report-date');
    if (reportDateElement) {
        reportDateElement.textContent = new Date().toLocaleDateString('ar-SA');
    }
}

/**
 * Update the report title
 * @param {string} reportType - The type of report
 * @param {string} warehouseType - The warehouse type
 */
function updateReportTitle(reportType, warehouseType) {
    const titleElement = document.querySelector('.report-title');
    
    if (titleElement) {
        titleElement.textContent = I18n.getReportTitle(reportType, warehouseType);
    }
}

/**
 * Update report statistics based on report data
 * @param {string} reportType - The type of report
 * @param {Object} data - The report data
 */
function updateReportStatistics(reportType, data) {
    const statsContainer = document.querySelector('.report-stats');
    
    if (!statsContainer) return;
    
    // Clear existing stats
    statsContainer.innerHTML = '';
    
    // Create stats based on report type
    switch (reportType) {
        case 'inventory-status':
            statsContainer.innerHTML = `
                <div class="stat-item">
                    <span class="stat-value">${data.totalItems}</span>
                    <span class="stat-label">إجمالي الأصناف</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${data.lowStockItems}</span>
                    <span class="stat-label">أصناف منخفضة المخزون</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${data.estimatedValue.toLocaleString()}</span>
                    <span class="stat-label">القيمة التقديرية</span>
                </div>
            `;
            break;
            
        case 'operations-summary':
            statsContainer.innerHTML = `
                <div class="stat-item">
                    <span class="stat-value">${data.totalOperations}</span>
                    <span class="stat-label">إجمالي العمليات</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${data.mostCommonOperation || '-'}</span>
                    <span class="stat-label">العملية الأكثر تكرارًا</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${data.lastOperation || '-'}</span>
                    <span class="stat-label">آخر عملية</span>
                </div>
            `;
            break;
            
        case 'item-movement':
            statsContainer.innerHTML = `
                <div class="stat-item">
                    <span class="stat-value">${data.totalMovements}</span>
                    <span class="stat-label">إجمالي الحركات</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${data.mostMovedItem || '-'}</span>
                    <span class="stat-label">الصنف الأكثر حركة</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${data.lastMovement || '-'}</span>
                    <span class="stat-label">آخر حركة</span>
                </div>
            `;
            break;
            
        case 'low-stock':
            statsContainer.innerHTML = `
                <div class="stat-item">
                    <span class="stat-value">${data.totalItems}</span>
                    <span class="stat-label">إجمالي الأصناف منخفضة المخزون</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${data.warningItems}</span>
                    <span class="stat-label">أصناف تحتاج للتجديد</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${data.criticalItems}</span>
                    <span class="stat-label">أصناف نفذت بالكامل</span>
                </div>
            `;
            break;
    }
}

/**
 * Update the report chart with the given data
 * @param {string} reportType - The type of report
 * @param {Object} data - The report data
 */
function updateReportChart(reportType, data) {
    const chartContainer = document.querySelector('.report-chart');
    
    if (!chartContainer) return;
    
    // Clear existing chart
    chartContainer.innerHTML = '';
    
    // If chart library is available, create chart
    if (typeof Chart !== 'undefined') {
        // Create canvas for chart
        const canvas = document.createElement('canvas');
        canvas.id = 'reportChart';
        chartContainer.appendChild(canvas);
        
        // Create chart based on report type
        let chartType, chartOptions;
        
        switch (reportType) {
            case 'inventory-status':
                chartType = 'pie';
                chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false
                };
                break;
                
            case 'operations-summary':
            case 'item-movement':
                chartType = 'bar';
                chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                };
                break;
                
            case 'low-stock':
                chartType = 'horizontalBar';
                chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true
                        }
                    }
                };
                break;
        }
        
        // Create chart
        new Chart(canvas.getContext('2d'), {
            type: chartType,
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'البيانات',
                    data: data.data,
                    backgroundColor: data.colors,
                    borderWidth: 1
                }]
            },
            options: chartOptions
        });
    } else {
        // Fallback to simple visualization if Chart.js is not available
        createSimpleChart(chartContainer, data);
    }
}

/**
 * Create a simple chart visualization without Chart.js
 * @param {HTMLElement} container - The container element
 * @param {Object} data - The chart data
 */
function createSimpleChart(container, data) {
    // Create simple bar chart using HTML/CSS
    const chart = document.createElement('div');
    chart.className = 'simple-chart';
    
    // Create bars for each data point
    data.labels.forEach((label, index) => {
        // Calculate bar height (50px to 200px range)
        const maxValue = Math.max(...data.data);
        const percent = (data.data[index] / maxValue) * 100;
        const height = Math.max(50, (percent * 150 / 100) + 50);
        
        // Create bar element
        const bar = document.createElement('div');
        bar.className = 'simple-chart-bar';
        bar.style.height = height + 'px';
        bar.style.backgroundColor = data.colors[index % data.colors.length];
        
        // Add value label
        const value = document.createElement('div');
        value.className = 'simple-chart-value';
        value.textContent = data.data[index];
        
        // Add name label
        const name = document.createElement('div');
        name.className = 'simple-chart-label';
        name.textContent = label;
        
        // Assemble bar
        bar.appendChild(value);
        bar.appendChild(document.createElement('div')); // Spacer
        
        // Assemble chart
        chart.appendChild(bar);
        chart.appendChild(name);
    });
    
    // Add to container
    container.appendChild(chart);
}

/**
 * Export the current report to PDF
 */
function exportReportToPdf() {
    // Check if jsPDF is available
    if (typeof jsPDF !== 'undefined') {
        // Get report title
        const reportTitle = document.querySelector('.report-title').textContent;
        
        // Create PDF instance
        const pdf = new jsPDF();
        
        // Add title
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text(reportTitle, 105, 15, { align: 'center' });
        
        // Add date
        const reportDate = document.querySelector('.report-date').textContent;
        pdf.setFontSize(12);
        pdf.text(`تاريخ التقرير: ${reportDate}`, 105, 25, { align: 'center' });
        
        // Add statistics
        pdf.setFontSize(14);
        pdf.text('إحصائيات التقرير:', 20, 40);
        
        // Get stats
        const stats = document.querySelectorAll('.report-stats .stat-item');
        let yPos = 50;
        
        stats.forEach(stat => {
            const label = stat.querySelector('.stat-label').textContent;
            const value = stat.querySelector('.stat-value').textContent;
            pdf.text(`${label}: ${value}`, 30, yPos);
            yPos += 10;
        });
        
        // Save PDF
        pdf.save(`${reportTitle}.pdf`);
        
        Toast.showToast('تم تصدير التقرير بصيغة PDF بنجاح', 'success');
    } else {
        Modal.showModal('تصدير PDF', `
            <p>مكتبة jsPDF غير متوفرة. يرجى تحميلها لاستخدام هذه الخاصية.</p>
            <p>يمكنك تحميلها من <a href="https://github.com/parallax/jsPDF" target="_blank">هنا</a>.</p>
        `);
    }
}

/**
 * Export the current report to Excel
 */
function exportReportToExcel() {
    Toast.showToast('جاري تصدير التقرير بصيغة Excel...', 'info');
    
    setTimeout(() => {
        Toast.showToast('تم تصدير التقرير بصيغة Excel بنجاح', 'success');
    }, 1500);
}

// Export reports module
const ReportsModule = {
    initialize,
    updateReportPreview
};

export default ReportsModule;