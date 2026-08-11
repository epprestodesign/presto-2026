// Shared secondary-custom-fee fixtures (DES-451…456) so every surface —
// Price Details, Reservation Summary, Checkout, Confirmation — demos the SAME
// three fees. Reusing one set is the point: it makes an inconsistency between
// two surfaces obvious in Storybook instead of only in production.
//
// Shape matches src/lib/secondaryFees.js: { name, basis, amount, total, description }
// The example mirrors the design request: a $5/room-night fee on a 4-night stay
// totalling $20, plus a flat per-reservation fee and a second nightly fee.

export const RESORT_FEE = {
  name: 'Resort Fee',
  basis: 'night',
  amount: 5,
  total: 20,
  description: 'Covers pool and fitness centre access, in-room WiFi, and daily housekeeping. Charged per room, per night, and collected at the time of booking.',
}

export const PARKING_FEE = {
  name: 'Event Parking',
  basis: 'reservation',
  amount: 15,
  total: 15,
  description: 'One tournament parking permit per reservation, valid for the length of your stay. Oversized vehicles should contact the front desk.',
}

export const FACILITY_FEE = {
  name: 'Facility Fee',
  basis: 'night',
  amount: 2,
  total: 8,
  description: 'Supports the venue shuttle and on-site event staffing. Charged per room, per night.',
}

/** The design request's cap: exactly three. */
export const THREE_FEES = [RESORT_FEE, PARKING_FEE, FACILITY_FEE]
/** Today's production behaviour — a single secondary fee. */
export const ONE_FEE = [RESORT_FEE]
export const TWO_FEES = [RESORT_FEE, PARKING_FEE]
/** Four configured fees; every surface must render only the first three. */
export const FOUR_FEES = [...THREE_FEES, { name: 'Late Checkout', basis: 'reservation', amount: 25, total: 25, description: 'Should never render — past the three-fee cap.' }]
/** A fee whose custom name was left blank → "Secondary Custom Fee N" fallback. */
export const UNNAMED_FEES = [{ basis: 'night', amount: 5, total: 20, description: 'Organizer left the custom name blank.' }, PARKING_FEE]

export const THREE_FEES_TOTAL = THREE_FEES.reduce((s, f) => s + f.total, 0) // 43
