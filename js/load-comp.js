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

function loadUrkundeLightBox(){
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox-close");

  // Select all images in your grids & document tables
  const images = document.querySelectorAll(".doc-table img, .aligned-column img, .row img");

  // Attach click listener to every image
  images.forEach(img => {
    img.addEventListener("click", function () {
      lightbox.style.display = "flex";
      lightboxImg.src = this.src;
      lightboxImg.alt = this.alt;
    });
  });

  // Close lightbox when clicking the '×' button
  closeBtn.addEventListener("click", closeLightbox);

  // Close lightbox when clicking anywhere on the dark background
  lightbox.addEventListener("click", function (e) {
    if (e.target !== lightboxImg) {
      closeLightbox();
    }
  });

  // Close lightbox on 'Escape' key press
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.style.display === "flex") {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.style.display = "none";
  }
}

// Safe Initialization Check
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
  document.addEventListener("DOMContentLoaded", loadUrkundeLightBox);
} else {
  initApp();
  loadUrkundeLightBox();
}