// Navdiva 2026 Interactive Systems
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Mobile Navigation Toggle
const toggleBtn = $('.mobile-toggle') || $('.menu');
const navLinks = $('.nav-links');

if (toggleBtn && navLinks) {
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.bento-navbar')) {
      navLinks.classList.remove('open');
    }
  });

  $$('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Scrolled Navbar Effect
window.addEventListener('scroll', () => {
  const navbar = $('.bento-navbar');
  if (navbar) {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
}, { passive: true });

// Active Navigation Link Detection
const currentFile = location.pathname.split('/').pop() || 'index.html';
$$('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentFile || (href === './' && (currentFile === '' || currentFile === 'index.html'))) {
    link.classList.add('active');
  }
});

// Toast System
window.showToast = (msg) => {
  const toast = $('.toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
};
