// DOM Ready
$(document).ready(function() {
  // Initialize DataTable
  const shopStatusTable = $('#shopStatusTable').DataTable({
    pageLength: 10,
    searching: true,
    ordering: true,
    info: true,
    responsive: true,
    dom: '<"table-wrapper"t>p',
    language: {
      search: "",
      searchPlaceholder: "Search..."
    }
  });

  // Initialize other tables
  const shopDetailsTable = $('#shopDetailsTable').DataTable({
    pageLength: 10,
    searching: false,
    ordering: true,
    info: false,
    responsive: true,
    dom: '<"table-wrapper"t>p'
  });

  const billingReadinessTable = $('#billingReadinessTable').DataTable({
    pageLength: 10,
    searching: false,
    ordering: true,
    info: false,
    responsive: true,
    dom: '<"table-wrapper"t>p'
  });

  const invoiceDetailsTable = $('#invoiceDetailsTable').DataTable({
    pageLength: 10,
    searching: false,
    ordering: true,
    info: false,
    responsive: true,
    dom: '<"table-wrapper"t>p'
  });

  // Queue Tab Handling
  $('.queue-tab').on('click', function() {
    $('.queue-tab').removeClass('active');
    $(this).addClass('active');
    
    const queueType = $(this).data('queue');
    if (queueType === 'my') {
      // Show only Shop1 data for My Queue
      shopStatusTable.search('Shop1').draw();
    } else {
      // Show all shops data for Overall Queue
      shopStatusTable.search('').draw();
    }
  });

  // Handle row click to show details
  $('#shopStatusTable tbody').on('click', 'tr', function() {
    const data = shopStatusTable.row(this).data();
    showShopDetails(data);
  });

  // Handle action recommendation click
  $('.view-invoice-details').on('click', function() {
    const currentRow = $(this).closest('tr');
    const esn = currentRow.find('td:first-child span').text();
    const shopName = currentRow.find('td:first-child .fw-medium').text();
    showInvoiceDetails(esn, shopName);
  });

  // Sidebar Toggle
  $('.menu-toggle').on('click', function() {
    $('.sidebar').toggleClass('show');
  });

  // Close sidebar when clicking outside on mobile
  $(document).on('click', function(event) {
    const sidebar = $('.sidebar');
    const menuToggle = $('.menu-toggle');
    
    if (!sidebar.is(event.target) && sidebar.has(event.target).length === 0 &&
        !menuToggle.is(event.target) && menuToggle.has(event.target).length === 0) {
      sidebar.removeClass('show');
    }
  });

  // Initialize tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});

// Store the last viewed section for back navigation
let lastSection = 'shopStatusSection';

function showShopDetails(data) {
  // Update the section title with shop info
  const shopName = $(data[0]).find('.fw-medium').text();
  $('#shopDetailsSection .table-title').text(`Shop Details - ${shopName}`);
  
  // Clear and populate shop details table
  shopDetailsTable.clear();
  // Add sample data - in a real application, this would come from an API
  shopDetailsTable.row.add([
    '<div class="d-flex align-items-center gap-2"><div class="shop-icon"><i class="bi bi-shop"></i></div><div class="text-truncate"><div class="fw-medium">' + shopName + '</div><div class="small text-muted">ID: SH001</div></div></div>',
    '<div class="text-truncate"><div class="fw-medium">Customer1</div><div class="small text-muted">CID: C001</div></div>',
    'SN101',
    '3',
    '<span class="badge bg-primary">FULL</span>',
    '2024-11-21',
    '2025-03-20',
    '2025-04-10',
    'Final',
    '<span class="badge bg-danger">Past Due</span>',
    '1'
  ]).draw();
  
  // Update sections
  lastSection = 'shopStatusSection';
  $('#shopStatusSection').hide();
  $('#shopDetailsSection').show();
  $('#billingReadinessSection').hide();
  $('#invoiceDetailsSection').hide();
}

function showBillingReadiness(data) {
  // Update the section title with shop and ESN info
  const shopName = $(data[0]).find('.fw-medium').text();
  const esn = data[2];
  $('#billingReadinessSection .text-muted').text(`ESN: ${esn} - ${shopName}`);
  
  // Clear and populate billing readiness table
  billingReadinessTable.clear();
  // Add sample data - in a real application, this would come from an API
  billingReadinessTable.row.add([
    '<div class="d-flex align-items-center gap-2"><i class="bi bi-file-text text-primary"></i><span>Contract Details</span></div>',
    '<div class="readiness-indicator yes"><i class="bi bi-check"></i></div>',
    '<div class="small">Contract verified and validated</div><div class="small text-muted">All terms and conditions checked</div>',
    '<div class="small">2024-03-15</div><div class="small text-muted">10:30 AM</div>',
    '<button class="btn btn-sm btn-light view-invoice-details"><i class="bi bi-eye me-1"></i>View</button>'
  ]).draw();
  
  // Update sections
  lastSection = 'shopDetailsSection';
  $('#shopStatusSection').hide();
  $('#shopDetailsSection').hide();
  $('#billingReadinessSection').show();
  $('#invoiceDetailsSection').hide();
}

function showInvoiceDetails(esn, shopName) {
  // Update the section title with shop and ESN info
  $('#invoiceDetailsSection .text-muted').text(`ESN: ${esn} - ${shopName}`);
  
  // Clear and populate invoice details table
  invoiceDetailsTable.clear();
  // Add sample data - in a real application, this would come from an API
  invoiceDetailsTable.row.add([
    '<div class="fw-medium">INV-2024-001</div><div class="small text-muted">Ref: REF001</div>',
    '<div class="small">2024-03-15</div><div class="small text-muted">10:30 AM</div>',
    '<div class="fw-medium">$5,245.00</div><div class="small text-success">+TAX</div>',
    '<span class="badge bg-success">Paid</span>',
    '<div class="action-buttons"><button class="action-button" title="Download"><i class="bi bi-download"></i></button><button class="action-button" title="Print"><i class="bi bi-printer"></i></button><div class="dropdown"><button class="action-button" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></button><ul class="dropdown-menu dropdown-menu-end"><li><a class="dropdown-item" href="#"><i class="bi bi-eye me-2"></i>View Details</a></li><li><a class="dropdown-item" href="#"><i class="bi bi-pencil me-2"></i>Edit</a></li><li><hr class="dropdown-divider"></li><li><a class="dropdown-item text-danger" href="#"><i class="bi bi-trash me-2"></i>Delete</a></li></ul></div></div>'
  ]).draw();
  
  // Update sections
  lastSection = 'billingReadinessSection';
  $('#shopStatusSection').hide();
  $('#shopDetailsSection').hide();
  $('#billingReadinessSection').hide();
  $('#invoiceDetailsSection').show();
}

function showSection(sectionId) {
  // Update sections
  $('#shopStatusSection, #shopDetailsSection, #billingReadinessSection, #invoiceDetailsSection').hide();
  $(`#${sectionId}`).show();
  
  // Update last section for back navigation
  if (sectionId !== 'shopStatusSection') {
    lastSection = sectionId;
  }
} 