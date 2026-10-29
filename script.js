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
