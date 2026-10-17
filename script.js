const filters = document.querySelectorAll('.filter');
const photos = document.querySelectorAll('.photo-card');

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((filter) => filter.classList.remove('active'));
    button.classList.add('active');
    const selected = button.dataset.filter;
    photos.forEach((photo) => {
      photo.classList.toggle('hidden', selected !== 'all' && photo.dataset.category !== selected);
    });
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
menuToggle.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxTitle = lightbox.querySelector('.lightbox-caption strong');
const lightboxLocation = lightbox.querySelector('.lightbox-caption span');
photos.forEach((photo) => {
  photo.addEventListener('click', () => {
    const image = photo.querySelector('img');
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = photo.dataset.title;
    lightboxLocation.textContent = photo.dataset.location;
    lightbox.showModal();
  });
});
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
