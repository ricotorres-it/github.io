(async () => {
  'use strict';

  const mount = document.querySelector('[data-tools-marquee]');
  if (!mount) return;

  const tools = Array.isArray(window.portfolioToolset) ? window.portfolioToolset : [];
  if (!tools.length) {
    mount.closest('.tools-dock')?.setAttribute('hidden', '');
    return;
  }

  const base = document.body.dataset.base || '';
  const assetUrl = (path) => new URL(`${base}${path}`, document.baseURI).href;
  const fallbackIcon = () => '<span class="ph-icon icon-fallback" aria-hidden="true">•</span>';
  let icon = fallbackIcon;

  try {
    if (!window.phosphorReady) {
      window.phosphorReady = window.PVPhosphor
        ? Promise.resolve(window.PVPhosphor)
        : import(assetUrl('assets/vendor/phosphor/phosphor-local.js'));
    }
    const phosphor = await window.phosphorReady;
    if (phosphor && typeof phosphor.icon === 'function') {
      window.PVPhosphor = phosphor;
      icon = phosphor.icon;
    }
  } catch (error) {
    window.phosphorReady = null;
    console.warn('Tools marquee icons could not be loaded. Rendering labels without icons.', error);
  }

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const items = tools.map((tool) => `
    <span class="tool-chip">
      ${icon(tool.icon)}
      <span>${escapeHtml(tool.name)}</span>
    </span>`).join('');

  mount.innerHTML = `
    <div class="tools-track">
      <div class="tools-group">${items}</div>
      <div class="tools-group" aria-hidden="true">${items}</div>
    </div>`;
  mount.setAttribute('aria-label', `Tools I work with: ${tools.map((tool) => tool.name).join(', ')}`);

  const labelIcon = document.querySelector('[data-tools-label-icon]');
  if (labelIcon) labelIcon.innerHTML = icon('toolbox');

  const linkIcon = document.querySelector('[data-tools-link-icon]');
  if (linkIcon) linkIcon.innerHTML = icon('arrow-right');

  document.body.classList.add('has-tools-dock');
})();
