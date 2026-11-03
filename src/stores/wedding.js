import { defineStore } from 'pinia'

/**
 * Everything you need to edit to make the site yours lives in this file:
 * names, date, venues, schedule, story and gallery.
 * Replace the placeholder images in /public/images (or change the paths below).
 */
export const useWeddingStore = defineStore('wedding', {
  state: () => ({
    partnerA: 'Giulia',
    partnerB: 'Marco',

    // Date and time of the ceremony, with the UTC offset of the venue
    dateISO: '2027-06-19T16:00:00+02:00',
    timeZone: 'Europe/Rome',

    heroPlace: 'Villa Aurora, Lake Como, Italy',
    hashtag: '#GiuliaAndMarco2027',
    rsvpDeadline: '1 May 2027',
    maxGuests: 4,

    // RSVP replies are POSTed here as JSON (Formspree, Google Apps Script, your API...).
    // Leave empty to keep replies in the visitor's browser only (demo mode).
    rsvpEndpoint: '',

    heroImage: '/images/hero.svg',

    story: [
      {
        year: '2019',
        title: 'A borrowed umbrella',
        text: 'It rained on the first day of the Milan design fair. One umbrella, two strangers and a very long walk to the tram.',
        image: '/images/story-1.svg'
      },
      {
        year: '2021',
        title: 'Our first flat',
        text: 'Forty square metres, eleven plants and a shared playlist we still argue about.',
        image: '/images/story-2.svg'
      },
      {
        year: '2024',
        title: 'The question',
        text: 'On a cliff path above the sea, with the ring in the wrong pocket for an hour. She said yes before he found it.',
        image: '/images/story-3.svg'
      },
      {
        year: '2027',
        title: 'The day',
        text: 'Now we would like to celebrate with the people who made all of this possible. That means you.',
        image: ''
      }
    ],

    dayIntro:
      'We will begin with a ceremony in the village church, then walk together to the villa gardens for the evening.',

    schedule: [
      { time: '15:30', title: 'Arrival', note: 'Take a seat in the church. Shuttles leave the lakefront at 15:00.' },
      { time: '16:00', title: 'Ceremony', note: 'Santa Maria church, about 40 minutes.' },
      { time: '17:30', title: 'Aperitivo', note: 'Drinks and music in the villa gardens.' },
      { time: '19:30', title: 'Dinner', note: 'A long table under the pergola.' },
      { time: '22:00', title: 'First dance', note: 'Then the dance floor is yours.' },
      { time: '23:30', title: 'Cake and last song', note: 'Shuttles back to the lakefront until 01:00.' }
    ],

    facts: [
      { label: 'Dress code', value: 'Garden formal. Think soft colours, and flat shoes for the gravel paths.' },
      { label: 'Please reply by', value: '1 May 2027' },
      { label: 'Gifts', value: 'Your company is the gift. If you wish to give something, we have a honeymoon fund.' }
    ],

    venues: [
      {
        name: 'Chiesa di Santa Maria',
        role: 'Ceremony at 16:00',
        address: 'Piazza della Chiesa, 22021 Bellagio CO, Italy',
        note: 'Five minutes on foot from the ferry pier.'
      },
      {
        name: 'Villa Aurora',
        role: 'Reception from 17:30',
        address: 'Via Garibaldi 12, 22021 Bellagio CO, Italy',
        note: 'Parking is limited. Please use the shuttle.'
      }
    ],

    gallery: [
      { src: '/images/gallery-1.svg', alt: 'The couple laughing on a terrace', ratio: '4 / 5', arch: true },
      { src: '/images/gallery-2.svg', alt: 'Holding hands on a beach walk', ratio: '1 / 1', arch: false },
      { src: '/images/gallery-3.svg', alt: 'A candlelit dinner for two', ratio: '5 / 4', arch: false },
      { src: '/images/gallery-4.svg', alt: 'Dancing in the kitchen', ratio: '4 / 5', arch: true },
      { src: '/images/gallery-5.svg', alt: 'The engagement on the cliff path', ratio: '5 / 4', arch: false },
      { src: '/images/gallery-6.svg', alt: 'A road trip stop at sunset', ratio: '1 / 1', arch: false },
      { src: '/images/gallery-7.svg', alt: 'Under one umbrella', ratio: '4 / 5', arch: true },
      { src: '/images/gallery-8.svg', alt: 'Cooking together', ratio: '5 / 4', arch: false },
      { src: '/images/gallery-9.svg', alt: 'A quiet morning in the mountains', ratio: '4 / 5', arch: true }
    ]
  }),

  getters: {
    names: state => `${state.partnerA} & ${state.partnerB}`,
    initials: state => `${state.partnerA.charAt(0)} & ${state.partnerB.charAt(0)}`,
    date: state => new Date(state.dateISO),
    longDate (state) {
      return new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: state.timeZone
      }).format(new Date(state.dateISO))
    },
    shortDate (state) {
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: state.timeZone
      }).format(new Date(state.dateISO))
    }
  }
})
