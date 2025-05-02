// Initialize Bootstrap tooltips and sections
document.addEventListener('DOMContentLoaded', function() {
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
  const uploadArea = document.querySelector('.upload-card');
  const viewToggle = document.querySelector('.view-toggle');
  const toggleButtons = viewToggle ? viewToggle.querySelectorAll('.toggle-btn') : [];
  const statsGrid = document.querySelector('.stats-grid');
  const invoiceView = document.querySelector('.invoice-view');
  const summaryLineSection = document.querySelector('.invoice-summary-line-section');
  const totalSummaryCard = document.querySelector('.total-summary-card');

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

  // Handle file selection
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      if (this.files.length > 0) {
        const fileName = this.files[0].name;
        const labelText = document.querySelector('.label-text');
        if (labelText) {
          labelText.textContent = fileName;
        }
      }
    });
  }

  // Handle upload button click
  if (uploadBtn && uploadSection && loaderSection && recommendationSection) {
    uploadBtn.addEventListener('click', function() {
      // Hide upload section with transition
      uploadSection.style.opacity = '0';
      setTimeout(() => {
        uploadSection.style.display = 'none';
        
        // Show loader
        loaderSection.style.display = 'flex';
        setTimeout(() => {
          loaderSection.style.opacity = '1';
          
          // Start loader animation
          animateLoaderSteps();
          
          // Simulate processing delay
          setTimeout(() => {
            // Hide loader with transition
            loaderSection.style.opacity = '0';
            setTimeout(() => {
              loaderSection.style.display = 'none';
              
              // Remove d-flex class from upload section
              uploadSection.classList.remove('d-flex');
              
              // Show recommendation section
              recommendationSection.style.display = 'block';
              setTimeout(() => {
                recommendationSection.style.opacity = '1';
              }, 50);
            }, 300);
          }, 5000);
        }, 50);
      }, 300);
    });
  }

  // Handle back to upload button
  if (backToUploadBtn && fileInput && uploadSection && recommendationSection) {
    backToUploadBtn.addEventListener('click', function() {
      // Reset file input
      fileInput.value = '';
      const labelText = document.querySelector('.label-text');
      if (labelText) {
        labelText.textContent = 'Choose File';
      }
      
      // Hide recommendation section with transition
      recommendationSection.style.opacity = '0';
      setTimeout(() => {
        recommendationSection.style.display = 'none';
        
        // Add d-flex class back to upload section
        uploadSection.classList.add('d-flex');
        
        // Show upload section
        uploadSection.style.display = 'flex';
        setTimeout(() => {
          uploadSection.style.opacity = '1';
        }, 50);
      }, 300);
    });
  }

  // Handle drag and drop
  if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        fileInput.dispatchEvent(new Event('change'));
      }
    });
  }

  // Recommendation Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const recommendationCards = document.querySelectorAll('.rec-card');

  if (filterButtons.length > 0 && recommendationCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');

        const priority = this.dataset.priority;

        // Filter cards
        recommendationCards.forEach(card => {
          if (priority === 'all') {
            card.style.display = 'block';
          } else {
            card.style.display = card.classList.contains(priority) ? 'block' : 'none';
          }
        });
      });
    });
  }

  // View Toggle Functionality
  if (toggleButtons.length) {
    toggleButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        toggleButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        // Toggle views
        if (this.dataset.view === 'list') {
          statsGrid && statsGrid.classList.add('list-view');
          statsGrid && (statsGrid.style.display = '');
          invoiceView && (invoiceView.style.display = 'none');
          summaryLineSection && (summaryLineSection.style.display = '');
          totalSummaryCard && (totalSummaryCard.style.display = '');
        } else if (this.dataset.view === 'grid') {
          statsGrid && statsGrid.classList.remove('list-view');
          statsGrid && (statsGrid.style.display = '');
          invoiceView && (invoiceView.style.display = 'none');
          summaryLineSection && (summaryLineSection.style.display = '');
          totalSummaryCard && (totalSummaryCard.style.display = '');
        } else if (this.dataset.view === 'invoice') {
          statsGrid && (statsGrid.style.display = 'none');
          invoiceView && (invoiceView.style.display = 'block');
          summaryLineSection && (summaryLineSection.style.display = 'none');
          totalSummaryCard && (totalSummaryCard.style.display = 'none');
        }
      });
    });
  }

  // Initialize other components
  initializeCharts();
  initializeRiskFactors();
  initializeRecommendations();
});

