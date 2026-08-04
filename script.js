const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

function closeMobileMenu() {
  if (!menuToggle || !navLinks) return;
  navLinks.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });
  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });
}

const animatedSections = document.querySelectorAll('.section-animate');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  animatedSections.forEach((section) => observer.observe(section));
} else {
  animatedSections.forEach((section) => section.classList.add('visible'));
}

const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryCarousel = document.getElementById('galleryCarousel');
const galleryPrev = document.querySelector('[data-gallery-prev]');
const galleryNext = document.querySelector('[data-gallery-next]');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;
    filterButtons.forEach((btn) => {
      const active = btn === button;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    galleryItems.forEach((item) => {
      const shouldShow = selectedFilter === 'todo' || selectedFilter === item.dataset.category;
      item.classList.toggle('hidden', !shouldShow);
      item.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
      item.tabIndex = shouldShow ? 0 : -1;
    });
    galleryCarousel?.scrollTo({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});

function scrollGallery(direction) {
  if (!galleryCarousel) return;
  const firstVisibleItem = Array.from(galleryItems).find((item) => !item.classList.contains('hidden'));
  const distance = firstVisibleItem ? firstVisibleItem.getBoundingClientRect().width + 18 : 320;
  galleryCarousel.scrollBy({ left: direction * distance, behavior: reduceMotion ? 'auto' : 'smooth' });
}
galleryPrev?.addEventListener('click', () => scrollGallery(-1));
galleryNext?.addEventListener('click', () => scrollGallery(1));

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
let previousFocus = null;

if (lightbox && lightboxImage && lightboxClose) {
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const image = item.querySelector('img');
      if (!image) return;
      previousFocus = item;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      lightboxClose.focus();
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImage.src = '';
    lightboxImage.alt = '';
    previousFocus?.focus();
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    if (event.key === 'Tab' && lightbox.classList.contains('active')) {
      event.preventDefault();
      lightboxClose.focus();
    }
  });
}
