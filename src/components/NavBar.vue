<template>
  <header class="nav" :class="{ 'nav--solid': solid && !open, 'nav--open': open }">
    <button class="nav__mark" type="button" :aria-label="`${wedding.names}, back to the top`" @click="go('top')">
      {{ wedding.initials }}
    </button>

    <nav class="nav__links" aria-label="Sections">
      <button v-for="link in links" :key="link.id" class="nav__link" type="button" @click="go(link.id)">
        {{ link.label }}
      </button>
    </nav>

    <q-btn class="nav__cta" unelevated rounded no-caps color="accent" text-color="dark" label="Reply" @click="go('rsvp')" />

    <button
      class="nav__burger"
      :class="{ 'nav__burger--open': open }"
      type="button"
      aria-controls="mobile-menu"
      :aria-expanded="open"
      :aria-label="open ? 'Close menu' : 'Open menu'"
      @click="open = !open"
    >
      <span />
      <span />
    </button>
  </header>

  <Transition name="menu">
    <div v-if="open" id="mobile-menu" class="menu">
      <button
        v-for="(link, i) in [...links, { id: 'rsvp', label: 'Reply' }]"
        :key="link.id"
        class="menu__link display"
        type="button"
        :style="{ '--i': i }"
        @click="go(link.id)"
      >
        {{ link.label }}
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useWeddingStore } from 'stores/wedding'
import { scrollToSection, useRafScroll } from 'src/composables/useScroll'

defineOptions({
  name: 'NavBar'
})

const wedding = useWeddingStore()

const links = [
  { id: 'story', label: 'Our story' },
  { id: 'day', label: 'The day' },
  { id: 'gallery', label: 'Photos' }
]

const solid = ref(false)
const open = ref(false)

useRafScroll(y => {
  solid.value = y > window.innerHeight * 0.75
})

function go (id) {
  open.value = false
  // Wait one frame so the menu overlay stops locking the scroll first
  requestAnimationFrame(() => scrollToSection(id))
}

function onKeydown (e) {
  if (e.key === 'Escape') open.value = false
}

watch(open, value => {
  document.body.style.overflow = value ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped lang="scss">
.nav {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  height: 4rem;
  padding: 0 var(--gutter);
  color: var(--glow);
  transition: background-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease;

  &--open {
    background: transparent;
    color: var(--glow);
  }

  &--solid {
    background: rgba(239, 234, 247, 0.92);
    backdrop-filter: blur(10px);
    color: var(--ink);
    box-shadow: 0 1px 0 rgba(42, 23, 64, 0.1);
  }
}

.nav__mark {
  margin-right: auto;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.5rem;
  letter-spacing: -0.01em;
}

.nav__links {
  display: flex;
  gap: 2rem;
}

.nav__link {
  position: relative;
  padding: 0.25rem 0;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-size: 0.95rem;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s var(--ease-out);
  }

  &:hover::after,
  &:focus-visible::after {
    transform: scaleX(1);
  }
}

.nav__burger {
  display: none;
  position: relative;
  width: 2.75rem;
  height: 2.75rem;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;

  span {
    position: absolute;
    left: 0.7rem;
    right: 0.7rem;
    height: 2px;
    background: currentColor;
    transition: transform 0.35s var(--ease-out), top 0.35s var(--ease-out);
  }

  span:first-child { top: 1.2rem; }
  span:last-child { top: 1.6rem; }

  &--open span:first-child { top: 1.4rem; transform: rotate(45deg); }
  &--open span:last-child { top: 1.4rem; transform: rotate(-45deg); }
}

@media (max-width: 760px) {
  .nav__links,
  .nav__cta {
    display: none;
  }

  .nav__burger {
    display: block;
    margin-right: -0.7rem;
  }
}

.menu {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 5rem var(--gutter) 3rem;
  background: var(--aubergine);
  color: var(--glow);
  clip-path: circle(150% at calc(100% - 2.5rem) 2rem);
}

.menu__link {
  padding: 0.25rem 0;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
  font-size: clamp(2.5rem, 12vw, 4rem);
  font-style: italic;
  text-align: left;
  animation: menu-in 0.7s var(--ease-out) both;
  animation-delay: calc(0.15s + var(--i) * 70ms);
}

@keyframes menu-in {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: none; }
}

.menu-enter-active,
.menu-leave-active {
  transition: clip-path 0.6s cubic-bezier(0.7, 0, 0.2, 1);
}

.menu-enter-from,
.menu-leave-to {
  clip-path: circle(0% at calc(100% - 2.5rem) 2rem);
}

@media (prefers-reduced-motion: reduce) {
  .menu-enter-active,
  .menu-leave-active,
  .menu__link {
    transition: none;
    animation: none;
  }
}
</style>
