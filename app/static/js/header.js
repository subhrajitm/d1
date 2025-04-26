// Header functionality
document.addEventListener('DOMContentLoaded', () => {
  initializeHeader();
  initializeMobileMenu();
});

function initializeHeader() {
  // Update page title and breadcrumb based on current page
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop().replace('.html', '');
  
  // Set page title and breadcrumb
  updatePageInfo(pageName);
  
  // Initialize header buttons
  initializeHeaderButtons();
}

function updatePageInfo(pageName) {
  const pageTitle = document.getElementById('pageTitle');
  const currentPage = document.getElementById('currentPage');
  
  if (pageTitle && currentPage) {
    switch(pageName) {
      case 'index':
        pageTitle.textContent = 'Dashboard';
        currentPage.textContent = 'Overview';
        break;
      case 'shop':
        pageTitle.textContent = 'Shop Status';
        currentPage.textContent = 'Shop Status';
        break;
      case 'invoiceCreation':
        pageTitle.textContent = 'Invoice Creation';
        currentPage.textContent = 'Invoice Creation';
        break;
      default:
        pageTitle.textContent = 'Dashboard';
        currentPage.textContent = 'Overview';
    }
  }
}

function initializeHeaderButtons() {
  // Refresh button
  const refreshBtn = document.querySelector('.header-icon[title="Refresh"]');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      window.location.reload();
    });
  }
  
  // Profile trigger
  const profileTrigger = document.querySelector('.profile-trigger');
  if (profileTrigger) {
    profileTrigger.addEventListener('click', toggleProfileMenu);
  }
  
  // Add ripple effect to all header icons
  document.querySelectorAll('.header-icon').forEach(icon => {
    icon.addEventListener('click', createRippleEffect);
  });
}

function toggleProfileMenu(e) {
  // Add profile menu toggle functionality here
  console.log('Toggle profile menu');
}

function createRippleEffect(e) {
  const button = e.currentTarget;
  const ripple = button.querySelector('.ripple');
  
  if (ripple) {
    ripple.style.animation = 'none';
    ripple.offsetHeight; // Trigger reflow
    ripple.style.animation = 'ripple 0.4s ease-out';
  }
}

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