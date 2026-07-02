const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  const links = document.querySelectorAll('.nav-links a');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const animatedSections = document.querySelectorAll('.section-animate');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

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

    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    galleryItems.forEach((item) => {
      const itemCategory = item.dataset.category;
      const shouldShow = selectedFilter === 'todo' || selectedFilter === itemCategory;
      item.classList.toggle('hidden', !shouldShow);
    });

    if (galleryCarousel) {
      galleryCarousel.scrollTo({ left: 0, behavior: 'smooth' });
    }
  });
});

function scrollGallery(direction) {
  if (!galleryCarousel) return;
  const firstVisibleItem = Array.from(galleryItems).find((item) => !item.classList.contains('hidden'));
  const distance = firstVisibleItem ? firstVisibleItem.getBoundingClientRect().width + 18 : 320;
  galleryCarousel.scrollBy({ left: direction * distance, behavior: 'smooth' });
}

if (galleryPrev) {
  galleryPrev.addEventListener('click', () => scrollGallery(-1));
}

if (galleryNext) {
  galleryNext.addEventListener('click', () => scrollGallery(1));
}

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox && lightboxImage && lightboxClose) {
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const image = item.querySelector('img');
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    lightboxImage.alt = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}
