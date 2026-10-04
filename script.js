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
  var endpoint = 'https://hits.andkamau.com/v1/page-view';

  function normalisedPath() {
    var path = window.location.pathname || '/';
    return path.charAt(0) === '/' ? path : '/' + path;
  }

  function sendPageView() {
    if (!window.fetch) return;
    var controller = window.AbortController ? new AbortController() : null;
    var timeout = controller ? window.setTimeout(function () { controller.abort(); }, 1500) : null;
    window.fetch(endpoint, {
      method: 'POST', mode: 'cors', credentials: 'omit', cache: 'no-store', keepalive: true,
      referrerPolicy: 'strict-origin-when-cross-origin',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({ path: normalisedPath() }),
      signal: controller ? controller.signal : undefined
    }).catch(function () {
      // Analytics must never change the visitor experience.
    }).then(function () {
      if (timeout !== null) window.clearTimeout(timeout);
    });
  }

  window.addEventListener('load', function () { window.setTimeout(sendPageView, 0); }, { once: true });
})();
