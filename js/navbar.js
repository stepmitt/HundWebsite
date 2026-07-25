document.addEventListener("DOMContentLoaded", () => {
  // Detect if we are inside the /pages/ directory
  const isSubpage = window.location.pathname.includes("/pages/")
  console.log(isSubpage)

  // Footer and Navbar are loaded relative to current depth
  const componentPath = isSubpage ? "../pages/" : "pages/"
  console.log(componentPath);

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
    // Fix footer links if on subpage
    if (isSubpage) {
      const footer = document.getElementById("footer-container");
      footer.querySelectorAll("a").forEach((link) => {
        const href = link.getAttribute("href");
        if (href && href.includes("/pages/")) {
          // Change /src/pages/X.html or /pages/X.html to X.html
          const pageName = href.split("/").pop();
          link.setAttribute("href", pageName);
        }
      });
    }
  });

  // 2. Load Navbar
  loadComponent("navbar-container", "navbar.html", () => {
    const hamburgerBtn = document.getElementById("hamburger_btn");
    const navLinks = document.getElementById("nav_links");
    const navbar = document.getElementById("navbar");

    // --- FIX PATHS FOR SUBPAGES ---
    if (isSubpage) {
      // Fix logo image and logo link
      const logo = document.getElementById("img_logo");
      if (logo) logo.setAttribute("src", "../pic/Logo.png");

      const logoLink = document.querySelector(".logo-link");
      if (logoLink) logoLink.setAttribute("href", "../index.html");

      // Fix links in the nav menu
      if (navLinks) {
        navLinks.querySelectorAll("a").forEach((link) => {
          const href = link.getAttribute("href");
          
          if (href === "index.html") {
            // Point back to root index
            link.setAttribute("href", "../index.html");
          } else if (href && href.startsWith("pages/")) {
            // Change "pages/tara.html" to "tara.html"
            link.setAttribute("href", href.replace("pages/", ""));
          }
        });
      }
    }

    // --- HAMBURGER MENU & SCROLL EVENTS ---
    if (hamburgerBtn && navLinks) {
      hamburgerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        navLinks.classList.toggle("active");
      });

      navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("active");
        });
      });
    }

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