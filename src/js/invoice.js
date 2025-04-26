// Global variables
let currentStep = 1;
const totalSteps = 5;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeSteps();
  initializeMobileMenu();
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

// Update step content visibility
function showStep(stepNumber) {
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
  
  // Update buttons
  const prevButton = document.querySelector('.step-btn.secondary');
  const nextButton = document.querySelector('.step-btn.primary');
  
  if (prevButton) {
    prevButton.disabled = stepNumber === 1;
  }
  
  if (nextButton) {
    nextButton.innerHTML = stepNumber === totalSteps ? 
      'Accept Invoice <i class="bi bi-check-circle"></i>' : 
      'Next <i class="bi bi-arrow-right"></i>';
  }
  
  // If it's the draft invoice step, expand its section and collapse others
  if (stepNumber === 5) {
    document.querySelectorAll('.section-header').forEach(header => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.collapse-icon');
      
      if (header.closest('#step5')) {
        content.classList.remove('collapsed');
        header.classList.remove('collapsed');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        content.classList.add('collapsed');
        header.classList.add('collapsed');
        if (icon) icon.style.transform = 'rotate(-180deg)';
      }
    });
  }
}

// Handle process completion
function completeProcess() {
  const processContent = document.querySelector('.process-content');
  processContent.style.position = 'relative';
  
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: absolute;
    inset: 0;
    background: var(--primary-gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
    font-weight: 600;
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: var(--compact-border-radius);
  `;
  overlay.innerHTML = `
    <div style="text-align: center;">
      <i class="bi bi-check-circle-fill" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
      Invoice Creation Complete!
    </div>
  `;
  
  processContent.appendChild(overlay);
  setTimeout(() => {
    overlay.style.opacity = '1';
  }, 100);

  setTimeout(() => {
    alert('Invoice creation process completed!');
    overlay.remove();
  }, 2000);
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