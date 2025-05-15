// Modern Invoice Table Data (from screenshot)
const invoiceData = [
  { Module: '31x', Class: 'Clas1', Part: 'PN1', Desc: 'Desc1', Qty: 1, Unit: 131200, Total: 131200, Included: 0, Excluded: 131200, Insights: 'CLP Mismatch/Exclusion as LLP material', Group: '-' },
  { Module: '22x', Class: 'Clas1', Part: 'PN2', Desc: 'Desc2', Qty: 1, Unit: 279400, Total: 279400, Included: 0, Excluded: 279400, Insights: 'CLP Mismatch/Exclusion as LLP material', Group: 'Underbilled' },
  { Module: '21x', Class: 'Clas1', Part: 'PN3', Desc: 'Desc3', Qty: 1, Unit: 521900, Total: 521900, Included: 0, Excluded: 521900, Insights: 'CLP Mismatch/Exclusion as LLP material', Group: '-' },
  { Module: '31x', Class: 'Clas1', Part: 'PN4', Desc: 'Desc4', Qty: 1, Unit: 683900, Total: 683900, Included: 0, Excluded: 683900, Insights: 'CLP Mismatch/Exclusion as LLP material', Group: '-' },
  { Module: '52x', Class: 'Clas1', Part: 'PN5', Desc: 'Desc5', Qty: 1, Unit: 576600, Total: 576600, Included: 0, Excluded: 576600, Insights: 'CLP Mismatch/Exclusion as LLP material', Group: '-' },
  { Module: '55x', Class: 'Clas1', Part: 'PN6', Desc: 'Desc6', Qty: 1, Unit: 416300, Total: 416300, Included: 0, Excluded: 416300, Insights: 'CLP Mismatch/Exclusion as LLP material', Group: '-' },
  { Module: '52x', Class: 'Clas1', Part: 'PN7', Desc: 'Desc7', Qty: 1, Unit: 254500, Total: 254500, Included: 0, Excluded: 254500, Insights: 'CLP Mismatch/Exclusion as LLP material', Group: '-' },
  { Module: '52x', Class: 'Clas1', Part: 'PN8', Desc: 'Desc8', Qty: 1, Unit: 521500, Total: 521500, Included: 0, Excluded: 521500, Insights: 'CLP Mismatch/Exclusion as LLP material', Group: '-' },
  { Module: '54x', Class: 'Clas1', Part: 'PN9', Desc: 'Desc9', Qty: 1, Unit: 208400, Total: 208400, Included: 0, Excluded: 208400, Insights: 'CLP Mismatch/Exclusion as LLP material', Group: '-' },
  { Module: '54x', Class: 'Clas1', Part: 'PN10', Desc: 'Desc10', Qty: 1, Unit: 241800, Total: 241800, Included: 0, Excluded: 241800, Insights: 'CLP Mismatch/Exclusion as LLP material', Group: '-' },
  { Module: '54x', Class: 'Clas1', Part: 'PN11', Desc: 'Desc11', Qty: 1, Unit: 237400, Total: 237400, Included: 0, Excluded: 237400, Insights: 'CLP Mismatch/Exclusion as LLP material', Group: '-' },
  { Module: '54x', Class: 'Class2', Part: 'PN12', Desc: 'Desc12', Qty: 1, Unit: 210900, Total: 210900, Included: 0, Excluded: 210900, Insights: 'CLP Mismatch/Exclusion as LLP material', Group: '-' },
  { Module: '54x', Class: 'Class2', Part: 'PN13', Desc: 'Desc13', Qty: 1, Unit: 281000, Total: 281000, Included: 0, Excluded: 281000, Insights: 'CLP Mismatch/Exclusion as LLP material', Group: '-' },
];

// Utility for formatting currency
function formatCurrency(num) {
  return '$' + num.toLocaleString();
}

