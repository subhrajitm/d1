// Initialize page
$(document).ready(function() {
  // Initialize tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  // Initialize DataTables
  const shopStatusTable = $('#shop-status-table').DataTable({
    order: [[1, 'desc']],
    pageLength: 10,
    language: {
      search: '',
      searchPlaceholder: 'Search shops...'
    }
  });

  // Handle search input
  $('.table-search input').on('keyup', function() {
    shopStatusTable.search(this.value).draw();
  });

  // Handle filter button click
  $('.filter-btn').on('click', function() {
    // Add filter functionality here
    console.log('Filter button clicked');
  });

  // Handle tab changes
  $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function(e) {
    const target = $(e.target).data('bs-target');
    // Refresh table data based on selected tab
    console.log('Tab changed:', target);
  });

  // Handle pagination
  $('.page-btn').on('click', function() {
    if ($(this).hasClass('disabled')) return;
    const direction = $(this).find('i').hasClass('bi-chevron-left') ? 'prev' : 'next';
    // Handle pagination logic here
    console.log('Pagination:', direction);
  });

  // Handle sidebar toggle
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
});

// Shop details data extracted from the image
const shopDetailsData = [
  {
    Shop: 'Shop1', Customer: 'Customer1', ESN: 'SN101', 'SV No': 3, 'SV Type': 'FULL',
    'Induction Date': '2024-11-21', 'Shipment Date': '2025-03-20', 'Entitlement Date': '2025-04-10',
    'Invoice Type': 'Final', 'Invoice Status': 'Past Due', Priority: 1
  },
  {
    Shop: 'Shop1', Customer: 'Customer1', ESN: 'SN103', 'SV No': 2, 'SV Type': 'FULL',
    'Induction Date': '2024-11-21', 'Shipment Date': '2025-03-20', 'Entitlement Date': '2025-04-10',
    'Invoice Type': 'Final', 'Invoice Status': 'Past Due', Priority: 2
  }
];

// Centralized section show/hide logic and step indicator
function showSection(section) {
  // Hide all main sections
  document.querySelector('.table-section').style.display = 'none';
  document.getElementById('shop-details-section').style.display = 'none';
  document.getElementById('billing-readiness-section').style.display = 'none';
  document.getElementById('invoice-details-section').style.display = 'none';
  const footer = document.querySelector('.table-footer');
  if (footer) footer.style.display = 'none';

  // Stepper: remove .active and .completed from all steps
  const steps = [
    'stepper-shop-overview',
    'stepper-shop-details',
    'stepper-billing-readiness',
    'stepper-invoice-details'
  ];
  steps.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('active', 'completed');
    }
  });

  // Determine current step index
  let currentIdx = 0;
  if (section === 'overview') currentIdx = 0;
  else if (section === 'shop-details') currentIdx = 1;
  else if (section === 'billing-readiness') currentIdx = 2;
  else if (section === 'invoice-details') currentIdx = 3;

  // Mark completed and active steps
  steps.forEach((id, idx) => {
    const el = document.getElementById(id);
    if (el) {
      if (idx < currentIdx) el.classList.add('completed');
      else if (idx === currentIdx) el.classList.add('active');
    }
  });

  // Animate progress bar
  const progressBar = document.querySelector('.stepper-progress-bar');
  if (progressBar) {
    const percent = [0, 33, 66, 100][currentIdx];
    progressBar.style.background =
      `linear-gradient(90deg, #10b981 ${percent}%, #e5e7eb ${percent}%)`;
  }

  // Show the requested section and manage focus
  if (section === 'overview') {
    document.querySelector('.table-section').style.display = '';
    if (footer) footer.style.display = '';
    // Focus first View Details button
    const btn = document.querySelector('.view-details-btn');
    if (btn) btn.focus();
  } else if (section === 'shop-details') {
    document.getElementById('shop-details-section').style.display = '';
    // Focus first row
    const row = document.querySelector('#shop-details-table tbody tr');
    if (row) row.focus();
  } else if (section === 'billing-readiness') {
    document.getElementById('billing-readiness-section').style.display = '';
    // Focus first Action Recommendation button
    const btn = document.querySelector('.action-recommendation-btn');
    if (btn) btn.focus();
  } else if (section === 'invoice-details') {
    document.getElementById('invoice-details-section').style.display = '';
    // Focus first select
    const sel = document.querySelector('#invoice-details-table select');
    if (sel) sel.focus();
  }
}

