/* Local Phosphor Icons renderer. Source: user-provided Phosphor Icons package (Regular). */
import { PATHS_A } from './phosphor-paths-a.js';
import { PATHS_B } from './phosphor-paths-b.js';
import { PATHS_C } from './phosphor-paths-c.js';

const PHOSPHOR_PATHS = { ...PATHS_A, ...PATHS_B, ...PATHS_C };

export function icon(name, extra = '') {
  const source = PHOSPHOR_PATHS[name] || PHOSPHOR_PATHS.circle;
  const paths = Array.isArray(source) ? source : [source];
  const extraClass = String(extra || '').replace(/[^a-zA-Z0-9_\- ]/g, '').trim();
  const classes = `ph-icon${extraClass ? ` ${extraClass}` : ''}`;
  return `<svg class="${classes}" viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">${paths.map((path) => `<path d="${path}"></path>`).join('')}</svg>`;
}
