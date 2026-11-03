<template>
  <section id="story" class="section story">
    <div class="section__inner">
      <h2 v-reveal class="display story__title">How we got here</h2>

      <div ref="track" class="story__track" :style="{ '--p': progress }">
        <div class="story__rail" aria-hidden="true">
          <div class="story__fill" />
        </div>

        <ol class="story__list">
          <li v-for="(item, i) in wedding.story" :key="item.year" class="story__item" :class="{ 'story__item--flip': i % 2 === 1 }">
            <span v-reveal="{ variant: 'scale' }" class="story__dot" aria-hidden="true" />

            <figure v-if="item.image" v-reveal="{ variant: 'wipe' }" class="story__media">
              <img :src="item.image" :alt="`${item.title}, ${item.year}`" loading="lazy">
            </figure>
            <div v-else class="story__media story__media--empty" aria-hidden="true" />

            <div v-reveal="{ delay: 150 }" class="story__text">
              <p class="story__year display">{{ item.year }}</p>
              <h3 class="story__heading">{{ item.title }}</h3>
              <p class="story__body">{{ item.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useWeddingStore } from 'stores/wedding'
import { useRafScroll } from 'src/composables/useScroll'

defineOptions({
  name: 'StorySection'
})

const wedding = useWeddingStore()
const track = ref(null)
const progress = ref(0)

// The line down the middle fills in as you read.
useRafScroll(() => {
  if (!track.value) return
  const rect = track.value.getBoundingClientRect()
  const p = (window.innerHeight * 0.6 - rect.top) / rect.height
  progress.value = Math.min(1, Math.max(0, Number(p.toFixed(4))))
})
</script>

<style scoped lang="scss">
.story {
  background: var(--paper);
}

.story__title {
  margin-bottom: clamp(3rem, 7vw, 6rem);
  font-size: clamp(2.75rem, 7vw, 6rem);
  font-weight: 300;
  max-width: 14ch;
}

.story__track {
  position: relative;
}

.story__rail {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  margin-left: -1px;
  background: var(--mist-deep);
}

.story__fill {
  width: 100%;
  height: calc(var(--p) * 100%);
  background: linear-gradient(180deg, var(--peony), var(--apricot));
}

.story__list {
  position: relative;
  display: grid;
  gap: clamp(4rem, 9vw, 8rem);
  margin: 0;
  padding: 0;
  list-style: none;
}

.story__item {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(3rem, 8vw, 8rem);
  align-items: center;
}

.story__item--flip .story__media {
  order: 2;
}

.story__dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1.1rem;
  height: 1.1rem;
  margin: -0.55rem 0 0 -0.55rem;
  border: 3px solid var(--peony);
  border-radius: 50%;
  background: var(--paper);
  z-index: 1;
}

.story__media {
  margin: 0;
  overflow: hidden;
  border-radius: 999px 999px 0.5rem 0.5rem;

  img {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
  }

  &--empty {
    display: none;
  }
}

.story__year {
  margin: 0 0 0.5rem;
  font-size: clamp(3.5rem, 8vw, 7rem);
  font-style: italic;
  font-weight: 300;
  color: var(--rose-deep);
}

.story__heading {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 500;
  line-height: 1.1;
}

.story__body {
  max-width: 28rem;
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.65;
  color: var(--ink-soft);
}

@media (max-width: 860px) {
  .story__rail {
    left: 0.55rem;
    margin-left: 0;
  }

  .story__item {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;
    padding-left: 2.25rem;
  }

  .story__item--flip .story__media {
    order: 0;
  }

  .story__dot {
    top: 0.6rem;
    left: 0.55rem;
  }

  .story__media {
    max-width: 22rem;
  }
}
</style>
