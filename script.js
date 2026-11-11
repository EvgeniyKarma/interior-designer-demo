(() => {
  const setPointerInput = () => {
    document.documentElement.classList.add("is-pointer-input");
    document.documentElement.classList.remove("gallery-suppress-hover");
  };
  document.addEventListener("pointerdown", setPointerInput, true);
  document.addEventListener("pointermove", () => document.documentElement.classList.remove("gallery-suppress-hover"), true);
  document.addEventListener("keydown", () => {
    document.documentElement.classList.remove("is-pointer-input", "gallery-suppress-hover");
  }, true);

  const drawer = document.querySelector("#site-menu");
  const closeButton = drawer.querySelector(".menu-close");
  const triggers = [...document.querySelectorAll(".menu-trigger")];
  const faqItems = [...document.querySelectorAll(".faq-item")];
  const scrollNav = document.querySelector(".scroll-nav");
  const heroNav = document.querySelector(".header-nav--hero");
  const footer = document.querySelector("#footer");
  let footerVisible = false;
  let returnFocus = null;
  let previousScrollY = window.scrollY;
  let scrollingUp = false;
  let parallaxFrame = 0;
  const parallaxImages = [...document.querySelectorAll("[data-parallax]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const footerWordmark = document.querySelector(".footer__brand > p");
  const projectGallery = document.querySelector("#project-gallery");
  const galleryTrack = projectGallery.querySelector(".project-gallery__track");
  const galleryTitle = projectGallery.querySelector(".project-gallery__title");
  const galleryClose = projectGallery.querySelector(".project-gallery__close");
  let galleryReturnFocus = null;
  let galleryOpenedByKeyboard = false;

  const projectGalleryImages = new Map([
    ["Квартира в природных тонах", [
      "public/assets/project-galleries/прихожая, гардероб/12_Post.jpg",
      "public/assets/project-galleries/кухня-гостиная/8_Post(2).jpg",
      "public/assets/project-galleries/кухня-гостиная/3_Post.jpg",
      "public/assets/project-galleries/детская/7_Post(3).jpg",
      "public/assets/project-galleries/кухня-гостиная/7_Post(2).jpg",
      "public/assets/project-galleries/детская/7_Post.jpg",
      "public/assets/project-galleries/санузел/3_Post(2).jpg",
      "public/assets/project-galleries/прихожая, гардероб/6_Post.jpg",
      "public/assets/project-galleries/кухня-гостиная/1_Post.jpg",
      "public/assets/project-galleries/кухня-гостиная/16_Post(2).jpg"
    ]],
    ["Городской минимализм", [
      "public/assets/project-galleries/детская/3_Post(3).jpg",
      "public/assets/project-galleries/кухня-гостиная/11_Post.jpg",
      "public/assets/project-galleries/детская/6_Post(2).jpg",
      "public/assets/project-galleries/санузел/3_Post.jpg",
      "public/assets/project-galleries/кухня-гостиная/12_Post.jpg",
      "public/assets/project-galleries/кухня-гостиная/13_Post.jpg",
      "public/assets/project-galleries/прихожая, гардероб/5_Post.jpg",
      "public/assets/project-galleries/прихожая, гардероб/11_Post(2).jpg",
      "public/assets/project-galleries/кухня-гостиная/8_Post(2).jpg",
      "public/assets/project-galleries/кухня-гостиная/7_Post(2).jpg"
    ]],
    ["Спокойный интерьер для семьи", [
      "public/assets/project-galleries/санузел/4_Post.jpg",
      "public/assets/project-galleries/кухня-гостиная/12_Post(2).jpg",
      "public/assets/project-galleries/кухня-гостиная/13_Post(2).jpg",
      "public/assets/project-galleries/прихожая, гардероб/9_Post(2).jpg",
      "public/assets/project-galleries/детская/6_Post.jpg",
      "public/assets/project-galleries/прихожая, гардероб/12_Post(2).jpg",
      "public/assets/project-galleries/кухня-гостиная/1_Post(3).jpg",
      "public/assets/project-galleries/прихожая, гардероб/1_Post(2).jpg",
      "public/assets/project-galleries/детская/1_Post(2).jpg",
      "public/assets/project-galleries/детская/5_Post(2).jpg"
    ]],
    ["Искусство простоты", [
      "public/assets/project-galleries/кухня-гостиная/9_Post(2).jpg",
      "public/assets/project-galleries/кухня-гостиная/13_Post(3).jpg",
      "public/assets/project-galleries/кухня-гостиная/8_Post(2).jpg",
      "public/assets/project-galleries/кухня-гостиная/4_Post(2).jpg",
      "public/assets/project-galleries/кухня-гостиная/11_Post(2).jpg",
      "public/assets/project-galleries/прихожая, гардероб/11_Post(2).jpg",
      "public/assets/project-galleries/кухня-гостиная/5_Post.jpg",
      "public/assets/project-galleries/кухня-гостиная/15_Post.jpg",
      "public/assets/project-galleries/прихожая, гардероб/1_Post.jpg",
      "public/assets/project-galleries/кухня-гостиная/13_Post.jpg"
    ]],
    ["Тёплая геометрия", [
      "public/assets/project-galleries/кухня-гостиная/11_Post.jpg",
      "public/assets/project-galleries/детская/2_Post(3).jpg",
      "public/assets/project-galleries/кухня-гостиная/12_Post.jpg",
      "public/assets/project-galleries/прихожая, гардероб/12_Post.jpg",
      "public/assets/project-galleries/детская/2_Post.jpg",
      "public/assets/project-galleries/санузел/3_Post.jpg",
      "public/assets/project-galleries/прихожая, гардероб/3_Post.jpg",
      "public/assets/project-galleries/санузел/3_Post(2).jpg",
      "public/assets/project-galleries/прихожая, гардероб/11_Post(2).jpg",
      "public/assets/project-galleries/санузел/1(2)_Post.jpg"
    ]],
    ["Современная квартира для двоих", [
      "public/assets/project-galleries/кухня-гостиная/8_Post(3).jpg",
      "public/assets/project-galleries/кухня-гостиная/12_Post(2).jpg",
      "public/assets/project-galleries/детская/4_Post.jpg",
      "public/assets/project-galleries/кухня-гостиная/2_Post.jpg",
      "public/assets/project-galleries/кухня-гостиная/7_Post(2).jpg",
      "public/assets/project-galleries/кухня-гостиная/1_Post(2).jpg",
      "public/assets/project-galleries/кухня-гостиная/2_Post(3).jpg",
      "public/assets/project-galleries/кухня-гостиная/4_Post.jpg",
      "public/assets/project-galleries/детская/3_Post(2).jpg",
      "public/assets/project-galleries/прихожая, гардероб/7_Post.jpg"
    ]]
  ]);

  const closeProjectGallery = () => {
    if (!projectGallery.open) return;
    projectGallery.close();
    document.body.classList.remove("gallery-open");
    document.documentElement.classList.add("gallery-suppress-hover");
    if (galleryReturnFocus?.isConnected) {
      if (galleryOpenedByKeyboard) galleryReturnFocus.focus({ preventScroll: true });
      else galleryReturnFocus.blur();
    }
    galleryReturnFocus = null;
  };

  const openProjectGallery = (trigger) => {
    const title = trigger.closest(".work-card")?.querySelector(".work-card__caption h3")?.textContent.replace(/\s+/g, " ").trim();
    const images = projectGalleryImages.get(title);
    if (!images) return;

    galleryReturnFocus = trigger;
    galleryOpenedByKeyboard = !document.documentElement.classList.contains("is-pointer-input");
    galleryTitle.textContent = title;
    galleryTrack.replaceChildren(...images.map((src, index) => {
      const image = document.createElement("img");
      image.src = src;
      image.alt = `${title}, фотография ${index + 1} из ${images.length}`;
      image.width = 560;
      image.height = 700;
      image.loading = "lazy";
      image.decoding = "async";
      return image;
    }));
    galleryTrack.scrollLeft = 0;
    projectGallery.showModal();
    document.body.classList.add("gallery-open");
    galleryClose.focus({ preventScroll: true });
  };

  document.querySelectorAll(".work-card__media").forEach((trigger) => {
    trigger.addEventListener("click", () => openProjectGallery(trigger));
  });
  galleryClose.addEventListener("click", closeProjectGallery);
  projectGallery.addEventListener("click", (event) => {
    if (event.target === projectGallery) closeProjectGallery();
  });
  projectGallery.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeProjectGallery();
  });
  galleryTrack.addEventListener("wheel", (event) => {
    if (window.matchMedia("(min-width: 1200px)").matches && Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      const multiplier = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? window.innerHeight : 1;
      galleryTrack.scrollLeft += event.deltaY * multiplier;
      event.preventDefault();
    }
  }, { passive: false });

  const fitFooterWordmark = () => {
    if (!footerWordmark) return;
    footerWordmark.style.removeProperty("font-size");
    const range = document.createRange();
    range.selectNodeContents(footerWordmark);
    const textWidth = range.getBoundingClientRect().width;
    const availableWidth = footerWordmark.clientWidth;
    const fontSize = Number.parseFloat(getComputedStyle(footerWordmark).fontSize);
    if (textWidth > availableWidth && availableWidth > 0) {
      footerWordmark.style.fontSize = `${fontSize * availableWidth / textWidth}px`;
    }
  };

  const initHeadingReveal = () => {
    fitFooterWordmark();
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      window.addEventListener("resize", fitFooterWordmark, { passive: true });
      return;
    }
    const targets = [...document.querySelectorAll("h1, h2, h3, .footer__brand > p")];
    const lineTargets = targets.map((heading) => heading.matches(".faq-item__question")
      ? heading
      : heading.querySelector(".faq-item__question") || heading);
    const uniqueTargets = [...new Set(lineTargets)];
    const containers = new Map();

    const renderLines = (target, container) => {
      const original = target.dataset.headingText ?? target.textContent.trim();
      const wasVisible = container.classList.contains("heading-motion-visible");
      target.textContent = original;
      const textNode = target.firstChild;
      if (!textNode || textNode.nodeType !== Node.TEXT_NODE || !original) return;
      const words = [...original.matchAll(/\S+/g)];
      const lines = [];
      words.forEach((word) => {
        const range = document.createRange();
        range.setStart(textNode, word.index);
        range.setEnd(textNode, word.index + word[0].length);
        const rect = range.getBoundingClientRect();
        const line = lines.find((candidate) => Math.abs(candidate.top - rect.top) < 2);
        if (line) line.end = word.index + word[0].length;
        else lines.push({ top: rect.top, start: word.index, end: word.index + word[0].length });
      });
      target.replaceChildren(...lines.map((line, index) => {
        const mask = document.createElement("span");
        const content = document.createElement("span");
        mask.className = "heading-line-mask";
        content.className = "heading-line-content";
        content.style.transitionDelay = `${index * 75}ms`;
        content.textContent = original.slice(line.start, line.end);
        mask.append(content);
        return mask;
      }));
      container.classList.add("heading-motion-ready");
      if (wasVisible) container.classList.add("heading-motion-visible");
      containers.set(container, target);
    };

    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("heading-motion-visible");
      observer.unobserve(entry.target);
    }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    uniqueTargets.forEach((target) => {
      target.dataset.headingText = target.textContent.trim();
      const container = target.closest("h1, h2, h3") || target;
      renderLines(target, container);
      observer.observe(container);
    });

    let resizeFrame = 0;
    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        fitFooterWordmark();
        containers.forEach((target, container) => renderLines(target, container));
      });
    }, { passive: true });
  };

  const syncScrollNav = () => {
    const threshold = heroNav.getBoundingClientRect().height;
    const desktop = window.matchMedia("(min-width: 1200px)").matches;
    const visible = window.scrollY >= threshold && !footerVisible && (!desktop || scrollingUp);
    scrollNav.classList.toggle("is-visible", visible);
    scrollNav.setAttribute("aria-hidden", String(!visible));
    if (visible) scrollNav.removeAttribute("inert");
    else scrollNav.setAttribute("inert", "");
  };

  const updateParallax = () => {
    parallaxFrame = 0;
    if (reducedMotion.matches) return;
    const viewportHeight = window.innerHeight;
    parallaxImages.forEach((image) => {
      const container = image.parentElement;
      const rect = container.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)));
      const distance = rect.height * 0.1;
      const offset = (progress * 2 - 1) * distance;
      image.style.setProperty("--parallax-offset", `${offset.toFixed(2)}px`);
    });
  };

  const requestParallaxUpdate = () => {
    if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateParallax);
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    scrollingUp = currentScrollY < previousScrollY;
    previousScrollY = currentScrollY;
    syncScrollNav();
    requestParallaxUpdate();
  };

  const openMenu = (trigger) => {
    returnFocus = trigger;
    drawer.hidden = false;
    drawer.inert = false;
    drawer.setAttribute("aria-hidden", "false");
    void drawer.offsetWidth;
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
      if (event.target !== drawer || event.propertyName !== "transform" || drawer.classList.contains("is-open")) return;
      drawer.setAttribute("aria-hidden", "true");
      drawer.inert = true;
      drawer.hidden = true;
      drawer.removeEventListener("transitionend", finish);
    };
    drawer.addEventListener("transitionend", finish);
    window.setTimeout(() => {
      if (!drawer.classList.contains("is-open")) {
        drawer.setAttribute("aria-hidden", "true");
        drawer.inert = true;
        drawer.hidden = true;
      }
    }, 450);
    if (restoreFocus && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  };

  triggers.forEach((trigger) => trigger.addEventListener("click", () => openMenu(trigger)));
  const setFaqItemOpen = (item, isOpen) => {
    item.classList.toggle("faq-item--open", isOpen);
    const trigger = item.querySelector(".faq-item__trigger");
    const panel = item.querySelector(".faq-item__panel");
    trigger.setAttribute("aria-expanded", String(isOpen));
    panel.setAttribute("aria-hidden", String(!isOpen));
    panel.inert = !isOpen;
  };
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-item__trigger");
    trigger.addEventListener("click", () => {
      const shouldOpen = trigger.getAttribute("aria-expanded") !== "true";
      faqItems.forEach((candidate) => setFaqItemOpen(candidate, candidate === item && shouldOpen));
    });
  });
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

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", () => {
    previousScrollY = window.scrollY;
    scrollingUp = false;
    syncScrollNav();
    requestParallaxUpdate();
  });
  reducedMotion.addEventListener?.("change", requestParallaxUpdate);
  document.fonts.ready.then(initHeadingReveal);
  syncScrollNav();
  updateParallax();
})();
