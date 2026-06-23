// Inline SVG inner markup keyed by name. Rendered inside a
// <svg viewBox="0 0 24 24"> with currentColor stroke, so icons inherit the
// active theme's action color. Keep entries simple, single-color, stroke-based.
export const outcomeIcons: Record<string, string> = {
  check: '<polyline points="20 6 9 17 4 12" />',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5a8.5 8.5 0 0 1-.9-3.5A8.4 8.4 0 0 1 12.5 4 8.4 8.4 0 0 1 21 11.5Z" />',
  spark:
    '<path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /><circle cx="12" cy="12" r="3" />',
  funnel: '<path d="M3 5h18l-7 8v5l-4 2v-7z" />',
  cart: '<circle cx="9" cy="20" r="1.2" /><circle cx="18" cy="20" r="1.2" /><path d="M2 3h3l2.4 12a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 7H6" />',
  agent: '<circle cx="12" cy="8" r="3.6" /><path d="M5 21a7 7 0 0 1 14 0" />',
  workflow:
    '<rect x="3" y="3" width="6" height="6" rx="1.4" /><rect x="15" y="15" width="6" height="6" rx="1.4" /><path d="M9 6h5a3 3 0 0 1 3 3v6" />',
  nurture: '<path d="M11 20A7 7 0 0 1 4 13C4 8 8 4 13 4c3 0 6 1 7 3-1 6-5 9-9 9z" /><path d="M7 17c3-3 6-5 10-6" />',
  cycle: '<path d="M21 12a9 9 0 1 1-2.6-6.3" /><polyline points="21 3 21 8 16 8" />',
  megaphone: '<path d="M4 11v2a1 1 0 0 0 1 1h2l5 4V6L7 10H5a1 1 0 0 0-1 1z" /><path d="M16 8.5a4 4 0 0 1 0 7" />',
  support:
    '<path d="M4 13v-1a8 8 0 0 1 16 0v1" /><path d="M4 13a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2zM20 13a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2z" /><path d="M18 17v.5a3.5 3.5 0 0 1-3.5 3.5H12" />',
  target: '<circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" />',
  audit: '<rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4V3h6v1" /><polyline points="9 13 11 15 15 11" />',
  link: '<path d="M9.5 14.5l5-5" /><path d="M11 6.5l1-1a4 4 0 0 1 6 6l-1 1" /><path d="M13 17.5l-1 1a4 4 0 0 1-6-6l1-1" />',
  chart: '<path d="M4 4v16h16" /><rect x="7" y="12" width="3" height="5" /><rect x="12" y="8" width="3" height="9" /><rect x="17" y="5" width="3" height="12" />',
  deliverable: '<path d="M4 7l8-4 8 4v10l-8 4-8-4z" /><path d="M4 7l8 4 8-4M12 11v10" />',
  outcome: '<path d="M4 13l4 4L20 5" /><path d="M20 12v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6" />',
};
