<template>
  <q-layout view="hHh lpR fFf">
    <NavBar />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import NavBar from 'components/NavBar.vue'

defineOptions({
  name: 'MainLayout'
})
</script>
