// Initialize Bootstrap tooltips
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // File Upload Handler
  const fileInput = document.getElementById('invoiceFile');
  const uploadBtn = document.getElementById('uploadBtn');
  const uploadSection = document.getElementById('uploadSection');
  const loaderSection = document.getElementById('loaderSection');
  const recommendationSection = document.getElementById('recommendationSection');

  // Handle file selection
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      // Hide upload screen and show loader screen
      uploadSection.style.cssText = 'display: none !important';
      loaderSection.style.display = 'flex';
      recommendationSection.style.display = 'none';
      
      // Simulate file processing
      setTimeout(() => {
        // Hide loader screen and show recommendation section
        loaderSection.style.cssText = 'display: none !important';
        recommendationSection.style.display = 'block';
        
        // Initialize charts and other components
        initializeCharts();
        initializeRiskFactors();
        initializeRecommendations();
      }, 3000); // 3 second delay to simulate processing
    }
  });

  // Handle upload button click
  uploadBtn.addEventListener('click', function() {
    if (fileInput.files.length > 0) {
      // Trigger the file input change event
      fileInput.dispatchEvent(new Event('change'));
    }
  });

  // Handle drag and drop
  const uploadLabel = document.querySelector('.upload-label');
  
  uploadLabel.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('dragover');
  });

  uploadLabel.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
  });

  uploadLabel.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
    
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      fileInput.dispatchEvent(new Event('change'));
    }
  });
});

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