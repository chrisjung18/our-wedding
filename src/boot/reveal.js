import { defineBoot } from '#q-app/wrappers'

/**
 * v-reveal directive: animates an element once, when it scrolls into view.
 *
 *   v-reveal                          -> rises into place
 *   v-reveal="{ variant: 'wipe' }"    -> unveiled left to right (good for images)
 *   v-reveal="{ variant: 'scale' }"   -> grows in
 *   v-reveal="{ delay: 150 }"         -> waits 150ms (stagger siblings)
 *
 * The styles live in src/css/app.scss (.reveal).
 */
export default defineBoot(({ app }) => {
  const supported = typeof window !== 'undefined' && 'IntersectionObserver' in window

  // Several elements can share one observed target (see "wipe" below)
  const watchers = new WeakMap()

  const observer = supported
    ? new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return
            const els = watchers.get(entry.target) || []
            els.forEach(el => el.classList.add('is-revealed'))
            watchers.delete(entry.target)
            observer.unobserve(entry.target)
          })
        },
        { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
      )
    : null

  app.directive('reveal', {
    mounted (el, binding) {
      const options = binding.value || {}
      const variant = options.variant || 'rise'

      el.classList.add('reveal', `reveal--${variant}`)
      if (options.delay) {
        el.style.setProperty('--reveal-delay', `${options.delay}ms`)
      }

      if (!observer) {
        el.classList.add('is-revealed')
        return
      }

      // A clipped ("wipe") element reports zero visibility, so it can never trigger
      // itself. Watch its parent instead.
      const target = variant === 'wipe' && el.parentElement ? el.parentElement : el
      el.__revealTarget = target

      const list = watchers.get(target) || []
      list.push(el)
      watchers.set(target, list)
      observer.observe(target)
    },
    unmounted (el) {
      if (!observer || !el.__revealTarget) return
      const list = (watchers.get(el.__revealTarget) || []).filter(item => item !== el)
      if (list.length) {
        watchers.set(el.__revealTarget, list)
      } else {
        watchers.delete(el.__revealTarget)
        observer.unobserve(el.__revealTarget)
      }
    }
  })
})
