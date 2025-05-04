// Initialize page
$(document).ready(function() {
  // Initialize tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  // Initialize DataTables
  const shopStatusTable = $('#shop-status-table').DataTable({
    order: [[1, 'desc']],
    pageLength: 10,
    language: {
      search: '',
      searchPlaceholder: 'Search shops...'
    }
  });

  // Handle search input
  $('.table-search input').on('keyup', function() {
    shopStatusTable.search(this.value).draw();
  });

  // Handle filter button click
  $('.filter-btn').on('click', function() {
    // Add filter functionality here
    console.log('Filter button clicked');
  });

  // Handle view details button click
  $('.view-details-btn').on('click', function(e) {
    e.preventDefault();
    const shopId = $(this).closest('tr').find('.shop-id').text();
    const shopName = $(this).closest('tr').find('.shop-name').text();
    // Navigate to shop details page with shop ID
    window.location.href = `shop-details.html?id=${shopId}&name=${encodeURIComponent(shopName)}`;
  });

  // Handle tab changes
  $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function(e) {
    const target = $(e.target).data('bs-target');
    // Refresh table data based on selected tab
    console.log('Tab changed:', target);
  });

  // Handle pagination
  $('.page-btn').on('click', function() {
    if ($(this).hasClass('disabled')) return;
    const direction = $(this).find('i').hasClass('bi-chevron-left') ? 'prev' : 'next';
    // Handle pagination logic here
    console.log('Pagination:', direction);
  });

  // Handle sidebar toggle
  $('.menu-toggle').on('click', function() {
    $('.sidebar').toggleClass('show');
  });

  // Close sidebar when clicking outside on mobile
  $(document).on('click', function(event) {
    const sidebar = $('.sidebar');
    const menuToggle = $('.menu-toggle');
    
    if (!sidebar.is(event.target) && sidebar.has(event.target).length === 0 &&
        !menuToggle.is(event.target) && menuToggle.has(event.target).length === 0) {
      sidebar.removeClass('show');
    }
  });
}); 