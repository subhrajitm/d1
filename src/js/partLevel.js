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
  { Module: '54x', Class: 'Class2', Part: 'PN13', Desc: 'Desc13', Qty: 1, Unit: 281000, Total: 281000, Included: 0, Excluded: 281000, Insights: 'CLP Mismatch/Exclusion as LLP material', Group: '-' }
];

// Utility for formatting currency
function formatCurrency(num) {
  return '$' + num.toLocaleString();
}

// Initialize DataTable
$(document).ready(function() {
  console.log('Document ready');
  console.log('Invoice data:', invoiceData);
  console.log('Table element exists:', $('#invoiceTable').length > 0);

  // Wait for DataTables to be fully loaded
  if (typeof $.fn.DataTable === 'undefined') {
    console.error('DataTables is not loaded!');
    return;
  }

  let table; // Declare table variable in wider scope

  try {
    // Initialize DataTable
    table = $('#invoiceTable').DataTable({
      data: invoiceData,
      responsive: true,
      pageLength: 10,
      lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
      columns: [
        {
          data: null,
          defaultContent: '<input type="checkbox" class="form-check-input row-select">',
          orderable: false,
          width: '40px'
        },
        { data: 'Part' },
        { data: 'Module' },
        { data: 'Class' },
        { data: 'Desc' },
        { data: 'Qty' },
        { 
          data: 'Unit',
          render: function(data) {
            return formatCurrency(data);
          }
        },
        { 
          data: 'Total',
          render: function(data) {
            return formatCurrency(data);
          }
        },
        { 
          data: 'Group',
          render: function(data) {
            const badgeClass = data === 'Underbilled' ? 'badge-underbilled' : 'badge-approved';
            const text = data === 'Underbilled' ? 'Underbilled' : 'Approved';
            return `<span class="badge ${badgeClass}">${text}</span>`;
          }
        },
        { 
          data: 'Insights',
          render: function(data) {
            return `<span class="badge badge-pending">${data}</span>`;
          }
        },
        { data: 'Group' }
      ],
      order: [[1, 'asc']],
      dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>rt<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      language: {
        search: "",
        searchPlaceholder: "Search invoices...",
        lengthMenu: "Show _MENU_ entries",
        info: "Showing _START_ to _END_ of _TOTAL_ entries",
        paginate: {
          first: '<i class="bi bi-chevron-double-left"></i>',
          previous: '<i class="bi bi-chevron-left"></i>',
          next: '<i class="bi bi-chevron-right"></i>',
          last: '<i class="bi bi-chevron-double-right"></i>'
        }
      },
      initComplete: function() {
        console.log('Table initialization complete');
        // Add custom classes to DataTables elements
        $('.dataTables_length select').addClass('form-select form-select-sm');
        $('.dataTables_filter input').addClass('form-control form-control-sm');
        
        // Update tab counts after table is initialized
        if (table) {
          updateTabCounts();
        }
      }
    });

    console.log('DataTable initialized successfully');

    // Select All functionality
    $('#selectAllInvoices').on('change', function() {
      $('.row-select').prop('checked', this.checked);
    });

    // Row select: update Select All if any unchecked
    $('#invoiceTable').on('change', '.row-select', function() {
      const allChecked = $('.row-select:checked').length === $('.row-select').length;
      $('#selectAllInvoices').prop('checked', allChecked);
    });

    // Tab filtering
    function filterTable(filter) {
      // Clear all filters first
      table.search('').columns().search('').draw();
      
      if (filter === 'all') {
        // Show all records
        table.draw();
        return;
      }

      // Apply the appropriate filter
      if (filter === 'pending' || filter === 'flagged') {
        table.column(9).search('CLP Mismatch').draw();
      } else if (filter === 'approved') {
        table.column(8).search('Approved').draw();
      }
    }

    // Bind click events to tabs
    $('.dashboard-tabs .tab').off('click').on('click', function() {
      // Update active state
      $('.dashboard-tabs .tab').removeClass('active');
      $(this).addClass('active');
      
      // Get filter type from tab text
      const filter = $(this).text().trim().toLowerCase();
      filterTable(filter);
    });

    // Update tab counts
    function updateTabCounts() {
      if (!table) return;
      
      const total = table.rows().count();
      let pending = 0;
      let approved = 0;
      let flagged = 0;

      // Count rows for each category
      table.rows().every(function() {
        const data = this.data();
        if (data.Insights && data.Insights.includes('CLP Mismatch')) {
          pending++;
          flagged++;
        }
        if (data.Group && data.Group.includes('Approved')) {
          approved++;
        }
      });

      // Update badge counts
      $('.tab-badge').each(function() {
        const tab = $(this).parent().text().trim().toLowerCase();
        if (tab.includes('all')) $(this).text(total);
        if (tab.includes('pending')) $(this).text(pending);
        if (tab.includes('approved')) $(this).text(approved);
        if (tab.includes('flagged')) $(this).text(flagged);
      });
    }

    // Initial tab count update
    updateTabCounts();

    // Update counts when table is filtered
    table.on('search.dt', function() {
      updateTabCounts();
    });

    // Add row hover effect
    $('#invoiceTable tbody').on('mouseenter', 'tr', function() {
      $(this).addClass('table-hover');
    }).on('mouseleave', 'tr', function() {
      $(this).removeClass('table-hover');
    });

    // Add error handling for table operations
    table.on('error.dt', function(e, settings, techNote, message) {
      console.error('DataTables error:', message);
    });

  } catch (error) {
    console.error('Error initializing DataTable:', error);
  }
});

