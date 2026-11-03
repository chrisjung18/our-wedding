<template>
  <footer class="foot">
    <p v-reveal class="foot__names display">{{ wedding.names }}</p>
    <p class="foot__line">{{ wedding.shortDate }}, {{ wedding.heroPlace }}</p>
    <p class="foot__tag">Share your photos with {{ wedding.hashtag }}</p>
  </footer>
</template>

<script setup>
import { useWeddingStore } from 'stores/wedding'

defineOptions({
  name: 'FooterSection'
})

const wedding = useWeddingStore()
</script>

<style scoped lang="scss">
.foot {
  padding: clamp(4rem, 9vw, 7rem) var(--gutter) 3rem;
  background: var(--aubergine);
  color: var(--glow);
}

.foot__names {
  margin-bottom: 1.5rem;
  font-size: clamp(3.5rem, 13vw, 11rem);
  font-style: italic;
  font-weight: 300;
  line-height: 0.95;
  color: var(--apricot);
}

.foot__line,
.foot__tag {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
}

.foot__tag {
  color: rgba(255, 243, 228, 0.75);
}
</style>
