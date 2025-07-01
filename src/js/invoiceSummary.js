// Initialize Bootstrap tooltips and sections
let isInitialized = false;
document.addEventListener('DOMContentLoaded', function() {
  if (isInitialized) {
    console.log('Already initialized, skipping...');
    return;
  }
  isInitialized = true;
  console.log('Initializing invoice summary page...');
  // Initialize all tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Get DOM elements
  const fileInput = document.getElementById('invoiceFile');
  const uploadBtn = document.getElementById('uploadBtn');
  const uploadSection = document.getElementById('uploadSection');
  const loaderSection = document.getElementById('loaderSection');
  const recommendationSection = document.getElementById('recommendationSection');
  const backToUploadBtn = document.getElementById('backToUpload');
  const uploadZone = document.getElementById('uploadZone');
  const viewToggle = document.querySelector('.view-toggle');
  const toggleButtons = viewToggle ? viewToggle.querySelectorAll('.toggle-btn') : [];
  const statsGrid = document.querySelector('.stats-grid');
  const invoiceView = document.querySelector('.invoice-view');
  const summaryLineSection = document.querySelector('.invoice-summary-line-section');
  const totalSummaryCard = document.querySelector('.total-summary-card');

  // Enhanced Upload Section Elements
  const uploadStats = document.querySelectorAll('.stat-item');
  const viewAllBtn = document.querySelector('.view-all-btn');
  const uploadItems = document.querySelectorAll('.upload-item');

  // Initialize sections
  function initializeSections() {
    if (loaderSection && recommendationSection && uploadSection) {
      // Hide all sections initially
      loaderSection.style.display = 'none';
      loaderSection.style.opacity = '0';
      recommendationSection.style.display = 'none';
      recommendationSection.style.opacity = '0';
      
      // Show upload section
      uploadSection.style.display = 'flex';
      uploadSection.style.opacity = '1';
    }
  }

  // Initialize sections on page load
  initializeSections();

  // Enhanced Upload Zone Functionality
  if (uploadZone) {
    // Drag and drop functionality
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    });

    // Click to browse - removed to prevent double upload
    // uploadZone.addEventListener('click', () => {
    //   fileInput.click();
    // });
  }

  // Handle file selection
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      console.log('File input change event triggered');
      if (this.files.length > 0) {
        console.log('File selected:', this.files[0].name);
        updateFileDisplay(this.files);
        // Start the upload process
        handleFileUpload(this.files[0]);
      }
    });
  }

  // Update file display in upload zone
  function updateFileDisplay(files) {
    const zoneContent = uploadZone.querySelector('.zone-content');
    if (zoneContent && files.length > 0) {
      const file = files[0];
      const fileName = file.name;
      const fileSize = (file.size / 1024 / 1024).toFixed(2); // Convert to MB
      
      zoneContent.innerHTML = `
        <i class="bi bi-file-earmark-text zone-icon"></i>
        <h4>${fileName}</h4>
        <p>${fileSize} MB • Ready to analyze</p>
        <div class="supported-formats">
          <span class="format-badge">PDF</span>
          <span class="format-badge">JPG</span>
          <span class="format-badge">PNG</span>
          <span class="format-badge">DOC</span>
          <span class="format-badge">DOCX</span>
        </div>
      `;
    }
  }

  // Recent Uploads Functionality
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      // Navigate to uploads history page
      console.log('Navigate to uploads history');
    });
  }

  if (uploadItems.length > 0) {
    uploadItems.forEach(item => {
      const actionBtns = item.querySelectorAll('.action-btn');
      actionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const title = this.getAttribute('title');
          handleUploadAction(title, item);
        });
      });
    });
  }

  function handleUploadAction(action, item) {
    const fileName = item.querySelector('.item-name').textContent;
    const status = item.querySelector('.status').textContent;
    
    switch(action) {
      case 'View Details':
        console.log(`Viewing details for ${fileName}`);
        showToast(`Opening details for ${fileName}`, 'success');
        break;
      case 'Download':
        console.log(`Downloading ${fileName}`);
        showToast(`Downloading ${fileName}`, 'info');
        break;
    }
  }

  // Toast notification function
  function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.style.cssText = `
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 12px 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 300px;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      border-left: 4px solid ${getToastColor(type)};
    `;

    const icon = document.createElement('i');
    icon.className = getToastIcon(type);
    icon.style.color = getToastColor(type);

    const messageEl = document.createElement('span');
    messageEl.textContent = message;
    messageEl.style.fontSize = '14px';
    messageEl.style.color = '#374151';

    toast.appendChild(icon);
    toast.appendChild(messageEl);

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 18px;
      color: #9ca3af;
      cursor: pointer;
      margin-left: auto;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    closeBtn.onclick = () => removeToast(toast);
    toast.appendChild(closeBtn);

    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(toast);
    }, 5000);
  }

  function removeToast(toast) {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  function getToastColor(type) {
    switch(type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': 
      default: return '#3b82f6';
    }
  }

  function getToastIcon(type) {
    switch(type) {
      case 'success': return 'bi bi-check-circle-fill';
      case 'error': return 'bi bi-x-circle-fill';
      case 'warning': return 'bi bi-exclamation-triangle-fill';
      case 'info': 
      default: return 'bi bi-info-circle-fill';
    }
  }

  // Upload button click handler
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      console.log('Upload button clicked');
      fileInput.click();
    });
  }

  // Back to upload button functionality
  if (backToUploadBtn) {
    backToUploadBtn.addEventListener('click', () => {
      if (uploadSection && loaderSection && recommendationSection) {
        uploadSection.style.display = 'flex';
        uploadSection.style.opacity = '1';
        loaderSection.style.display = 'none';
        loaderSection.style.opacity = '0';
        recommendationSection.style.display = 'none';
        recommendationSection.style.opacity = '0';
      }
    });
  }

  // View toggle functionality
  if (viewToggle && toggleButtons.length > 0) {
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        toggleButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Toggle grid/list view
        if (statsGrid) {
          if (btn.getAttribute('data-view') === 'list') {
            statsGrid.classList.add('list-view');
          } else {
            statsGrid.classList.remove('list-view');
          }
        }
      });
    });
  }

  // Initialize other sections
  initializeCharts();
  initializeRiskFactors();
  initializeRecommendations();
  initializeModal();
});

