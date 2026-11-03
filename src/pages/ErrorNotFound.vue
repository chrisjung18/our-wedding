<template>
  <div class="lost">
    <p class="lost__code display">404</p>
    <p class="lost__text">This page does not exist. The party is on the home page.</p>
    <q-btn unelevated rounded no-caps color="primary" label="Back to the invitation" to="/" />
  </div>
</template>

<script setup>
defineOptions({
  name: 'ErrorNotFound'
})
</script>

<style scoped lang="scss">
.lost {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
  padding: var(--gutter);
  background: linear-gradient(180deg, var(--aubergine), var(--plum));
  color: var(--glow);
}

.lost__code {
  font-size: clamp(6rem, 24vw, 16rem);
  font-style: italic;
}

.lost__text {
  font-size: 1.2rem;
  margin: 0 0 1rem;
}
</style>
