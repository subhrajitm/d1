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
        }, 3500);
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
});

// Loader animation function
function animateLoaderSteps() {
  const steps = document.querySelectorAll('.loader-step');
  const stepDuration = 1000; // 1 second per step
  let currentStep = 0;

  // Reset all steps
  steps.forEach(step => {
    step.classList.remove('active');
    const progressBar = step.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.width = '0%';
    }
  });

  // Animate each step
  function animateStep() {
    if (currentStep >= steps.length) {
      return;
    }

    const step = steps[currentStep];
    step.classList.add('active');
    
    const progressBar = step.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.width = '100%';
    }

    currentStep++;
    setTimeout(animateStep, stepDuration);
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