function showShopDetails(shopName) {
  showSection('shop-details');
  // Filter data for the selected shop
  const filtered = shopDetailsData.filter(row => row.Shop === shopName);
  const tbody = document.querySelector('#shop-details-table tbody');
  tbody.innerHTML = '';
  filtered.forEach(row => {
    const tr = document.createElement('tr');
    tr.tabIndex = 0;
    tr.innerHTML = `
      <td>${row.Shop}</td>
      <td>${row.Customer}</td>
      <td>${row.ESN}</td>
      <td>${row['SV No']}</td>
      <td>${row['SV Type']}</td>
      <td>${row['Induction Date']}</td>
      <td>${row['Shipment Date']}</td>
      <td>${row['Entitlement Date']}</td>
      <td>${row['Invoice Type']}</td>
      <td><span class="badge bg-danger">${row['Invoice Status']}</span></td>
      <td>${row.Priority}</td>
    `;
    tbody.appendChild(tr);
  });
  // Re-attach row click handlers and highlight
  setupShopDetailsRowClick();
}

document.addEventListener('DOMContentLoaded', function() {
  // View Details button click
  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      // Find shop name from the row
      const shopName = this.closest('tr').querySelector('.shop-name').textContent.trim();
      showShopDetails(shopName);
    });
  });

  // Back button click
  document.getElementById('back-to-overview').addEventListener('click', function() {
    document.getElementById('shop-details-section').style.display = 'none';
    document.querySelector('.table-section').style.display = '';
    // Show the table footer again
    document.querySelector('.table-footer').style.display = '';
  });
});

// Billing Readiness data (from image)
const billingReadinessData = [
  {
    ESN: 'SN103',
    Shop: 'Shop1',
    'Contract Details': 'Yes',
    'SV Details': 'Yes',
    'Billing Receipt': 'Yes',
    'Warranty & Discount': 'No',
    'Action Recommendation': 'Review Invoice'
  },
  {
    ESN: 'SN101',
    Shop: 'Shop1',
    'Contract Details': 'Yes',
    'SV Details': 'Yes',
    'Billing Receipt': 'Yes',
    'Warranty & Discount': 'No',
    'Action Recommendation': 'Review Invoice'
  }
];

// Invoice Details data (from image)
const invoiceDetailsData = [
  {
    ESN: 'SN103',
    'Invoice Generated?': 'Yes',
    'Do you want to create Invoice?': 'NA',
    'Do you want to get Reminder?': 'No',
    'Frequency?': 'NA',
    Action: 'Review Invoice'
  },
  {
    ESN: 'SN101',
    'Invoice Generated?': 'Yes',
    'Do you want to create Invoice?': 'NA',
    'Do you want to get Reminder?': 'No',
    'Frequency?': 'NA',
    Action: 'Review Invoice'
  }
];

