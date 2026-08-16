/** Anchor navigation. Native scrolling throughout — no smooth-scroll library,
 *  so the wheel behaves exactly like every other page. */
export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
