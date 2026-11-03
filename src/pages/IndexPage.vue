<template>
  <q-page class="index-page">
    <HeroSection />
    <MarqueeBand />
    <CountdownSection />
    <StorySection />
    <DetailsSection />
    <GallerySection />
    <RsvpSection />
    <FooterSection />
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useWeddingStore } from 'stores/wedding'
import HeroSection from 'components/HeroSection.vue'
import MarqueeBand from 'components/MarqueeBand.vue'
import CountdownSection from 'components/CountdownSection.vue'
import StorySection from 'components/StorySection.vue'
import DetailsSection from 'components/DetailsSection.vue'
import GallerySection from 'components/GallerySection.vue'
import RsvpSection from 'components/RsvpSection.vue'
import FooterSection from 'components/FooterSection.vue'

defineOptions({
  name: 'IndexPage'
})

const wedding = useWeddingStore()

onMounted(() => {
  document.title = `${wedding.names} are getting married`
})
</script>
