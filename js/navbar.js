document.addEventListener("DOMContentLoaded", () => {
  // Determine relative folder depth
  const isSubpage = window.location.pathname.includes("/pages/");
  const basePath = isSubpage ? "../pages/" : "pages/";

  // 1. Helper function to load HTML components
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
        // Run callback ONLY AFTER HTML is injected into DOM
        if (callback) callback();
      })
      .catch((err) => console.error("Error loading component:", err));
  };

  // 2. Load Footer
  loadComponent("footer-container", "footer.html");

  // 3. Load Navbar and attach Hamburger Event Listener AFTER loading finishes
  loadComponent("navbar-container", "navbar.html", () => {
    const hamburgerBtn = document.getElementById("hamburger_btn");
    const navLinks = document.getElementById("nav_links");
    const navbar = document.getElementById("navbar");

    // Hamburger Toggle Click Event
    if (hamburgerBtn && navLinks) {
      hamburgerBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevents instant closing
        navLinks.classList.toggle("active");
      });

      // Close menu when clicking a link inside it
      navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("active");
        });
      });
    }

    // Shrink navbar effect on scroll
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