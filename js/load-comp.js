document.addEventListener("DOMContentLoaded", () => {
  // Determine relative folder depth dynamically
  const isSubpage = window.location.pathname.includes("/pages/");
  const basePath = isSubpage ? "./" : "pages/";

  // Helper function to load components
  const loadComponent = (elementId, fileName, callback) => {
    const container = document.getElementById(elementId);
    if (!container) return;

    fetch(basePath + fileName)
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
  loadComponent("footer-container", "footer.html");

  // 2. Load Navbar and set active page
  loadComponent("navbar-container", "navbar.html", () => {
    const hamburgerBtn = document.getElementById("hamburger_btn");
    const navLinks = document.getElementById("nav_links");
    const navbar = document.getElementById("navbar");

    // Dynamic Current Page Highlight logic
    const currentPath = window.location.pathname;
    const links = navLinks ? navLinks.querySelectorAll("a") : [];

    links.forEach((link) => {
      const linkPath = link.getAttribute("href");

      // Check if current page matches the link path
      if (
        linkPath &&
        (currentPath.endsWith(linkPath) ||
         (currentPath === "/" && linkPath.includes("index.html")) ||
         (currentPath.endsWith("/") && linkPath.includes("index.html")))
      ) {
        link.id = "current_page";
      }
    });

    // Mobile Hamburger Event Handler
    if (hamburgerBtn && navLinks) {
      hamburgerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        navLinks.classList.toggle("active");
      });

      document.addEventListener("click", (e) => {
        if (!navLinks.contains(e.target) && !hamburgerBtn.contains(e.target)) {
          navLinks.classList.remove("active");
        }
      });

      navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("active");
        });
      });
    }

    // Scroll shrink effect
    if (navbar) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      });
    }
  });
});