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
    showBillingReadiness(data);
  });

  // Handle action recommendation click
  $('.view-invoice-details').on('click', function() {
    showInvoiceDetails();
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

function showBillingReadiness(data) {
  $('#shopStatusSection').hide();
  $('#billingReadinessSection').show();
  $('#invoiceDetailsSection').hide();
}

function showInvoiceDetails() {
  $('#shopStatusSection').hide();
  $('#billingReadinessSection').hide();
  $('#invoiceDetailsSection').show();
}

function showSection(sectionId) {
  $('#shopStatusSection, #billingReadinessSection, #invoiceDetailsSection').hide();
  $(`#${sectionId}`).show();
} 