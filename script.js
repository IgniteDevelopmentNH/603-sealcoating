const year = document.querySelector("#year");
const menuToggle = document.querySelector(".menu-toggle");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle) {
  const navLeft = document.querySelector(".site-nav-left");
  const navRight = document.querySelector(".site-nav-right");

  menuToggle.addEventListener("click", () => {
    const isOpen = navLeft.classList.toggle("is-open");
    navRight.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  [navLeft, navRight].forEach((nav) => {
    if (!nav) return;
    nav.addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        navLeft.classList.remove("is-open");
        navRight.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

// Logo always returns to the very top of the page.
const logo = document.querySelector(".logo");
if (logo) {
  logo.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

(() => {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;

  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  const dots = document.querySelectorAll(".carousel-dot");

  const totalSlides = slides.length;
  let currentSlide = 0;
  let autoplayInterval;
  const mobile = window.matchMedia("(max-width: 880px)");

  // Stacked "card deck" — current card in front, prev/next peeking behind.
  // Slightly smaller peek on mobile so the side cards stay on-screen.
  const render = () => {
    const peek = mobile.matches ? 36 : 40;
    const sideScale = mobile.matches ? 0.94 : 0.95;
    slides.forEach((slide, i) => {
      const offset = (i - currentSlide + totalSlides) % totalSlides;
      if (offset === 0) {
        slide.style.transform = "translateX(0) scale(1)";
        slide.style.zIndex = "3";
      } else if (offset === 1) {
        slide.style.transform = `translateX(${peek}px) scale(${sideScale})`;
        slide.style.zIndex = "2";
      } else if (offset === totalSlides - 1) {
        slide.style.transform = `translateX(-${peek}px) scale(${sideScale})`;
        slide.style.zIndex = "1";
      } else {
        slide.style.transform = "translateX(0) scale(0.9)";
        slide.style.zIndex = "0";
      }
    });
    dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
  };

  const goToSlide = (n) => {
    currentSlide = (n + totalSlides) % totalSlides;
    render();
  };
  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  const startAutoplay = () => {
    autoplayInterval = setInterval(nextSlide, 3500);
  };
  const stopAutoplay = () => clearInterval(autoplayInterval);
  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoplay();
  });
  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoplay();
  });
  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      goToSlide(parseInt(e.target.dataset.slide));
      resetAutoplay();
    });
  });

  // Finger-swipe support: swipe left/right on the carousel to change cards.
  let startX = 0;
  let startY = 0;
  let tracking = false;
  let horizontal = false;

  carousel.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
      horizontal = false;
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchmove",
    (e) => {
      if (!tracking) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (!horizontal && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        horizontal = true;
        stopAutoplay();
      }
      // Prevent the page from scrolling while doing a horizontal swipe.
      if (horizontal) e.preventDefault();
    },
    { passive: false }
  );

  carousel.addEventListener("touchend", (e) => {
    if (!tracking) return;
    tracking = false;
    if (!horizontal) return;
    const dx = e.changedTouches[0].clientX - startX;
    const threshold = carousel.getBoundingClientRect().width * 0.15;
    if (dx > threshold) prevSlide();
    else if (dx < -threshold) nextSlide();
    resetAutoplay();
  });

  // Re-apply peek sizing when crossing the mobile/desktop breakpoint.
  mobile.addEventListener("change", render);

  render();
  startAutoplay();
})();