// Loader animation function
function animateLoaderSteps() {
  const steps = document.querySelectorAll('.loader-step');
  const stepDuration = 1000; // 1 second per step
  let currentStep = 0;
  const progressIndicator = document.querySelector('.loader-progress-indicator .progress-text');

  // Reset all steps
  steps.forEach(step => {
    step.classList.remove('active', 'completed');
    const progressBar = step.querySelector('.progress-bar');
    const statusEl = step.querySelector('.step-status');
    if (progressBar) {
      progressBar.style.width = '0%';
    }
    if (statusEl) {
      statusEl.textContent = 'Waiting';
      statusEl.classList.remove('in-progress', 'completed');
    }
  });

  // Animate each step
  function animateStep() {
    if (currentStep >= steps.length) {
      return;
    }

    // Update progress indicator
    const progressPercentage = Math.round(((currentStep + 1) / steps.length) * 100);
    if (progressIndicator) {
      progressIndicator.textContent = `${progressPercentage}% Complete`;
    }

    // Mark previous steps as completed
    for (let i = 0; i < currentStep; i++) {
      const prevStep = steps[i];
      prevStep.classList.remove('active');
      prevStep.classList.add('completed');
      
      const prevStatusEl = prevStep.querySelector('.step-status');
      if (prevStatusEl) {
        prevStatusEl.textContent = 'Completed';
        prevStatusEl.classList.remove('in-progress');
        prevStatusEl.classList.add('completed');
      }
    }

    // Animate current step
    const step = steps[currentStep];
    step.classList.add('active');
    
    const statusEl = step.querySelector('.step-status');
    if (statusEl) {
      statusEl.textContent = 'In progress';
      statusEl.classList.add('in-progress');
    }
    
    const progressBar = step.querySelector('.progress-bar');
    if (progressBar) {
      // Animate progress bar
      let width = 0;
      const animationInterval = setInterval(() => {
        if (width >= 100) {
          clearInterval(animationInterval);
          currentStep++;
          setTimeout(animateStep, 300); // Small delay between steps
        } else {
          width += 2;
          progressBar.style.width = width + '%';
        }
      }, 20);
    }
  }

  animateStep();
}

// Initialize charts
function initializeCharts() {
  // Chart initialization code here
}

// Initialize risk factors
function initializeRiskFactors() {
  // Risk factors initialization code here
}

// Initialize recommendations
function initializeRecommendations() {
  // Recommendations initialization code here
}

// Invoice Review Section
const invoiceReviewSection = document.getElementById('invoiceReviewSection');
const closeReviewBtn = document.querySelector('.close-btn');
const statCards = document.querySelectorAll('.stat-card');

// Function to show invoice review
function showInvoiceReview(card) {
  const title = card.querySelector('.card-title').textContent;
  const value = card.querySelector('.card-value').textContent;
  const percentage = card.querySelector('.card-percentage').textContent;
  
  // Update review section content
  document.querySelector('.review-title').textContent = title;
  document.querySelector('.card-value').textContent = value;
  document.querySelector('.card-trend span').textContent = percentage;
  
  // Show the review section
  invoiceReviewSection.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Function to hide invoice review
function hideInvoiceReview() {
  invoiceReviewSection.classList.remove('active');
  document.body.style.overflow = '';
}

// Add click event listeners to stat cards
statCards.forEach(card => {
  card.addEventListener('click', () => showInvoiceReview(card));
});

// Add click event listener to close button
closeReviewBtn.addEventListener('click', hideInvoiceReview);

// Close review section when clicking outside
invoiceReviewSection.addEventListener('click', (e) => {
  if (e.target === invoiceReviewSection) {
    hideInvoiceReview();
  }
});

// Handle view options
const viewOptions = document.querySelectorAll('.view-option');
viewOptions.forEach(option => {
  option.addEventListener('click', () => {
    viewOptions.forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');
    // Add logic here to change the view based on the selected option
  });
});

// Handle action buttons
const exportBtn = document.querySelector('.action-btn.primary');
const printBtn = document.querySelector('.action-btn.secondary');

if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    // Add export functionality here
    console.log('Export clicked');
  });
}

if (printBtn) {
  printBtn.addEventListener('click', () => {
    // Add print functionality here
    console.log('Print clicked');
  });
}