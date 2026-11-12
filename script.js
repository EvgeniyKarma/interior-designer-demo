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
  const galleryButtons = [...projectGallery.querySelectorAll("[data-gallery-direction]")];
  let galleryReturnFocus = null;
  let galleryOpenedByKeyboard = false;
  let galleryActiveSlide = null;
  let galleryNavigationSlide = null;
  let galleryAnimationFrame = 0;
  let galleryScrollFrame = 0;
  let gallerySettleTimer = 0;
  let galleryWheelLock = false;
  let galleryWheelTimer = 0;
  let galleryIsRecentering = false;
  let galleryIsAnimating = false;
  let galleryIsDragging = false;
  let galleryPointerId = null;
  let galleryPointerStartX = 0;
  let galleryPointerStartY = 0;
  let galleryPointerStartScrollLeft = 0;
  let galleryPointerDeltaX = 0;
  let galleryPointerMoved = false;

  const projectGalleryImages = new Map([
    ["Квартира в природных тонах", [
      "public/assets/project-galleries/прихожая, гардероб/12_Post.webp",
      "public/assets/project-galleries/кухня-гостиная/8_Post(2).webp",
      "public/assets/project-galleries/кухня-гостиная/3_Post.webp",
      "public/assets/project-galleries/детская/7_Post(3).webp",
      "public/assets/project-galleries/кухня-гостиная/7_Post(2).webp",
      "public/assets/project-galleries/детская/7_Post.webp",
      "public/assets/project-galleries/санузел/3_Post(2).webp",
      "public/assets/project-galleries/прихожая, гардероб/6_Post.webp",
      "public/assets/project-galleries/кухня-гостиная/1_Post.webp",
      "public/assets/project-galleries/кухня-гостиная/16_Post(2).webp"
    ]],
    ["Городской минимализм", [
      "public/assets/project-galleries/детская/3_Post(3).webp",
      "public/assets/project-galleries/кухня-гостиная/11_Post.webp",
      "public/assets/project-galleries/детская/6_Post(2).webp",
      "public/assets/project-galleries/санузел/3_Post.webp",
      "public/assets/project-galleries/кухня-гостиная/12_Post.webp",
      "public/assets/project-galleries/кухня-гостиная/13_Post.webp",
      "public/assets/project-galleries/прихожая, гардероб/5_Post.webp",
      "public/assets/project-galleries/прихожая, гардероб/11_Post(2).webp",
      "public/assets/project-galleries/кухня-гостиная/8_Post(2).webp",
      "public/assets/project-galleries/кухня-гостиная/7_Post(2).webp"
    ]],
    ["Спокойный интерьер для семьи", [
      "public/assets/project-galleries/санузел/4_Post.webp",
      "public/assets/project-galleries/кухня-гостиная/12_Post(2).webp",
      "public/assets/project-galleries/кухня-гостиная/13_Post(2).webp",
      "public/assets/project-galleries/прихожая, гардероб/9_Post(2).webp",
      "public/assets/project-galleries/детская/6_Post.webp",
      "public/assets/project-galleries/прихожая, гардероб/12_Post(2).webp",
      "public/assets/project-galleries/кухня-гостиная/1_Post(3).webp",
      "public/assets/project-galleries/прихожая, гардероб/1_Post(2).webp",
      "public/assets/project-galleries/детская/1_Post(2).webp",
      "public/assets/project-galleries/детская/5_Post(2).webp"
    ]],
    ["Искусство простоты", [
      "public/assets/project-galleries/кухня-гостиная/9_Post(2).webp",
      "public/assets/project-galleries/кухня-гостиная/13_Post(3).webp",
      "public/assets/project-galleries/кухня-гостиная/8_Post(2).webp",
      "public/assets/project-galleries/кухня-гостиная/4_Post(2).webp",
      "public/assets/project-galleries/кухня-гостиная/11_Post(2).webp",
      "public/assets/project-galleries/прихожая, гардероб/11_Post(2).webp",
      "public/assets/project-galleries/кухня-гостиная/5_Post.webp",
      "public/assets/project-galleries/кухня-гостиная/15_Post.webp",
      "public/assets/project-galleries/прихожая, гардероб/1_Post.webp",
      "public/assets/project-galleries/кухня-гостиная/13_Post.webp"
    ]],
    ["Тёплая геометрия", [
      "public/assets/project-galleries/кухня-гостиная/11_Post.webp",
      "public/assets/project-galleries/детская/2_Post(3).webp",
      "public/assets/project-galleries/кухня-гостиная/12_Post.webp",
      "public/assets/project-galleries/прихожая, гардероб/12_Post.webp",
      "public/assets/project-galleries/детская/2_Post.webp",
      "public/assets/project-galleries/санузел/3_Post.webp",
      "public/assets/project-galleries/прихожая, гардероб/3_Post.webp",
      "public/assets/project-galleries/санузел/3_Post(2).webp",
      "public/assets/project-galleries/прихожая, гардероб/11_Post(2).webp",
      "public/assets/project-galleries/санузел/1(2)_Post.webp"
    ]],
    ["Современная квартира для двоих", [
      "public/assets/project-galleries/кухня-гостиная/8_Post(3).webp",
      "public/assets/project-galleries/кухня-гостиная/12_Post(2).webp",
      "public/assets/project-galleries/детская/4_Post.webp",
      "public/assets/project-galleries/кухня-гостиная/2_Post.webp",
      "public/assets/project-galleries/кухня-гостиная/7_Post(2).webp",
      "public/assets/project-galleries/кухня-гостиная/1_Post(2).webp",
      "public/assets/project-galleries/кухня-гостиная/2_Post(3).webp",
      "public/assets/project-galleries/кухня-гостиная/4_Post.webp",
      "public/assets/project-galleries/детская/3_Post(2).webp",
      "public/assets/project-galleries/прихожая, гардероб/7_Post.webp"
    ]]
  ]);

  const preloadedGalleryImages = new Set();
  const shouldSkipGalleryPrefetch = () => {
    const connection = navigator.connection;
    return connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || "");
  };
  const preloadGalleryImage = (src) => {
    if (preloadedGalleryImages.has(src)) return;
    preloadedGalleryImages.add(src);
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = "low";
    image.src = src;
  };
  const getProjectGalleryImages = (trigger) => {
    const title = trigger.closest(".work-card")?.querySelector(".work-card__caption h3")?.textContent.replace(/\s+/g, " ").trim();
    return projectGalleryImages.get(title);
  };
  const warmProjectGallery = (trigger) => {
    if (shouldSkipGalleryPrefetch()) return;
    getProjectGalleryImages(trigger)?.forEach(preloadGalleryImage);
  };

  const warmGalleryLeads = () => {
    if (shouldSkipGalleryPrefetch()) return;
    const leads = [...new Set([...projectGalleryImages.values()].map((images) => images[0]))];
    let index = 0;
    const warmNext = () => {
      if (index >= leads.length || shouldSkipGalleryPrefetch()) return;
      preloadGalleryImage(leads[index++]);
      if (index < leads.length) {
        if ("requestIdleCallback" in window) window.requestIdleCallback(warmNext, { timeout: 2000 });
        else window.setTimeout(warmNext, 400);
      }
    };
    if ("requestIdleCallback" in window) window.requestIdleCallback(warmNext, { timeout: 2000 });
    else window.setTimeout(warmNext, 400);
  };
  if (document.readyState === "complete") warmGalleryLeads();
  else window.addEventListener("load", warmGalleryLeads, { once: true });

  const centerGallerySlide = (slide, behavior = "instant") => {
    if (!slide) return;
    const left = slide.offsetLeft + slide.offsetWidth / 2 - galleryTrack.clientWidth / 2;
    galleryTrack.scrollTo({ left, behavior });
  };

  const isDesktopGallery = () => window.matchMedia("(min-width: 1200px)").matches;

  const getGallerySlotMetrics = () => {
    const centerImage = galleryActiveSlide?.querySelector(".project-gallery__mask img");
    const centerWidth = centerImage?.offsetWidth || 0;
    const gap = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) * 4.375;
    return { center: centerWidth + gap, side: centerWidth * 0.7 + gap };
  };

  const getGalleryTargetScrollLeft = (target) => {
    const slides = [...galleryTrack.querySelectorAll(".project-gallery__slide")];
    const targetIndex = slides.indexOf(target);
    if (targetIndex < 0) return galleryTrack.scrollLeft;
    const { center, side } = getGallerySlotMetrics();
    let targetCenter = center / 2;
    for (let index = 0; index < targetIndex; index += 1) {
      targetCenter += slides[index] === galleryActiveSlide ? center : side;
    }
    return targetCenter - galleryTrack.clientWidth / 2;
  };

  const easeGalleryProgress = (progress) => {
    const coordinate = (time, first, second) => 3 * (1 - time) ** 2 * time * first + 3 * (1 - time) * time ** 2 * second + time ** 3;
    let low = 0;
    let high = 1;
    let time = progress;
    for (let iteration = 0; iteration < 10; iteration += 1) {
      if (coordinate(time, 0.42, 0.58) < progress) low = time;
      else high = time;
      time = (low + high) / 2;
    }
    return coordinate(time, 0, 1);
  };

  const animateGalleryTrackTo = (startScrollLeft, prepare, complete) => {
    if (galleryAnimationFrame) window.cancelAnimationFrame(galleryAnimationFrame);
    galleryIsAnimating = true;
    const duration = reducedMotion.matches ? 0 : 500;
    let startedAt = null;
    let endScrollLeft = startScrollLeft;

    const step = (now) => {
      if (startedAt === null) {
        endScrollLeft = prepare();
        startedAt = now;
      }
      const progress = duration === 0 ? 1 : Math.min(1, (now - startedAt) / duration);
      const eased = easeGalleryProgress(progress);
      galleryTrack.scrollLeft = startScrollLeft + (endScrollLeft - startScrollLeft) * eased;
      updateGalleryParallax();
      if (progress < 1) {
        galleryAnimationFrame = window.requestAnimationFrame(step);
        return;
      }
      galleryAnimationFrame = 0;
      galleryTrack.scrollLeft = endScrollLeft;
      galleryIsAnimating = false;
      complete?.();
    };

    galleryAnimationFrame = window.requestAnimationFrame(step);
  };

  const finishGalleryButtonTransition = (target) => {
    const photoIndex = Number(target.dataset.photoIndex);
    const centralSlide = Number(target.dataset.copyIndex) === 1
      ? target
      : galleryTrack.querySelector(`.project-gallery__slide[data-copy-index="1"][data-photo-index="${photoIndex}"]`);
    galleryIsAnimating = false;
    galleryNavigationSlide = centralSlide || target;
    if (centralSlide && centralSlide !== target) {
      galleryIsRecentering = true;
      galleryTrack.classList.add("is-recentering");
      setActiveGallerySlide(centralSlide);
      centerGallerySlide(centralSlide);
      updateGalleryParallax();
      window.requestAnimationFrame(() => {
        galleryTrack.classList.remove("is-recentering");
        galleryIsRecentering = false;
      });
      return;
    }
    updateGalleryParallax();
  };

  const animateToGallerySlide = (target) => {
    if (!target || projectGallery.classList.contains("is-opening")) return;
    window.clearTimeout(gallerySettleTimer);
    gallerySettleTimer = 0;
    galleryIsRecentering = false;
    const startScrollLeft = galleryTrack.scrollLeft;
    galleryNavigationSlide = target;
    animateGalleryTrackTo(startScrollLeft, () => {
        setActiveGallerySlide(target);
        return getGalleryTargetScrollLeft(target);
      }, () => finishGalleryButtonTransition(target));
  };

  const updateGalleryParallax = () => {
    if (reducedMotion.matches) return;
    const trackCenter = galleryTrack.scrollLeft + galleryTrack.clientWidth / 2;
    galleryTrack.querySelectorAll(".project-gallery__slide").forEach((slide) => {
      const mask = slide.querySelector(".project-gallery__mask");
      const image = mask?.querySelector("img");
      if (!mask || !image) return;
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const availableShift = Math.max(0, (image.offsetWidth - mask.clientWidth) / 2);
      const delayedShift = (trackCenter - slideCenter) * 0.2;
      const shift = Math.max(-availableShift, Math.min(availableShift, delayedShift));
      image.style.setProperty("--gallery-parallax-x", `${shift}px`);
    });
  };

  const findCenteredGallerySlide = () => {
    const center = galleryTrack.scrollLeft + galleryTrack.clientWidth / 2;
    let closest = null;
    let closestDistance = Infinity;
    galleryTrack.querySelectorAll(".project-gallery__slide").forEach((slide) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(slideCenter - center);
      if (distance < closestDistance) {
        closest = slide;
        closestDistance = distance;
      }
    });
    return closest;
  };

  const setActiveGallerySlide = (slide) => {
    if (!slide || slide === galleryActiveSlide) return;
    galleryActiveSlide?.classList.remove("is-active");
    galleryActiveSlide = slide;
    galleryActiveSlide.classList.add("is-active");
    const photoNumber = Number(slide.dataset.photoIndex) + 1;
    const photoCount = Number(galleryTrack.dataset.photoCount);
    galleryTrack.setAttribute("aria-label", `Фотографии проекта, фото ${photoNumber} из ${photoCount}`);
  };

  const updateActiveGallerySlide = () => {
    galleryScrollFrame = 0;
    updateGalleryParallax();
  };

  const recenterGalleryLoop = () => {
    gallerySettleTimer = 0;
    if (!projectGallery.open || !galleryActiveSlide) return;
    const settledSlide = findCenteredGallerySlide();
    if (!settledSlide) return;
    const photoIndex = Number(settledSlide.dataset.photoIndex);
    const centralSlide = Number(settledSlide.dataset.copyIndex) === 1
      ? settledSlide
      : galleryTrack.querySelector(`.project-gallery__slide[data-copy-index="1"][data-photo-index="${photoIndex}"]`);
    if (!centralSlide) return;

    galleryIsRecentering = true;
    setActiveGallerySlide(centralSlide);
    galleryNavigationSlide = centralSlide;
    window.requestAnimationFrame(() => {
      centerGallerySlide(centralSlide);
      updateGalleryParallax();
      galleryIsRecentering = false;
    });
  };

  const handleGalleryScroll = () => {
    if (isDesktopGallery() || galleryIsRecentering || galleryIsAnimating || galleryIsDragging) return;
    if (!galleryScrollFrame) galleryScrollFrame = window.requestAnimationFrame(updateActiveGallerySlide);
    window.clearTimeout(gallerySettleTimer);
    gallerySettleTimer = window.setTimeout(recenterGalleryLoop, 500);
  };

  const closeProjectGallery = () => {
    if (!projectGallery.open) return;
    projectGallery.close();
    window.clearTimeout(gallerySettleTimer);
    window.clearTimeout(galleryWheelTimer);
    gallerySettleTimer = 0;
    galleryWheelTimer = 0;
    galleryWheelLock = false;
    galleryIsDragging = false;
    galleryPointerId = null;
    if (galleryAnimationFrame) window.cancelAnimationFrame(galleryAnimationFrame);
    galleryAnimationFrame = 0;
    galleryIsAnimating = false;
    projectGallery.classList.remove("is-opening");
    galleryActiveSlide = null;
    galleryNavigationSlide = null;
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
    galleryTrack.dataset.photoCount = images.length;
    galleryTrack.setAttribute("aria-label", `Фотографии проекта, фото 1 из ${images.length}`);
    const slides = [];
    for (let copyIndex = 0; copyIndex < 3; copyIndex += 1) {
      images.forEach((src, photoIndex) => {
        const slide = document.createElement("div");
        slide.className = "project-gallery__slide";
        slide.dataset.copyIndex = copyIndex;
        slide.dataset.photoIndex = photoIndex;
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-roledescription", "слайд");
        slide.setAttribute("aria-label", `Фото ${photoIndex + 1} из ${images.length}`);
        slide.setAttribute("aria-hidden", String(copyIndex !== 1));

        const mask = document.createElement("div");
        mask.className = "project-gallery__mask";
        const image = document.createElement("img");
        image.src = src;
        image.alt = `${title}, фотография ${photoIndex + 1} из ${images.length}`;
        image.width = 560;
        image.height = 700;
        image.loading = copyIndex === 1 ? "eager" : "lazy";
        image.fetchPriority = copyIndex === 1 && photoIndex === 0 ? "high" : "low";
        image.decoding = "async";
        mask.append(image);
        slide.append(mask);
        slides.push(slide);
      });
    }
    galleryTrack.replaceChildren(...slides);
    galleryActiveSlide = slides[images.length];
    galleryNavigationSlide = galleryActiveSlide;
    galleryActiveSlide.classList.add("is-active");
    galleryTrack.tabIndex = isDesktopGallery() ? -1 : 0;
    galleryIsRecentering = true;
    galleryTrack.classList.remove("is-recentering");
    galleryTrack.scrollLeft = 0;
    projectGallery.classList.add("is-opening");
    projectGallery.showModal();
    document.body.classList.add("gallery-open");
    galleryAnimationFrame = window.requestAnimationFrame(() => {
      galleryAnimationFrame = 0;
      centerGallerySlide(galleryActiveSlide);
      updateGalleryParallax();
      const startScrollLeft = galleryTrack.scrollLeft;
      animateGalleryTrackTo(startScrollLeft, () => {
        projectGallery.classList.remove("is-opening");
        return getGalleryTargetScrollLeft(galleryActiveSlide);
      }, () => {
        galleryNavigationSlide = galleryActiveSlide;
        galleryIsRecentering = false;
        updateGalleryParallax();
      });
    });
    galleryClose.focus({ preventScroll: true });
  };

  document.querySelectorAll(".work-card__media").forEach((trigger) => {
    trigger.addEventListener("pointerenter", () => warmProjectGallery(trigger), { once: true });
    trigger.addEventListener("focus", () => warmProjectGallery(trigger), { once: true });
    trigger.addEventListener("click", () => openProjectGallery(trigger));
  });
  galleryClose.addEventListener("click", closeProjectGallery);
  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const slides = [...galleryTrack.querySelectorAll(".project-gallery__slide")];
      const currentSlide = galleryNavigationSlide || galleryActiveSlide;
      const currentIndex = slides.indexOf(currentSlide);
      const direction = Number(button.dataset.galleryDirection);
      const target = slides[currentIndex + direction];
      if (!target) return;
      animateToGallerySlide(target);
    });
  });
  galleryTrack.addEventListener("pointerdown", (event) => {
    if (isDesktopGallery() || galleryIsAnimating || galleryPointerId !== null || !event.isPrimary || event.button > 0) return;
    galleryPointerId = event.pointerId;
    galleryPointerStartX = event.clientX;
    galleryPointerStartY = event.clientY;
    galleryPointerStartScrollLeft = galleryTrack.scrollLeft;
    galleryPointerDeltaX = 0;
    galleryPointerMoved = false;
    galleryIsDragging = true;
    galleryTrack.setPointerCapture(event.pointerId);
  });
  galleryTrack.addEventListener("pointermove", (event) => {
    if (event.pointerId !== galleryPointerId) return;
    const deltaX = event.clientX - galleryPointerStartX;
    const deltaY = event.clientY - galleryPointerStartY;
    if (!galleryPointerMoved && Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 8) return;
    if (!galleryPointerMoved && Math.abs(deltaY) > Math.abs(deltaX)) {
      galleryIsDragging = false;
      galleryPointerId = null;
      if (galleryTrack.hasPointerCapture(event.pointerId)) galleryTrack.releasePointerCapture(event.pointerId);
      return;
    }
    galleryPointerMoved = true;
    event.preventDefault();

    const slides = [...galleryTrack.querySelectorAll(".project-gallery__slide")];
    const currentSlide = galleryNavigationSlide || galleryActiveSlide;
    const currentIndex = slides.indexOf(currentSlide);
    const neighbor = slides[currentIndex + (deltaX < 0 ? 1 : -1)];
    if (!currentSlide || !neighbor) return;
    const currentCenter = currentSlide.offsetLeft + currentSlide.offsetWidth / 2;
    const neighborCenter = neighbor.offsetLeft + neighbor.offsetWidth / 2;
    const maxDistance = Math.abs(neighborCenter - currentCenter);
    const movement = Math.max(-maxDistance, Math.min(maxDistance, -deltaX));
    galleryTrack.scrollLeft = galleryPointerStartScrollLeft + movement;
    galleryPointerDeltaX = deltaX;
    updateGalleryParallax();
  });
  const finishGalleryPointerGesture = (event, cancelled = false) => {
    if (event.pointerId !== galleryPointerId) return;
    const moved = galleryPointerMoved;
    const deltaX = galleryPointerDeltaX;
    galleryPointerId = null;
    galleryIsDragging = false;
    galleryPointerMoved = false;
    galleryPointerDeltaX = 0;
    if (!moved) return;

    const slides = [...galleryTrack.querySelectorAll(".project-gallery__slide")];
    const currentSlide = galleryNavigationSlide || galleryActiveSlide;
    const currentIndex = slides.indexOf(currentSlide);
    const direction = cancelled || Math.abs(deltaX) < 32 ? 0 : deltaX < 0 ? 1 : -1;
    animateToGallerySlide(slides[currentIndex + direction] || currentSlide);
  };
  galleryTrack.addEventListener("pointerup", (event) => finishGalleryPointerGesture(event));
  galleryTrack.addEventListener("pointercancel", (event) => finishGalleryPointerGesture(event, true));
  projectGallery.addEventListener("click", (event) => {
    if (event.target === projectGallery) closeProjectGallery();
  });
  projectGallery.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeProjectGallery();
  });
  galleryTrack.addEventListener("scroll", handleGalleryScroll, { passive: true });
  galleryTrack.addEventListener("scrollend", () => {
    if (isDesktopGallery() || galleryIsAnimating || galleryIsRecentering) return;
    window.clearTimeout(gallerySettleTimer);
    recenterGalleryLoop();
  });
  galleryTrack.addEventListener("keydown", (event) => {
    if (isDesktopGallery()) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const slides = [...galleryTrack.querySelectorAll(".project-gallery__slide")];
    const activeIndex = slides.indexOf(findCenteredGallerySlide());
    const target = slides[activeIndex + (event.key === "ArrowRight" ? 1 : -1)];
    if (!target) return;
    event.preventDefault();
    animateToGallerySlide(target);
  });
  projectGallery.addEventListener("wheel", (event) => {
    if (isDesktopGallery()) {
      event.preventDefault();
      return;
    }
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
    event.preventDefault();

    if (!galleryWheelLock) {
      const slides = [...galleryTrack.querySelectorAll(".project-gallery__slide")];
      const currentSlide = findCenteredGallerySlide();
      const currentIndex = slides.indexOf(currentSlide);
      const targetSlide = slides[currentIndex + (event.deltaY > 0 ? 1 : -1)];
      if (targetSlide) animateToGallerySlide(targetSlide);
      galleryWheelLock = true;
    }

    window.clearTimeout(galleryWheelTimer);
    galleryWheelTimer = window.setTimeout(() => {
      galleryWheelLock = false;
      galleryWheelTimer = 0;
    }, 700);
  }, { passive: false });
  window.addEventListener("resize", () => {
    if (!projectGallery.open || !galleryActiveSlide) return;
    if (galleryAnimationFrame) window.cancelAnimationFrame(galleryAnimationFrame);
    galleryAnimationFrame = 0;
    galleryIsAnimating = false;
    projectGallery.classList.remove("is-opening");
    galleryTrack.tabIndex = isDesktopGallery() ? -1 : 0;
    galleryNavigationSlide = galleryActiveSlide;
    galleryIsRecentering = true;
    galleryTrack.classList.add("is-recentering");
    window.requestAnimationFrame(() => {
      centerGallerySlide(galleryNavigationSlide || galleryActiveSlide);
      window.requestAnimationFrame(() => {
        galleryTrack.classList.remove("is-recentering");
        galleryIsRecentering = false;
      });
    });
  }, { passive: true });

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

  const aboutScene = document.querySelector(".about__desktop-scene");
  const aboutRunway = aboutScene?.querySelector(".about__desktop-runway");
  const aboutIntro = aboutScene?.querySelector(".about__desktop-intro");
  const aboutTitle = aboutScene?.querySelector(".about__desktop-title h2");
  const aboutPortrait = aboutScene?.querySelector(".about__desktop-portrait");
  const aboutPortraitImage = aboutPortrait?.querySelector("img");
  const aboutStoryCopies = aboutScene ? [...aboutScene.querySelectorAll(".about__desktop-copy")] : [];
  let aboutStoryReady = false;
  let aboutStoryStartY = null;
  let aboutIntroMarginTop = 0;
  let aboutStoryTravel = [];
  let aboutPinStartY = 0;

  const measureAboutStory = () => {
    if (!aboutRunway || !aboutStoryCopies.length || !aboutIntro) return;
    aboutStoryTravel = aboutStoryCopies.map((copy) => window.innerHeight + copy.getBoundingClientRect().height);
    const tail = aboutStoryTravel.reduce((sum, distance) => sum + distance, 0);
    if (aboutStoryStartY === null || !aboutIntro.classList.contains("is-expanded")) {
      const wasExpanded = aboutIntro.classList.contains("is-expanded");
      const previousTransition = aboutPortrait.style.transition;
      if (wasExpanded) {
        aboutPortrait.style.transition = "none";
        aboutIntro.classList.remove("is-expanded");
        void aboutPortrait.offsetWidth;
      }
      const compactHeight = aboutIntro.getBoundingClientRect().height;
      if (wasExpanded) {
        aboutIntro.classList.add("is-expanded");
        void aboutPortrait.offsetWidth;
        aboutPortrait.style.transition = previousTransition;
      }
      aboutIntroMarginTop = Math.max(0, (window.innerHeight - compactHeight) / 2);
      aboutIntro.style.marginTop = `${aboutIntroMarginTop}px`;
      aboutPinStartY = window.scrollY + aboutScene.getBoundingClientRect().top + aboutIntroMarginTop - window.innerHeight * 0.083;
    }
    if (aboutStoryStartY === null) {
      const expandedHeight = aboutIntro.getBoundingClientRect().height;
      aboutRunway.style.height = `${aboutIntroMarginTop + window.innerHeight * 2 + tail + expandedHeight}px`;
      return;
    }
    const sceneStartY = window.scrollY + aboutScene.getBoundingClientRect().top;
    const expandedHeight = aboutIntro.getBoundingClientRect().height;
    const stickyTop = window.innerHeight * 0.083;
    const releaseScrollY = aboutStoryStartY + tail;
    aboutRunway.style.height = `${Math.max(window.innerHeight, releaseScrollY - sceneStartY + stickyTop + expandedHeight)}px`;
  };

  const initAboutStory = () => {
    if (!aboutScene || aboutStoryReady || !window.matchMedia("(min-width: 1200px)").matches) return;
    const segmenter = typeof Intl.Segmenter === "function" ? new Intl.Segmenter("ru", { granularity: "grapheme" }) : null;
    aboutStoryCopies.forEach((copy) => {
      const text = copy.textContent;
      const characters = segmenter ? [...segmenter.segment(text)].map((part) => part.segment) : Array.from(text);
      copy.replaceChildren(...characters.map((character) => {
        const span = document.createElement("span");
        span.textContent = character;
        return span;
      }));
    });
    aboutStoryReady = true;
    measureAboutStory();
  };

  const updateAboutStory = () => {
    if (!aboutScene || !window.matchMedia("(min-width: 1200px)").matches) return;
    if (!aboutStoryReady) initAboutStory();
    if (!aboutStoryReady) return;

    const titleRect = aboutTitle.getBoundingClientRect();
    const titleCenter = titleRect.top + titleRect.height / 2;
    aboutScene.classList.toggle("is-color-active", titleCenter <= window.innerHeight / 2);

    const sceneStartY = window.scrollY + aboutScene.getBoundingClientRect().top;
    const stickyTop = window.innerHeight * 0.083;
    aboutPinStartY = sceneStartY + aboutIntroMarginTop - stickyTop;
    const shouldExpand = window.scrollY >= aboutPinStartY;
    if (shouldExpand && !aboutIntro.classList.contains("is-expanded")) {
      aboutIntro.classList.add("is-expanded");
      aboutStoryStartY = null;
      measureAboutStory();
      if (reducedMotion.matches) {
        aboutStoryStartY = window.scrollY;
        placeAboutStoryCopies();
        measureAboutStory();
      }
    } else if (!shouldExpand && aboutIntro.classList.contains("is-expanded")) {
      aboutIntro.classList.remove("is-expanded");
      aboutStoryStartY = null;
      aboutStoryCopies.forEach((copy) => {
        copy.style.top = "-10000px";
        copy.dataset.highlightedCount = "0";
        copy.querySelectorAll("span.is-highlighted").forEach((span) => span.classList.remove("is-highlighted"));
      });
      aboutPortraitImage.style.setProperty("--about-image-shift", "0px");
      measureAboutStory();
    }
    if (aboutStoryStartY === null) return;

    let elapsed = Math.max(0, window.scrollY - aboutStoryStartY);
    const photoTop = aboutPortrait.getBoundingClientRect().top;
    const fillDistance = Math.max(1, window.innerHeight - photoTop);
    aboutStoryCopies.forEach((copy, index) => {
      const distance = aboutStoryTravel[index] || window.innerHeight;
      const fillProgress = Math.min(1, Math.max(0, elapsed / fillDistance));
      const spans = copy.children;
      const highlightedCount = Math.floor(fillProgress * spans.length);
      const previousCount = Number(copy.dataset.highlightedCount || 0);
      if (highlightedCount > previousCount) {
        for (let characterIndex = previousCount; characterIndex < highlightedCount; characterIndex += 1) {
          spans[characterIndex].classList.add("is-highlighted");
        }
      } else if (highlightedCount < previousCount) {
        for (let characterIndex = highlightedCount; characterIndex < previousCount; characterIndex += 1) {
          spans[characterIndex].classList.remove("is-highlighted");
        }
      }
      copy.dataset.highlightedCount = String(highlightedCount);
      elapsed = Math.max(0, elapsed - distance);
    });

    const storyTravel = aboutStoryTravel.reduce((sum, distance) => sum + distance, 0);
    const afterStoryDistance = window.scrollY - (aboutStoryStartY + storyTravel);
    const availableImageTravel = Math.max(0, aboutPortraitImage.offsetHeight - aboutPortrait.clientHeight);
    const parallaxShift = afterStoryDistance > 0 ? Math.min(availableImageTravel, afterStoryDistance * 0.2) : 0;
    aboutPortraitImage.style.setProperty("--about-image-shift", `${parallaxShift.toFixed(2)}px`);
  };

  const placeAboutStoryCopies = () => {
    if (aboutStoryStartY === null || !aboutScene || !aboutStoryCopies.length) return;
    const sceneStartY = window.scrollY + aboutScene.getBoundingClientRect().top;
    const firstCopyTop = aboutStoryStartY + window.innerHeight - sceneStartY;
    aboutStoryCopies.forEach((copy, index) => {
      const precedingDistance = aboutStoryTravel.slice(0, index).reduce((sum, distance) => sum + distance, 0);
      copy.style.top = `${firstCopyTop + precedingDistance}px`;
    });
  };

  aboutPortrait?.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "width" || !aboutIntro.classList.contains("is-expanded")) return;
    aboutStoryStartY = window.scrollY;
    placeAboutStoryCopies();
    measureAboutStory();
    updateAboutStory();
  });

  const requestParallaxUpdate = () => {
    if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateParallax);
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    scrollingUp = currentScrollY < previousScrollY;
    previousScrollY = currentScrollY;
    syncScrollNav();
    updateAboutStory();
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
    measureAboutStory();
    if (aboutStoryStartY !== null) placeAboutStoryCopies();
    updateAboutStory();
    requestParallaxUpdate();
  });
  reducedMotion.addEventListener?.("change", requestParallaxUpdate);
  document.fonts.ready.then(initHeadingReveal);
  document.fonts.ready.then(() => {
    initAboutStory();
    measureAboutStory();
    if (aboutStoryStartY !== null) placeAboutStoryCopies();
    updateAboutStory();
  });
  syncScrollNav();
  updateParallax();
})();
