/**
 * Component Loader Script
 */
function initApp() {
  const isSubpage = window.location.pathname.includes("/pages/");
  const componentPath = isSubpage ? "../pages/" : "pages/";

  const loadComponent = (elementId, fileName, callback) => {
    const container = document.getElementById(elementId);
    if (!container) return;

    fetch(componentPath + fileName)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${fileName}: ${response.status}`);
        }
        return response.text();
      })
      .then((html) => {
        container.innerHTML = html;
        if (callback) callback();
      })
      .catch((err) => console.error("Error loading component:", err));
  };

  // 1. Load Footer
  loadComponent("footer-container", "footer.html", () => {
    if (isSubpage) {
      const footer = document.getElementById("footer-container");
      if (footer) {
        footer.querySelectorAll("a").forEach((link) => {
          const href = link.getAttribute("href");
          if (href && href.includes("pages/")) {
            const pageName = href.split("/").pop();
            link.setAttribute("href", pageName);
          }
        });
      }
    }
  });

  // 2. Load Navbar and trigger navbar utility functions
  loadComponent("navbar-container", "navbar.html", () => {
    if (typeof initNavbarUtils === "function") {
      initNavbarUtils(isSubpage);
    }
  });
}

// Safe Initialization Check
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}