// Loader animation functions
function animateLoaderSteps() {
  const steps = document.querySelectorAll('.progress-steps .step');
  let currentStep = 0;

  function animateStep() {
    if (currentStep < steps.length) {
      // Remove active from all steps
      steps.forEach(step => step.classList.remove('active'));
      
      // Add active to current step
      steps[currentStep].classList.add('active');
      
      // Add completed to previous steps
      for (let i = 0; i < currentStep; i++) {
        steps[i].classList.add('completed');
      }
      
      currentStep++;
      
      // Continue to next step after delay
      setTimeout(animateStep, 2000);
    } else {
      // All steps completed, show recommendations
      setTimeout(() => {
        hideLoader();
        showRecommendations();
      }, 1000);
    }
  }

  animateStep();
}

// Initialize charts
function initializeCharts() {
  // Chart initialization code would go here
  console.log('Charts initialized');
}

// Initialize risk factors
function initializeRiskFactors() {
  // Risk factors initialization code would go here
  console.log('Risk factors initialized');
}

// Initialize recommendations
function initializeRecommendations() {
  // Recommendations initialization code would go here
  console.log('Recommendations initialized');
}

// Initialize modal
function initializeModal() {
  // Modal initialization code would go here
  console.log('Modal initialized');
}

// Open invoice review modal
function openInvoiceReview(category) {
  const modal = document.getElementById('invoiceReviewModal');
  if (modal) {
    updateModalContent(category);
    modal.classList.add('active');
  }
}

// Update modal content based on category
function updateModalContent(category) {
  const modalContent = document.querySelector('.review-content');
  if (modalContent) {
    // Update modal content based on category
    console.log('Updating modal content for category:', category);
  }
}

// File upload handler
function handleFileUpload(file) {
  console.log('handleFileUpload called for:', file.name);
  showLoader();
  // Simulate file upload process
  setTimeout(() => {
    animateLoaderSteps();
  }, 1000);
}

// Show loader
function showLoader() {
  const loaderSection = document.getElementById('loaderSection');
  const uploadSection = document.getElementById('uploadSection');
  
  if (loaderSection && uploadSection) {
    // Hide upload section
    uploadSection.style.opacity = '0';
    setTimeout(() => {
      uploadSection.style.display = 'none';
      
      // Show loader section
      loaderSection.style.display = 'flex';
      setTimeout(() => {
        loaderSection.style.opacity = '1';
      }, 50);
    }, 300);
  }
}

// Hide loader
function hideLoader() {
  const loaderSection = document.getElementById('loaderSection');
  if (loaderSection) {
    loaderSection.style.opacity = '0';
    setTimeout(() => {
      loaderSection.style.display = 'none';
    }, 300);
  }
}

// Show recommendations
function showRecommendations() {
  const recommendationSection = document.getElementById('recommendationSection');
  if (recommendationSection) {
    recommendationSection.style.display = 'block';
    setTimeout(() => {
      recommendationSection.style.opacity = '1';
    }, 50);
  }
}