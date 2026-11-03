<template>
  <div class="band" aria-hidden="true">
    <div class="band__track">
      <div v-for="n in 2" :key="n" class="band__group">
        <template v-for="(item, i) in items" :key="i">
          <span class="band__text display">{{ item }}</span>
          <svg class="band__sun" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="7" />
            <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M20 3v6M20 31v6M3 20h6M31 20h6M8 8l4 4M28 28l4 4M32 8l-4 4M12 28l-4 4" />
            </g>
          </svg>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWeddingStore } from 'stores/wedding'

defineOptions({
  name: 'MarqueeBand'
})

const wedding = useWeddingStore()

const items = computed(() => [wedding.names, wedding.shortDate, 'Lake Como', 'Save the date'])
</script>

<style scoped lang="scss">
.band {
  overflow: hidden;
  padding: 1.1rem 0;
  background: var(--apricot);
  color: var(--aubergine);
}

.band__track {
  display: flex;
  width: max-content;
  animation: band-scroll 38s linear infinite;
}

.band__group {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 2rem;
  padding-right: 2rem;
}

.band__text {
  font-size: clamp(1.6rem, 4vw, 2.75rem);
  font-style: italic;
  white-space: nowrap;
}

.band__sun {
  width: 1.6rem;
  height: 1.6rem;
  flex-shrink: 0;

  circle { fill: currentColor; }
}

@keyframes band-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .band__track {
    animation: none;
  }
}
</style>
