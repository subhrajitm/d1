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

  // Initialize sections
  function initializeSections() {
    // Hide all sections initially
    loaderSection.style.display = 'none';
    loaderSection.style.opacity = '0';
    recommendationSection.style.display = 'none';
    recommendationSection.style.opacity = '0';
    
    // Show upload section
    uploadSection.style.display = 'flex';
    uploadSection.style.opacity = '1';
  }

  // Initialize sections on page load
  initializeSections();

  // Handle file selection
  fileInput.addEventListener('change', function(e) {
    if (this.files.length > 0) {
      const fileName = this.files[0].name;
      document.querySelector('.label-text').textContent = fileName;
    }
  });

  // Handle upload button click
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

  // Handle back to upload button
  backToUploadBtn.addEventListener('click', function() {
    // Reset file input
    fileInput.value = '';
    document.querySelector('.label-text').textContent = 'Choose File';
    
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

  // Handle drag and drop
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

  // Recommendation Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const recommendationCards = document.querySelectorAll('.rec-card');

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
const searchInput = document.querySelector('.search-input');
const sortSelect = document.querySelector('.sort-select');
const viewOptions = document.querySelectorAll('.view-option');
const addNoteBtn = document.querySelector('.add-note-btn');
const noteTextarea = document.querySelector('.add-note textarea');

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

// Function to handle search
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  const rows = document.querySelectorAll('.details-table tbody tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
  });
}

// Function to handle sorting
function handleSort() {
  const sortValue = sortSelect.value;
  const tbody = document.querySelector('.details-table tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  
  rows.sort((a, b) => {
    const aValue = a.cells[sortValue.includes('date') ? 1 : 3].textContent;
    const bValue = b.cells[sortValue.includes('date') ? 1 : 3].textContent;
    
    if (sortValue.includes('date')) {
      return sortValue.includes('desc') 
        ? new Date(bValue) - new Date(aValue)
        : new Date(aValue) - new Date(bValue);
    } else {
      const aAmount = parseFloat(aValue.replace(/[^0-9.-]+/g, ''));
      const bAmount = parseFloat(bValue.replace(/[^0-9.-]+/g, ''));
      return sortValue.includes('desc') ? bAmount - aAmount : aAmount - bAmount;
    }
  });
  
  rows.forEach(row => tbody.appendChild(row));
}

// Function to handle view options
function handleViewOption(option) {
  viewOptions.forEach(opt => opt.classList.remove('active'));
  option.classList.add('active');
  
  // Add logic here to filter by date range
  const rows = document.querySelectorAll('.details-table tbody tr');
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  
  rows.forEach(row => {
    const date = new Date(row.cells[1].textContent);
    let show = true;
    
    switch(option.textContent) {
      case 'This Month':
        show = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        break;
      case 'Last Month':
        show = date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
        break;
      case 'Custom Range':
        // Implement custom date range picker
        break;
    }
    
    row.style.display = show ? '' : 'none';
  });
}

// Function to add a note
function addNote() {
  const noteText = noteTextarea.value.trim();
  if (!noteText) return;
  
  const notesList = document.querySelector('.notes-list');
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  
  const noteItem = document.createElement('div');
  noteItem.className = 'note-item';
  noteItem.innerHTML = `
    <div class="note-header">
      <span class="note-date">${dateStr}</span>
      <span class="note-author">Current User</span>
    </div>
    <div class="note-content">${noteText}</div>
  `;
  
  notesList.appendChild(noteItem);
  noteTextarea.value = '';
}

// Add event listeners
statCards.forEach(card => {
  card.addEventListener('click', () => showInvoiceReview(card));
});

closeReviewBtn.addEventListener('click', hideInvoiceReview);

invoiceReviewSection.addEventListener('click', (e) => {
  if (e.target === invoiceReviewSection) {
    hideInvoiceReview();
  }
});

searchInput.addEventListener('input', handleSearch);

sortSelect.addEventListener('change', handleSort);

viewOptions.forEach(option => {
  option.addEventListener('click', () => handleViewOption(option));
});

addNoteBtn.addEventListener('click', addNote);

noteTextarea.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    addNote();
  }
});

// Handle action buttons
const exportBtn = document.querySelector('.action-btn.primary');

exportBtn.addEventListener('click', () => {
  // Add export functionality here
  console.log('Export clicked');
});

// Handle action icons
document.querySelectorAll('.action-icon').forEach(icon => {
  icon.addEventListener('click', (e) => {
    const action = icon.getAttribute('title');
    const row = icon.closest('tr');
    const invoiceId = row.cells[0].textContent;
    
    if (action === 'View Details') {
      // Implement view details functionality
      console.log(`View details for ${invoiceId}`);
    } else if (action === 'Add Note') {
      // Implement add note functionality
      console.log(`Add note for ${invoiceId}`);
    }
  });
});