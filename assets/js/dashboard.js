(async () => {
  'use strict';

  const data = window.portfolioData;
  if (!data) return;

  const root = document.documentElement;
  const body = document.body;
  const base = body.dataset.base || '';
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const assetUrl = (path) => new URL(`${base}${path}`, document.baseURI).href;

  root.dataset.theme = 'dark';
  $('meta[name="theme-color"]')?.setAttribute('content', '#050505');

  const fallbackIcon = (name) => `<span class="ph-icon icon-fallback" data-icon="${escapeHtml(name)}" aria-hidden="true">•</span>`;
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
    console.warn('Local Phosphor icons could not be loaded. Using safe fallback icons.', error);
  }

  const verifiedTools = [
    { name: 'Linux', icon: 'terminal-window' },
    { name: 'cPanel / WHM', icon: 'browser' },
    { name: 'WordPress', icon: 'globe-simple' },
    { name: 'Cloudflare', icon: 'cloud' },
    { name: 'LiteSpeed', icon: 'lightning' },
    { name: 'GLPI 11', icon: 'toolbox' },
    { name: 'UptimeRobot', icon: 'activity' },
    { name: 'GitHub', icon: 'github-logo' },
    { name: 'ChatGPT', icon: 'chat-circle-dots' },
    { name: 'Google Workspace', icon: 'google-logo' },
    { name: 'Slack', icon: 'slack-logo' },
    { name: 'AnyDesk', icon: 'monitor' },
    { name: 'Bash', icon: 'terminal-window' },
    { name: 'Bitdefender', icon: 'shield-check' },
    { name: 'Acronis', icon: 'hard-drives' },
    { name: 'Tailscale', icon: 'share-network' }
  ];
  window.portfolioToolset = verifiedTools;

  const capabilities = [
    { name: 'Linux & hosting administration', icon: 'terminal-window' },
    { name: 'WordPress operations', icon: 'globe-simple' },
    { name: 'Server migrations & cutovers', icon: 'hard-drives' },
    { name: 'DNS & SSL/TLS administration', icon: 'shield-check' },
    { name: 'Backup & recovery validation', icon: 'hard-drives' },
    { name: 'Availability & health monitoring', icon: 'activity' },
    { name: 'Recurring task automation', icon: 'robot' },
    { name: 'GLPI asset & ticket workflows', icon: 'toolbox' },
    { name: 'User provisioning & access', icon: 'user' },
    { name: 'Endpoint checks & security', icon: 'shield-check' },
    { name: 'Incident troubleshooting', icon: 'wrench' },
    { name: 'Operational documentation', icon: 'file-text' }
  ];

  const sidebar = $('#sidebar');
  const overlay = $('[data-overlay]');
  const menuButtons = $$('[data-menu]');
  let lastMenuTrigger = null;
  const setMenu = (open, returnFocus = false) => {
    sidebar?.classList.toggle('open', open);
    overlay?.toggleAttribute('hidden', !open);
    menuButtons.forEach((button) => button.setAttribute('aria-expanded', String(open)));
    body.classList.toggle('menu-open', open);
    if (open) {
      requestAnimationFrame(() => $('.side-nav a', sidebar)?.focus({ preventScroll: true }));
    } else if (returnFocus && lastMenuTrigger) {
      lastMenuTrigger.focus({ preventScroll: true });
    }
  };

  menuButtons.forEach((button) => {
    button.setAttribute('aria-controls', 'sidebar');
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = icon('list');
    button.addEventListener('click', () => {
      lastMenuTrigger = button;
      setMenu(!sidebar?.classList.contains('open'));
    });
  });
  overlay?.addEventListener('click', () => setMenu(false, true));
  $$('.side-nav a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sidebar?.classList.contains('open')) setMenu(false, true);
  });

  const navIconByLabel = {
    home: 'house',
    about: 'user',
    projects: 'squares-four',
    experience: 'briefcase',
    'skills & tools': 'wrench',
    contact: 'envelope-simple'
  };
  $$('.side-nav a').forEach((link) => {
    const target = $('.nav-ico', link);
    const label = [...link.childNodes]
      .filter((node) => node.nodeType === 3)
      .map((node) => node.textContent)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
    if (target) {
      target.setAttribute('aria-hidden', 'true');
      target.innerHTML = icon(navIconByLabel[label] || 'circle');
    }
  });

  const dashboardIconByTitle = {
    'ABOUT ME': 'user',
    'PROJECTS': 'squares-four',
    'EXPERIENCE': 'briefcase',
    'SKILLS & TOOLS': 'wrench'
  };
  $$('.nav-card').forEach((card) => {
    const title = $('h3', card)?.textContent.trim();
    const target = $('.nav-card-icon', card);
    if (target) target.innerHTML = icon(dashboardIconByTitle[title] || 'circle');
    const arrow = $('.arrow', card);
    if (arrow) arrow.innerHTML = icon('arrow-right');
  });

  $$('[data-theme-toggle]').forEach((button) => button.remove());

  $$('.cv-btn').forEach((button) => {
    button.innerHTML = `${icon('download-simple')}<span>Download CV</span>`;
  });

  $$('.btn').forEach((button) => {
    const originalText = button.textContent.trim();
    const text = originalText.toLowerCase();
    if (text.includes('get in touch') || text.includes('send email')) {
      button.innerHTML = `${icon('envelope-simple')}<span>${escapeHtml(originalText.replace(/^[^A-Za-z]+/, ''))}</span>`;
    } else if (text.includes('download cv')) {
      button.innerHTML = `${icon('download-simple')}<span>Download CV</span>`;
    } else if (text.includes('view github')) {
      button.innerHTML = `${icon('github-logo')}<span>View GitHub</span>`;
    }
  });

  $$('.contact-links a').forEach((link) => {
    const label = $('span', link)?.textContent || link.textContent.trim();
    if (link.href.startsWith('mailto:')) link.innerHTML = `${icon('envelope-simple')}<span>${escapeHtml(label)}</span>`;
    else if (link.href.includes('github.com')) link.innerHTML = `${icon('github-logo')}<span>${escapeHtml(label)}</span>`;
  });
  $$('.contact-links > span').forEach((node) => {
    const label = node.textContent.replace(/^\s*⌖\s*/, '').trim();
    node.innerHTML = `${icon('map-pin')}<span>${escapeHtml(label)}</span>`;
  });

  $$('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });

  const socialWrap = $('[data-socials]');
  if (socialWrap) {
    const links = [];
    if (data.socials.github) links.push(`<a href="${escapeHtml(data.socials.github)}" target="_blank" rel="noreferrer" aria-label="GitHub profile">${icon('github-logo')}</a>`);
    if (data.socials.linkedin) links.push(`<a href="${escapeHtml(data.socials.linkedin)}" target="_blank" rel="noreferrer" aria-label="LinkedIn profile">${icon('linkedin-logo')}</a>`);
    if (data.socials.email) links.push(`<a href="${escapeHtml(data.socials.email)}" aria-label="Email Rico Torres">${icon('envelope-simple')}</a>`);
    socialWrap.innerHTML = links.join('');
  }

  const stats = $('[data-stats]');
  if (stats) {
    stats.innerHTML = data.stats.map((item) => `
      <div class="stat" title="${escapeHtml(item.note)}">
        <strong>${escapeHtml(item.value)}</strong>
        <span>${escapeHtml(item.label)}</span>
      </div>`).join('');
  }

  const specialties = $('[data-specialties]');
  if (specialties) {
    specialties.innerHTML = data.profile.specialties.map((item) => `<span>${escapeHtml(item)}</span>`).join('');
  }

  const statusClass = (status) => String(status).toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const featured = $('[data-featured-projects]');
  if (featured) {
    featured.innerHTML = data.projects.filter((project) => project.featured).slice(0, 3).map((project) => `
      <article class="project-mini">
        <a href="${base}projects/${escapeHtml(project.slug)}/" aria-label="Open ${escapeHtml(project.title)} case study">
          <img src="${base}${escapeHtml(project.thumbnail)}" alt="${escapeHtml(project.title)} screenshot" loading="lazy" decoding="async" width="720" height="405">
          <div class="project-mini-body">
            <h4>${escapeHtml(project.title)}</h4>
            <p>${escapeHtml(project.shortDescription)}</p>
            <div class="chips">${project.technologies.slice(0, 3).map((tech) => `<span>${escapeHtml(tech)}</span>`).join('')}</div>
          </div>
        </a>
      </article>`).join('');
  }

  const search = $('[data-search]');
  if (search) {
    search.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      const query = search.value.trim().toLowerCase();
      if (!query) return;
      const project = data.projects.find((item) => (
        `${item.title} ${item.shortDescription} ${item.category} ${item.technologies.join(' ')}`
      ).toLowerCase().includes(query));
      if (project) {
        location.href = `${base}projects/${project.slug}/`;
        return;
      }
      const skill = data.skills.find((item) => (`${item.title} ${item.items.join(' ')}`).toLowerCase().includes(query));
      const tool = verifiedTools.find((item) => item.name.toLowerCase().includes(query));
      location.href = skill || tool ? `${base}skills/` : `${base}projects/`;
    });
  }

  const projectLibrary = $('[data-project-library]');
  if (projectLibrary) {
    projectLibrary.innerHTML = data.projects.map((project) => `
      <article>
        <a class="project-library-link" href="${base}projects/${escapeHtml(project.slug)}/" aria-label="View ${escapeHtml(project.title)} case study">
          <div class="project-thumb">
            <img src="${base}${escapeHtml(project.thumbnail)}" alt="Sanitized ${escapeHtml(project.title)} interface" loading="lazy" decoding="async" width="720" height="405">
            <span class="project-dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <div class="project-badges">
              <span class="status-badge ${statusClass(project.status)}">${escapeHtml(project.status)}</span>
              <span class="category-badge">${escapeHtml(project.category)}</span>
            </div>
          </div>
          <div class="body">
            <h2>${escapeHtml(project.title)}</h2>
            <p>${escapeHtml(project.shortDescription)}</p>
            <div class="chips">${project.technologies.slice(0, 5).map((tech) => `<span>${escapeHtml(tech)}</span>`).join('')}</div>
            <div class="project-card-action"><span>View case study</span><span aria-hidden="true">${icon('arrow-right')}</span></div>
          </div>
        </a>
      </article>`).join('');
  }

  const toolGrid = $('[data-verified-tools]');
  if (toolGrid) {
    toolGrid.innerHTML = verifiedTools.map((tool) => `
      <div class="tool-tile">
        <span class="tool-tile__icon" aria-hidden="true">${icon(tool.icon)}</span>
        <strong>${escapeHtml(tool.name)}</strong>
      </div>`).join('');
  }

  const capabilityGrid = $('[data-capabilities]');
  if (capabilityGrid) {
    capabilityGrid.innerHTML = capabilities.map((item) => `
      <div class="capability-tile">
        <span aria-hidden="true">${icon(item.icon)}</span>
        <span>${escapeHtml(item.name)}</span>
      </div>`).join('');
  }

  const skillGrid = $('[data-skills]');
  if (skillGrid) {
    skillGrid.innerHTML = data.skills.map((skill) => `
      <article class="detail-card skill-card">
        <p class="eyebrow">TECHNICAL AREA</p>
        <h2>${escapeHtml(skill.title)}</h2>
        <p>${escapeHtml(skill.description)}</p>
        <div class="chips">${skill.items.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>
      </article>`).join('');
  }

  const experience = $('[data-experience]');
  if (experience) {
    experience.innerHTML = data.experience.map((item) => `
      <article>
        <time>${icon('calendar-blank')} ${escapeHtml(item.period)}</time>
        <h2>${escapeHtml(item.role)}</h2>
        <h3>${escapeHtml(item.company)}${item.location ? ` · ${escapeHtml(item.location)}` : ''}</h3>
        <ul>${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>
        <div class="chips">${item.technologies.map((tech) => `<span>${escapeHtml(tech)}</span>`).join('')}</div>
      </article>`).join('');
  }

  const aboutBody = $('[data-about-body]');
  if (aboutBody) aboutBody.innerHTML = data.about.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');

  const aboutFocus = $('[data-about-focus]');
  if (aboutFocus) {
    const focusIcons = ['hard-drives', 'robot', 'activity', 'file-text'];
    aboutFocus.innerHTML = data.about.focus.map((item, index) => `
      <div class="list-tile how-i-work-tile">
        ${icon(focusIcons[index] || 'check-circle')}
        <span>${escapeHtml(item)}</span>
      </div>`).join('');
  }

  const credlyRefs = {
    'Networking Devices and Basic Configuration': 'https://www.credly.com/earner/earned/badge/dcc9e02d-baab-42ec-9eac-749c68d8b550',
    'Networking Basics': 'https://www.credly.com/earner/earned/badge/da023fab-794d-477b-84df-a6b64de7afcf',
    'Introduction to Cybersecurity': 'https://www.credly.com/earner/earned/badge/e408b8f6-a1d6-40e4-84d6-0425c9c29c73'
  };
  const extraCredlyRef = 'https://www.credly.com/earner/earned/badge/8deac90f-d87f-4811-b2d3-037672af05d2';
  const certifications = $('[data-certifications]');
  if (certifications) {
    const cards = data.certifications.map((item) => {
      const isCredly = Boolean(credlyRefs[item.title] || item.verify.includes('credly.com'));
      const verifyUrl = credlyRefs[item.title] || item.verify;
      return `
        <article class="list-tile credential-card">
          <span class="credential-icon" aria-hidden="true">${icon(isCredly ? 'seal-check' : 'certificate')}</span>
          <div class="credential-card__body">
            <span class="credential-provider">${isCredly ? 'CREDLY / CISCO' : 'VERIFIED COURSE'}</span>
            <strong>${escapeHtml(item.title)}</strong>
            <p class="muted">${escapeHtml(item.issuer)} · ${escapeHtml(item.issued)}</p>
            <a href="${escapeHtml(verifyUrl)}" target="_blank" rel="noopener noreferrer">${icon('arrow-square-out')}<span>${isCredly ? 'Open Credly badge' : 'Verify credential'}</span></a>
          </div>
        </article>`;
    });
    cards.push(`
      <article class="list-tile credential-card credential-reference">
        <span class="credential-icon" aria-hidden="true">${icon('seal-check')}</span>
        <div class="credential-card__body">
          <span class="credential-provider">CREDLY REFERENCE</span>
          <strong>Additional Credly badge</strong>
          <p class="muted">Badge title is intentionally not guessed. Reference ID: 8deac90f-d87f-4811-b2d3-037672af05d2</p>
          <a href="${extraCredlyRef}" target="_blank" rel="noopener noreferrer">${icon('arrow-square-out')}<span>Open badge reference</span></a>
        </div>
      </article>`);
    certifications.innerHTML = cards.join('');
  }

  const projectRoot = $('[data-project-detail]');
  if (projectRoot) {
    const slug = projectRoot.dataset.projectDetail;
    const project = data.projects.find((item) => item.slug === slug);
    if (project) {
      const setText = (selector, value) => {
        const node = $(selector);
        if (node) node.textContent = value;
      };

      setText('[data-project-title]', project.title);
      setText('[data-project-category]', project.category);
      setText('[data-project-status]', project.status);
      setText('[data-project-summary]', project.fullDescription);
      setText('[data-project-problem]', project.problem);
      setText('[data-project-role]', project.role);
      setText('[data-project-architecture]', project.architecture);
      setText('[data-project-automation]', project.automation);
      setText('[data-project-security]', project.security);

      const status = $('[data-project-status]');
      status?.classList.add(statusClass(project.status));

      const hero = $('[data-project-hero]');
      if (hero) {
        const heroSource = project.screenshots[0] || project.thumbnail;
        hero.src = `${base}${heroSource}`;
        hero.alt = `Sanitized ${project.title} screenshot`;
        hero.decoding = 'async';
        hero.fetchPriority = 'high';
        hero.width = 960;
        hero.height = 540;
      }

      const tags = $('[data-project-tags]');
      if (tags) tags.innerHTML = project.technologies.map((tech) => `<span>${escapeHtml(tech)}</span>`).join('');

      const implemented = $('[data-project-implemented]');
      if (implemented) implemented.innerHTML = project.implemented.map((item) => `<li>${escapeHtml(item)}</li>`).join('');

      const features = $('[data-project-features]');
      if (features) features.innerHTML = project.features.map((item) => `<li>${escapeHtml(item)}</li>`).join('');

      const results = $('[data-project-results]');
      if (results) results.innerHTML = project.results.map((item) => `<div class="list-tile result-tile">${icon('check-circle')}<span>${escapeHtml(item)}</span></div>`).join('');

      const gallery = $('[data-project-gallery]');
      if (gallery) gallery.innerHTML = project.screenshots.map((source, index) => `
        <img src="${base}${escapeHtml(source)}" alt="Sanitized ${escapeHtml(project.title)} screenshot ${index + 1}" loading="lazy" decoding="async" width="960" height="540">`).join('');

      const facts = $('[data-project-facts]');
      if (facts) facts.innerHTML = `
        <div class="list-tile"><strong>${icon('pulse')} Status</strong><span>${escapeHtml(project.status)}</span></div>
        <div class="list-tile"><strong>${icon('target')} Focus</strong><span>${escapeHtml(project.category)}</span></div>
        <div class="list-tile"><strong>${icon('stack')} Stack</strong><span>${escapeHtml(project.technologies.slice(0, 4).join(' · '))}</span></div>`;

      const projectIndex = data.projects.indexOf(project);
      const previous = data.projects[(projectIndex - 1 + data.projects.length) % data.projects.length];
      const next = data.projects[(projectIndex + 1) % data.projects.length];
      const previousLink = $('[data-prev-project]');
      const nextLink = $('[data-next-project]');
      if (previousLink) {
        previousLink.href = `${base}projects/${previous.slug}/`;
        previousLink.innerHTML = `${icon('arrow-left')}<span><span class="project-nav-label">Previous project</span><span class="project-nav-title">${escapeHtml(previous.title)}</span></span>`;
        previousLink.setAttribute('aria-label', `Previous project: ${previous.title}`);
      }
      if (nextLink) {
        nextLink.href = `${base}projects/${next.slug}/`;
        nextLink.innerHTML = `<span><span class="project-nav-label">Next project</span><span class="project-nav-title">${escapeHtml(next.title)}</span></span>${icon('arrow-right')}`;
        nextLink.setAttribute('aria-label', `Next project: ${next.title}`);
      }
      const allProjects = $('.project-nav-index');
      if (allProjects) allProjects.innerHTML = `${icon('squares-four')}<span>All Projects</span>`;
    }
  }

  body.classList.add('js-ready');
})();
