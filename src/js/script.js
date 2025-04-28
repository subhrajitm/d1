// Toggle sidebar on mobile
document.querySelector('.header-icon.d-lg-none').addEventListener('click', function() {
  document.querySelector('.sidebar').classList.toggle('show');
});

// Add ripple effect to buttons
document.querySelectorAll('.btn, .header-icon').forEach(button => {
  button.addEventListener('click', function(e) {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.animation = 'ripple 0.6s linear';
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add hover effect to table rows
document.querySelectorAll('.product-table tbody tr').forEach(row => {
  row.addEventListener('mouseenter', function() {
    this.style.transform = 'translateX(8px)';
  });
  
  row.addEventListener('mouseleave', function() {
    this.style.transform = 'translateX(0)';
  });
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add loading animation to stats
function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Animate stats on page load
document.querySelectorAll('.stat-value').forEach(stat => {
  const value = parseInt(stat.innerText.replace(/[^0-9]/g, ''));
  stat.innerText = '0';
  animateValue(stat, 0, value, 2000);
});

// Initialize Sales Chart
const salesChartElement = document.getElementById('salesChart');
if (salesChartElement) {
  const ctx = salesChartElement.getContext('2d');
  const salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'This Period',
          data: [65000, 75000, 63000, 80000, 72000, 80225],
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
          backgroundColor: 'transparent',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Last Period',
          data: [55000, 60000, 48000, 58000, 63000, 68000],
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-light').trim(),
          backgroundColor: 'transparent',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'var(--card-bg)',
          titleColor: 'var(--text-color)',
          bodyColor: 'var(--text-color)',
          borderColor: 'var(--border-color)',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: 'var(--text-secondary)'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'var(--border-color)',
            drawBorder: false
          },
          ticks: {
            color: 'var(--text-secondary)',
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

// Add interactivity to legend items
document.querySelectorAll('.legend-item').forEach((item, index) => {
  item.addEventListener('click', () => {
    const dataset = salesChart.data.datasets[index];
    dataset.hidden = !dataset.hidden;
    salesChart.update();
    
    // Update legend item opacity
    item.style.opacity = dataset.hidden ? 0.5 : 1;
  });
});


// Add interactivity to refresh button
const refreshButton = document.querySelector('.chart-action-btn:nth-child(2)');
if (refreshButton) {
  refreshButton.addEventListener('click', function() {
    this.querySelector('i').style.transform = 'rotate(360deg)';
    setTimeout(() => {
      this.querySelector('i').style.transform = 'none';
    }, 1000);

    // Simulate data refresh
    const randomFactor = Math.random() * 0.2 + 0.9;
    salesChart.data.datasets[0].data = salesChart.data.datasets[0].data.map(value => 
      Math.round(value * randomFactor)
    );
    salesChart.update();

    // Update total value with animation
    const latestValue = salesChart.data.datasets[0].data[salesChart.data.datasets[0].data.length - 1];
    animateValue(document.querySelector('.chart-value'), 
      parseInt(document.querySelector('.chart-value').textContent.replace(/[^0-9]/g, '')),
      latestValue, 
      1000
    );
  });
}

// Table Functionality
document.addEventListener('DOMContentLoaded', function() {
  const table = document.getElementById('advancedTable');
  if (!table) return;

  const searchInput = document.getElementById('tableSearch');
  const statusFilter = document.getElementById('statusFilter');
  const rowsPerPage = document.getElementById('rowsPerPage');
  const pagination = document.querySelector('.pagination');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  let currentPage = 1;
  let currentSort = { column: null, direction: 'asc' };

  // Search functionality
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    filterAndPaginate();
  });

  // Status filter functionality
  statusFilter.addEventListener('change', function() {
    filterAndPaginate();
  });

  // Rows per page functionality
  rowsPerPage.addEventListener('change', function() {
    currentPage = 1;
    filterAndPaginate();
  });

  // Sort functionality
  table.querySelectorAll('th.sortable').forEach(header => {
    header.addEventListener('click', function() {
      const column = this.dataset.sort;
      const direction = currentSort.column === column && currentSort.direction === 'asc' ? 'desc' : 'asc';
      
      // Update sort indicators
      table.querySelectorAll('th.sortable i').forEach(icon => {
        icon.className = 'bi bi-arrow-down-up';
      });
      this.querySelector('i').className = `bi bi-arrow-${direction === 'asc' ? 'up' : 'down'}`;
      
      currentSort = { column, direction };
      filterAndPaginate();
    });
  });

  // Filter and paginate function
  function filterAndPaginate() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    const itemsPerPage = parseInt(rowsPerPage.value);
    
    // Filter rows
    const filteredRows = rows.filter(row => {
      const text = row.textContent.toLowerCase();
      const status = row.querySelector('.badge')?.textContent || '';
      return text.includes(searchTerm) && (!statusValue || status === statusValue);
    });

    // Sort rows
    if (currentSort.column) {
      filteredRows.sort((a, b) => {
        const aValue = a.querySelector(`td:nth-child(${getColumnIndex(currentSort.column)})`).textContent;
        const bValue = b.querySelector(`td:nth-child(${getColumnIndex(currentSort.column)})`).textContent;
        
        if (currentSort.column === 'salary') {
          return currentSort.direction === 'asc' 
            ? parseFloat(aValue.replace(/[^0-9.-]+/g, '')) - parseFloat(bValue.replace(/[^0-9.-]+/g, ''))
            : parseFloat(bValue.replace(/[^0-9.-]+/g, '')) - parseFloat(aValue.replace(/[^0-9.-]+/g, ''));
        } else if (currentSort.column === 'age' || currentSort.column === 'startDate') {
          return currentSort.direction === 'asc' 
            ? new Date(aValue) - new Date(bValue)
            : new Date(bValue) - new Date(aValue);
        } else {
          return currentSort.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
      });
    }

    // Calculate pagination
    const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
    currentPage = Math.min(currentPage, totalPages);
    
    // Update pagination
    updatePagination(totalPages);
    
    // Show current page rows
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentPageRows = filteredRows.slice(start, end);
    
    // Update table
    tbody.innerHTML = '';
    currentPageRows.forEach(row => tbody.appendChild(row));
  }

  // Get column index from data-sort attribute
  function getColumnIndex(column) {
    const headers = Array.from(table.querySelectorAll('th'));
    return headers.findIndex(header => header.dataset.sort === column) + 1;
  }

  // Update pagination
  function updatePagination(totalPages) {
    if (totalPages <= 1) {
      pagination.style.display = 'none';
      return;
    }
    
    pagination.style.display = 'flex';
    const paginationList = pagination.querySelector('ul');
    paginationList.innerHTML = '';
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" tabindex="-1">Previous</a>`;
    prevLi.addEventListener('click', e => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        filterAndPaginate();
      }
    });
    paginationList.appendChild(prevLi);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.className = `page-item ${i === currentPage ? 'active' : ''}`;
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.addEventListener('click', e => {
        e.preventDefault();
        currentPage = i;
        filterAndPaginate();
      });
      paginationList.appendChild(li);
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
    nextLi.addEventListener('click', e => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        filterAndPaginate();
      }
    });
    paginationList.appendChild(nextLi);
  }

  // Initialize
  filterAndPaginate();
});
