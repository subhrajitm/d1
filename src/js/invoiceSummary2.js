// Initialize Bootstrap tooltips and sections
document.addEventListener('DOMContentLoaded', function() {
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Show all sections by default
  const sections = document.querySelectorAll('.invoice-summary-section, .recommendations-container, .impact-summary, .recommendation-section, .total-summary-card, .invoice-summary-line-section');
  sections.forEach(section => {
    section.style.display = 'block';
  });

  // Set stats-grid to grid display
  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    statsGrid.style.display = 'grid';
  }

  // Hide invoice view by default
  const invoiceView = document.querySelector('.invoice-view');
  if (invoiceView) {
    invoiceView.style.display = 'none';
  }

  // View toggle for stats-grid and invoice-view
  const viewToggleButtons = document.querySelectorAll('.toggle-btn');
  const totalSummaryCard = document.querySelector('.total-summary-card');
  const summaryLineSection = document.querySelector('.invoice-summary-line-section');
  
  viewToggleButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      viewToggleButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      
      const view = this.getAttribute('data-view');
      
      // Handle stats grid view
      if (statsGrid) {
        if (view === 'list') {
          statsGrid.classList.add('list-view');
        } else {
          statsGrid.classList.remove('list-view');
        }
      }
      
      // Handle invoice view
      if (invoiceView) {
        if (view === 'invoice') {
          invoiceView.style.display = 'block';
          if (statsGrid) statsGrid.style.display = 'none';
          if (totalSummaryCard) totalSummaryCard.style.display = 'none';
          if (summaryLineSection) summaryLineSection.style.display = 'none';
        } else {
          invoiceView.style.display = 'none';
          if (statsGrid) statsGrid.style.display = 'grid';
          if (totalSummaryCard) totalSummaryCard.style.display = 'block';
          if (summaryLineSection) summaryLineSection.style.display = 'flex';
        }
      }
    });
  });

  // Initialize event listeners for card action buttons
  document.querySelectorAll('.card-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const category = btn.getAttribute('data-category');
      const cardTitle = btn.closest('.rec-card').querySelector('h4').textContent;
      
      // Initialize and show the modal
      const modal = new bootstrap.Modal(document.getElementById('actionRecommendationModal'));
      const modalTitle = document.getElementById('actionRecommendationModalLabel');
      const fileList = document.getElementById('modal-file-list');
      const fileInput = document.querySelector('.file-input');
      const uploadArea = document.querySelector('.file-upload-area');
      const proceedBtn = document.getElementById('modal-proceed-btn');
      
      // Update modal title
      modalTitle.textContent = `Upload Documents - ${cardTitle}`;
      
      // Clear previous files
      fileList.innerHTML = '';
      fileInput.value = '';
      
      // Remove any existing event listeners
      const newFileInput = fileInput.cloneNode(true);
      fileInput.parentNode.replaceChild(newFileInput, fileInput);
      
      // Handle file input change
      newFileInput.addEventListener('change', (e) => {
        handleFileUpload(e.target.files);
      });
      
      // Handle drag and drop
      const handleDragOver = (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
      };
      
      const handleDragLeave = () => {
        uploadArea.classList.remove('dragover');
      };
      
      const handleDrop = (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFileUpload(e.dataTransfer.files);
      };
      
      uploadArea.addEventListener('dragover', handleDragOver);
      uploadArea.addEventListener('dragleave', handleDragLeave);
      uploadArea.addEventListener('drop', handleDrop);
      
      // Handle proceed button
      const handleProceed = () => {
        // Here you would typically handle the file upload to your server
        modal.hide();
      };
      
      proceedBtn.addEventListener('click', handleProceed);
      
      // Clean up event listeners when modal is hidden
      const modalElement = document.getElementById('actionRecommendationModal');
      modalElement.addEventListener('hidden.bs.modal', () => {
        uploadArea.removeEventListener('dragover', handleDragOver);
        uploadArea.removeEventListener('dragleave', handleDragLeave);
        uploadArea.removeEventListener('drop', handleDrop);
        proceedBtn.removeEventListener('click', handleProceed);
      }, { once: true });
      
      modal.show();
    });
  });

  // Function to handle file uploads
  function handleFileUpload(files) {
    const fileList = document.getElementById('modal-file-list');
    
    Array.from(files).forEach(file => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      
      const fileInfo = document.createElement('div');
      fileInfo.className = 'file-info';
      
      const fileIcon = document.createElement('div');
      fileIcon.className = 'file-icon';
      fileIcon.innerHTML = '<i class="bi bi-file-earmark"></i>';
      
      const fileName = document.createElement('div');
      fileName.className = 'file-name';
      fileName.textContent = file.name;
      
      const fileSize = document.createElement('div');
      fileSize.className = 'file-size';
      fileSize.textContent = formatFileSize(file.size);
      
      fileInfo.appendChild(fileIcon);
      fileInfo.appendChild(fileName);
      fileInfo.appendChild(fileSize);
      
      const removeButton = document.createElement('button');
      removeButton.className = 'remove-file';
      removeButton.innerHTML = '<i class="bi bi-x"></i>';
      removeButton.addEventListener('click', () => {
        fileItem.remove();
      });
      
      fileItem.appendChild(fileInfo);
      fileItem.appendChild(removeButton);
      fileList.appendChild(fileItem);
    });
  }

  // Function to format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Initialize filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      
      const priority = this.dataset.priority;
      filterRecommendations(priority);
    });
  });

  // Close review section
  const closeReviewBtn = document.getElementById('closeReview');
  if (closeReviewBtn) {
    closeReviewBtn.addEventListener('click', function() {
      document.getElementById('invoiceReviewSection').style.display = 'none';
    });
  }

  // Initialize tab switching
  const tabButtons = document.querySelectorAll('.view-style-tab');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.dataset.bsTarget.replace('#', '');
      switchTab(tabId);
    });
  });
});

