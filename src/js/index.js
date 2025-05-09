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

  // Initialize Charts
  initializeCharts();
});

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

  // Contract Status Chart (Customer breakdown)
  const contractStatusCtx = document.getElementById('contractStatusChart')?.getContext('2d');
  if (contractStatusCtx) {
    // Data
    const customers = ['Customer1', 'Customer2', 'Customer3', 'Customer4', 'Customer5', 'Customer6', 'Customer7', 'Customer8', 'Customer9', 'Customer10'];
    const late = [20, 17, 16, 6, 15, 15, 14, 7, 4, 2];
    const onTime = [9, 8, 1, 56, 61, 3, 0, 32, 1, 7];
    // Calculate totals and percentages
    const totals = late.map((l, i) => l + onTime[i]);
    const latePct = late.map((l, i) => totals[i] ? (l / totals[i]) * 100 : 0);
    const onTimePct = onTime.map((o, i) => totals[i] ? (o / totals[i]) * 100 : 0);
    const totalContracts = totals.reduce((a, b) => a + b, 0);
    const totalLate = late.reduce((a, b) => a + b, 0);
    const totalOnTime = onTime.reduce((a, b) => a + b, 0);
    const overallLatePct = totalContracts ? (totalLate / totalContracts) * 100 : 0;
    const overallOnTimePct = totalContracts ? (totalOnTime / totalContracts) * 100 : 0;
    // Find best/worst
    const bestIdx = onTimePct.indexOf(Math.max(...onTimePct));
    const worstIdx = latePct.indexOf(Math.max(...latePct));
    // Bar colors
    const lateColors = late.map((_, i) => i === worstIdx ? 'rgba(239, 68, 68, 1)' : 'rgba(239, 68, 68, 0.7)');
    const onTimeColors = onTime.map((_, i) => i === bestIdx ? 'rgba(16, 185, 129, 1)' : 'rgba(16, 185, 129, 0.7)');
    // Chart
    new Chart(contractStatusCtx, {
      type: 'bar',
      data: {
        labels: customers,
        datasets: [
          {
            label: 'Late',
            data: late,
            backgroundColor: lateColors,
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1
          },
          {
            label: 'On Time',
            data: onTime,
            backgroundColor: onTimeColors,
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
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
              label: function(context) {
                const idx = context.dataIndex;
                const l = late[idx];
                const o = onTime[idx];
                const t = totals[idx];
                const lPct = latePct[idx].toFixed(1);
                const oPct = onTimePct[idx].toFixed(1);
                if (context.dataset.label === 'Late') {
                  return `Late: ${l} (${lPct}%) of ${t}`;
                } else {
                  return `On Time: ${o} (${oPct}%) of ${t}`;
                }
              },
              afterBody: function(context) {
                const idx = context[0].dataIndex;
                return `Total: ${totals[idx]}`;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: { color: '#64748b', font: { size: 10 } }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: { color: '#64748b', font: { size: 10 } }
          }
        }
      }
    });
    // Summary box
    const summaryDiv = document.getElementById('contractSummary');
    if (summaryDiv) {
      summaryDiv.innerHTML = `
        <style>
          .contract-pill { 
            display: flex; 
            align-items: center; 
            gap: 0.3em; 
            border-radius: 999px; 
            padding: 0.2em 0.7em; 
            font-weight: 500; 
            font-size: 0.9em; 
            background: white; 
            border: 1px solid #e2e8f0;
            transition: transform 0.2s;
          }
          .contract-pill:hover { 
            transform: translateY(-1px); 
            cursor: pointer; 
          }
          .contract-pill .contract-num { 
            font-weight: 600; 
            margin-left: 0.2em; 
          }
          .contract-pill i { 
            font-size: 0.9em; 
          }
          .contract-pill-total { color: #334155; }
          .contract-pill-late { color: #b91c1c; }
          .contract-pill-ontime { color: #15803d; }
          .contract-pill-best { color: #6d28d9; }
          .contract-pill-worst { color: #b45309; }
          .contract-summary-divider { 
            width: 1px; 
            height: 1.2em; 
            background: #e2e8f0; 
            margin: 0 0.4em; 
          }
          @media (max-width: 600px) { 
            #contractSummary { 
              flex-direction: column !important; 
              align-items: stretch !important; 
              gap: 0.3rem !important; 
            } 
            .contract-summary-divider { 
              display: none; 
            } 
          }
        </style>
        <span class="contract-pill contract-pill-total"><i class='bi bi-collection me-1'></i> Total <span class='contract-num'>${totalContracts}</span></span>
        <span class="contract-pill contract-pill-late"><i class='bi bi-exclamation-circle me-1'></i> Late <span class='contract-num'>${totalLate} (${overallLatePct.toFixed(1)}%)</span></span>
        <span class="contract-pill contract-pill-ontime"><i class='bi bi-check-circle me-1'></i> On Time <span class='contract-num'>${totalOnTime} (${overallOnTimePct.toFixed(1)}%)</span></span>
        <span class="contract-summary-divider"></span>
        <span class="contract-pill contract-pill-best"><i class='bi bi-star-fill me-1'></i> Best <span class='contract-num'>${customers[bestIdx]} (${onTimePct[bestIdx].toFixed(1)}%)</span></span>
        <span class="contract-pill contract-pill-worst"><i class='bi bi-emoji-frown-fill me-1'></i> Worst <span class='contract-num'>${customers[worstIdx]} (${latePct[worstIdx].toFixed(1)}%)</span></span>
      `;
    }
  }
}
