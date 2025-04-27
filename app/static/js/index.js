// Sample data for demonstration
const sampleData = {
  stats: {
    totalInvoices: 125,
    pendingInvoices: 45,
    completedInvoices: 80,
    totalAmount: 12500
  },
  shops: [
    {
      shop: "Shop A",
      customer: "Customer 1",
      esn: "ESN001",
      svNo: "SV001",
      status: "Pending",
      lastUpdated: "2024-04-27 10:30"
    },
    {
      shop: "Shop B",
      customer: "Customer 2",
      esn: "ESN002",
      svNo: "SV002",
      status: "Completed",
      lastUpdated: "2024-04-27 09:15"
    },
    {
      shop: "Shop C",
      customer: "Customer 3",
      esn: "ESN003",
      svNo: "SV003",
      status: "Pending",
      lastUpdated: "2024-04-27 11:45"
    }
  ],
  activities: [
    {
      type: "invoice",
      message: "New invoice created for Shop A",
      time: "10:30 AM"
    },
    {
      type: "status",
      message: "Status updated for Shop B",
      time: "09:15 AM"
    },
    {
      type: "payment",
      message: "Payment received for Shop C",
      time: "11:45 AM"
    }
  ]
};

// DOM Ready
$(document).ready(function () {
  // Sidebar Toggle
  $('.menu-toggle').on('click', function () {
    $('.sidebar').toggleClass('show');
  });

  // Close sidebar when clicking outside on mobile
  $(document).on('click', function (event) {
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

  // Initialize stats first
  updateStats();
  
  // Initialize mini charts
  initializeMiniCharts();

  // Initialize DataTable
  const shopTable = $('#shopStatusOverviewTable').DataTable({
    data: sampleData.shops,
    columns: [
      { data: 'shop' },
      { data: 'customer' },
      { data: 'esn' },
      { data: 'svNo' },
      { 
        data: 'status',
        render: function(data) {
          const statusClass = data === 'Completed' ? 'success' : 'warning';
          return `<span class="badge bg-${statusClass}">${data}</span>`;
        }
      },
      { data: 'lastUpdated' },
      {
        data: null,
        render: function() {
          return `
            <div class="btn-group">
              <button class="btn btn-sm btn-light" data-bs-toggle="tooltip" data-bs-title="View">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn btn-sm btn-light" data-bs-toggle="tooltip" data-bs-title="Edit">
                <i class="bi bi-pencil"></i>
              </button>
            </div>
          `;
        }
      }
    ],
    pageLength: 10,
    order: [[0, 'asc']],
    dom: '<"row"<"col-sm-12"tr>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
    language: {
      info: "Showing _START_ to _END_ of _TOTAL_ shops",
      paginate: {
        first: '<i class="bi bi-chevron-double-left"></i>',
        last: '<i class="bi bi-chevron-double-right"></i>',
        next: '<i class="bi bi-chevron-right"></i>',
        previous: '<i class="bi bi-chevron-left"></i>'
      }
    }
  });

  // Update total shops count
  $('#totalShops').text(`${sampleData.shops.length} Total Records`);

  // Initialize activities
  updateActivities();

  // Initialize Charts
  initializeCharts();

  // Shop search functionality
  $('#shopSearch').on('keyup', function () {
    shopTable.search(this.value).draw();
  });

  // Filter functionality
  $('.table-filters .btn').on('click', function () {
    $('.table-filters .btn').removeClass('active');
    $(this).addClass('active');

    const filter = $(this).data('filter');
    if (filter === 'all') {
      shopTable.search('').draw();
    } else {
      shopTable.search(filter).draw();
    }
  });

  // Queue tab switching with animation
  $('.queue-tab').on('click', function () {
    $('.queue-tab').removeClass('active');
    $(this).addClass('active');

    $('.table-container').fadeOut(200, function () {
      $(this).fadeIn(200);
    });
  });
});

// Update stats
function updateStats() {
  // Update stat values
  $('#totalInvoices').text(sampleData.stats.totalInvoices);
  $('#pendingInvoices').text(sampleData.stats.pendingInvoices);
  $('#completedInvoices').text(sampleData.stats.completedInvoices);
  $('#totalAmount').text(`$${sampleData.stats.totalAmount.toLocaleString()}`);
}

// Update activities
function updateActivities() {
  const activitiesList = $('#activitiesList');
  activitiesList.empty();

  sampleData.activities.forEach(activity => {
    const activityHtml = `
      <div class="activity-item">
        <div class="activity-icon">
          <i class="bi bi-${getActivityIcon(activity.type)}"></i>
        </div>
        <div class="activity-content">
          <div class="activity-message">${activity.message}</div>
          <div class="activity-time">${activity.time}</div>
        </div>
      </div>
    `;
    activitiesList.append(activityHtml);
  });
}

// Get activity icon based on type
function getActivityIcon(type) {
  const icons = {
    invoice: 'file-text',
    status: 'arrow-repeat',
    payment: 'currency-dollar'
  };
  return icons[type] || 'circle';
}

// Initialize mini charts
function initializeMiniCharts() {
  const createMiniChart = (ctx, data, color) => {
    if (!ctx) return;
    
    // Generate smooth data points
    const smoothData = data.map((value, index) => {
      const prev = index > 0 ? data[index - 1] : value;
      const next = index < data.length - 1 ? data[index + 1] : value;
      return (prev + value + next) / 3;
    });

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: new Array(smoothData.length).fill(''),
        datasets: [{
          data: smoothData,
          borderColor: color,
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          fill: true,
          backgroundColor: color + '10'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: { 
            display: false,
            grid: { display: false }
          },
          y: { 
            display: false,
            grid: { display: false }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });
  };

  // Initialize mini charts with more realistic data
  createMiniChart(
    document.getElementById('invoicesChart')?.getContext('2d'),
    [30, 35, 25, 45, 30, 55, 45, 50, 40, 60, 45, 70],
    '#4f46e5'
  );
  
  createMiniChart(
    document.getElementById('pendingBillingChart')?.getContext('2d'),
    [25, 30, 35, 40, 35, 45, 40, 35, 30, 25, 20, 15],
    '#f59e0b'
  );
  
  createMiniChart(
    document.getElementById('paidBillingChart')?.getContext('2d'),
    [45, 50, 40, 60, 45, 70, 60, 55, 65, 75, 70, 80],
    '#10b981'
  );
  
  createMiniChart(
    document.getElementById('overdueBillingChart')?.getContext('2d'),
    [15, 20, 25, 15, 20, 10, 15, 20, 25, 20, 15, 10],
    '#ef4444'
  );
}

// Charts Initialization
function initializeCharts() {
  // Delay Reasons Analysis Chart
  const delayReasonsOverviewCtx = document.getElementById('delayReasonsOverviewChart')?.getContext('2d');
  if (delayReasonsOverviewCtx) {
    new Chart(delayReasonsOverviewCtx, {
      type: 'doughnut',
      data: {
        labels: ['Capacity', 'Customer', 'Volume', 'Other'],
        datasets: [{
          data: [45, 30, 14, 21],
          backgroundColor: [
            '#4f46e5',
            '#10b981',
            '#f59e0b',
            '#6b7280'
          ],
          borderWidth: 0,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'white',
            titleColor: '#1e293b',
            bodyColor: '#1e293b',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            padding: 8,
            boxPadding: 4,
            usePointStyle: true,
            callbacks: {
              label: function (context) {
                const value = context.raw;
                const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  // Month over Month Timeliness Chart
  const timelinessOverviewCtx = document.getElementById('timelinessOverviewChart')?.getContext('2d');
  if (timelinessOverviewCtx) {
    new Chart(timelinessOverviewCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Monthly Value',
          data: [91, 23, 11, 9, 52, 12, 18, 6, 15, 8, 77, 4],
          borderColor: 'rgba(79, 70, 229, 1)',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgba(79, 70, 229, 1)',
          pointBorderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 4,
          order: 2
        }, {
          label: '3-Month Moving Average',
          data: [41.7, 14.3, 24, 24.3, 27.3, 12, 13, 9.7, 33.3, 29.7, 29.7, null],
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          borderDash: [4, 4],
          tension: 0.4,
          fill: false,
          pointRadius: 0,
          order: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              font: {
                size: 10
              },
              color: '#64748b',
              maxTicksLimit: 12
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            border: {
              dash: [4, 4]
            },
            beginAtZero: true,
            ticks: {
              font: {
                size: 10
              },
              color: '#64748b',
              padding: 6,
              maxTicksLimit: 6
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}

// Load header component
fetch('/static/components/header.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('headerComponent').innerHTML = html;
    // Initialize header after loading
    initializeHeader();
  })
  .catch(error => console.error('Error loading header:', error)); 