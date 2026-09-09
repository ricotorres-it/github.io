(() => {
  'use strict';

  const body = document.body;
  const base = body.dataset.base || '';
  const assetUrl = (path) => new URL(`${base}${path}`, document.baseURI).href;

  const routes = [
    { match: /\/about$/, icon: 'user', label: 'About', fallback: '●' },
    { match: /\/projects$/, icon: 'squares-four', label: 'Projects', fallback: '▦' },
    { match: /\/experience$/, icon: 'briefcase', label: 'Experience', fallback: '▣' },
    { match: /\/skills$/, icon: 'wrench', label: 'Skills', fallback: '⌘' },
    { match: /\/contact$/, icon: 'envelope-simple', label: 'Contact', fallback: '✉' }
  ];

  const normalizePath = (value) => {
    const path = value.replace(/\/+$/, '');
    return path || '/';
  };

  const resolveRoute = (link) => {
    const path = normalizePath(new URL(link.href, location.href).pathname);
    const matched = routes.find((route) => route.match.test(path));
    return matched || { icon: 'house', label: 'Home', fallback: '⌂' };
  };

  const renderFallbacks = () => {
    document.querySelectorAll('.side-nav a').forEach((link) => {
      const route = resolveRoute(link);
      const target = link.querySelector('.nav-ico');
      link.dataset.navLabel = route.label;
      link.setAttribute('aria-label', route.label);
      if (target) target.textContent = route.fallback;
    });
  };

  const render = async () => {
    renderFallbacks();

    let phosphor = window.PVPhosphor;
    try {
      if (!phosphor) {
        window.phosphorReady = window.phosphorReady || import(assetUrl('assets/vendor/phosphor/phosphor-local.js'));
        phosphor = await window.phosphorReady;
        if (phosphor) window.PVPhosphor = phosphor;
      }
    } catch (error) {
      console.warn('Mobile navigation icons are using safe fallbacks.', error);
      return;
    }

    if (!phosphor || typeof phosphor.icon !== 'function') return;

    document.querySelectorAll('.side-nav a').forEach((link) => {
      const route = resolveRoute(link);
      const target = link.querySelector('.nav-ico');
      link.dataset.navLabel = route.label;
      link.setAttribute('aria-label', route.label);
      if (target) {
        target.setAttribute('aria-hidden', 'true');
        target.innerHTML = phosphor.icon(route.icon);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render, { once: true });
  } else {
    render();
  }
})();
