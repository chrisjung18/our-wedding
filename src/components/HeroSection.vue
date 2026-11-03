<template>
  <section id="top" ref="root" class="hero">
    <div class="hero__sky" aria-hidden="true" />

    <!-- The couple's photo is the sun. It rises when the page opens. -->
    <div class="hero__sun-wrap" aria-hidden="true">
      <div class="hero__sun">
        <img class="hero__photo" :src="wedding.heroImage" alt="">
      </div>
    </div>

    <svg class="hero__hills" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
      <path class="hills-back" d="M0,190 C180,110 360,140 560,180 C760,220 960,110 1160,130 C1300,145 1380,180 1440,160 L1440,320 L0,320 Z" />
      <path class="hills-front" d="M0,250 C200,205 380,232 600,250 C820,268 1040,205 1240,226 C1340,238 1400,254 1440,250 L1440,320 L0,320 Z" />
    </svg>

    <div class="hero__content">
      <h1 class="hero__names" :aria-label="`${wedding.partnerA} and ${wedding.partnerB}`">
        <span class="hero__line" aria-hidden="true">
          <span v-for="(c, i) in lettersA" :key="`a${i}`" class="hero__ch" :style="{ '--i': i }">{{ c }}</span>
        </span>
        <span class="hero__line hero__line--b" aria-hidden="true">
          <span class="hero__ch hero__amp" :style="{ '--i': lettersA.length }">&amp;</span>
          <span v-for="(c, i) in lettersB" :key="`b${i}`" class="hero__ch" :style="{ '--i': lettersA.length + 1 + i }">{{ c }}</span>
        </span>
      </h1>

      <div class="hero__foot">
        <p class="hero__when">{{ wedding.longDate }}</p>
        <p class="hero__where">{{ wedding.heroPlace }}</p>
        <q-btn
          class="hero__cta"
          unelevated
          rounded
          no-caps
          size="lg"
          color="accent"
          text-color="dark"
          label="Reply to the invitation"
          @click="scrollToSection('rsvp')"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWeddingStore } from 'stores/wedding'
import { scrollToSection, useRafScroll, prefersReducedMotion } from 'src/composables/useScroll'

defineOptions({
  name: 'HeroSection'
})

const wedding = useWeddingStore()
const root = ref(null)

const lettersA = computed(() => Array.from(wedding.partnerA))
const lettersB = computed(() => Array.from(wedding.partnerB))

// Gentle parallax: the sun sinks and the names drift up as you scroll away.
useRafScroll(y => {
  if (!root.value || prefersReducedMotion()) return
  const limit = window.innerHeight * 1.2
  root.value.style.setProperty('--py', Math.min(y, limit))
})
</script>

<style scoped lang="scss">
$hills-h: max(34%, 17rem);

.hero {
  --py: 0;
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  color: var(--glow);
  background: var(--aubergine);
  isolation: isolate;
}

.hero__sky {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(
    180deg,
    #2a1740 0%,
    #4d2262 26%,
    #a8407f 50%,
    #ee7c93 68%,
    #f6b07a 84%,
    #fbd9a8 100%
  );
}

.hero__sun-wrap {
  position: absolute;
  z-index: 1;
  left: 50%;
  bottom: calc(#{$hills-h} - clamp(3rem, 9vw, 7rem));
  transform: translate3d(-50%, calc(var(--py) * 0.38px), 0);
  will-change: transform;
}

.hero__sun {
  position: relative;
  width: clamp(15rem, 40vw, 31rem);
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  box-shadow:
    0 0 0 clamp(0.5rem, 1.2vw, 1rem) rgba(255, 243, 228, 0.18),
    0 0 8rem 2rem rgba(246, 176, 122, 0.6);
  animation: sun-rise 2.6s cubic-bezier(0.16, 0.8, 0.2, 1) 0.1s both;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(168, 64, 127, 0) 40%, rgba(246, 176, 122, 0.45));
    pointer-events: none;
  }
}

.hero__photo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__hills {
  position: absolute;
  z-index: 2;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: $hills-h;

  .hills-back { fill: #3d1d52; }
  .hills-front { fill: #2a1740; }
}

// A soft shade of dusk under the date and button, so they stay readable
// whatever the photo or sky colours behind them.
.hero::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  z-index: 2;
  height: 36%;
  background: linear-gradient(
    0deg,
    rgba(42, 23, 64, 0.88) 0%,
    rgba(42, 23, 64, 0.6) 40%,
    rgba(42, 23, 64, 0) 100%
  );
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  min-height: 100vh;
  min-height: 100svh;
  padding: clamp(5.5rem, 13vh, 8rem) var(--gutter) clamp(1.5rem, 4vh, 3rem);
  transform: translate3d(0, calc(var(--py) * -0.14px), 0);
  opacity: calc(1 - var(--py) / 800);
}

.hero__names {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(4.25rem, 17vw, 13rem);
  line-height: 0.92;
  letter-spacing: -0.035em;
}

.hero__line {
  display: block;
  overflow: hidden;
  padding: 0.04em 0.08em 0.12em 0;
}

.hero__line--b {
  padding-left: clamp(2rem, 14vw, 14rem);
}

.hero__ch {
  display: inline-block;
  transform: translateY(115%);
  animation: letter-in 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  animation-delay: calc(0.7s + var(--i) * 70ms);
}

.hero__amp {
  margin-right: 0.12em;
  font-style: italic;
  font-weight: 400;
  color: var(--apricot);
}

.hero__foot {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  animation: foot-in 1.2s var(--ease-out) 2s both;
  text-shadow: 0 1px 18px rgba(42, 23, 64, 0.6);
}

.hero__when {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3.2vw, 2.2rem);
  font-style: italic;
}

.hero__where {
  margin: 0 0 1rem;
  font-size: 1.05rem;
}

@keyframes sun-rise {
  from { transform: translateY(60%) scale(0.88); opacity: 0; }
  to { transform: none; opacity: 1; }
}

@keyframes letter-in {
  from { transform: translateY(115%) rotate(4deg); }
  to { transform: none; }
}

@keyframes foot-in {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .hero__sun,
  .hero__ch,
  .hero__foot {
    animation: none;
    transform: none;
  }

  .hero__sun-wrap,
  .hero__content {
    transform: none;
    opacity: 1;
  }
}
</style>
