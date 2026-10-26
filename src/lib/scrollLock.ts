/**
 * Uses a direct window property — the most reliable shared state
 * across all components, with zero async/module-caching issues.
 */
export function lockNavbar() {
  (window as any).__programmaticScroll = true;
}

export function unlockNavbar() {
  (window as any).__programmaticScroll = false;
}

export function isNavbarLocked(): boolean {
  return !!(window as any).__programmaticScroll;
}