function renderInvoiceDashboard() {
  const tbody = document.getElementById('invoiceDashboardBody');
  tbody.innerHTML = '';
  invoiceData.forEach((row, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" class="row-select"></td>
      <td>${row.Part}</td>
      <td>${row.Module}</td>
      <td>${row.Class}</td>
      <td class="text-muted">${row.Desc}</td>
      <td>${row.Qty}</td>
      <td>$${row.Unit.toLocaleString()}</td>
      <td>$${row.Total.toLocaleString()}</td>
      <td>
        <span class="badge badge-${row.Group === 'Underbilled' ? 'underbilled' : 'approved'}">
          ${row.Group === 'Underbilled' ? 'Underbilled' : 'Approved'}
        </span>
      </td>
      <td>
        <span class="badge badge-pending">${row.Insights}</span>
      </td>
      <td>${row.Group || '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderInvoiceDashboard();

  // Select All functionality
  const selectAll = document.getElementById('selectAllInvoices');
  selectAll.addEventListener('change', function() {
    document.querySelectorAll('.row-select').forEach(cb => {
      cb.checked = selectAll.checked;
    });
  });

  // Row select: update Select All if any unchecked
  document.getElementById('invoiceDashboardBody').addEventListener('change', function(e) {
    if (e.target.classList.contains('row-select')) {
      const all = document.querySelectorAll('.row-select');
      const checked = document.querySelectorAll('.row-select:checked');
      selectAll.checked = all.length === checked.length;
    }
  });

  // Close info banner
  const closeBanner = document.querySelector('.close-banner');
  if (closeBanner) {
    closeBanner.addEventListener('click', function() {
      this.parentElement.style.display = 'none';
    });
  }
});

// Combine all styles into one
const style = document.createElement('style');
style.textContent = `
    .bulk-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1.25rem;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
    }
    
    .selected-count {
        font-size: 0.875rem;
        color: #6c757d;
    }
    
    .action-buttons {
        display: flex;
        gap: 0.5rem;
    }
    
    .dashboard-table th.sort-asc::after {
        content: '↑';
        margin-left: 0.5rem;
    }
    
    .dashboard-table th.sort-desc::after {
        content: '↓';
        margin-left: 0.5rem;
    }

    .invoice-card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .invoice-card {
        background: #fff;
        border-radius: 0.75rem;
        padding: 1rem 0.75rem 0.75rem 0.75rem;
        box-shadow: 0 1px 4px #0072ce11;
        border: 1px solid #e5e7eb;
        transition: box-shadow 0.18s, transform 0.18s, opacity 0.4s, border-color 0.18s;
        position: relative;
        min-width: 0;
    }
    
    .invoice-card:hover {
        box-shadow: 0 4px 16px #0072ce22;
        transform: translateY(-2px) scale(1.015);
        border-color: #b6d4fe;
    }
    
    .invoice-card .badge {
        font-size: 0.75em;
        padding: 0.3em 0.6em;
        border-radius: 0.5em;
    }
    
    .invoice-card .small, .invoice-card .text-muted {
        font-size: 0.92em;
    }
`;
document.head.appendChild(style);

// Invoice Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentFilter = 'all';
    let currentSort = { column: null, direction: 'asc' };
    let selectedInvoices = new Set();
    
    // DOM Elements
    const tabButtons = document.querySelectorAll('.dashboard-tabs .tab');
    const selectAllCheckbox = document.getElementById('selectAllInvoices');
    const tableBody = document.getElementById('invoiceDashboardBody');
    const searchInput = document.createElement('input');
    
    // Initialize search input
    searchInput.type = 'text';
    searchInput.className = 'form-control form-control-sm dashboard-search-input';
    searchInput.placeholder = 'Search invoices...';
    searchInput.style.maxWidth = '250px';
    // Add a search icon
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'search-input-wrapper position-relative';
    searchWrapper.appendChild(searchInput);
    const searchIcon = document.createElement('i');
    searchIcon.className = 'bi bi-search search-input-icon';
    searchWrapper.appendChild(searchIcon);
    document.querySelector('.dashboard-search').appendChild(searchWrapper);
    
    // Tab Filtering
    tabButtons.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active state
            tabButtons.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update filter
            currentFilter = this.textContent.trim().toLowerCase().split(' ')[0];
            filterTable();
        });
    });
    
    // Search Functionality
    searchInput.addEventListener('input', debounce(function() {
        filterTable();
    }, 300));
    
    // Select All Functionality
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
            const invoiceId = checkbox.value;
            if (this.checked) {
                selectedInvoices.add(invoiceId);
            } else {
                selectedInvoices.delete(invoiceId);
            }
        });
        updateBulkActions();
    });
    
    // Table Sorting
    document.querySelectorAll('.dashboard-table th').forEach(header => {
        if (header.dataset.sortable !== 'false') {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                const column = header.dataset.column;
                sortTable(column);
            });
        }
    });
    
    // Functions
    function filterTable() {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = tableBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const status = row.querySelector('.badge').textContent.toLowerCase();
            const text = row.textContent.toLowerCase();
            const matchesFilter = currentFilter === 'all' || status.includes(currentFilter);
            const matchesSearch = text.includes(searchTerm);
            
            row.style.display = matchesFilter && matchesSearch ? '' : 'none';
        });
        
        updateTabCounts();
    }
    
    function sortTable(column) {
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        const header = document.querySelector(`th[data-column="${column}"]`);
        if (!header) return;
        
        // Update sort direction
        if (currentSort.column === column) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.column = column;
            currentSort.direction = 'asc';
        }
        
        // Update header indicators
        document.querySelectorAll('.dashboard-table th').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
        });
        header.classList.add(`sort-${currentSort.direction}`);
        
        // Sort rows
        rows.sort((a, b) => {
            const aCell = a.querySelector(`td[data-column="${column}"]`);
            const bCell = b.querySelector(`td[data-column="${column}"]`);
            const aValue = aCell ? aCell.textContent : '';
            const bValue = bCell ? bCell.textContent : '';
            
            if (currentSort.direction === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
        
        // Reorder rows
        rows.forEach(row => tableBody.appendChild(row));
    }
    
    function updateTabCounts() {
        const counts = {
            all: 0,
            pending: 0,
            approved: 0,
            flagged: 0
        };
        
        tableBody.querySelectorAll('tr').forEach(row => {
            if (row.style.display !== 'none') {
                counts.all++;
                const status = row.querySelector('.badge').textContent.toLowerCase();
                if (status.includes('pending')) counts.pending++;
                if (status.includes('approved')) counts.approved++;
                if (status.includes('flagged')) counts.flagged++;
            }
        });
        
        tabButtons.forEach(tab => {
            const status = tab.textContent.trim().toLowerCase().split(' ')[0];
            const badge = tab.querySelector('.tab-badge');
            if (badge) {
                badge.textContent = counts[status] || '0';
            }
        });
    }
    
    function updateBulkActions() {
        const bulkActions = document.querySelector('.bulk-actions');
        const selectedCount = document.querySelector('.bulk-actions .selected-count');
        const checked = document.querySelectorAll('.row-select:checked').length;
        if (bulkActions) {
            bulkActions.style.display = checked > 0 ? 'flex' : 'none';
            if (selectedCount) {
                selectedCount.textContent = `${checked} item${checked === 1 ? '' : 's'} selected`;
            }
        }
    }
    
    // Utility Functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Initialize
    filterTable();
    
    // Add bulk actions container
    const bulkActions = document.createElement('div');
    bulkActions.className = 'bulk-actions';
    bulkActions.style.display = 'none';
    bulkActions.innerHTML = `
        <div class="selected-count">${selectedInvoices.size} selected</div>
        <div class="action-buttons">
            <button class="btn btn-sm btn-primary" onclick="submitSelected()">Submit</button>
        </div>
    `;
    document.querySelector('.dashboard-card').insertBefore(bulkActions, document.querySelector('.table-responsive'));

    // Ensure bulk-actions shows on any selection
    tableBody.addEventListener('change', function(e) {
        if (e.target.classList.contains('row-select')) {
            updateBulkActions();
        }
    });
});

