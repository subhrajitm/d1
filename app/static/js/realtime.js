// Initialize Socket.IO connection
const socket = io();

// Function to update dashboard data
function updateDashboardData(data) {
    // Update total invoices
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = data.totalInvoices;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = data.pendingInvoices;
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = data.completedInvoices;
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = `$${data.totalAmount.toLocaleString()}`;

    // Update recent activities
    const activitiesList = document.querySelector('.activities-list');
    if (activitiesList) {
        activitiesList.innerHTML = data.recentActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="bi bi-${activity.type === 'invoice' ? 'file-text' : 'cash'}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.description}</div>
                    <div class="activity-time">${new Date(activity.time).toLocaleTimeString()}</div>
                </div>
            </div>
        `).join('');
    }
}

// Function to update shop status
function updateShopStatus(data) {
    const shopGrid = document.querySelector('.shop-grid');
    if (shopGrid) {
        shopGrid.innerHTML = data.shops.map(shop => `
            <div class="shop-card ${shop.status}">
                <div class="shop-header">
                    <h3 class="shop-name">${shop.name}</h3>
                    <span class="status-badge">${shop.status}</span>
                </div>
                <div class="shop-stats">
                    <div class="stat">
                        <span class="stat-label">Invoices</span>
                        <span class="stat-value">${shop.invoices}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Amount</span>
                        <span class="stat-value">$${shop.amount.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Function to update invoice details
function updateInvoiceDetails(data) {
    // Update contract summary
    document.querySelector('[data-field="fixedPriceLabour"]').textContent = `$${data.contractSummary.fixedPriceLabour.toLocaleString()}`;
    document.querySelector('[data-field="overAndAboveLabour"]').textContent = `$${data.contractSummary.overAndAboveLabour.toLocaleString()}`;
    document.querySelector('[data-field="componentRepairCatalogue"]').textContent = `$${data.contractSummary.componentRepairCatalogue.toLocaleString()}`;
    document.querySelector('[data-field="material"]').textContent = `$${data.contractSummary.material.toLocaleString()}`;

    // Update SV summary
    document.querySelector('[data-field="subContractCharge"]').textContent = `$${data.svSummary.subContractCharge.toLocaleString()}`;
    document.querySelector('[data-field="fuelAndOil"]').textContent = `$${data.svSummary.fuelAndOil.toLocaleString()}`;
    document.querySelector('[data-field="testCellCharge"]').textContent = `$${data.svSummary.testCellCharge.toLocaleString()}`;
}

// Socket.IO event handlers
socket.on('connect', () => {
    console.log('Connected to server');
    // Request initial data
    socket.emit('request_update', { type: 'initial' });
});

socket.on('data_update', (data) => {
    console.log('Received update:', data);
    // Update the appropriate section based on current page
    const currentPage = window.location.pathname;
    if (currentPage.includes('/index') || currentPage === '/') {
        updateDashboardData(data);
    } else if (currentPage.includes('/shop')) {
        updateShopStatus(data);
    } else if (currentPage.includes('/invoice')) {
        updateInvoiceDetails(data);
    }
});

// Fetch initial data from API endpoints
async function fetchInitialData() {
    try {
        const currentPage = window.location.pathname;
        if (currentPage.includes('/index') || currentPage === '/') {
            const response = await fetch('/api/dashboard/summary');
            const data = await response.json();
            updateDashboardData(data);
        } else if (currentPage.includes('/shop')) {
            const response = await fetch('/api/shop/status');
            const data = await response.json();
            updateShopStatus(data);
        } else if (currentPage.includes('/invoice')) {
            const response = await fetch('/api/invoice/details');
            const data = await response.json();
            updateInvoiceDetails(data);
        }
    } catch (error) {
        console.error('Error fetching initial data:', error);
    }
}

// Call fetchInitialData when the page loads
document.addEventListener('DOMContentLoaded', fetchInitialData); 