// Function to open invoice review
function openInvoiceReview(category) {
  const reviewSection = document.getElementById('invoiceReviewSection');
  if (reviewSection) {
    reviewSection.style.display = 'block';
    // Update review content based on category
    updateReviewContent(category);
  }
}

// Function to update review content
function updateReviewContent(category) {
  // Update content based on category
  const reviewTitle = document.querySelector('.review-title');
  if (reviewTitle) {
    reviewTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Review`;
  }
  
  // Update other content elements as needed
  // This is where you would update the detailed breakdown, recommendations, etc.
}

// Function to filter recommendations
function filterRecommendations(priority) {
  const recommendations = document.querySelectorAll('.rec-card');
  recommendations.forEach(rec => {
    if (priority === 'all' || rec.classList.contains(priority)) {
      rec.style.display = 'block';
    } else {
      rec.style.display = 'none';
    }
  });
}

// Function to handle tab switching
function switchTab(tabId) {
  const tabs = document.querySelectorAll('.view-style-tab');
  const tabContents = document.querySelectorAll('.tab-pane');
  
  // Remove active class from all tabs and contents
  tabs.forEach(tab => tab.classList.remove('active'));
  tabContents.forEach(content => content.classList.remove('show', 'active'));
  
  // Add active class to selected tab and content
  const selectedTab = document.querySelector(`[data-bs-target="#${tabId}"]`);
  const selectedContent = document.getElementById(tabId);
  
  if (selectedTab) selectedTab.classList.add('active');
  if (selectedContent) selectedContent.classList.add('show', 'active');
}

// Function to handle Excel download
function downloadExcel() {
  // Get all tables
  const tables = document.querySelectorAll('.invoice-view table');
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Define styles
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "4F46E5" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "FFFFFF" } },
      bottom: { style: "thin", color: { rgb: "FFFFFF" } },
      left: { style: "thin", color: { rgb: "FFFFFF" } },
      right: { style: "thin", color: { rgb: "FFFFFF" } }
    }
  };

  const cellStyle = {
    alignment: { vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "E5E7EB" } },
      bottom: { style: "thin", color: { rgb: "E5E7EB" } },
      left: { style: "thin", color: { rgb: "E5E7EB" } },
      right: { style: "thin", color: { rgb: "E5E7EB" } }
    }
  };

  const amountStyle = {
    ...cellStyle,
    alignment: { horizontal: "right", vertical: "center" },
    numFmt: '"$"#,##0.00'
  };

  const totalStyle = {
    ...headerStyle,
    font: { bold: true, color: { rgb: "4F46E5" } },
    fill: { fgColor: { rgb: "F8FAFC" } }
  };
  
  // Process each table
  tables.forEach((table, index) => {
    // Convert table to worksheet
    const ws = XLSX.utils.table_to_sheet(table, { raw: true });
    
    // Get range of data
    const range = XLSX.utils.decode_range(ws['!ref']);
    
    // Apply styles
    for(let R = range.s.r; R <= range.e.r; ++R) {
      for(let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = {c: C, r: R};
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        
        if(!ws[cell_ref]) continue;
        
        // Apply header style to first row
        if(R === 0) {
          ws[cell_ref].s = headerStyle;
        } 
        // Apply amount style to cells in last column
        else if(C === range.e.c && ws[cell_ref].v !== undefined) {
          ws[cell_ref].s = amountStyle;
        }
        // Apply total style to total row
        else if(R === range.e.r && ws[cell_ref].v !== undefined) {
          ws[cell_ref].s = totalStyle;
        }
        // Apply default cell style
        else {
          ws[cell_ref].s = cellStyle;
        }
      }
    }
    
    // Set column widths
    const colWidths = [];
    for(let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 10;
      for(let R = range.s.r; R <= range.e.r; ++R) {
        const cell = ws[XLSX.utils.encode_cell({c: C, r: R})];
        if(cell && cell.v) {
          const cellWidth = String(cell.v).length;
          maxWidth = Math.max(maxWidth, cellWidth);
        }
      }
      colWidths.push({ wch: maxWidth + 2 });
    }
    ws['!cols'] = colWidths;
    
    // Add worksheet to workbook with descriptive name
    const sheetNames = ['Address_Info', 'Invoice_Details', 'Cost_Breakdown'];
    XLSX.utils.book_append_sheet(wb, ws, sheetNames[index] || `Sheet${index + 1}`);
  });
  
  // Generate Excel file
  const fileName = `Invoice_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
} 