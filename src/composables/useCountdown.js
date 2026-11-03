import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export function useCountdown (target) {
  const now = ref(Date.now())
  let timer = null

  onMounted(() => {
    now.value = Date.now()
    timer = setInterval(() => { now.value = Date.now() }, 1000)
  })

  onBeforeUnmount(() => clearInterval(timer))

  const done = computed(() => target.getTime() <= now.value)

  const parts = computed(() => {
    const total = Math.max(0, Math.floor((target.getTime() - now.value) / 1000))
    return [
      { key: 'days', label: 'days', value: Math.floor(total / 86400) },
      { key: 'hours', label: 'hours', value: Math.floor((total % 86400) / 3600) },
      { key: 'minutes', label: 'minutes', value: Math.floor((total % 3600) / 60) },
      { key: 'seconds', label: 'seconds', value: total % 60 }
    ]
  })

  return { parts, done }
}
