// Sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle sidebar on menu button click
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isClickInside = sidebar.contains(event.target) || 
                            (menuToggle && menuToggle.contains(event.target));
        
        if (!isClickInside && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    });

    // Handle active state of navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');

            // On mobile, close sidebar after navigation
            if (window.innerWidth <= 991.98) {
                sidebar.classList.remove('show');
            }
        });

        // Set active state based on current page
        if (link.getAttribute('href') === window.location.pathname) {
            link.classList.add('active');
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 991.98) {
                sidebar.classList.remove('show');
            }
        }, 250);
    });
}); 