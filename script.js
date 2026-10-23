document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("currentYear");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const navigation = document.getElementById("mainNav");
  const navigationLinks = navigation?.querySelectorAll(".nav-link, .btn-nav");
  const bootstrapCollapse = navigation && window.bootstrap
    ? window.bootstrap.Collapse.getOrCreateInstance(navigation, { toggle: false })
    : null;

  navigationLinks?.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 991.98px)").matches) {
        bootstrapCollapse?.hide();
      }
    });
  });
});