// Action Functions
function approveSelected() {
    // Implementation for approving selected invoices
    console.log('Approving selected invoices...');
}

function flagSelected() {
    // Implementation for flagging selected invoices
    console.log('Flagging selected invoices...');
}

function exportSelected() {
    // Implementation for exporting selected invoices
    console.log('Exporting selected invoices...');
}

// Add submitSelected function
function submitSelected() {
    // Implementation for submitting selected invoices
    console.log('Submitting selected invoices...');
}

// Pagination and Items Per Page Functionality
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = Math.ceil(invoiceData.length / itemsPerPage);

function updatePagination() {
    const startEntry = document.getElementById('startEntry');
    const endEntry = document.getElementById('endEntry');
    const totalEntries = document.getElementById('totalEntries');
    const pageNumbers = document.querySelector('.page-numbers');
    
    // Update entry information
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, invoiceData.length);
    startEntry.textContent = start;
    endEntry.textContent = end;
    totalEntries.textContent = invoiceData.length;
    
    // Update page numbers
    pageNumbers.innerHTML = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.className = `btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-secondary'}`;
        button.textContent = i;
        button.onclick = () => goToPage(i);
        pageNumbers.appendChild(button);
    }
    
    // Update navigation buttons
    document.getElementById('firstPage').disabled = currentPage === 1;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
    document.getElementById('lastPage').disabled = currentPage === totalPages;
}

function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderPage(currentPage);
    updatePagination();
}

function updateItemsPerPage() {
    itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    totalPages = Math.ceil(invoiceData.length / itemsPerPage);
    currentPage = 1;
    renderPage(currentPage);
    updatePagination();
}

