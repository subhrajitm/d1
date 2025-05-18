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
  
  // Hide all table footers
  document.querySelectorAll('.table-footer').forEach(footer => {
    footer.style.display = 'none';
  });

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
    // Show the footer for the active tab
    const activeTab = document.querySelector('.tab-pane.active');
    if (activeTab) {
      const footer = activeTab.querySelector('.table-footer');
      if (footer) footer.style.display = '';
    }
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

function hideAllTableSections() {
  document.querySelectorAll('.table-section').forEach(section => {
    section.style.display = 'none';
  });
}

function showShopDetails(shopName) {
  showSection('shop-details');
  // Filter data for the selected shop
  const filtered = shopDetailsData.filter(row => row.Shop === shopName);
  const tbody = document.querySelector('#shop-details-table tbody');
  tbody.innerHTML = '';
  filtered.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.Shop}</td>
      <td>${row.Customer}</td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <span class="highlight-esn">${row.ESN}</span>
          <button class="btn btn-sm btn-primary proceed-btn" data-esn="${row.ESN}" onclick="showBillingReadiness('${row.ESN}')">
            <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      </td>
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

  // Add click handler for Overall Queue table rows
  document.querySelectorAll('#overall-queue table tbody tr').forEach(row => {
    row.addEventListener('click', function() {
      showOverallDetailsTable();
    });
  });
  // Back button handler for Shop2 Details
  const backBtn = document.getElementById('back-to-overall-queue');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      hideAllTableSections();
      document.querySelector('.tab-pane#overall-queue').style.display = '';
      // Show the table footer again
      const footer = document.querySelector('.table-footer');
      if (footer) footer.style.display = '';
    });
  }
  // Back button: Billing Readiness -> Shop2 Details
  document.getElementById('back-to-shop2-details').addEventListener('click', function() {
    hideAllTableSections();
    document.getElementById('overall-details-section').style.display = '';
  });
  // Back button: Invoice Details -> Billing Readiness
  document.getElementById('back-to-shop2-billing-readiness').addEventListener('click', function() {
    hideAllTableSections();
    document.getElementById('shop2-billing-readiness-section').style.display = '';
  });
  // Back button: Billing Readiness -> Shop Details
  document.getElementById('back-to-shop-details').addEventListener('click', function() {
    hideAllTableSections();
    document.getElementById('shop-details-section').style.display = '';
  });
  // Back button: Invoice Details -> Billing Readiness (Shop Details flow)
  document.getElementById('back-to-billing-readiness').addEventListener('click', function() {
    hideAllTableSections();
    document.getElementById('billing-readiness-section').style.display = '';
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

// Data from the user's image for Shop2
const overallDetailsData = [
  { Shop: 'Shop2', Customer: 'Customer1', ESN: 'SN107', 'SV No': 2, 'SV Type': 'FULL', 'Induction Date': '2024-08-22', 'Shipment Date': '2024-10-27', 'Entitlement Date': '2024-11-17', 'Invoice Type': 'Initial', 'Invoice Status': 'Upcoming', Priority: 1 },
  { Shop: 'Shop2', Customer: 'Customer1', ESN: 'SN102', 'SV No': 4, 'SV Type': 'NDT', 'Induction Date': '2024-09-22', 'Shipment Date': '2024-11-28', 'Entitlement Date': '2024-12-19', 'Invoice Type': 'Initial', 'Invoice Status': 'Upcoming', Priority: 2 },
  { Shop: 'Shop2', Customer: 'Customer1', ESN: 'SN109', 'SV No': 5, 'SV Type': 'FULL', 'Induction Date': '2024-09-12', 'Shipment Date': '2024-11-21', 'Entitlement Date': '2024-12-12', 'Invoice Type': 'Progress', 'Invoice Status': 'No Due', Priority: 3 },
  { Shop: 'Shop2', Customer: 'Customer1', ESN: 'SN104', 'SV No': 4, 'SV Type': 'QT', 'Induction Date': '2024-09-11', 'Shipment Date': '2024-11-14', 'Entitlement Date': '2024-12-05', 'Invoice Type': 'Initial', 'Invoice Status': 'Upcoming', Priority: 4 },
  { Shop: 'Shop2', Customer: 'Customer1', ESN: 'SN132', 'SV No': 2, 'SV Type': 'QT', 'Induction Date': '2024-09-04', 'Shipment Date': '2024-11-05', 'Entitlement Date': '2024-11-26', 'Invoice Type': 'Progress', 'Invoice Status': 'No Due', Priority: 5 },
  { Shop: 'Shop2', Customer: 'Customer1', ESN: 'SN140', 'SV No': 4, 'SV Type': 'QT', 'Induction Date': '2024-08-27', 'Shipment Date': '2024-11-04', 'Entitlement Date': '2024-11-25', 'Invoice Type': 'Progress', 'Invoice Status': 'No Due', Priority: 6 },
  { Shop: 'Shop2', Customer: 'Customer1', ESN: 'SN118', 'SV No': 3, 'SV Type': 'QT', 'Induction Date': '2024-09-14', 'Shipment Date': '2024-11-20', 'Entitlement Date': '2024-12-11', 'Invoice Type': 'Progress', 'Invoice Status': 'No Due', Priority: 7 },
  { Shop: 'Shop2', Customer: 'Customer1', ESN: 'SN137', 'SV No': 3, 'SV Type': 'NDT', 'Induction Date': '2024-09-25', 'Shipment Date': '2024-12-01', 'Entitlement Date': '2024-12-22', 'Invoice Type': 'Progress', 'Invoice Status': 'No Due', Priority: 8 },
  { Shop: 'Shop2', Customer: 'Customer1', ESN: 'SN153', 'SV No': 3, 'SV Type': 'FULL', 'Induction Date': '2024-08-26', 'Shipment Date': '2024-11-01', 'Entitlement Date': '2024-11-22', 'Invoice Type': 'Progress', 'Invoice Status': 'No Due', Priority: 9 },
  { Shop: 'Shop2', Customer: 'Customer1', ESN: 'SN115', 'SV No': 5, 'SV Type': 'QT', 'Induction Date': '2024-08-27', 'Shipment Date': '2024-11-02', 'Entitlement Date': '2024-11-23', 'Invoice Type': 'Progress', 'Invoice Status': 'No Due', Priority: 10 }
];

function showOverallDetailsTable() {
  hideAllTableSections();
  document.getElementById('overall-details-section').style.display = '';
  // Hide the table footer
  const footer = document.querySelector('.table-footer');
  if (footer) footer.style.display = 'none';
  // Populate the table
  const tbody = document.querySelector('#overall-details-table tbody');
  tbody.innerHTML = '';
  overallDetailsData.forEach(row => {
    const tr = document.createElement('tr');
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
      <td><span class="badge ${row['Invoice Status'] === 'Upcoming' ? 'bg-warning' : 'bg-success'}">${row['Invoice Status']}</span></td>
      <td>${row.Priority}</td>
    `;
    tbody.appendChild(tr);
  });
  setupShop2DetailsRowClick();
}

function setupShop2DetailsRowClick() {
  document.querySelectorAll('#overall-details-table tbody tr').forEach(row => {
    row.addEventListener('click', function() {
      const esn = this.querySelector('td:nth-child(3)').textContent.trim();
      showShop2BillingReadiness(esn);
    });
  });
}

// Sample Billing Readiness data for Shop2 (demo, all Yes except Warranty & Discount)
const shop2BillingReadinessData = [
  // This demo will use the ESN from the row clicked
  // You can expand this array for more ESNs if needed
  {
    ESN: '', // to be filled dynamically
    Shop: 'Shop2',
    'Contract Details': 'Yes',
    'SV Details': 'Yes',
    'Billing Receipt': 'Yes',
    'Warranty & Discount': 'No',
    'Action Recommendation': 'Review/Create Invoice'
  }
];

// Sample Invoice Details data for Shop2 (demo)
const shop2InvoiceDetailsData = [
  {
    ESN: '', // to be filled dynamically
    'Invoice Generated?': 'Yes',
    'Do you want to create Invoice?': 'NA',
    'Do you want to get Reminder?': 'No',
    'Frequency?': 'NA',
    Action: 'Review Invoice'
  }
];

function showShop2BillingReadiness(esn) {
  // Hide all table sections
  document.querySelectorAll('.table-section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById('shop2-billing-readiness-section').style.display = '';
  // Fill ESN in demo data
  const data = shop2BillingReadinessData.map(row => ({ ...row, ESN: esn }));
  const tbody = document.querySelector('#shop2-billing-readiness-table tbody');
  tbody.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.ESN}</td>
      <td>${row.Shop}</td>
      <td class="bg-success text-white">${row['Contract Details']}</td>
      <td class="bg-success text-white">${row['SV Details']}</td>
      <td class="bg-success text-white">${row['Billing Receipt']}</td>
      <td class="bg-danger text-white">${row['Warranty & Discount']}</td>
      <td><button class="btn btn-primary btn-sm shop2-action-recommendation-btn">${row['Action Recommendation']}</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function showShop2InvoiceDetails(esn) {
  // Hide all table sections
  document.querySelectorAll('.table-section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById('shop2-invoice-details-section').style.display = '';
  // Fill ESN in demo data
  const data = shop2InvoiceDetailsData.map(row => ({ ...row, ESN: esn }));
  const tbody = document.querySelector('#shop2-invoice-details-table tbody');
  tbody.innerHTML = '';
  data.forEach(row => {
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

// Billing Readiness data (from image)
const billingReadinessData = [
  {
    ESN: 'SN103',
    Shop: 'Shop1',
    'Contract Details': 'Yes',
    'SV Details': 'Yes',
    'Billing Receipt': 'Yes',
    'Warranty & Discount': 'Yes',
    'Action Recommendation': 'Review/Create Invoice'
  },
  {
    ESN: 'SN101',
    Shop: 'Shop1',
    'Contract Details': 'Yes',
    'SV Details': 'Yes',
    'Billing Receipt': 'Yes',
    'Warranty & Discount': 'No',
    'Action Recommendation': 'Review/Create Invoice'
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
    const yesBadge = '<span class="status-badge-yes"><i class="bi bi-check-circle"></i> Yes</span>';
    const noBadge = '<span class="status-badge-no"><i class="bi bi-x-circle"></i> No</span>';
    const contractDetails = row['Contract Details'] === 'Yes' ? yesBadge : noBadge;
    const svDetails = row['SV Details'] === 'Yes' ? yesBadge : noBadge;
    const billingReceipt = row['Billing Receipt'] === 'Yes' ? yesBadge : noBadge;
    const warrantyDiscount = row['Warranty & Discount'] === 'Yes' ? yesBadge : noBadge;

    // Create recommendations array for all "No" values
    const recommendations = [];
    
    if (row['Contract Details'] === 'No') {
      recommendations.push({
        text: 'Contract details need to be updated',
        button: '<button class="btn btn-sm btn-primary ms-2">Update Contract</button>'
      });
    }
    if (row['SV Details'] === 'No') {
      recommendations.push({
        text: 'Service visit details need to be completed',
        button: '<button class="btn btn-sm btn-primary ms-2">Complete SV Details</button>'
      });
    }
    if (row['Billing Receipt'] === 'No') {
      recommendations.push({
        text: 'Billing receipt needs to be uploaded',
        button: '<button class="btn btn-sm btn-primary ms-2">Upload Receipt</button>'
      });
    }
    if (row['Warranty & Discount'] === 'No') {
      recommendations.push({
        text: 'Warranty and discount information needs to be verified',
        button: '<button class="btn btn-sm btn-primary ms-2">Verify Warranty</button>'
      });
    }

    // If all checks pass, show success message with proceed button
    if (recommendations.length === 0) {
      recommendations.push({
        text: 'All checks passed',
        button: '<button class="btn btn-sm btn-success proceed-btn" onclick="showInvoiceDetails(\'' + row.ESN + '\')">Proceed</button>'
      });
    }

    // Create recommendation HTML
    const recommendationHTML = recommendations.map(rec => `
      <div class="recommendation-item">
        <span class="recommendation-text">${rec.text}</span>
        ${rec.button}
      </div>
    `).join('');

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.ESN}</td>
      <td>${row.Shop}</td>
      <td>${contractDetails}</td>
      <td>${svDetails}</td>
      <td>${billingReceipt}</td>
      <td>${warrantyDiscount}</td>
      <td>
        <div class="recommendations-container">
          ${recommendationHTML}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Re-initialize tooltips for info icons
  if (window.bootstrap) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
}

function showInvoiceDetails(esn) {
  showSection('invoice-details');
  const invoiceGenerated = document.getElementById('invoiceGenerated');
  const createInvoice = document.getElementById('createInvoice');
  const reviewInvoiceBtn = document.getElementById('reviewInvoiceBtn');
  const createInvoiceBtn = document.getElementById('createInvoiceBtn');

  // Add event listeners for dynamic behavior
  invoiceGenerated.addEventListener('change', updateActionButtons);
  createInvoice.addEventListener('change', updateActionButtons);

  // Function to update action buttons based on selections
  function updateActionButtons() {
    const isGenerated = invoiceGenerated.value === 'yes';
    const shouldCreate = createInvoice.value === 'yes';

    reviewInvoiceBtn.style.display = isGenerated ? 'flex' : 'none';
    createInvoiceBtn.style.display = shouldCreate ? 'flex' : 'none';
  }

  // Initialize button states
  updateActionButtons();

  // Add click handlers for the buttons
  reviewInvoiceBtn.addEventListener('click', () => {
    console.log('Reviewing invoice for ESN:', esn);
    // Add your review invoice logic here
  });

  createInvoiceBtn.addEventListener('click', () => {
    console.log('Creating invoice for ESN:', esn);
    // Add your create invoice logic here
  });
} 