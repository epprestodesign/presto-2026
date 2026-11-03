// Landing Page Concepts '27 — shared IMEX America 2027 brand + content.
// CONCEPT ONLY: an EventPipe/Presto design exploration using the IMEX America
// brand as a starting point for the corporate-events vertical. Not affiliated
// with or endorsed by IMEX. Hotel rates, block numbers and organizations are
// sample data.
import logo from '../../assets/landing27/imex-logo.svg'
import logoDark from '../../assets/landing27/imex-logo-dark.svg'
import mark from '../../assets/landing27/photos/og.jpg'
import buyers from '../../assets/landing27/photos/buyers.jpg'
import education from '../../assets/landing27/photos/education.jpg'
import networking from '../../assets/landing27/photos/networking.jpg'
import showfloor from '../../assets/landing27/photos/showfloor.jpg'
import mandalay from '../../assets/landing27/photos/mandalay.jpg'
import designMatters from '../../assets/landing27/photos/design-matters.jpg'
import hExterior from '../../assets/hotel/exterior.jpg'
import hLobby from '../../assets/hotel/lobby.jpg'
import hPool from '../../assets/hotel/pool.jpg'
import hKing from '../../assets/hotel/deluxe-king.jpg'
import hSuite from '../../assets/hotel/ocean-suite.jpg'
import hSpa from '../../assets/hotel/spa.jpg'

export const brand = {
  name: 'IMEX America',
  year: 2027,
  logo,
  logoDark,
  mark,
  colors: {
    red: '#E30613', coral: '#ED6B6C', blue: '#4D92CF', orange: '#F08006',
    green: '#086029', navy: '#191D4E', yellow: '#FFD100', pink: '#FBE3EA', ink: '#1D1D1B',
  },
}

export const photos = { buyers, education, networking, showfloor, mandalay, designMatters }

export const event = {
  name: 'IMEX America 2027',
  tagline: 'The heartbeat of the global business events industry.',
  venue: 'Mandalay Bay, Las Vegas',
  address: '3950 S Las Vegas Blvd, Las Vegas, NV 89119',
  datesLabel: 'September 28–30, 2027',
  smartMonday: 'Smart Monday, September 27',
  // Show opens 9:00 am PT on Tue Sep 28 2027.
  startsAt: '2027-09-28T09:00:00-07:00',
  blockDeadline: 'August 27, 2027',
}

// Every night a guest might stay. `tag` marks the show days.
export const stayDays = [
  { iso: '2027-09-25', dow: 'Sat', day: 25, mon: 'Sep' },
  { iso: '2027-09-26', dow: 'Sun', day: 26, mon: 'Sep' },
  { iso: '2027-09-27', dow: 'Mon', day: 27, mon: 'Sep', tag: 'Smart Monday', short: 'Smart' },
  { iso: '2027-09-28', dow: 'Tue', day: 28, mon: 'Sep', tag: 'Show day 1', short: 'Day 1' },
  { iso: '2027-09-29', dow: 'Wed', day: 29, mon: 'Sep', tag: 'Show day 2', short: 'Day 2' },
  { iso: '2027-09-30', dow: 'Thu', day: 30, mon: 'Sep', tag: 'Show day 3', short: 'Day 3' },
  { iso: '2027-10-01', dow: 'Fri', day: 1, mon: 'Oct' },
  { iso: '2027-10-02', dow: 'Sat', day: 2, mon: 'Oct' },
]
export const defaultStay = { arrive: '2027-09-27', depart: '2027-10-01' }

export const stats = [
  { value: 18200, label: 'Total participants' },
  { value: 96000, label: 'Meetings booked' },
  { value: 6292, label: 'Buyers' },
  { value: 3800, label: 'Exhibiting companies' },
]

// Corporate booking widget — replaces the sports "team" selector.
export const organizations = [
  'Northwind Events Co.', 'Brightline Hospitality', 'Summit Association Group', 'Coastal Convention Bureau',
  'Atlas Incentive Travel', 'Meridian Meetings', 'Harborview Hotels', 'Keystone Expo Services',
]
export const attendeeTypes = [
  { value: 'exhibitor', label: 'Exhibitor', icon: 'storefront' },
  { value: 'hosted', label: 'Hosted buyer', icon: 'workspace_premium' },
  { value: 'buyer', label: 'Buyer / planner', icon: 'event_note' },
  { value: 'speaker', label: 'Speaker', icon: 'record_voice_over' },
  { value: 'media', label: 'Media & press', icon: 'photo_camera' },
  { value: 'staff', label: 'Staff & crew', icon: 'badge' },
]

// Sample official hotels (rates + block numbers are illustrative).
export const hotels = [
  { id: 'mandalay', name: 'Mandalay Bay Resort', walk: 0, walkLabel: 'Show venue', rate: 239, was: 329, left: 41, image: hExterior, perks: ['Inside the venue', 'Free resort fee'], x: 34, y: 78 },
  { id: 'delano', name: 'Delano Las Vegas', walk: 4, walkLabel: '4 min walk', rate: 259, was: 349, left: 18, image: hSuite, perks: ['All-suite', 'Connected to venue'], x: 40, y: 72 },
  { id: 'fourseasons', name: 'Four Seasons Las Vegas', walk: 5, walkLabel: '5 min walk', rate: 389, was: 499, left: 9, image: hSpa, perks: ['Non-gaming', 'Spa credit'], x: 30, y: 70 },
  { id: 'luxor', name: 'Luxor Hotel', walk: 9, walkLabel: '9 min · free tram', rate: 149, was: 219, left: 76, image: hPool, perks: ['Free tram', 'Best value'], x: 46, y: 58 },
  { id: 'excalibur', name: 'Excalibur Hotel', walk: 13, walkLabel: '13 min · free tram', rate: 129, was: 189, left: 112, image: hKing, perks: ['Free tram', 'Family friendly'], x: 50, y: 44 },
  { id: 'nymgm', name: 'New York-New York', walk: 18, walkLabel: '18 min walk', rate: 169, was: 239, left: 64, image: hLobby, perks: ['Food hall', 'Late checkout'], x: 58, y: 30 },
]

