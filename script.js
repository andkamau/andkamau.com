(function () {
  'use strict';
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var storageKey = 'andkamau-theme';

  function readTheme() {
    try {
      var savedTheme = window.localStorage.getItem(storageKey);
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch (error) {
      // Storage can be unavailable in private or restricted browsing modes.
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
  }

  applyTheme(readTheme());
  toggle.addEventListener('click', function () {
    var nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try { window.localStorage.setItem(storageKey, nextTheme); } catch (error) {
      // The selected theme still works for this page when storage is unavailable.
    }
  });
})();

(function () {
  'use strict';
  var button = document.getElementById('copy-portfolio');
  var status = document.getElementById('copy-status');
  var label = document.getElementById('copy-label');
  var link = document.getElementById('view-portfolio');
  if (!button || !status || !label || !link || !window.fetch) return;
  if (!navigator.clipboard || !navigator.clipboard.writeText) return;

  // Load first so the clipboard write stays directly inside the user's click.
  window.fetch(link.href, { cache: 'no-cache', credentials: 'same-origin' })
    .then(function (response) {
      if (!response.ok) throw new Error('Portfolio unavailable');
      return response.text();
    })
    .then(function (markdown) {
      if (!markdown.startsWith('# Andrew Kamau\n')) throw new Error('Invalid portfolio');
      button.hidden = false;
      link.hidden = true;
      var reset;
      button.addEventListener('click', function () {
        window.clearTimeout(reset);
        status.textContent = '';
        navigator.clipboard.writeText(markdown).then(function () {
          label.textContent = 'Portfolio copied';
          status.textContent = 'Portfolio copied';
          reset = window.setTimeout(function () {
            label.textContent = 'Copy for your agent';
            status.textContent = '';
          }, 2500);
        }).catch(function () {
          button.hidden = true;
          link.hidden = false;
          link.focus();
          status.textContent = 'Copy was blocked. Download the portfolio instead.';
        });
      });
    }).catch(function () {
      status.textContent = 'Download the portfolio to read or copy it.';
    });
})();
