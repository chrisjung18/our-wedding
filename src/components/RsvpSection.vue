<template>
  <section id="rsvp" class="section rsvp">
    <div class="section__inner rsvp__grid">
      <div class="rsvp__intro">
        <h2 v-reveal class="display rsvp__title">Will you celebrate with us?</h2>
        <p v-reveal="{ delay: 120 }" class="lede">
          It takes a minute. Please reply by {{ wedding.rsvpDeadline }} so we can plan the tables and the food.
        </p>
      </div>

      <div v-reveal="{ delay: 200 }" class="rsvp__panel">
        <!-- Thank-you state -->
        <div v-if="rsvp.submitted" class="done" role="status">
          <div class="done__mark" aria-hidden="true">
            <svg viewBox="0 0 52 52" class="done__svg">
              <circle class="done__circle" cx="26" cy="26" r="23" />
              <path class="done__check" d="M15 27l7 7 15-16" />
            </svg>
            <span v-for="n in 14" :key="n" class="done__spark" :style="spark(n)" />
          </div>

          <h3 class="done__title display">{{ doneTitle }}</h3>
          <p class="done__text">{{ doneText }}</p>
          <q-btn flat no-caps rounded color="primary" label="Change my reply" @click="rsvp.reopen()" />
        </div>

        <!-- Form -->
        <q-form v-else ref="formRef" class="form" greedy @submit.prevent="onSubmit" @validation-error="onValidationError">
          <q-input
            v-model="form.name"
            outlined
            autocomplete="name"
            label="Full name"
            :rules="[v => !!(v && v.trim()) || 'Enter your full name']"
            lazy-rules
          />

          <q-input
            v-model="form.email"
            outlined
            type="email"
            autocomplete="email"
            label="Email"
            hint="We only use this to send you updates about the day."
            :rules="[v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '') || 'Enter a valid email address']"
            lazy-rules
          />

          <fieldset class="form__group">
            <legend class="form__legend">Can you come?</legend>
            <q-btn-toggle
              v-model="form.attending"
              class="form__toggle"
              no-caps
              unelevated
              spread
              toggle-color="primary"
              color="white"
              text-color="dark"
              :options="[
                { label: 'Yes, I\'ll be there', value: 'yes' },
                { label: 'Sorry, I can\'t', value: 'no' }
              ]"
              @update:model-value="attendingError = false"
            />
            <p v-if="attendingError" class="form__error" role="alert">Tell us whether you can come.</p>
          </fieldset>

          <Transition name="expand">
            <div v-if="form.attending === 'yes'" class="form__more">
              <div class="form__guests">
                <span id="guests-label" class="form__legend">Guests, including you</span>
                <div class="stepper" role="group" aria-labelledby="guests-label">
                  <q-btn round flat icon="remove" :disable="form.guests <= 1" aria-label="One fewer guest" @click="form.guests--" />
                  <output class="stepper__value display" aria-live="polite">{{ form.guests }}</output>
                  <q-btn round flat icon="add" :disable="form.guests >= wedding.maxGuests" aria-label="One more guest" @click="form.guests++" />
                </div>
              </div>

              <q-select
                v-model="form.menu"
                outlined
                emit-value
                map-options
                label="Dinner menu"
                :options="menus"
                :rules="[v => !!v || 'Choose a menu']"
                lazy-rules
              />
            </div>
          </Transition>

          <q-input
            v-model="form.note"
            outlined
            type="textarea"
            autogrow
            label="Allergies, song requests, anything else"
          />

          <!-- Honeypot: hidden from people, filled in by simple bots -->
          <input v-model="form.website" class="sr-only" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">

          <q-btn
            class="form__submit"
            type="submit"
            unelevated
            rounded
            no-caps
            size="lg"
            color="primary"
            label="Send my reply"
            :loading="rsvp.submitting"
          />
        </q-form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useWeddingStore } from 'stores/wedding'
import { useRsvpStore } from 'stores/rsvp'

defineOptions({
  name: 'RsvpSection'
})

const $q = useQuasar()
const wedding = useWeddingStore()
const rsvp = useRsvpStore()

const formRef = ref(null)
const attendingError = ref(false)

const form = reactive({
  name: '',
  email: '',
  attending: null,
  guests: 1,
  menu: null,
  note: '',
  website: ''
})

