// Global variables
let currentStep = 1;
const totalSteps = 2;

const stepContent = {
  1: {
    title: 'Billing Inputs',
    icon: 'file-text',
    description: 'Enter billing details'
  },
  2: {
    title: 'Draft Invoice',
    icon: 'file-earmark-text',
    description: 'Review and finalize'
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeSteps();
  initializeMobileMenu();
  initializeCollapsiblePanels();

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Update page info
  updatePageInfo('invoiceCreation');

  // Initialize collapsible sections
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach(header => {
    // Add click event listener
    header.addEventListener('click', () => {
      // Toggle collapsed class
      header.classList.toggle('collapsed');
      
      // Get the content section
      const content = header.nextElementSibling;
      
      // Toggle content visibility
      if (header.classList.contains('collapsed')) {
        content.style.display = 'none';
        content.style.opacity = '0';
      } else {
        content.style.display = 'block';
        content.style.opacity = '1';
      }
    });
  });
});

// Initialize step functionality
function initializeSteps() {
  // Add click handlers for process steps
  document.querySelectorAll('.process-step').forEach(step => {
    step.addEventListener('click', () => {
      const stepNumber = parseInt(step.getAttribute('data-step'));
      currentStep = stepNumber;
      showStep(stepNumber);
    });
  });

  // Initialize first step
  showStep(currentStep);
}

// Initialize all panels as collapsed
function initializeCollapsiblePanels() {
  document.querySelectorAll('.section-content').forEach(content => {
    content.classList.add('collapsed');
    content.style.maxHeight = '0px';
  });
  
  document.querySelectorAll('.section-header').forEach(header => {
    header.classList.add('collapsed');
    const icon = header.querySelector('.collapse-icon');
    if (icon) icon.style.transform = 'rotate(-180deg)';
  });
}

// Update progress indicators
function updateProgress() {
  document.querySelectorAll('.process-step').forEach((step, index) => {
    const stepNumber = index + 1;
    step.classList.remove('active', 'completed');
    if (stepNumber === currentStep) {
      step.classList.add('active');
    } else if (stepNumber < currentStep) {
      step.classList.add('completed');
    }
  });
}

// Update content header
function updateContentHeader(stepNumber) {
  const content = stepContent[stepNumber];
  const titleElement = document.querySelector('.content-title');
  const stepIndicator = document.querySelector('.step-indicator');
  
  if (titleElement && content) {
    titleElement.innerHTML = `
      <i class="bi bi-${content.icon}"></i>
      <span class="title-text">${content.title}</span>
    `;
  }
  
  if (stepIndicator) {
    const currentStepSpan = stepIndicator.querySelector('.current-step');
    if (currentStepSpan) {
      currentStepSpan.textContent = stepNumber;
    }
  }
}

// Update step content visibility
function showStep(stepNumber) {
  // Update content header
  updateContentHeader(stepNumber);
  
  // Hide all step contents
  document.querySelectorAll('.step-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Remove active class from all steps
  document.querySelectorAll('.process-step').forEach(step => {
    step.classList.remove('active');
  });
  
  // Show current step content
  const currentContent = document.getElementById(`step${stepNumber}`);
  if (currentContent) {
    currentContent.classList.add('active');
  }
  
  // Add active class to current step
  const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
  if (currentStepElement) {
    currentStepElement.classList.add('active');
  }
  
  // Update progress
  updateProgress();
  
  // Update buttons
  updateNavigationButtons(stepNumber);
  
  // Handle content visibility based on step
  const billingSections = document.querySelector('.billing-sections');
  const draftInvoice = document.querySelector('.draft-invoice');
  
  if (stepNumber === 1) {
    // For Billing Inputs, show billing sections and hide draft invoice
    if (billingSections) {
      billingSections.style.display = 'block';
      // Keep sections collapsed by default
      document.querySelectorAll('#step1 .section-content').forEach(content => {
        content.classList.add('collapsed');
        content.style.maxHeight = '0px';
      });
      document.querySelectorAll('#step1 .section-header').forEach(header => {
        header.classList.add('collapsed');
        const icon = header.querySelector('.collapse-icon');
        if (icon) icon.style.transform = 'rotate(-180deg)';
      });
    }
    if (draftInvoice) {
      draftInvoice.style.display = 'none';
    }
  } else if (stepNumber === 2) {
    // For Draft Invoice, hide billing sections and show draft invoice
    if (billingSections) {
      billingSections.style.display = 'none';
    }
    if (draftInvoice) {
      draftInvoice.style.display = 'block';
    }
  }
}

// Update navigation buttons
function updateNavigationButtons(stepNumber) {
  const prevButton = document.querySelector('.step-btn.secondary');
  const nextButton = document.querySelector('.step-btn.primary');
  
  if (prevButton) {
    prevButton.disabled = stepNumber === 1;
  }
  
  if (nextButton) {
    if (stepNumber === totalSteps) {
      nextButton.innerHTML = 'Accept Invoice <i class="bi bi-check-circle"></i>';
      nextButton.onclick = completeProcess;
    } else {
      nextButton.innerHTML = 'Next <i class="bi bi-arrow-right"></i>';
      nextButton.onclick = nextStep;
    }
  }
}

// Navigation functions
function nextStep() {
  if (currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

// Complete process and redirect to revised invoice
function completeProcess() {
  // Show loading state
  const nextButton = document.querySelector('.step-btn.primary');
  if (nextButton) {
    nextButton.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Processing...';
    nextButton.disabled = true;
  }

  // Simulate processing delay
  setTimeout(() => {
    // Redirect to revised invoice page
    window.location.href = 'revisedInvoice.html';
  }, 1500);
}

// Toggle collapsible sections
function toggleSection(header) {
  const content = header.nextElementSibling;
  const icon = header.querySelector('.collapse-icon');
  
  if (content) {
    content.classList.toggle('collapsed');
    header.classList.toggle('collapsed');
    if (icon) {
      icon.style.transform = content.classList.contains('collapsed') ? 
        'rotate(-180deg)' : 'rotate(0deg)';
    }
    
    // Animate the content height
    if (content.classList.contains('collapsed')) {
      content.style.maxHeight = '0px';
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  }
}

// Initialize mobile menu
function initializeMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('show');
      document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : '';
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 991.98) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && sidebar.classList.contains('show')) {
          sidebar.classList.remove('show');
          document.body.style.overflow = '';
        }
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991.98) {
        sidebar.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }
}

// Update page info
function updatePageInfo(page) {
  // Implementation of updatePageInfo function
} 