// Initialize footer functionality
document.addEventListener('DOMContentLoaded', () => {
    // ... existing initialization code ...
    
    // Add event listeners for pagination
    document.getElementById('firstPage').addEventListener('click', () => goToPage(1));
    document.getElementById('prevPage').addEventListener('click', () => goToPage(currentPage - 1));
    document.getElementById('nextPage').addEventListener('click', () => goToPage(currentPage + 1));
    document.getElementById('lastPage').addEventListener('click', () => goToPage(totalPages));
    
    // Add event listener for items per page
    document.getElementById('itemsPerPage').addEventListener('change', updateItemsPerPage);
    
    // Initialize pagination
    updatePagination();
});

// Update renderPage function to use itemsPerPage
function renderPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = invoiceData.slice(start, end);
    
    const tbody = document.getElementById('invoiceDashboardBody');
    tbody.innerHTML = '';
    
    pageData.forEach((row, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" class="row-select" value="${start + idx + 1}"></td>
            <td data-column="part">${row.Part}</td>
            <td data-column="module">${row.Module}</td>
            <td data-column="class">${row.Class}</td>
            <td data-column="description" class="text-muted">${row.Desc}</td>
            <td data-column="qty">${row.Qty}</td>
            <td data-column="unitValue">$${row.Unit.toLocaleString()}</td>
            <td data-column="total">$${row.Total.toLocaleString()}</td>
            <td data-column="status">
                <span class="badge badge-${row.Group === 'Underbilled' ? 'underbilled' : 'approved'}">
                    ${row.Group === 'Underbilled' ? 'Underbilled' : 'Approved'}
                </span>
            </td>
            <td data-column="insights">
                <span class="badge badge-pending">${row.Insights}</span>
            </td>
            <td data-column="group">${row.Group || '-'}</td>
            <td data-column="actions">
                <button class="btn btn-sm btn-outline-primary view-details" data-bs-toggle="tooltip" data-bs-title="View Details">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Reinitialize tooltips for the new buttons
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Reattach click event listeners to view details buttons
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            showDetailsModal(row);
        });
    });
}

// Add action menu functionality
function toggleActionsMenu(button) {
    const menu = button.nextElementSibling;
    const allMenus = document.querySelectorAll('.actions-menu');
    
    allMenus.forEach(m => {
        if (m !== menu) m.classList.remove('show');
    });
    
    menu.classList.toggle('show');
}

// Close action menus when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.actions')) {
        document.querySelectorAll('.actions-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

// Action handlers
function viewDetails(id) {
    console.log('Viewing details for invoice:', id);
    // Implement view details functionality
}

function editInvoice(id) {
    console.log('Editing invoice:', id);
    // Implement edit functionality
}

function deleteInvoice(id) {
    console.log('Deleting invoice:', id);
    // Implement delete functionality
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    renderPage(1);
    // ... existing initialization code ...
});

// Function to show the details modal
function showDetailsModal(row) {
    // Get all the data from the row
    const part = row.querySelector('[data-column="part"]').textContent;
    const module = row.querySelector('[data-column="module"]').textContent;
    const classValue = row.querySelector('[data-column="class"]').textContent;
    const description = row.querySelector('[data-column="description"]').textContent;
    const qty = row.querySelector('[data-column="qty"]').textContent;
    const unitValue = row.querySelector('[data-column="unitValue"]').textContent;
    const total = row.querySelector('[data-column="total"]').textContent;
    const status = row.querySelector('[data-column="status"]').innerHTML;
    const group = row.querySelector('[data-column="group"]').textContent;
    const insights = row.querySelector('[data-column="insights"]').innerHTML;

    // Populate the modal with the data
    document.getElementById('modalPart').textContent = part;
    document.getElementById('modalModule').textContent = module;
    document.getElementById('modalClass').textContent = classValue;
    document.getElementById('modalDescription').textContent = description;
    document.getElementById('modalQty').textContent = qty;
    document.getElementById('modalUnitValue').textContent = unitValue;
    document.getElementById('modalTotal').textContent = total;
    document.getElementById('modalStatus').innerHTML = status;
    document.getElementById('modalGroup').textContent = group;
    document.getElementById('modalInsights').innerHTML = insights;

    // Show the modal
    const modalElement = document.getElementById('detailsModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// Initialize tooltips and modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Add click event listeners to all view details buttons
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            showDetailsModal(row);
        });
    });

    // Handle modal close
    const detailsModal = document.getElementById('detailsModal');
    detailsModal.addEventListener('hidden.bs.modal', function() {
        // Remove modal backdrop
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        // Remove modal-open class from body
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    });

    // Handle modal show
    detailsModal.addEventListener('show.bs.modal', function() {
        // Ensure body has modal-open class
        document.body.classList.add('modal-open');
    });
}); 