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

  // Initialize DataTables
  const shopTable = $('#shopStatusOverviewTable').DataTable({
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

  // Initialize Charts
  initializeCharts();
});

// Charts Initialization
function initializeCharts() {
  // Mini charts initialization
  const createMiniChart = (ctx, data, color) => {
    if (!ctx) return;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: new Array(data.length).fill(''),
        datasets: [{
          data: data,
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
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: { display: false }
        }
      }
    });
  };

  // Initialize mini charts
  createMiniChart(document.getElementById('invoicesChart')?.getContext('2d'),
    [30, 35, 25, 45, 30, 55, 45],
    '#4f46e5'
  );
  createMiniChart(document.getElementById('pendingBillingChart')?.getContext('2d'),
    [25, 30, 35, 40, 35, 45, 40],
    '#f59e0b'
  );
  createMiniChart(document.getElementById('paidBillingChart')?.getContext('2d'),
    [45, 50, 40, 60, 45, 70, 60],
    '#10b981'
  );
  createMiniChart(document.getElementById('overdueBillingChart')?.getContext('2d'),
    [15, 20, 25, 15, 20, 10, 15],
    '#ef4444'
  );

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
        labels: [
          'Apr 22', 'May 22', 'Jun 22', 'Jul 22', 'Aug 22', 'Sep 22', 'Oct 22', 'Nov 22',
          'Feb 23', 'Mar 23', 'Apr 23', 'May 23', 'Jun 23', 'Jul 23', 'Aug 23', 'Sep 23',
          'Oct 23', 'Nov 23', 'Dec 23', 'Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24',
          'Jun 24', 'Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24'
        ],
        datasets: [{
          label: 'Monthly Value',
          data: [91, 23, 11, 9, 52, 12, 18, 6, 15, 8, 77, 4, 113, 17, 56, 26, 49, 30, 4, 64, 25, 97, 107, 62, 66, 86, 90, 105, 75, 50],
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
          data: [null, 41.7, 14.3, 24, 24.3, 27.3, 12, 13, 9.7, 33.3, 29.7, 64.7, 44.7, 62, 33, 43.7, 35, 27.7, 32.7, 31, 62, 88.7, 88.7, 78.3, 71.3, 80.7, 93.7, 90, 76.7, null],
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
            titleFont: {
              size: 11,
              weight: '600'
            },
            bodyFont: {
              size: 11
            },
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(1);
                }
                return label;
              }
            }
          }
        }
      }
    });
  }
}
