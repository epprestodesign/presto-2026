<script setup>
// Confirmation — the library's ConfirmationPage (Confirmation / Book
// Reservation · Single Reservation), fed from the completed order: the hotel
// stay (rooms by night, taxes, room cost, paid now vs. balance due) plus a race
// order card for the Spartan tickets and add-ons in the same purchase.
import { computed } from 'vue'
import ConfirmationPage from '@lib/components/confirmation/ConfirmationPage.vue'
import { store } from './bridge.js'
import { HOTELS, money } from './hotels.js'

const now = new Date()
const reservedOn = now.toLocaleString('en-US', { weekday: 'short', month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '') + ' CT'
const confirmationId = String(7205577 + Math.floor(now.getTime() / 1000) % 1000000) + '1948'

const data = computed(() => {
  const q = store.hotel
  const h = q ? HOTELS.find((x) => x.id === q.hotelId) : null
  const king = q?.roomType === 'king'
  return {
    bannerTitle: q ? 'Success! Your race weekend is booked.' : 'Success! Your race order is confirmed.',
    bannerCta: 'Back to the race',
    contactName: 'Alex Smith',
    confirmationId,
    reservedOn,
    guest: 'Alex Smith — (555) 018-2245',
    email: 'youraccount@eventpipe.com',
    hotels: q ? [{
      name: q.name,
      stars: q.stars,
      address: `${q.address || h?.address || q.city} · ${q.miles} mi from Sandy Oaks Ranch (race venue)`,
      seed: q.seed ?? h?.seed ?? 0,
      checkIn: `${q.checkIn || ''} 03:00 PM`,
      checkOut: `${q.checkOut || ''} 11:00 AM`,
      rooms: [{
        type: king ? 'Room, 1 King Bed, Non Smoking' : 'Room, 2 Queen Beds, Non Smoking',
        note: [king ? '1 King Bed' : '2 Queen Beds', `Sleeps ${king ? 2 : 4}`, ...(h?.tags || q.tags || [])].join(' · '),
        nights: (q.nightDates || []).map((date) => ({ date, qty: q.rooms, price: q.nightly })),
      }],
      totals: { taxes: q.taxes, rooms: q.rooms, roomCost: q.total, amountPaid: q.dueToday, balanceDue: q.dueAtHotel },
    }] : [],
    policies: q ? [{ hotel: q.name, items: [
      { title: 'Cancellation Policy', body: `A cancellation fee will not be charged if you cancel before Fri, 11/13/2026 at 4:00 PM. If you cancel after that, you agree to be charged a fee of ${money(q.firstNight)}.` },
      { title: 'Deposit', body: q.payOption === 'full' ? 'The full stay was charged to the card on file with your race order. No additional deposit is collected at check-in.' : `The first night (${money(q.dueToday)}) was charged to the card on file with your race order. The balance of ${money(q.dueAtHotel)} is due at check-in.` },
      { title: 'Check-in & Check-out', body: 'Check-in from 3:00 PM with photo ID and the card used for booking. Check-out by 11:00 AM.' },
      { title: 'Amenities Notice', body: 'Kindly note that amenities like laundry, pools, parking rates, breakfast and restaurants are not guaranteed. For the latest updates on available amenities, please visit the hotel website.' },
      { title: 'Refund Policy', body: 'Eligible refunds are returned to the original payment method within 5–7 business days of cancellation.' },
    ] }] : [],
  }
})
const r = computed(() => store.receipt)
</script>

<template>
  <div class="cf">
    <confirmation-page mode="reserve" :data="data" />

    <section v-if="r" class="cf__race">
      <h2 class="cf__h">Race order</h2>
      <div class="cf__card">
        <p class="cf__sub">Tickets</p>
        <div v-for="(t, i) in r.tickets" :key="'t' + i" class="cf__row"><span>{{ t.label }}<template v-if="t.qty > 1"> × {{ t.qty }}</template></span><span>{{ money(t.amount) }}</span></div>
        <template v-if="r.addons.length">
          <p class="cf__sub">Add-ons</p>
          <div v-for="(a, i) in r.addons" :key="'a' + i" class="cf__row"><span>{{ a.label }}<template v-if="a.qty > 1"> × {{ a.qty }}</template></span><span>{{ money(a.amount) }}</span></div>
        </template>
        <div class="cf__row cf__row--total"><span>Total charged today</span><span>{{ money(r.total) }}</span></div>
        <p v-if="r.hotelAtHotel" class="cf__note">Includes the hotel’s first night. {{ money(r.hotelAtHotel) }} is due at hotel check-in.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* embedded: the library page's min-height:100vh would grow with the auto-sized
   iframe forever — size it to its content instead */
.cf :deep(.conf) { min-height: 0; padding-bottom: 32px; }
.cf { background: var(--ds-color-surface-sunken); padding-bottom: 8px; }
.cf__race { max-width: 848px; margin: -24px auto 40px; padding: 0 24px; } /* same 800px column as .conf__inner */
.cf__h { margin: 0 0 12px; font-size: 1.375rem; font-weight: 800; color: var(--ds-color-link); } /* = .conf__sectionlabel */
.cf__card { padding: 22px 32px; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); background: var(--ds-color-surface); }
.cf__sub { margin: 10px 0 4px; font-size: 0.8125rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ds-color-text-subtle); }
.cf__sub:first-child { margin-top: 0; }
.cf__row { display: flex; justify-content: space-between; gap: 16px; padding: 5px 0; font-size: 0.9375rem; color: var(--ds-color-text); }
.cf__row > span:last-child { flex: none; }
.cf__row--total { margin-top: 10px; padding-top: 12px; border-top: 1px solid var(--ds-color-border); font-weight: 700; font-size: 1.0625rem; }
.cf__note { margin: 6px 0 0; font-size: 0.875rem; color: var(--ds-color-text-subtle); }
</style>
