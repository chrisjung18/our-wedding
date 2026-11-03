import { defineStore } from 'pinia'
import { useWeddingStore } from './wedding.js'

const STORAGE_KEY = 'wedding-rsvp-replies'

function saveLocally (reply) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    all.push({ ...reply, sentAt: new Date().toISOString() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch (e) {
    // Storage can be blocked (private mode). The demo still succeeds.
  }
}

export const useRsvpStore = defineStore('rsvp', {
  state: () => ({
    submitting: false,
    submitted: false,
    lastReply: null
  }),

  actions: {
    /**
     * Sends the reply. Throws if the request fails so the form can show an error.
     */
    async submit (reply) {
      this.submitting = true
      try {
        const { rsvpEndpoint } = useWeddingStore()

        if (rsvpEndpoint) {
          const response = await fetch(rsvpEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(reply)
          })
          if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
        } else {
          // Demo mode: no server configured, keep the reply in this browser.
          await new Promise(resolve => setTimeout(resolve, 900))
          saveLocally(reply)
        }

        this.lastReply = reply
        this.submitted = true
      } finally {
        this.submitting = false
      }
    },

    reopen () {
      this.submitted = false
    }
  }
})
