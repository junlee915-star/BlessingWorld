const slides = [...document.querySelectorAll('.hero-image')];
const dots = [...document.querySelectorAll('.dot')];
let currentSlide = 0;
let timer;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  document.querySelector('.hero-index').firstChild.textContent = `0${currentSlide + 1} `;
}

function restartTimer() {
  clearInterval(timer);
  timer = setInterval(() => showSlide(currentSlide + 1), 5000);
}

document.querySelector('.next').addEventListener('click', () => { showSlide(currentSlide + 1); restartTimer(); });
document.querySelector('.prev').addEventListener('click', () => { showSlide(currentSlide - 1); restartTimer(); });
dots.forEach((dot, index) => dot.addEventListener('click', () => { showSlide(index); restartTimer(); }));
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) restartTimer();

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
menuButton.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', isOpen);
  menuButton.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => mobileNav.classList.remove('open')));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 45, 300)}ms`;
  observer.observe(element);
});