function showBillingReadiness(esn) {
  showSection('billing-readiness');
  // Filter data for the selected ESN
  const filtered = billingReadinessData.filter(row => row.ESN === esn);
  const tbody = document.querySelector('#billing-readiness-table tbody');
  tbody.innerHTML = '';
  filtered.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.ESN}</td>
      <td>${row.Shop}</td>
      <td class="bg-success text-white">${row['Contract Details'] === 'Yes' ? 'Yes' : 'No'}</td>
      <td class="bg-success text-white">${row['SV Details'] === 'Yes' ? 'Yes' : 'No'}</td>
      <td class="bg-success text-white">${row['Billing Receipt'] === 'Yes' ? 'Yes' : 'No'}</td>
      <td class="${row['Warranty & Discount'] === 'No' ? 'bg-danger text-white' : 'bg-success text-white'}">${row['Warranty & Discount']}</td>
      <td><button class="btn btn-primary btn-sm action-recommendation-btn">${row['Action Recommendation']}</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function showInvoiceDetails(esn) {
  showSection('invoice-details');
  // Filter data for the selected ESN
  const filtered = invoiceDetailsData.filter(row => row.ESN === esn);
  const tbody = document.querySelector('#invoice-details-table tbody');
  tbody.innerHTML = '';
  filtered.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.ESN}</td>
      <td><select class="form-select form-select-sm"><option>Yes</option><option>No</option></select></td>
      <td><select class="form-select form-select-sm"><option>NA</option><option>Yes</option><option>No</option></select></td>
      <td><select class="form-select form-select-sm"><option>No</option><option>Yes</option></select></td>
      <td><select class="form-select form-select-sm"><option>NA</option><option>Daily</option><option>Weekly</option></select></td>
      <td><button class="btn btn-primary btn-sm">Review Invoice</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// Add event listeners for new navigation and actions
function setupShopDetailsRowClick() {
  document.querySelectorAll('#shop-details-table tbody tr').forEach(row => {
    row.addEventListener('click', function() {
      // Remove highlight from all rows
      document.querySelectorAll('#shop-details-table tbody tr').forEach(r => r.classList.remove('table-active'));
      // Highlight this row
      this.classList.add('table-active');
      const esn = this.querySelector('td:nth-child(3)').textContent.trim();
      showBillingReadiness(esn);
    });
    // Keyboard accessibility: Enter/Space triggers click
    row.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // ... existing code ...

  // After populating shop details, set up row click
  setupShopDetailsRowClick();

  // Back button: Billing Readiness -> Shop Details
  document.getElementById('back-to-shop-details').addEventListener('click', function() {
    showSection('shop-details');
    setupShopDetailsRowClick();
  });

  // Back button: Invoice Details -> Billing Readiness
  document.getElementById('back-to-billing-readiness').addEventListener('click', function() {
    showSection('billing-readiness');
  });

  // Delegate click for Action Recommendation (Review Invoice)
  document.getElementById('billing-readiness-table').addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('action-recommendation-btn')) {
      // Find ESN from the row
      const esn = e.target.closest('tr').querySelector('td').textContent.trim();
      showInvoiceDetails(esn);
    }
  });

  setupStepperNavigation();
});

// Stepper navigation: allow clicking or pressing Enter/Space on completed steps
function setupStepperNavigation() {
  const steps = [
    { id: 'stepper-shop-overview', section: 'overview' },
    { id: 'stepper-shop-details', section: 'shop-details' },
    { id: 'stepper-billing-readiness', section: 'billing-readiness' },
    { id: 'stepper-invoice-details', section: 'invoice-details' }
  ];
  steps.forEach((step, idx) => {
    const el = document.getElementById(step.id);
    if (!el) return;
    // Remove previous listeners
    el.onclick = null;
    el.onkeydown = null;
    // Only allow navigation to completed steps (not current or future)
    el.addEventListener('click', function() {
      if (el.classList.contains('completed')) {
        showSection(step.section);
      }
    });
    el.addEventListener('keydown', function(e) {
      if ((e.key === 'Enter' || e.key === ' ') && el.classList.contains('completed')) {
        e.preventDefault();
        showSection(step.section);
      }
    });
  });
}

// Also call setupStepperNavigation after every showSection to update listeners
const _originalShowSection = showSection;
showSection = function(section) {
  _originalShowSection(section);
  setupStepperNavigation();
}; 