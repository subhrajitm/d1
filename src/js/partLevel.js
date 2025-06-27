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

// Data organization by category
const partsData = {
    all: invoiceData,
    engine: invoiceData.filter(item => item.Module.startsWith('31') || item.Module.startsWith('32')),
    transmission: invoiceData.filter(item => item.Module.startsWith('21') || item.Module.startsWith('22')),
    electrical: invoiceData.filter(item => item.Module.startsWith('52') || item.Module.startsWith('54')),
    body: invoiceData.filter(item => item.Module.startsWith('55') || item.Module.startsWith('56'))
};

// Pagination variables
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = Math.ceil(invoiceData.length / itemsPerPage);

// Mini loader for quick operations
function showMiniLoader(container) {
    if (!container) return;
    
    const loader = document.createElement('div');
    loader.className = 'mini-loader';
    loader.innerHTML = `
        <div class="mini-spinner"></div>
        <span>Loading...</span>
    `;
    loader.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.9);
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: #6366f1;
    `;
    
    container.style.position = 'relative';
    container.appendChild(loader);
    
    return loader;
}

function hideMiniLoader(loader) {
    if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
    }
}

// Utility for formatting currency
function formatCurrency(num) {
  return '$' + num.toLocaleString();
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('submitToast');
  const toastMessage = document.getElementById('toastMessage');
  const toastIcon = toast.querySelector('.bi');
  
  if (toastMessage) {
    toastMessage.textContent = message;
  }
  
  // Update icon based on type
  if (toastIcon) {
    toastIcon.className = type === 'success' ? 'bi bi-check-circle-fill text-success me-2' : 'bi bi-exclamation-circle-fill text-danger me-2';
  }
  
  // Show the toast
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}

// Function to create table row HTML
function createTableRow(row, index) {
    return `
        <tr>
            <td><input type="checkbox" class="form-check-input invoice-checkbox" value="${index + 1}"></td>
            <td data-column="part">${row.Part}</td>
            <td data-column="module">${row.Module}</td>
            <td data-column="class">${row.Class}</td>
            <td data-column="description">${row.Desc}</td>
            <td data-column="qty">${row.Qty}</td>
            <td data-column="unitValue">${formatCurrency(row.Unit)}</td>
            <td data-column="total">${formatCurrency(row.Total)}</td>
            <td data-column="status">
        <span class="badge badge-${row.Group === 'Underbilled' ? 'underbilled' : 'approved'}">
          ${row.Group === 'Underbilled' ? 'Underbilled' : 'Approved'}
        </span>
      </td>
            <td data-column="insights">
                <span class="insights-text">${row.Insights}</span>
            </td>
            <td data-column="group">${row.Group || '-'}</td>
            <td data-column="actions">
                <button class="btn btn-sm btn-outline-primary view-details" data-bs-toggle="tooltip" data-bs-title="View Details">
                    <i class="bi bi-eye"></i>
                </button>
      </td>
        </tr>
    `;
}

// Function to render table content
function renderTableContent(tableId, page) {
    console.log(`Rendering table: ${tableId}, page: ${page}`);
    const category = tableId.replace('PartsBody', '');
    const data = partsData[category] || partsData.all;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = data.slice(start, end);
    
    const tbody = document.getElementById(tableId);
    if (!tbody) {
        console.error(`Table body not found: ${tableId}`);
        return;
    }
    
    // Show mini loader
    const tableContainer = tbody.closest('.table-responsive-xl');
    const miniLoader = showMiniLoader(tableContainer);
    
    // Simulate a small delay for better UX (remove in production)
    setTimeout(() => {
        tbody.innerHTML = pageData.map((row, idx) => createTableRow(row, start + idx)).join('');
        
        // Add event listeners for checkboxes
        const checkboxes = tbody.querySelectorAll('.invoice-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateSelectedActions();
                updateSelectAllState(tableContainer);
            });
        });

        // Update pagination info
        updatePaginationInfo(data.length);
        
        // Initialize tooltips and attach event listeners
        initializeTooltips();
        attachViewDetailsListeners();
        
        // Hide mini loader
        hideMiniLoader(miniLoader);
    }, 800);
}

// Update pagination info
function updatePaginationInfo(totalItems) {
    const startEntry = document.getElementById('startEntry');
    const endEntry = document.getElementById('endEntry');
    const totalEntries = document.getElementById('totalEntries');
    
    if (!startEntry || !endEntry || !totalEntries) {
        console.error('Pagination elements not found');
        return;
    }
    
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, totalItems);
    
    startEntry.textContent = start;
    endEntry.textContent = end;
    totalEntries.textContent = totalItems;
    
    // Update total pages
    totalPages = Math.ceil(totalItems / itemsPerPage);
    updatePagination();
}

// Update pagination
function updatePagination() {
    const pageNumbers = document.querySelector('.page-numbers');
    if (!pageNumbers) {
        console.error('Page numbers container not found');
        return;
    }

    let paginationHTML = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page
    if (startPage > 1) {
        paginationHTML += `<button class="btn btn-sm btn-outline-secondary page-number" data-page="1">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-secondary'} page-number" data-page="${i}">
                ${i}
            </button>
        `;
    }

    // Last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
        paginationHTML += `<button class="btn btn-sm btn-outline-secondary page-number" data-page="${totalPages}">${totalPages}</button>`;
    }

    pageNumbers.innerHTML = paginationHTML;

    // Add event listeners to page number buttons
    const pageButtons = pageNumbers.querySelectorAll('.page-number');
    pageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const page = parseInt(button.dataset.page);
            if (page !== currentPage) {
                currentPage = page;
                const activeTable = document.querySelector('.tab-pane.active');
                const tableBody = activeTable.querySelector('tbody');
                if (tableBody) {
                    renderTableContent(tableBody.id, currentPage);
    }
            }
        });
    });
    
    // Update pagination button states
    document.getElementById('firstPage').disabled = currentPage === 1;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
    document.getElementById('lastPage').disabled = currentPage === totalPages;
}

// Show details modal
function showDetailsModal(row) {
    const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    const modalTitle = document.getElementById('detailsModalLabel');
    const modalBody = document.querySelector('#detailsModal .modal-body');

    // Get row data
    const part = row.querySelector('[data-column="part"]').textContent;
    const module = row.querySelector('[data-column="module"]').textContent;
    const description = row.querySelector('[data-column="description"]').textContent;
    const qty = row.querySelector('[data-column="qty"]').textContent;
    const unitValue = row.querySelector('[data-column="unitValue"]').textContent;
    const total = row.querySelector('[data-column="total"]').textContent;
    const status = row.querySelector('[data-column="status"] .badge').textContent;
    const group = row.querySelector('[data-column="group"]').textContent;

    // Update modal content
    modalTitle.textContent = `Part Details: ${part}`;
    modalBody.innerHTML = `
        <div class="details-grid">
            <div class="detail-item">
                <label>Module</label>
                <span>${module}</span>
            </div>
            <div class="detail-item">
                <label>Description</label>
                <span>${description}</span>
            </div>
            <div class="detail-item">
                <label>Quantity</label>
                <span>${qty}</span>
            </div>
            <div class="detail-item">
                <label>Unit Value</label>
                <span>${unitValue}</span>
            </div>
            <div class="detail-item">
                <label>Total</label>
                <span>${total}</span>
            </div>
            <div class="detail-item">
                <label>Status</label>
                <span class="badge badge-${status === 'Underbilled' ? 'underbilled' : 'approved'}">${status}</span>
            </div>
            <div class="detail-item">
                <label>Group</label>
                <span>${group}</span>
            </div>
        </div>
    `;

    modal.show();
}

// Initialize table sorting
function initializeTableSorting() {
    const sortableHeaders = document.querySelectorAll('th[data-sortable="true"]');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            const activeTable = document.querySelector('.tab-pane.active');
            const tbody = activeTable.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            // Sort rows
            rows.sort((a, b) => {
                const aValue = a.querySelector(`[data-column="${column}"]`).textContent;
                const bValue = b.querySelector(`[data-column="${column}"]`).textContent;
                
                if (column === 'unitValue' || column === 'total') {
                    return parseFloat(aValue.replace(/[^0-9.-]+/g, '')) - parseFloat(bValue.replace(/[^0-9.-]+/g, ''));
                }
                
                return aValue.localeCompare(bValue);
            });
            
            // Update table
            tbody.innerHTML = '';
            rows.forEach(row => tbody.appendChild(row));
        });
    });
}

// Update selected actions
function updateSelectedActions() {
    const activeTable = document.querySelector('.tab-pane.active');
    const selectedRows = activeTable.querySelectorAll('.invoice-checkbox:checked');
    const selectedActions = document.querySelector('.selected-actions');
    
    if (selectedActions) {
        selectedActions.style.display = selectedRows.length > 0 ? 'block' : 'none';
    }
}

// Update select all checkbox state
function updateSelectAllState(tableContainer) {
    const table = tableContainer.querySelector('table');
    const selectAllCheckbox = table.querySelector('.select-all-checkbox');
    const checkboxes = table.querySelectorAll('.invoice-checkbox');
    const checkedCheckboxes = table.querySelectorAll('.invoice-checkbox:checked');
    
    if (selectAllCheckbox && checkboxes.length > 0) {
        if (checkedCheckboxes.length === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (checkedCheckboxes.length === checkboxes.length) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }
}

// Submit selected
function submitSelected(selectedIds) {
    console.log('Submitting selected IDs:', selectedIds);
    
    // Get the submit button
    const submitButton = document.getElementById('submitSelected');
    const originalContent = submitButton.innerHTML;
    
    // Show loader state
    submitButton.innerHTML = `
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        Submitting...
    `;
    submitButton.disabled = true;
    
    // Simulate API call with delay
    setTimeout(() => {
        try {
            // Here you would typically make an API call to submit the selected items
            console.log(`Successfully submitted ${selectedIds.length} items!`);
            
            // Show success message
            submitButton.innerHTML = `
                <i class="bi bi-check-circle me-1"></i>
                Submitted Successfully!
            `;
            submitButton.classList.remove('btn-primary');
            submitButton.classList.add('btn-success');
            
            // Show toast notification
            showToast(`Successfully submitted ${selectedIds.length} item${selectedIds.length > 1 ? 's' : ''}!`, 'success');
            
        } catch (error) {
            console.error('Error submitting items:', error);
            
            // Show error state
            submitButton.innerHTML = `
                <i class="bi bi-exclamation-circle me-1"></i>
                Submission Failed
            `;
            submitButton.classList.remove('btn-primary');
            submitButton.classList.add('btn-danger');
            
            // Show error toast
            showToast('Failed to submit items. Please try again.', 'error');
        }
        
        // Reset after 2 seconds
        setTimeout(() => {
            submitButton.innerHTML = originalContent;
            submitButton.disabled = false;
            submitButton.classList.remove('btn-success', 'btn-danger');
            submitButton.classList.add('btn-primary');
            
            // Reset checkboxes
            const activeTable = document.querySelector('.tab-pane.active');
            const checkboxes = activeTable.querySelectorAll('.invoice-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Reset select all checkboxes
            const selectAllCheckboxes = document.querySelectorAll('.select-all-checkbox');
            selectAllCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.indeterminate = false;
            });
            
            // Hide selected actions
            const selectedActions = document.querySelector('.selected-actions');
            if (selectedActions) {
                selectedActions.style.display = 'none';
            }
        }, 2000);
        
    }, 2000); // Simulate 2 second API call
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Attach view details listeners
function attachViewDetailsListeners() {
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const row = button.closest('tr');
            showDetailsModal(row);
        });
    });
}

// Initialize the page
function initializePage() {
    console.log('Initializing page...');
    
    // First, ensure all tables exist in the DOM
    const categories = ['all', 'engine', 'transmission', 'electrical', 'body'];
    categories.forEach(category => {
        const tableBody = document.getElementById(`${category}PartsBody`);
        if (!tableBody) {
            console.error(`Table body not found for category: ${category}`);
            return;
        }
    });

    // Update tab badges with actual counts
    Object.entries(partsData).forEach(([category, data]) => {
        const badge = document.querySelector(`#${category}-tab .badge`);
        if (badge) {
            badge.textContent = data.length;
    }
});

    // Initialize Bootstrap tabs
    const tabElList = document.querySelectorAll('[data-bs-toggle="tab"]');
    const tabList = [...tabElList].map(tabEl => new bootstrap.Tab(tabEl));

    // Initialize tooltips
    initializeTooltips();

    // Initialize table sorting
    initializeTableSorting();

    // Handle select all checkboxes for all tabs
    const selectAllCheckboxes = document.querySelectorAll('.select-all-checkbox');
    selectAllCheckboxes.forEach(selectAllCheckbox => {
        selectAllCheckbox.addEventListener('change', () => {
            const table = selectAllCheckbox.closest('table');
            const checkboxes = table.querySelectorAll('.invoice-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
            selectAllCheckbox.indeterminate = false;
            updateSelectedActions();
        });
    });

    // Add submit button event listener
    const submitButton = document.getElementById('submitSelected');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            const activeTable = document.querySelector('.tab-pane.active');
            const selectedRows = activeTable.querySelectorAll('.invoice-checkbox:checked');
            
            if (selectedRows.length > 0) {
                const selectedIds = Array.from(selectedRows).map(checkbox => checkbox.value);
                submitSelected(selectedIds);
            }
        });
    }

    // Handle tab changes
    document.getElementById('partsTab').addEventListener('shown.bs.tab', function(e) {
        const targetId = e.target.getAttribute('data-bs-target').substring(1);
        const tableBody = document.querySelector(`#${targetId} tbody`);
        if (tableBody) {
            currentPage = 1; // Reset to first page on tab change
            renderTableContent(tableBody.id, currentPage);
        }
    });

    // Initial render of all tables
    categories.forEach(category => {
        const tableBody = document.getElementById(`${category}PartsBody`);
        if (tableBody) {
            console.log(`Rendering table for category: ${category}`);
            renderTableContent(tableBody.id, 1);
    }
    });

    // Force render the active tab's content
    const activeTab = document.querySelector('.nav-link.active');
    if (activeTab) {
        const targetId = activeTab.getAttribute('data-bs-target').substring(1);
        const tableBody = document.querySelector(`#${targetId} tbody`);
        if (tableBody) {
            console.log(`Force rendering active tab: ${targetId}`);
            renderTableContent(tableBody.id, 1);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    initializePage();
    
    // Initial render
    renderTableContent('allPartsBody', currentPage);
    
    // Add event listener for items per page change
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', function() {
            itemsPerPage = parseInt(this.value);
            currentPage = 1; // Reset to first page when changing items per page
            const activeTable = document.querySelector('.tab-pane.active');
            const tableBody = activeTable.querySelector('tbody');
            if (tableBody) {
                renderTableContent(tableBody.id, currentPage);
            }
        });
    }

    // Add event listeners for pagination buttons
    document.getElementById('firstPage').addEventListener('click', () => {
        if (currentPage !== 1) {
            currentPage = 1;
            const activeTable = document.querySelector('.tab-pane.active');
            const tableBody = activeTable.querySelector('tbody');
            if (tableBody) {
                renderTableContent(tableBody.id, currentPage);
            }
        }
    });

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            const activeTable = document.querySelector('.tab-pane.active');
            const tableBody = activeTable.querySelector('tbody');
            if (tableBody) {
                renderTableContent(tableBody.id, currentPage);
            }
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            const activeTable = document.querySelector('.tab-pane.active');
            const tableBody = activeTable.querySelector('tbody');
            if (tableBody) {
                renderTableContent(tableBody.id, currentPage);
            }
        }
    });

    document.getElementById('lastPage').addEventListener('click', () => {
        if (currentPage !== totalPages) {
            currentPage = totalPages;
            const activeTable = document.querySelector('.tab-pane.active');
            const tableBody = activeTable.querySelector('tbody');
            if (tableBody) {
                renderTableContent(tableBody.id, currentPage);
            }
        }
    });
}); 