const menus = [
  { label: 'Meat', value: 'meat' },
  { label: 'Fish', value: 'fish' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Children’s menu', value: 'children' }
]

const firstName = computed(() => (rsvp.lastReply?.name || form.name).trim().split(/\s+/)[0] || '')

const doneTitle = computed(() =>
  rsvp.lastReply?.attending === 'yes'
    ? `See you there, ${firstName.value}!`
    : `We will miss you, ${firstName.value}.`
)

const doneText = computed(() =>
  rsvp.lastReply?.attending === 'yes'
    ? `Your reply is in. We are counting down to ${wedding.shortDate}.`
    : 'Thank you for letting us know. We will raise a glass to you on the day.'
)

// Random-looking but stable burst positions for the confirmation sparks
function spark (n) {
  const angle = (n / 14) * Math.PI * 2
  const distance = 54 + ((n * 37) % 28)
  return {
    '--dx': `${Math.cos(angle) * distance}px`,
    '--dy': `${Math.sin(angle) * distance}px`,
    '--delay': `${(n % 5) * 40}ms`,
    background: n % 2 ? 'var(--apricot)' : 'var(--peony)'
  }
}

// Quasar only calls submit when every field is valid, so flag the toggle here too
function onValidationError () {
  attendingError.value = !form.attending
}

async function onSubmit () {
  if (!form.attending) {
    attendingError.value = true
    return
  }

  // A bot filled the hidden field: pretend it worked and send nothing
  if (form.website) {
    rsvp.lastReply = { name: form.name, attending: form.attending }
    rsvp.submitted = true
    return
  }

  const reply = {
    name: form.name.trim(),
    email: form.email.trim(),
    attending: form.attending,
    guests: form.attending === 'yes' ? form.guests : 0,
    menu: form.attending === 'yes' ? form.menu : null,
    note: form.note.trim()
  }

  try {
    await rsvp.submit(reply)
  } catch (e) {
    $q.notify({
      type: 'negative',
      position: 'top',
      message: 'We could not send your reply. Check your connection and try again.'
    })
  }
}
</script>

<style scoped lang="scss">
.rsvp {
  background: linear-gradient(180deg, var(--mist) 0%, var(--mist-deep) 100%);
}

.rsvp__grid {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  gap: clamp(3rem, 7vw, 7rem);
  align-items: start;
}

.rsvp__title {
  margin-bottom: 1.5rem;
  font-size: clamp(2.75rem, 6.5vw, 5.5rem);
  font-weight: 300;
}

.rsvp__panel {
  padding: clamp(1.5rem, 4vw, 3rem);
  border-radius: 1.5rem;
  background: var(--paper);
  box-shadow: 0 2rem 4rem -2rem rgba(42, 23, 64, 0.35);
}

.form {
  display: grid;
  gap: 1.25rem;
}

.form__group {
  margin: 0;
  padding: 0;
  border: 0;
}

.form__legend {
  display: block;
  margin-bottom: 0.5rem;
  padding: 0;
  font-weight: 600;
}

.form__toggle {
  border: 1px solid rgba(42, 23, 64, 0.3);
  border-radius: 999px;
  overflow: hidden;
}

.form__error {
  margin: 0.5rem 0 0;
  color: var(--q-negative);
  font-size: 0.85rem;
}

.form__more {
  display: grid;
  gap: 1.25rem;
}

.stepper {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(42, 23, 64, 0.3);
  border-radius: 999px;
  padding: 0.15rem;
}

.stepper__value {
  min-width: 2.5rem;
  text-align: center;
  font-size: 1.8rem;
}

.form__submit {
  justify-self: start;
  margin-top: 0.5rem;
}

.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.4s ease, transform 0.5s var(--ease-out);
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Thank-you state ------------------------------------------------ */
.done {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 0;
}

.done__mark {
  position: relative;
  width: 5rem;
  height: 5rem;
  margin-bottom: 0.5rem;
}

.done__svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.done__circle {
  stroke: var(--peony);
  stroke-dasharray: 145;
  stroke-dashoffset: 145;
  animation: draw 0.8s var(--ease-out) forwards;
}

.done__check {
  stroke: var(--rose-deep);
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: draw 0.5s ease 0.7s forwards;
}

.done__spark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.5rem;
  height: 0.5rem;
  margin: -0.25rem 0 0 -0.25rem;
  border-radius: 50%;
  opacity: 0;
  animation: spark 1.1s var(--ease-out) 0.9s forwards;
  animation-delay: calc(0.9s + var(--delay));
}

.done__title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-style: italic;
  font-weight: 300;
}

.done__text {
  max-width: 28rem;
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}

@keyframes spark {
  0% { opacity: 1; transform: translate(0, 0) scale(1); }
  100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.4); }
}

@media (max-width: 860px) {
  .rsvp__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .done__circle,
  .done__check {
    animation: none;
    stroke-dashoffset: 0;
  }

  .done__spark {
    display: none;
  }

  .expand-enter-active,
  .expand-leave-active {
    transition: none;
  }
}
</style>