export const block = { total: 2400, booked: 1728 } // 72% of the room block

export const perks = [
  { icon: 'savings', title: 'Up to 35% below public rates', text: 'Negotiated IMEX rates you won’t find on travel sites.' },
  { icon: 'directions_walk', title: 'Steps from the show floor', text: 'Every hotel is a short walk or free tram ride to Mandalay Bay.' },
  { icon: 'event_available', title: 'Flexible until Aug 27', text: 'Change or cancel without a fee until the block closes.' },
  { icon: 'groups', title: 'Book your whole team', text: 'Rooms for colleagues on one booking, one invoice.' },
  { icon: 'shield', title: 'Protected from scams', text: 'Only official partners — never a third-party “housing” call.' },
  { icon: 'support_agent', title: 'Real people, 24/7', text: 'The EventPipe housing team helps with changes and invoices.' },
]

export const schedule = [
  { day: '2027-09-27', label: 'Mon 27', title: 'Smart Monday', sub: 'Powered by MPI', items: [
    { time: '9:00', title: 'Smart Monday education', tag: 'Education' },
    { time: '13:00', title: 'Association Leadership Forum', tag: 'Forum' },
    { time: '18:00', title: 'Welcome reception', tag: 'Social' },
  ] },
  { day: '2027-09-28', label: 'Tue 28', title: 'Show day 1', sub: 'Trade show opens', items: [
    { time: '9:00', title: 'Show floor opens', tag: 'Trade show' },
    { time: '10:30', title: 'Design Matters keynote', tag: 'Keynote' },
    { time: '16:00', title: 'Inspiration Hub sessions', tag: 'Education' },
  ] },
  { day: '2027-09-29', label: 'Wed 29', title: 'Show day 2', sub: 'Meetings + education', items: [
    { time: '9:00', title: 'Pre-scheduled buyer meetings', tag: 'Meetings' },
    { time: '12:00', title: 'Sustainability roundtable', tag: 'Education' },
    { time: '19:00', title: 'IMEXrun & evening events', tag: 'Social' },
  ] },
  { day: '2027-09-30', label: 'Thu 30', title: 'Show day 3', sub: 'Last day on the floor', items: [
    { time: '9:00', title: 'Show floor opens', tag: 'Trade show' },
    { time: '11:00', title: 'Future of events panel', tag: 'Panel' },
    { time: '15:00', title: 'Show closes', tag: 'Trade show' },
  ] },
]

export const speakers = [
  { name: 'Amara Okafor', role: 'VP Global Events, Northwind', topic: 'Designing events people remember' },
  { name: 'Daniel Reyes', role: 'Founder, Atlas Incentive', topic: 'Incentive travel that actually motivates' },
  { name: 'Priya Natarajan', role: 'Head of Meetings, Summit Group', topic: 'Association events in 2028' },
  { name: 'Lena Fischer', role: 'Sustainability Lead, Meridian', topic: 'The low-carbon conference' },
]

export const partners = ['MPI', 'ASAE', 'PCMA', 'ICCA', 'IAEE', 'SITE', 'AIPC', 'IAPCO', 'Destinations International']

export const faqs = [
  { q: 'Why book inside the IMEX hotel block?', a: 'Block rates are negotiated below public prices, include perks like waived resort fees, and every hotel is a short walk or free tram ride from Mandalay Bay.' },
  { q: 'Can I book rooms for my whole team?', a: 'Yes — add rooms for colleagues on one booking. Each guest gets their own confirmation, and you get one invoice for your company.' },
  { q: 'When does the block close?', a: 'Block rates are held until August 27, 2027 or until the block sells out, whichever comes first.' },
  { q: 'Can I change or cancel my reservation?', a: 'Changes and cancellations are free until the block closes. After that, the hotel’s own policy applies.' },
  { q: 'Will anyone call me to book my hotel?', a: 'No. IMEX and EventPipe never cold-call exhibitors about housing. If someone does, it’s a scam — book only through this page.' },
]

// Formatting helpers shared by the concepts.
export const dayByIso = (iso) => stayDays.find((d) => d.iso === iso)
export const nightsBetween = (a, b) => Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000))
export function stayLabel (stay) {
  if (!stay || !stay.arrive || !stay.depart) return 'Add dates'
  const a = dayByIso(stay.arrive); const d = dayByIso(stay.depart)
  const n = nightsBetween(stay.arrive, stay.depart)
  if (!a || !d) return `${n} night${n === 1 ? '' : 's'}`
  const range = a.mon === d.mon ? `${a.mon} ${a.day}–${d.day}` : `${a.mon} ${a.day} – ${d.mon} ${d.day}`
  return `${range} · ${n} night${n === 1 ? '' : 's'}`
}
