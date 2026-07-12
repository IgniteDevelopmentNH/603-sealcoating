const year = document.querySelector("#year");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

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

  if (navLeft) {
    navLeft.addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        navLeft.classList.remove("is-open");
        navRight.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (navRight) {
    navRight.addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        navLeft.classList.remove("is-open");
        navRight.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
}

(() => {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;

  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  const dots = document.querySelectorAll(".carousel-dot");

  let currentSlide = 0;
  const totalSlides = 4;
  let autoplayInterval;

  const goToSlide = (n) => {
    currentSlide = (n + totalSlides) % totalSlides;
    const slides = document.querySelectorAll('.carousel-slide');

    slides.forEach((slide, i) => {
      let offset = (i - currentSlide + totalSlides) % totalSlides;

      if (offset === 0) {
        // Current card - front
        slide.style.transform = 'translateX(0) scale(1)';
        slide.style.zIndex = '3';
      } else if (offset === 1) {
        // Next card - right
        slide.style.transform = 'translateX(40px) scale(0.95)';
        slide.style.zIndex = '2';
      } else if (offset === totalSlides - 1) {
        // Previous card - left
        slide.style.transform = 'translateX(-40px) scale(0.95)';
        slide.style.zIndex = '1';
      } else {
        // Hidden
        slide.style.transform = 'translateX(0) scale(0.9)';
        slide.style.zIndex = '0';
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
    });
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  const startAutoplay = () => {
    autoplayInterval = setInterval(nextSlide, 3000);
  };

  const resetAutoplay = () => {
    clearInterval(autoplayInterval);
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

  dots.forEach(dot => {
    dot.addEventListener("click", (e) => {
      const slideIndex = parseInt(e.target.dataset.slide);
      goToSlide(slideIndex);
      resetAutoplay();
    });
  });

  goToSlide(0);
  startAutoplay();
})();
