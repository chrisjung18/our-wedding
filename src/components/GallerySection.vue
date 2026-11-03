<template>
  <section id="gallery" class="section gallery">
    <div class="section__inner">
      <h2 v-reveal class="display gallery__title">A few of our favourite days</h2>
      <p v-reveal="{ delay: 120 }" class="lede gallery__lede">Tap a photo to see it full size.</p>

      <ul class="gallery__cols">
        <li v-for="(photo, i) in wedding.gallery" :key="photo.src" class="gallery__cell">
          <button
            v-reveal="{ variant: 'wipe', delay: (i % 3) * 140 }"
            class="gallery__item"
            :class="{ 'gallery__item--arch': photo.arch }"
            type="button"
            :aria-label="`Open photo: ${photo.alt}`"
            @click="openAt(i)"
          >
            <img :src="photo.src" :alt="photo.alt" :style="{ aspectRatio: photo.ratio }" loading="lazy">
          </button>
        </li>
      </ul>
    </div>

    <q-dialog v-model="isOpen" maximized transition-show="fade" transition-hide="fade">
      <q-card v-touch-swipe.horizontal="onSwipe" class="lightbox" flat>
        <div class="lightbox__bar">
          <span class="lightbox__count">{{ index + 1 }} of {{ wedding.gallery.length }}</span>
          <q-btn v-close-popup flat round icon="close" color="white" aria-label="Close gallery" />
        </div>

        <div class="lightbox__stage">
          <q-btn class="lightbox__nav" flat round size="lg" icon="chevron_left" color="white" aria-label="Previous photo" @click="step(-1)" />

          <Transition :name="`slide-${direction}`" mode="out-in">
            <img :key="index" class="lightbox__img" :src="current.src" :alt="current.alt">
          </Transition>

          <q-btn class="lightbox__nav" flat round size="lg" icon="chevron_right" color="white" aria-label="Next photo" @click="step(1)" />
        </div>

        <p class="lightbox__caption">{{ current.alt }}</p>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useWeddingStore } from 'stores/wedding'

defineOptions({
  name: 'GallerySection'
})

const wedding = useWeddingStore()

const isOpen = ref(false)
const index = ref(0)
const direction = ref('next')

const current = computed(() => wedding.gallery[index.value])

function openAt (i) {
  index.value = i
  direction.value = 'next'
  isOpen.value = true
}

function step (delta) {
  const total = wedding.gallery.length
  direction.value = delta > 0 ? 'next' : 'prev'
  index.value = (index.value + delta + total) % total
}

function onSwipe ({ direction: dir }) {
  if (dir === 'left') step(1)
  if (dir === 'right') step(-1)
}

function onKeydown (e) {
  if (e.key === 'ArrowRight') step(1)
  if (e.key === 'ArrowLeft') step(-1)
}

watch(isOpen, open => {
  if (open) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped lang="scss">
.gallery {
  background: var(--mist);
}

.gallery__title {
  margin-bottom: 1.25rem;
  font-size: clamp(2.5rem, 6.5vw, 5.5rem);
  font-weight: 300;
  max-width: 16ch;
}

.gallery__lede {
  margin: 0 0 clamp(2.5rem, 6vw, 5rem);
}

.gallery__cols {
  columns: 3;
  column-gap: clamp(0.75rem, 2vw, 1.5rem);
  margin: 0;
  padding: 0;
  list-style: none;
}

.gallery__cell {
  break-inside: avoid;
  margin-bottom: clamp(0.75rem, 2vw, 1.5rem);
}

.gallery__item {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  border-radius: 0.6rem;
  background: var(--mist-deep);
  overflow: hidden;
  cursor: zoom-in;

  &--arch {
    border-radius: 999px 999px 0.6rem 0.6rem;
  }

  img {
    display: block;
    width: 100%;
    object-fit: cover;
    transition: transform 1s var(--ease-out);
  }

  &:hover img,
  &:focus-visible img {
    transform: scale(1.06);
  }
}

@media (max-width: 860px) {
  .gallery__cols {
    columns: 2;
  }
}

/* Lightbox ------------------------------------------------------- */
.lightbox {
  display: flex;
  flex-direction: column;
  background: var(--aubergine);
  color: var(--glow);
}

.lightbox__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem 0.75rem 1.5rem;
}

.lightbox__stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-height: 0;
  padding: 0 0.5rem;
}

.lightbox__img {
  flex: 1;
  min-width: 0;
  max-height: calc(100vh - 11rem);
  object-fit: contain;
}

.lightbox__caption {
  margin: 0;
  padding: 1rem 1.5rem 1.5rem;
  text-align: center;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.15rem;
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: opacity 0.3s ease, transform 0.4s var(--ease-out);
}

.slide-next-enter-from { opacity: 0; transform: translateX(48px) scale(0.98); }
.slide-next-leave-to { opacity: 0; transform: translateX(-48px) scale(0.98); }
.slide-prev-enter-from { opacity: 0; transform: translateX(-48px) scale(0.98); }
.slide-prev-leave-to { opacity: 0; transform: translateX(48px) scale(0.98); }

@media (max-width: 600px) {
  .lightbox__nav {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gallery__item img,
  .slide-next-enter-active,
  .slide-next-leave-active,
  .slide-prev-enter-active,
  .slide-prev-leave-active {
    transition: none;
  }
}
</style>
