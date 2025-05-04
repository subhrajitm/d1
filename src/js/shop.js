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

function showShopDetails(shopName) {
  // Hide overview, show details
  document.querySelector('.table-section').style.display = 'none';
  document.getElementById('shop-details-section').style.display = '';
  // Hide the table footer
  document.querySelector('.table-footer').style.display = 'none';

  // Filter data for the selected shop
  const filtered = shopDetailsData.filter(row => row.Shop === shopName);
  const tbody = document.querySelector('#shop-details-table tbody');
  tbody.innerHTML = '';
  filtered.forEach(row => {
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
      <td><span class="badge bg-danger">${row['Invoice Status']}</span></td>
      <td>${row.Priority}</td>
    `;
    tbody.appendChild(tr);
  });
  // Re-attach row click handlers
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
  document.getElementById('shop-details-section').style.display = 'none';
  document.getElementById('billing-readiness-section').style.display = '';
  // Hide table footer if present
  const footer = document.querySelector('.table-footer');
  if (footer) footer.style.display = 'none';

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
  document.getElementById('billing-readiness-section').style.display = 'none';
  document.getElementById('invoice-details-section').style.display = '';
  // Hide table footer if present
  const footer = document.querySelector('.table-footer');
  if (footer) footer.style.display = 'none';

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
      const esn = this.querySelector('td:nth-child(3)').textContent.trim();
      showBillingReadiness(esn);
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // ... existing code ...

  // After populating shop details, set up row click
  setupShopDetailsRowClick();

  // Back button: Billing Readiness -> Shop Details
  document.getElementById('back-to-shop-details').addEventListener('click', function() {
    document.getElementById('billing-readiness-section').style.display = 'none';
    document.getElementById('shop-details-section').style.display = '';
    // Hide Invoice Details if open
    document.getElementById('invoice-details-section').style.display = 'none';
    // Hide table footer if present
    const footer = document.querySelector('.table-footer');
    if (footer) footer.style.display = 'none';
    setupShopDetailsRowClick();
  });

  // Back button: Invoice Details -> Billing Readiness
  document.getElementById('back-to-billing-readiness').addEventListener('click', function() {
    document.getElementById('invoice-details-section').style.display = 'none';
    document.getElementById('billing-readiness-section').style.display = '';
    // Hide table footer if present
    const footer = document.querySelector('.table-footer');
    if (footer) footer.style.display = 'none';
  });

  // Delegate click for Action Recommendation (Review Invoice)
  document.getElementById('billing-readiness-table').addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('action-recommendation-btn')) {
      // Find ESN from the row
      const esn = e.target.closest('tr').querySelector('td').textContent.trim();
      showInvoiceDetails(esn);
    }
  });
}); 