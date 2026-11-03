import { onMounted, onBeforeUnmount } from 'vue'

export function prefersReducedMotion () {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function scrollToSection (id) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start'
  })
}

/**
 * Calls `callback(scrollY)` at most once per animation frame while the page scrolls
 * or resizes, and once on mount.
 */
export function useRafScroll (callback) {
  let ticking = false

  const handler = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      ticking = false
      callback(window.scrollY)
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', handler, { passive: true })
    window.addEventListener('resize', handler, { passive: true })
    callback(window.scrollY)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handler)
    window.removeEventListener('resize', handler)
  })
}
