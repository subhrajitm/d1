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
  { Module: '54x', Class: 'Class2', Part: 'PN13', Desc: 'Desc13', Qty: 1, Unit: 281000, Total: 281000, Included: 0, Excluded: 281000, Insights: 'CLP Mismatch/Exclusion as LLP material', Group: '-' },
];

// Utility for formatting currency
function formatCurrency(num) {
  return '$' + num.toLocaleString();
}

function renderInvoiceDashboard() {
  const tbody = document.getElementById('invoiceDashboardBody');
  tbody.innerHTML = '';
  invoiceData.forEach((row, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" class="row-select"></td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <div class="avatar avatar-sm bg-primary text-white fw-bold">${row.Part[0]}</div>
          <span>${row.Part}</span>
        </div>
      </td>
      <td>${row.Module}</td>
      <td>${row.Class}</td>
      <td class="text-muted">${row.Desc}</td>
      <td>${row.Qty}</td>
      <td>$${row.Unit.toLocaleString()}</td>
      <td>$${row.Total.toLocaleString()}</td>
      <td>
        <span class="badge badge-${row.Group === 'Underbilled' ? 'underbilled' : 'approved'}">
          ${row.Group === 'Underbilled' ? 'Underbilled' : 'Approved'}
        </span>
      </td>
      <td>
        <span class="badge badge-pending">${row.Insights}</span>
      </td>
      <td class="actions">
        <button class="btn btn-sm btn-light"><i class="bi bi-three-dots"></i></button>
        <!-- Actions menu can be added here -->
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderInvoiceDashboard();

  // Select All functionality
  const selectAll = document.getElementById('selectAllInvoices');
  selectAll.addEventListener('change', function() {
    document.querySelectorAll('.row-select').forEach(cb => {
      cb.checked = selectAll.checked;
    });
  });

  // Row select: update Select All if any unchecked
  document.getElementById('invoiceDashboardBody').addEventListener('change', function(e) {
    if (e.target.classList.contains('row-select')) {
      const all = document.querySelectorAll('.row-select');
      const checked = document.querySelectorAll('.row-select:checked');
      selectAll.checked = all.length === checked.length;
    }
  });

  // Close info banner
  const closeBanner = document.querySelector('.close-banner');
  if (closeBanner) {
    closeBanner.addEventListener('click', function() {
      this.parentElement.style.display = 'none';
    });
  }
});

// Modern compact card/grid styles
const style = document.createElement('style');
style.innerHTML = `
  .invoice-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .invoice-card {
    background: #fff;
    border-radius: 0.75rem;
    padding: 1rem 0.75rem 0.75rem 0.75rem;
    box-shadow: 0 1px 4px #0072ce11;
    border: 1px solid #e5e7eb;
    transition: box-shadow 0.18s, transform 0.18s, opacity 0.4s, border-color 0.18s;
    position: relative;
    min-width: 0;
  }
  .invoice-card:hover {
    box-shadow: 0 4px 16px #0072ce22;
    transform: translateY(-2px) scale(1.015);
    border-color: #b6d4fe;
  }
  .invoice-card .badge {
    font-size: 0.75em;
    padding: 0.3em 0.6em;
    border-radius: 0.5em;
  }
  .invoice-card .small, .invoice-card .text-muted {
    font-size: 0.92em;
  }
`;
document.head.appendChild(style); 