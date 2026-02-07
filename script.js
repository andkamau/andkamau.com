/**
 * andkamau.com - Main Script
 * Handles: Dark mode toggle, scroll reveal animations
 */

// =====================================================================
// DARK MODE TOGGLE
// =====================================================================

(function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  /**
   * Get the saved theme from localStorage or system preference
   */
  function getSavedTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;

    // Check system preference
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemDark ? 'dark' : 'light';
  }

  /**
   * Update theme icon based on current theme
   */
  function updateThemeIcon() {
    const icon = themeToggle.querySelector('.theme-icon');
    const isDark = html.dataset.theme === 'dark';
    // Icon rotation handled by CSS
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
  }

  /**
   * Initialize theme on page load
   */
  function initializeTheme() {
    const theme = getSavedTheme();
    html.dataset.theme = theme;
    updateThemeIcon();
  }

  /**
   * Handle theme toggle click
   */
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.dataset.theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();

    // Subtle haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  });

  // Initialize on page load
  initializeTheme();

  // Listen for system theme changes
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        html.dataset.theme = e.matches ? 'dark' : 'light';
        updateThemeIcon();
      }
    });
})();

// =====================================================================
// SCROLL REVEAL ANIMATION
// =====================================================================

(function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Already has fade-in animation, just make sure it's visible
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }
})();

// =====================================================================
// PAST TALKS TOGGLE
// =====================================================================

(function initPastTalksToggle() {
  const toggleButton = document.getElementById('toggle-past-talks');
  const pastTalksContainer = document.getElementById('past-talks');

  if (!toggleButton || !pastTalksContainer) return;

  toggleButton.addEventListener('click', () => {
    const isHidden = pastTalksContainer.classList.contains('hidden');

    if (isHidden) {
      pastTalksContainer.classList.remove('hidden');
      toggleButton.textContent = 'Hide past talks ↑';
    } else {
      pastTalksContainer.classList.add('hidden');
      toggleButton.textContent = 'View past talks →';
    }

    // Smooth scroll to container if opening
    if (isHidden) {
      setTimeout(() => {
        pastTalksContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  });
})();

// =====================================================================
// LAZY LOAD IMAGES
// =====================================================================

(function initLazyLoad() {
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // Image loading is handled by browser with loading="lazy"
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
})();

// =====================================================================
// ANALYTICS TRACKING (Optional enhancement)
// =====================================================================

(function trackInteractions() {
  // Track external link clicks
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.addEventListener('click', function () {
      // Analytics removed
    });
  });

  // Track theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', function () {
    // Analytics removed
  });
})();

// =====================================================================
// SMOOTH SCROLL POLYFILL (if needed)
// =====================================================================

(function smoothScrollPolyfill() {
  if (!('scrollBehavior' in document.documentElement.style)) {
    // Polyfill for smooth scroll in older browsers
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);

        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
})();

// =====================================================================
// ACCESSIBILITY: SKIP TO MAIN
// =====================================================================

(function addSkipToMain() {
  if (document.querySelector('a[href="#main"]')) return; // Already exists

  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-to-main';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--accent);
    color: var(--bg-primary);
    padding: 8px;
    text-decoration: none;
    z-index: 100;
  `;

  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });

  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });

  document.body.insertBefore(skipLink, document.body.firstChild);

  // Add id to main
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main-content';
    main.tabIndex = -1;
  }
})();

// =====================================================================
// PERFORMANCE: Preload critical resources
// =====================================================================

(function preloadResources() {
  // Preload fonts
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
  document.head.appendChild(link);
})();

console.log('andkamau.com loaded successfully');
