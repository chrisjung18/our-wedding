import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// Optional: a shared instance with your API address
const api = axios.create({ baseURL: 'https://api.example.com' })

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }