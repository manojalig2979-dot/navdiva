// Navdiva Group - Modern 2026 Core JS
// Bento Navbar, Sliding Glider, 3D Hero, Card Spotlight, Stat Counters, Magnetic Buttons, Command Palette (Ctrl+K)

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  highlightActiveLink();
  initNavGlider();
  initMobileMenu();
  init3DHero();
  initCardSpotlight();
  initStatCounters();
  initMagneticButtons();
  initCommandPalette();
});

// 1. Dynamic Scroll Condensation
function initNavbarScroll() {
  const navbar = document.querySelector('.bento-navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// 2. Sliding Active Pill Glider (Desktop)
function initNavGlider() {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  let glider = navLinks.querySelector('.nav-glider');
  if (!glider) {
    glider = document.createElement('div');
    glider.className = 'nav-glider';
    navLinks.prepend(glider);
  }

  const items = navLinks.querySelectorAll('li > a');
  
  function moveToElement(el) {
    if (!el || window.innerWidth <= 768) {
      glider.classList.remove('visible');
      return;
    }
    const rect = el.getBoundingClientRect();
    const parentRect = navLinks.getBoundingClientRect();

    const left = rect.left - parentRect.left;
    const top = rect.top - parentRect.top;
    const width = rect.width;
    const height = rect.height;

    glider.style.left = `${left}px`;
    glider.style.top = `${top}px`;
    glider.style.width = `${width}px`;
    glider.style.height = `${height}px`;
    glider.classList.add('visible');
  }

  function resetToActive() {
    const activeItem = navLinks.querySelector('li.active > a');
    if (activeItem) {
      moveToElement(activeItem);
    } else {
      glider.classList.remove('visible');
    }
  }

  items.forEach(link => {
    link.addEventListener('mouseenter', () => {
      moveToElement(link);
    });
  });

  navLinks.addEventListener('mouseleave', () => {
    resetToActive();
  });

  window.addEventListener('resize', () => {
    resetToActive();
  });

  setTimeout(resetToActive, 100);
}

// 3. Enhanced Mobile Glass Drawer & Accordion
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!mobileToggle || !navLinks) return;

  let backdrop = document.querySelector('.mobile-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-backdrop';
    document.body.appendChild(backdrop);
  }

  function toggleMenu(open) {
    const shouldOpen = typeof open === 'boolean' ? open : !navLinks.classList.contains('active');
    
    if (shouldOpen) {
      navLinks.classList.add('active');
      backdrop.classList.add('active');
      mobileToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
      mobileToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    } else {
      navLinks.classList.remove('active');
      backdrop.classList.remove('active');
      mobileToggle.classList.remove('active');
      document.body.style.overflow = '';
      mobileToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      `;
    }
  }

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  backdrop.addEventListener('click', () => {
    toggleMenu(false);
  });

  const dropdowns = navLinks.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('a');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('mobile-open');
        }
      });
    }
  });

  const regularLinks = navLinks.querySelectorAll('li:not(.dropdown) a, .dropdown-menu a');
  regularLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        toggleMenu(false);
      }
    });
  });
}

// 4. Highlight Active Page Link
function highlightActiveLink() {
  const normalizePath = (path) => {
    const clean = path.replace(/\/$/, '');
    const pageName = clean.substring(clean.lastIndexOf('/') + 1).replace(/\.html$/, '');
    return pageName === '' || pageName === '.' || pageName === 'index' ? '' : pageName;
  };

  const currentPage = normalizePath(window.location.pathname);
  
  const navItems = document.querySelectorAll('.nav-links > li');
  navItems.forEach(item => {
    const link = item.querySelector(':scope > a');
    if (!link) return;
    
    const hrefPage = normalizePath(link.getAttribute('href') || '');
    if (hrefPage === currentPage) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// 5. 3D Hero Parallax
function init3DHero() {
  const heroCard = document.querySelector('.hero-3d-card');
  const heroStage = document.querySelector('.hero-stage');
  const spotlight = document.querySelector('.hero-3d-spotlight');

  if (!heroCard || !heroStage) return;

  let currentRotateX = 0;
  let currentRotateY = 0;
  let targetRotateX = 0;
  let targetRotateY = 0;

  heroStage.addEventListener('mousemove', (e) => {
    const rect = heroStage.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    targetRotateY = (mouseX / (rect.width / 2)) * 10;
    targetRotateX = -(mouseY / (rect.height / 2)) * 10;

    if (spotlight) {
      const cardRect = heroCard.getBoundingClientRect();
      const spotX = e.clientX - cardRect.left;
      const spotY = e.clientY - cardRect.top;
      spotlight.style.transform = `translate3d(${spotX - cardRect.width / 2}px, ${spotY - cardRect.height / 2}px, -20px)`;
      spotlight.style.opacity = '1';
    }
  });

  heroStage.addEventListener('mouseleave', () => {
    targetRotateX = 0;
    targetRotateY = 0;
    if (spotlight) {
      spotlight.style.opacity = '0.5';
    }
  });

  function update3DTilt() {
    currentRotateX += (targetRotateX - currentRotateX) * 0.08;
    currentRotateY += (targetRotateY - currentRotateY) * 0.08;

    heroCard.style.transform = `rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;
    requestAnimationFrame(update3DTilt);
  }

  update3DTilt();
}

// 6. Dynamic Mouse Spotlight on Bento Cards & 3D Tilt
function initCardSpotlight() {
  const cards = document.querySelectorAll('.bento-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Gentle 3D perspective tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = -((y - centerY) / centerY) * 4;
      const tiltY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', `-999px`);
      card.style.setProperty('--mouse-y', `-999px`);
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

// 7. Scroll-Triggered Animated Number Counters
function initStatCounters() {
  const statElements = document.querySelectorAll('.stat-number');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  statElements.forEach(el => {
    el.setAttribute('data-target', el.textContent.trim());
    observer.observe(el);
  });

  function animateCounter(element) {
    const rawTarget = element.getAttribute('data-target') || '0';
    const isPercent = rawTarget.includes('%');
    const isPlus = rawTarget.includes('+');
    const numericTarget = parseFloat(rawTarget.replace(/[^0-9.]/g, ''));
    
    if (isNaN(numericTarget)) return;

    const duration = 1800; // ms
    const startTime = performance.now();
    const isFloat = rawTarget.includes('.');

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = easeOut * numericTarget;

      let formatted = isFloat ? currentVal.toFixed(1) : Math.floor(currentVal).toString();
      if (isPlus) formatted += '+';
      if (isPercent) formatted += '%';

      element.textContent = formatted;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = rawTarget; // Ensure exact final text
      }
    }

    requestAnimationFrame(updateCount);
  }
}

// 8. Magnetic Buttons Physics
function initMagneticButtons() {
  const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .cmd-trigger-btn, .theme-toggle');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const distX = (e.clientX - btnCenterX) * 0.25;
      const distY = (e.clientY - btnCenterY) * 0.25;

      btn.style.transform = `translate3d(${distX.toFixed(1)}px, ${distY.toFixed(1)}px, 0)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

// 9. Modern Glassmorphic Command Palette (Ctrl+K)
function initCommandPalette() {
  // Command items repository
  const commands = [
    { title: 'NDTechHub', subtitle: 'AI/ML, custom software lab & cloud services', category: 'Portfolio Units', icon: 'cpu', url: 'https://ndtechhub.com', external: true, badge: 'Tech' },
    { title: 'NDMart', subtitle: 'Curated e-commerce & retail platform', category: 'Portfolio Units', icon: 'shopping-bag', url: 'https://ndmart.store', external: true, badge: 'Retail' },
    { title: 'Rameshta', subtitle: 'Digital darshan, sacred texts & chants', category: 'Portfolio Units', icon: 'flame', url: 'https://rameshta.online', external: true, badge: 'Devotion' },
    { title: 'NDInsights', subtitle: 'Corporate blogs, research & thought leadership', category: 'Portfolio Units', icon: 'book-open', url: 'https://ndinsights.navdiva.com/', external: true, badge: 'Blog' },
    { title: 'Admin Workstation', subtitle: 'Generate official candidate & corporate letters', category: 'Utilities', icon: 'printer', url: './admin', external: false, badge: 'Tool' },
    { title: 'Open Careers', subtitle: 'Explore active job vacancies & apply', category: 'Company', icon: 'briefcase', url: './careers', external: false, badge: 'Hiring' },
    { title: 'Founder Story (CEO)', subtitle: 'Read the journey of CEO Manoj Singh', category: 'Company', icon: 'user', url: './ceo', external: false, badge: 'Profile' },
    { title: 'About Navdiva Group', subtitle: 'Conglomerate vision, mission & holding model', category: 'Company', icon: 'info', url: './about', external: false, badge: 'About' },
    { title: 'Contact Headquarters', subtitle: 'Reach out to our Delhi HQ office', category: 'Company', icon: 'map-pin', url: './contact', external: false, badge: 'HQ' }
  ];

  // Inject command palette DOM if not present
  let backdrop = document.querySelector('.cmd-palette-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'cmd-palette-backdrop';
    backdrop.innerHTML = `
      <div class="cmd-palette-modal" role="dialog" aria-modal="true" aria-label="Command Palette">
        <div class="cmd-search-bar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="cmd-input" placeholder="Type a command or search business units..." autocomplete="off" spellcheck="false">
          <span class="cmd-kbd-badge">ESC</span>
        </div>
        <div class="cmd-results-list" id="cmd-results"></div>
        <div class="cmd-palette-footer">
          <div class="cmd-footer-shortcuts">
            <span><span class="cmd-kbd-badge">↑</span> <span class="cmd-kbd-badge">↓</span> to navigate</span>
            <span><span class="cmd-kbd-badge">↵</span> to select</span>
          </div>
          <span>Navdiva Quick Navigator</span>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
  }

  const input = backdrop.querySelector('#cmd-input');
  const resultsContainer = backdrop.querySelector('#cmd-results');
  let selectedIndex = 0;
  let filteredCommands = [...commands];

  function renderCommands() {
    resultsContainer.innerHTML = '';
    
    if (!filteredCommands.length) {
      resultsContainer.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 14px;">
          No matching unit or command found.
        </div>
      `;
      return;
    }

    let currentCategory = '';
    filteredCommands.forEach((cmd, idx) => {
      if (cmd.category !== currentCategory) {
        currentCategory = cmd.category;
        const groupLabel = document.createElement('div');
        groupLabel.className = 'cmd-group-label';
        groupLabel.textContent = currentCategory;
        resultsContainer.appendChild(groupLabel);
      }

      const item = document.createElement('a');
      item.className = `cmd-item ${idx === selectedIndex ? 'active' : ''}`;
      item.href = cmd.url;
      if (cmd.external) {
        item.target = '_blank';
        item.rel = 'noopener noreferrer';
      }

      item.innerHTML = `
        <div class="cmd-item-left">
          <div class="cmd-item-icon"><i data-lucide="${cmd.icon}"></i></div>
          <div>
            <div class="cmd-item-title">${cmd.title}</div>
            <div class="cmd-item-subtitle">${cmd.subtitle}</div>
          </div>
        </div>
        <span class="cmd-item-badge">${cmd.badge}</span>
      `;

      item.addEventListener('mouseenter', () => {
        selectedIndex = idx;
        updateActiveItem();
      });

      item.addEventListener('click', () => {
        closePalette();
      });

      resultsContainer.appendChild(item);
    });

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function updateActiveItem() {
    const items = resultsContainer.querySelectorAll('.cmd-item');
    items.forEach((it, idx) => {
      if (idx === selectedIndex) {
        it.classList.add('active');
        it.scrollIntoView({ block: 'nearest' });
      } else {
        it.classList.remove('active');
      }
    });
  }

  function openPalette() {
    backdrop.classList.add('open');
    input.value = '';
    filteredCommands = [...commands];
    selectedIndex = 0;
    renderCommands();
    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    backdrop.classList.remove('open');
    input.blur();
  }

  // Keyboard shortcut listener: Ctrl+K or Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (backdrop.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closePalette();
    } else if (backdrop.classList.contains('open')) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % filteredCommands.length;
        updateActiveItem();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
        updateActiveItem();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeItem = resultsContainer.querySelectorAll('.cmd-item')[selectedIndex];
        if (activeItem) {
          activeItem.click();
        }
      }
    }
  });

  // Filter on input typing
  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    filteredCommands = commands.filter(cmd => 
      cmd.title.toLowerCase().includes(query) ||
      cmd.subtitle.toLowerCase().includes(query) ||
      cmd.category.toLowerCase().includes(query) ||
      cmd.badge.toLowerCase().includes(query)
    );
    selectedIndex = 0;
    renderCommands();
  });

  // Click outside to close
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closePalette();
    }
  });

  // Trigger button in navbar
  const triggerBtn = document.querySelector('.cmd-trigger-btn');
  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      openPalette();
    });
  }
}
