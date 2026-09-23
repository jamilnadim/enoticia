//novidades do carrossel
function setupCarousel() {
  const track = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.slide'); // Agora ele busca os slides injetados
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (slides.length === 0) return; // Se não houver slides, não faz nada

  let currentIndex = 0;

  function updateCarousel() {
    const width = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * width}px)`;
  }

  function moveSlide(delta) {
    currentIndex = (currentIndex + delta + slides.length) % slides.length;
    updateCarousel();
  }

  // Remove ouvintes antigos para não dar erro ao recarregar
  prevBtn.replaceWith(prevBtn.cloneNode(true));
  nextBtn.replaceWith(nextBtn.cloneNode(true));
  
  // Pega as novas referências após clonar
  const newPrevBtn = document.getElementById('prevBtn');
  const newNextBtn = document.getElementById('nextBtn');

  newPrevBtn.addEventListener('click', () => moveSlide(-1));
  newNextBtn.addEventListener('click', () => moveSlide(1));

  // Auto-play
  setInterval(() => moveSlide(1), 6000);
  
  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}

/* Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
  });
} */

// Simple carousel
const track = document.getElementById('carouselTrack');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentIndex = 0;

function updateCarousel() {
  const width = slides[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${currentIndex * width}px)`;
}

function moveSlide(delta) {
  currentIndex = (currentIndex + delta + slides.length) % slides.length;
  updateCarousel();
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => moveSlide(-1));
  nextBtn.addEventListener('click', () => moveSlide(1));
}

// Auto-play carousel
let autoPlay = setInterval(() => moveSlide(1), 6000);
track.addEventListener('mouseenter', () => clearInterval(autoPlay));
track.addEventListener('mouseleave', () => autoPlay = setInterval(() => moveSlide(1), 6000));
window.addEventListener('resize', updateCarousel);
window.addEventListener('load', updateCarousel);

// Rotating ads (can handle multiple blocks)
function initRotatingAds(containerId, interval = 5000) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const imgs = Array.from(container.querySelectorAll('img'));
  if (imgs.length <= 1) return;

  let i = imgs.findIndex(img => img.classList.contains('active'));
  if (i < 0) { i = 0; imgs[0].classList.add('active'); }

  setInterval(() => {
    imgs[i].classList.remove('active');
    i = (i + 1) % imgs.length;
    imgs[i].classList.add('active');
  }, interval);
}

initRotatingAds('adsTop', 5000);
initRotatingAds('adsMiddle', 6000);

// Optional: pause ticker on hover is CSS-only; here we could later fetch items dynamically


