/**
 * Utility functions for the Navbar component
 */
function initNavbarUtils(isSubpage) {
  const hamburgerBtn = document.getElementById("hamburger_btn");
  const navLinks = document.getElementById("nav_links");
  const navbar = document.getElementById("navbar");

  // 1. Fix relative link & image paths if sitting inside /pages/
  if (isSubpage) {
    const logo = document.getElementById("img_logo");
    if (logo) logo.setAttribute("src", "../pic/Logo.png");

    const logoLink = document.querySelector(".logo-link");
    if (logoLink) logoLink.setAttribute("href", "../index.html");

    if (navLinks) {
      navLinks.querySelectorAll("a").forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;

        if (href === "index.html" || href.endsWith("/index.html")) {
          link.setAttribute("href", "../index.html");
        } else if (href.includes("pages/")) {
          const fileName = href.split("/").pop();
          link.setAttribute("href", fileName);
        }
      });
    }
  }

  // 2. Set current active page identifier dynamically
  if (navLinks) {
    const currentPath = window.location.pathname;
    const links = navLinks.querySelectorAll("a");

    links.forEach((link) => {
      const linkPath = link.getAttribute("href");
      if (
        linkPath &&
        (currentPath.endsWith(linkPath) ||
          (currentPath === "/" && linkPath.includes("index.html")) ||
          (currentPath.endsWith("/") && linkPath.includes("index.html")))
      ) {
        link.id = "current_page";
      }
    });
  }

  // 3. Hamburger Toggle & Outside Click Events
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

  // 4. Shrink navbar effect on scroll
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }
}