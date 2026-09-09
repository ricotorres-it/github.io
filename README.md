# Rico Torres Portfolio

Static GitHub Pages portfolio for Rico Torres, System Administrator and IT Infrastructure professional.

Live site: https://itprimeview.github.io/test/

## Design system

- Zero Black: `#050505`
- Ghost Green: `#D7FFE0`
- Local Phosphor Icons package under `assets/vendor/phosphor/`
- Desktop home is designed as a one-screen dashboard with no vertical scroll
- Tablet and mobile layouts reflow to normal page scrolling
- No magnetic/custom cursor effect
- No visible theme switcher; the portfolio keeps one consistent visual identity

## Current architecture

- `index.html` - one-screen dashboard homepage
- `data/portfolio.js` - centralized portfolio content source
- `assets/css/dashboard.css` - ordered CSS bundle entry point
- `assets/css/dashboard-base.css` - structural base layout
- `assets/css/polish.css` - shared component and project presentation rules
- `assets/css/ghost-theme.css` - Zero Black / Ghost Green visual identity
- `assets/css/final-polish.css` - final desktop, tablet, mobile, accessibility, credentials, projects, and responsive QA rules
- `assets/css/home-tools.css` - homepage Tools I Work With marquee/dock
- `assets/js/dashboard.js` - local icon loading, navigation, search, centralized content rendering, skills, credentials, experience, and project navigation
- `assets/js/home-tools.js` - homepage tools marquee using the shared verified toolset
- `about/` - background, education, and verified learning credentials
- `projects/` - project library and six clean project case-study routes
- `experience/` - professional experience timeline
- `skills/` - verified work tools, technical capabilities, and technical areas
- `contact/` - contact information and CV access
- `assets/images/` - profile, social-preview, and sanitized project visuals
- `assets/files/Rico_Torres_CV.pdf` - downloadable CV

## Project routes

- `/projects/glpi-it-operations/`
- `/projects/employee-hub/`
- `/projects/infrastructure-automation/`
- `/projects/domain-manager/`
- `/projects/monthly-it-check/`
- `/projects/primeview-nexus/`

Legacy `.html` project URLs remain as lightweight `noindex, follow` redirects so existing links and bookmarks continue to work.

## Content rules

Most portfolio content should be edited in `data/portfolio.js` rather than duplicated across page templates.

Personal information, work metrics, technologies, tools, and credentials should only be added when they are supported by the existing work history or explicitly verified by Rico. Unknown credential details must not be guessed.

## Deployment

GitHub Pages publishes directly from the `main` branch and repository root. No build step, framework, backend, or database is required.