// Add custom styles for DataTables
const style = document.createElement('style');
style.textContent = `
  .dataTables_wrapper .dataTables_length,
  .dataTables_wrapper .dataTables_filter {
    margin-bottom: 1rem;
  }
  
  .dataTables_wrapper .dataTables_info {
    padding-top: 1rem;
  }
  
  .dataTables_wrapper .dataTables_paginate {
    padding-top: 1rem;
  }
  
  .dataTables_wrapper .dataTables_paginate .paginate_button {
    padding: 0.5rem 0.75rem;
    margin: 0 0.25rem;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    background: white;
    color: #0d6efd !important;
  }
  
  .dataTables_wrapper .dataTables_paginate .paginate_button.current {
    background: #0d6efd !important;
    color: white !important;
    border-color: #0d6efd;
  }
  
  .dataTables_wrapper .dataTables_paginate .paginate_button:hover {
    background: #e9ecef !important;
    border-color: #dee2e6;
    color: #0d6efd !important;
  }
  
  .badge-underbilled {
    background-color: #dc3545;
    color: white;
  }
  
  .badge-approved {
    background-color: #198754;
    color: white;
  }
  
  .badge-pending {
    background-color: #ffc107;
    color: #000;
  }

  .dashboard-table {
    width: 100% !important;
  }

  .dashboard-table td, 
  .dashboard-table th {
    padding: 0.75rem;
    vertical-align: middle;
  }

  .dashboard-table tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  .table-hover {
    background-color: rgba(0, 0, 0, 0.02) !important;
  }

  .dataTables_wrapper .dataTables_filter input {
    width: 100%;
    max-width: 300px;
  }

  .dataTables_wrapper .dataTables_length select {
    min-width: 80px;
  }

  .dataTables_wrapper .dataTables_info {
    color: #6c757d;
  }

  .dataTables_wrapper .dataTables_processing {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 0.25rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  }
`;
document.head.appendChild(style);

// Action Functions
function approveSelected() {
    const selectedRows = $('.row-select:checked').length;
    if (selectedRows === 0) {
        alert('Please select at least one invoice to approve.');
        return;
    }
    console.log('Approving selected invoices...');
}

function flagSelected() {
    const selectedRows = $('.row-select:checked').length;
    if (selectedRows === 0) {
        alert('Please select at least one invoice to flag.');
        return;
    }
    console.log('Flagging selected invoices...');
}

function exportSelected() {
    const selectedRows = $('.row-select:checked').length;
    if (selectedRows === 0) {
        alert('Please select at least one invoice to export.');
        return;
    }
    console.log('Exporting selected invoices...');
}

function submitSelected() {
    const selectedRows = $('.row-select:checked').length;
    if (selectedRows === 0) {
        alert('Please select at least one invoice to submit.');
        return;
    }
    console.log('Submitting selected invoices...');
}

// Action menu functionality
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
}

function editInvoice(id) {
    console.log('Editing invoice:', id);
}

function deleteInvoice(id) {
    console.log('Deleting invoice:', id);
} 