(() => {
  const drawer = document.querySelector("#site-menu");
  const closeButton = drawer.querySelector(".menu-close");
  const triggers = [...document.querySelectorAll(".menu-trigger")];
  const scrollNav = document.querySelector(".scroll-nav");
  const heroNav = document.querySelector(".header-nav--hero");
  const footer = document.querySelector("#footer");
  let footerVisible = false;
  let returnFocus = null;

  const syncScrollNav = () => {
    const threshold = heroNav.getBoundingClientRect().height;
    const visible = window.scrollY >= threshold && !footerVisible;
    scrollNav.classList.toggle("is-visible", visible);
    scrollNav.setAttribute("aria-hidden", String(!visible));
    if (visible) scrollNav.removeAttribute("inert");
    else scrollNav.setAttribute("inert", "");
  };

  const openMenu = (trigger) => {
    returnFocus = trigger;
    drawer.inert = false;
    drawer.setAttribute("aria-hidden", "false");
    drawer.classList.add("is-open");
    document.body.classList.add("menu-open");
    triggers.forEach((button) => button.setAttribute("aria-expanded", "true"));
    window.requestAnimationFrame(() => closeButton.focus({ preventScroll: true }));
  };

  const closeMenu = (restoreFocus = true) => {
    if (!drawer.classList.contains("is-open")) return;
    drawer.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    triggers.forEach((button) => button.setAttribute("aria-expanded", "false"));
    const finish = (event) => {
      if (event.target !== drawer || drawer.classList.contains("is-open")) return;
      drawer.setAttribute("aria-hidden", "true");
      drawer.inert = true;
      drawer.removeEventListener("transitionend", finish);
    };
    drawer.addEventListener("transitionend", finish);
    window.setTimeout(() => {
      if (!drawer.classList.contains("is-open")) {
        drawer.setAttribute("aria-hidden", "true");
        drawer.inert = true;
      }
    }, 450);
    if (restoreFocus && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  };

  triggers.forEach((trigger) => trigger.addEventListener("click", () => openMenu(trigger)));
  closeButton.addEventListener("click", () => closeMenu());
  drawer.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.getAttribute("href") === "#") return;
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    closeMenu(false);
    history.pushState(null, "", link.getAttribute("href"));
    window.setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });

  if ("IntersectionObserver" in window) {
    const footerObserver = new IntersectionObserver(([entry]) => {
      footerVisible = entry.isIntersecting;
      syncScrollNav();
    }, { threshold: 0 });
    footerObserver.observe(footer);
  }

  window.addEventListener("scroll", syncScrollNav, { passive: true });
  window.addEventListener("resize", syncScrollNav);
  syncScrollNav();
})();
