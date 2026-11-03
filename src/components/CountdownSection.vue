<template>
  <section id="date" class="section count">
    <div class="section__inner count__grid">
      <div class="count__text">
        <h2 v-reveal class="display count__title">{{ wedding.longDate }}</h2>
        <p v-reveal="{ delay: 120 }" class="lede">
          Ceremony at four in the afternoon, then dinner and dancing until late.
          {{ done ? 'Today is the day.' : 'Here is how long we have left to wait.' }}
        </p>
      </div>

      <div v-reveal="{ variant: 'scale', delay: 200 }" class="count__clock" role="timer" aria-live="off">
        <span class="sr-only">{{ parts[0].value }} days to go</span>
        <div v-for="p in parts" :key="p.key" class="count__unit" aria-hidden="true">
          <span class="count__digits">
            <Transition name="roll" mode="out-in">
              <span :key="p.value" class="count__digit">{{ pad(p.value) }}</span>
            </Transition>
          </span>
          <span class="count__label">{{ p.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useWeddingStore } from 'stores/wedding'
import { useCountdown } from 'src/composables/useCountdown'

defineOptions({
  name: 'CountdownSection'
})

const wedding = useWeddingStore()
const { parts, done } = useCountdown(wedding.date)

const pad = n => String(n).padStart(2, '0')
</script>

<style scoped lang="scss">
.count {
  background: var(--mist);
}

.count__grid {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  gap: clamp(2.5rem, 6vw, 6rem);
  align-items: center;
}

.count__title {
  margin-bottom: 1.5rem;
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-style: italic;
  font-weight: 300;
}

.count__clock {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.5rem, 1.5vw, 1.25rem);
}

.count__unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: clamp(1rem, 2.5vw, 2rem) 0.25rem 0.9rem;
  border-radius: 999px 999px 0.75rem 0.75rem; // the wedding arch
  background: var(--aubergine);
  color: var(--glow);
}

.count__digits {
  display: block;
  height: 1.05em;
  overflow: hidden;
  font-family: var(--font-display);
  font-size: clamp(2rem, 5.4vw, 4.25rem);
  font-weight: 300;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
}

.count__digit {
  display: block;
}

.count__label {
  font-size: 0.85rem;
  color: var(--sand);
}

.roll-enter-active,
.roll-leave-active {
  transition: transform 0.35s var(--ease-out), opacity 0.35s ease;
}

.roll-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.roll-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

@media (max-width: 860px) {
  .count__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .roll-enter-active,
  .roll-leave-active {
    transition: none;
  }
}
</style>
