<template>
  <section id="day" class="section day">
    <div class="section__inner day__grid">
      <div class="day__intro">
        <h2 v-reveal class="display day__title">The day, hour by hour</h2>
        <p v-reveal="{ delay: 120 }" class="lede">{{ wedding.dayIntro }}</p>

        <dl class="day__facts">
          <div v-for="(fact, i) in wedding.facts" :key="fact.label" v-reveal="{ delay: 200 + i * 90 }" class="day__fact">
            <dt>{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>
      </div>

      <ol class="day__schedule">
        <li v-for="(slot, i) in wedding.schedule" :key="slot.time" v-reveal="{ delay: i * 60 }" class="day__row">
          <time class="day__time display">{{ slot.time }}</time>
          <div>
            <h3 class="day__what">{{ slot.title }}</h3>
            <p class="day__note">{{ slot.note }}</p>
          </div>
        </li>
      </ol>
    </div>

    <div class="section__inner day__venues">
      <article v-for="(venue, i) in wedding.venues" :key="venue.name" v-reveal="{ delay: i * 120 }" class="venue">
        <p class="venue__role">{{ venue.role }}</p>
        <h3 class="venue__name display">{{ venue.name }}</h3>
        <p class="venue__address">{{ venue.address }}</p>
        <p class="venue__note">{{ venue.note }}</p>
        <a class="venue__link" :href="mapsUrl(venue)" target="_blank" rel="noopener">Open in Maps</a>
      </article>
    </div>
  </section>
</template>

<script setup>
import { useWeddingStore } from 'stores/wedding'

defineOptions({
  name: 'DetailsSection'
})

const wedding = useWeddingStore()

const mapsUrl = venue =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.name}, ${venue.address}`)}`
</script>

<style scoped lang="scss">
.day {
  background: var(--aubergine);
  color: var(--glow);
}

.day__grid {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  gap: clamp(3rem, 7vw, 7rem);
  align-items: start;
}

.day__intro {
  position: sticky;
  top: 6rem;
}

.day__title {
  margin-bottom: 1.5rem;
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 300;
}

.day__facts {
  display: grid;
  gap: 1.5rem;
  margin: 3rem 0 0;
}

.day__fact {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 243, 228, 0.25);

  dt {
    margin-bottom: 0.25rem;
    font-weight: 600;
    color: var(--apricot);
  }

  dd {
    margin: 0;
    max-width: 30rem;
    line-height: 1.6;
  }
}

.day__schedule {
  margin: 0;
  padding: 0;
  list-style: none;
}

.day__row {
  display: grid;
  grid-template-columns: clamp(6rem, 12vw, 9rem) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: baseline;
  padding: 1.75rem 0;
  border-top: 1px solid rgba(255, 243, 228, 0.25);

  &:last-child {
    border-bottom: 1px solid rgba(255, 243, 228, 0.25);
  }
}

.day__time {
  font-size: clamp(2rem, 4.4vw, 3.4rem);
  font-style: italic;
  font-weight: 300;
  font-variant-numeric: tabular-nums;
  color: var(--apricot);
}

.day__what {
  margin: 0 0 0.25rem;
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 500;
}

.day__note {
  margin: 0;
  line-height: 1.55;
  color: rgba(255, 243, 228, 0.8);
}

.day__venues {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(2rem, 5vw, 5rem);
  margin-top: clamp(4rem, 9vw, 8rem);
}

.venue {
  padding: clamp(1.75rem, 3.5vw, 3rem);
  border-radius: 999px 999px 0.75rem 0.75rem;
  padding-top: clamp(4rem, 9vw, 7rem);
  background: var(--plum);
  text-align: center;
}

.venue__role {
  margin: 0 0 0.5rem;
  color: var(--apricot);
}

.venue__name {
  margin-bottom: 1rem;
  font-size: clamp(1.9rem, 3.6vw, 3rem);
  font-style: italic;
  font-weight: 300;
}

.venue__address {
  margin: 0 0 0.25rem;
}

.venue__note {
  margin: 0 0 1.5rem;
  color: rgba(255, 243, 228, 0.8);
}

.venue__link {
  display: inline-block;
  padding: 0.7rem 1.5rem;
  border: 1px solid var(--apricot);
  border-radius: 999px;
  color: var(--apricot);
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover,
  &:focus-visible {
    background: var(--apricot);
    color: var(--aubergine);
  }
}

@media (max-width: 860px) {
  .day__grid,
  .day__venues {
    grid-template-columns: minmax(0, 1fr);
  }

  .day__intro {
    position: static;
  }
}
</style>
