(() => {
  'use strict';

  const mount = document.querySelector('[data-home-projects-showcase]');
  const data = window.portfolioData;
  if (!mount || !data?.projects?.length) return;

  const base = document.body.dataset.base || '';
  const projects = data.projects.filter((project) => project.featured).slice(0, 3);
  const items = projects.length ? projects : data.projects.slice(0, 3);
  if (!items.length) return;

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cycleMs = Math.max(1800, Number(mount.dataset.cycle || 3200));

  let activeIndex = 0;
  let offset = 0;
  let lastFrame = 0;
  let frameId = 0;
  let paused = false;
  let visible = true;

  const projectUrl = (project) => `${base}projects/${encodeURIComponent(project.slug)}/`;
  const projectImage = (project) => `${base}${project.thumbnail}`;

  // Duplicate the full set so the upward motion can wrap without a visible jump.
  const slides = [...items, ...items];

  mount.innerHTML = `
    <div class="home-projects-showcase__inner">
      <div class="home-projects-showcase__copy">
        <p class="home-projects-showcase__label"><span class="home-projects-showcase__folder" aria-hidden="true"></span><span>PROJECTS</span></p>
        <p class="home-projects-showcase__description">Funnels, workflows and apps built to solve real problems.</p>
        <div class="home-projects-showcase__active" aria-live="polite">
          <strong data-home-project-title></strong>
          <span data-home-project-category></span>
        </div>
        <a class="home-projects-showcase__link" href="projects/">View All Projects →</a>
      </div>
      <div class="home-projects-showcase__stage">
        <div class="home-projects-showcase__viewport" data-home-project-viewport tabindex="0" aria-label="Continuously scrolling featured project previews. Hover or focus to pause. Use arrow keys to change project.">
          <div class="home-projects-showcase__track" data-home-project-track>
            ${slides.map((project, index) => {
              const duplicate = index >= items.length;
              return `
              <article class="home-projects-showcase__slide" ${duplicate ? 'aria-hidden="true"' : ''}>
                <a class="home-projects-showcase__browser" href="${projectUrl(project)}" ${duplicate ? 'tabindex="-1"' : ''} aria-label="Open ${escapeHtml(project.title)} case study">
                  <div class="home-projects-showcase__chrome">
                    <span class="home-projects-showcase__dots" aria-hidden="true"><i></i><i></i><i></i></span>
                    <span class="home-projects-showcase__address">${escapeHtml(project.category)}</span>
                  </div>
                  <div class="home-projects-showcase__media">
                    <img src="${projectImage(project)}" alt="Sanitized ${escapeHtml(project.title)} project screenshot" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async" width="1280" height="720">
                  </div>
                </a>
              </article>`;
            }).join('')}
          </div>
        </div>
      </div>
      <span class="home-projects-showcase__progress" aria-hidden="true"><span data-home-project-progress></span></span>
    </div>`;

  const viewport = mount.querySelector('[data-home-project-viewport]');
  const track = mount.querySelector('[data-home-project-track]');
  const title = mount.querySelector('[data-home-project-title]');
  const category = mount.querySelector('[data-home-project-category]');
  const progress = mount.querySelector('[data-home-project-progress]');
  if (!viewport || !track) return;

  const step = () => {
    const first = track.querySelector('.home-projects-showcase__slide');
    const gap = parseFloat(getComputedStyle(track).gap || '0') || 0;
    return (first?.getBoundingClientRect().height || viewport.clientHeight) + gap;
  };

  const loopDistance = () => step() * items.length;

  const setMeta = (index) => {
    const normalized = ((index % items.length) + items.length) % items.length;
    if (normalized === activeIndex && title?.textContent) return;
    const project = items[normalized];
    activeIndex = normalized;
    if (title) title.textContent = project.title;
    if (category) category.textContent = project.category;
  };

  const render = () => {
    track.style.transform = `translate3d(0, ${-offset}px, 0)`;
    const slideStep = step();
    const distance = loopDistance();
    if (slideStep > 0) setMeta(Math.floor((offset + slideStep * 0.5) / slideStep));
    if (progress && distance > 0) {
      progress.style.transform = `scaleX(${Math.min(1, Math.max(0, offset / distance))})`;
    }
  };

  const tick = (now) => {
    if (!lastFrame) lastFrame = now;
    const delta = Math.min(50, now - lastFrame);
    lastFrame = now;

    if (!paused && visible && !reducedMotion.matches && items.length > 1) {
      const slideStep = step();
      const distance = loopDistance();
      if (slideStep > 0 && distance > 0) {
        offset += (slideStep / cycleMs) * delta;
        if (offset >= distance) offset %= distance;
        render();
      }
    }

    frameId = requestAnimationFrame(tick);
  };

  const jumpTo = (index) => {
    const normalized = ((index % items.length) + items.length) % items.length;
    offset = normalized * step();
    lastFrame = performance.now();
    setMeta(normalized);
    render();
  };

  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      jumpTo(activeIndex + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      jumpTo(activeIndex - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      jumpTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      jumpTo(items.length - 1);
    }
  });

  mount.addEventListener('mouseenter', () => { paused = true; });
  mount.addEventListener('mouseleave', () => { paused = false; lastFrame = performance.now(); });
  mount.addEventListener('focusin', () => { paused = true; });
  mount.addEventListener('focusout', (event) => {
    if (!mount.contains(event.relatedTarget)) {
      paused = false;
      lastFrame = performance.now();
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      visible = Boolean(entries[0]?.isIntersecting);
      lastFrame = performance.now();
    }, { threshold: 0.15 });
    observer.observe(mount);
  }

  const onMotionChange = () => {
    offset = 0;
    lastFrame = performance.now();
    setMeta(0);
    render();
  };
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onMotionChange);
  else reducedMotion.addListener(onMotionChange);

  window.addEventListener('resize', () => {
    const normalized = activeIndex;
    offset = normalized * step();
    lastFrame = performance.now();
    render();
  }, { passive: true });

  setMeta(0);
  render();
  frameId = requestAnimationFrame(tick);

  window.addEventListener('pagehide', () => {
    if (frameId) cancelAnimationFrame(frameId);
  }, { once: true });
})();
