// Static content for the San Antonio Trifecta Weekend event page + checkout.
// Copy and prices are transcribed from the reference captures.

const A = './assets'
export const asset = (p) => `${A}/${p}`

export const EVENT = {
  dates: 'Nov 21 - 22, 2026',
  title: '2026 San Antonio Spartan Trifecta Weekend',
  address: 'Sandy Oaks Ranch, 1480 I-35, Devine, TX',
  rating: 4.7,
  testimonials: 33,
  features: [
    {
      icon: 'icons/longhorn.svg',
      title: 'Sandy Oaks Ranch',
      body: 'Native woodlands, rolling pastures, creek crossings, and wildlife-rich wetlands create a diverse challenge',
    },
    {
      icon: 'icons/sunshine.svg',
      title: 'Texas Sun',
      body: 'Take on a scenic, sun-soaked challenge in this thrilling late-season race.',
    },
  ],
  gallery: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'].map((n) => `img/gallery-${n}.jpg`),
}

export const PROMOS = [
  { title: '2027 OCR Passes', body: 'New goals await. Lock in your pass and commit to ultimate achievement.', cta: 'Get your pass' },
  { title: 'Go Harder', body: 'Get back outside. Train for something that matters.', cta: 'Find an event' },
]

export const UTILITY_BRANDS = [
  'Tough Mudder', 'Spartan Trail', 'DEKA', 'Extreme Endurance', 'OCRWC', 'La Ruta', 'M20', 'Highlander', 'Combat',
]

export const MAIN_NAV = ['Race', 'Passes', 'Train', 'Shop', 'Blog']

// ── Race cards (the TicketSocket widget area) ──
// The Sprint inventory is transcribed from the reference. The other races only
// show a "FROM" price in the reference, so their expanded inventory is a
// plausible stand-in built around that price.
const DAYS = {
  sat: { key: 'sat', label: 'Nov 21 • Sat', dayName: 'Saturday', date: 'Nov 21, 2026' },
  sun: { key: 'sun', label: 'Nov 22 • Sun', dayName: 'Sunday', date: 'Nov 22, 2026' },
}
const day = (key, extra) => ({ ...DAYS[key], ...extra })

const spectatorAddon = (d) => ({ id: `${d}-spectator`, name: `${d === 'sat' ? 'Saturday' : 'Sunday'} Spectator Pass`, price: 20 })

export const RACES = [
  {
    id: 'sprint',
    ribbon: { label: 'Challenge a friend', color: 'var(--rib-friend)', bg: 'var(--rib-friend-bg)' },
    dates: 'Nov 21 - 22',
    name: ['Sprint 5K', '20 Obstacles'],
    short: 'Sprint',
    from: 129,
    eventName: 'San Antonio Spartan Sprint 5K',
    days: [
      day('sat', {
        tickets: [
          { id: 'sat-open', time: '9:30am - 12:59pm', name: 'Open', left: 42, price: 139, window: '9:30AM - 12:59PM' },
          { id: 'sat-doubles', time: '9:30am - 12:59pm', name: 'Doubles Open', left: 81, price: 139, window: '9:30AM - 12:59PM' },
        ],
        addons: [spectatorAddon('sat')],
      }),
      day('sun', {
        tickets: [
          { id: 'sun-doubles', time: '11:00am - 12:59pm', name: 'Doubles Open', left: 47, price: 129, window: '11:00AM - 12:59PM' },
          { id: 'sun-open', time: '11:00am - 12:59pm', name: 'Open', left: 33, price: 129, window: '11:00AM - 12:59PM' },
        ],
        addons: [spectatorAddon('sun')],
      }),
    ],
  },
  {
    id: 'super',
    ribbon: { label: 'Great for teams', color: 'var(--rib-teams)', bg: 'var(--rib-teams-bg)' },
    dates: 'Nov 22', name: ['Super 10K', '25 Obstacles'], short: 'Super', from: 155,
    eventName: 'San Antonio Spartan Super 10K',
    days: [day('sun', {
      tickets: [
        { id: 'super-open', time: '8:00am - 11:59am', name: 'Open', left: 64, price: 155, window: '8:00AM - 11:59AM' },
        { id: 'super-ag', time: '7:30am - 7:59am', name: 'Age Group', left: 28, price: 175, window: '7:30AM - 7:59AM' },
        { id: 'super-elite', time: '7:00am - 7:29am', name: 'Elite', left: 12, price: 195, window: '7:00AM - 7:29AM' },
      ],
      addons: [spectatorAddon('sun')],
    })],
  },
  {
    id: 'beast',
    ribbon: { label: 'Test the mind & body', color: 'var(--rib-mind)', bg: 'var(--rib-mind-bg)' },
    dates: 'Nov 21', name: ['Beast 21K', '30 Obstacles'], short: 'Beast', from: 195,
    eventName: 'San Antonio Spartan Beast 21K',
    days: [day('sat', {
      tickets: [
        { id: 'beast-open', time: '7:30am - 9:59am', name: 'Open', left: 51, price: 195, window: '7:30AM - 9:59AM' },
        { id: 'beast-ag', time: '7:15am - 7:29am', name: 'Age Group', left: 19, price: 215, window: '7:15AM - 7:29AM' },
        { id: 'beast-elite', time: '7:00am - 7:14am', name: 'Elite', left: 9, price: 235, window: '7:00AM - 7:14AM' },
      ],
      addons: [spectatorAddon('sat')],
    })],
  },
  {
    id: 'kids',
    ribbon: { label: 'Family fun', color: 'var(--rib-family)', bg: 'var(--rib-family-bg)' },
    dates: 'Nov 21 - 22', name: ['Kids Race 1-3KM', '+Obstacles'], short: 'Kids', from: 29,
    eventName: 'San Antonio Spartan Kids Race',
    days: [
      day('sat', { tickets: [{ id: 'kids-sat', time: '10:00am - 2:59pm', name: 'Kids 1-3KM', left: 120, price: 29, window: '10:00AM - 2:59PM' }], addons: [] }),
      day('sun', { tickets: [{ id: 'kids-sun', time: '10:00am - 1:59pm', name: 'Kids 1-3KM', left: 96, price: 29, window: '10:00AM - 1:59PM' }], addons: [] }),
    ],
  },
  {
    id: 'hh4', bar: 'var(--rib-hh4)', dates: 'Nov 21', name: ['Hurricane Heat 4HR'], short: 'HH4HR', from: 105,
    eventName: 'San Antonio Hurricane Heat 4HR',
    days: [day('sat', { tickets: [{ id: 'hh4-open', time: '5:00pm - 8:59pm', name: 'Open', left: 30, price: 105, window: '5:00PM - 8:59PM' }], addons: [] })],
  },
  {
    id: 'hh12', bar: 'var(--rib-hh12)', dates: 'Nov 21', name: ['Hurricane Heat 12HR'], short: 'HH12HR', from: 155,
    eventName: 'San Antonio Hurricane Heat 12HR',
    days: [day('sat', { tickets: [{ id: 'hh12-open', time: '7:00pm - 6:59am', name: 'Open', left: 22, price: 155, window: '7:00PM - 6:59AM' }], addons: [] })],
  },
  {
    id: 'spectators',
    ribbon: { label: 'Cheer from the sidelines', color: 'var(--rib-cheer)', bg: 'var(--rib-cheer-bg)' },
    dates: 'Nov 21', name: ['Spectators'], short: 'Spectator', from: null,
    eventName: 'San Antonio Spartan Spectators',
    days: [
      day('sat', { tickets: [{ id: 'spec-sat', time: '7:00am - 4:00pm', name: 'Spectator', left: 300, price: 20, window: '7:00AM - 4:00PM' }], addons: [] }),
      day('sun', { tickets: [{ id: 'spec-sun', time: '7:00am - 3:00pm', name: 'Spectator', left: 300, price: 20, window: '7:00AM - 3:00PM' }], addons: [] }),
    ],
  },
]

export const TRIFECTA_PASS = {
  price: '$449',
  savings: '$170 in savings',
  perks: [
    { icon: 'icons/helmet.svg', text: "3 Epic U.S. Races in '26: Sprint/Stadion, Super, Beast" },
    { icon: 'icons/heat-bars.svg', text: 'All Heat Access' },
    { icon: 'icons/binoculars.svg', text: 'Free Spectator Passes' },
  ],
}

export const ABOUT =
  'Welcome to Sandy Oaks Ranch - This course offers the perfect blend of scenic Texas beauty and punishing obstacles, featuring rolling hills, creek crossings, and wildlife-packed trails. Located 40 minutes southwest of San Antonio, Sandy Oaks makes for a great way to spend your Spartan weekend with a true test of your grit and determination.'

export const DISTANCE_TABS = ['Sprint', 'Super', 'Beast', 'Kids Race', 'HH4HR', 'HH12HR', 'Spectators']

// Only the first three obstacle titles are visible in the reference; the rest
// are Spartan-standard obstacles matched to their photos.
export const OBSTACLES = [
  { img: 'obstacles/5k.png', hero: true },
  { img: 'obstacles/atlas-carry.png', kind: 'Carry', name: 'Atlas Carry' },
  { img: 'obstacles/ob-42.jpg', kind: 'Climb', name: 'A-Frame Cargo' },
  { img: 'obstacles/ob-43.jpg', kind: 'Crawl', name: 'Barbed Wire Crawl' },
  { img: 'obstacles/ob-44.jpg', kind: 'Jump', name: 'Fire Jump' },
  { img: 'obstacles/ob-46.jpg', kind: 'Climb', name: 'Olympus' },
  { img: 'obstacles/ob-47.jpg', kind: 'Carry', name: 'Sandbag Carry' },
  { img: 'obstacles/ob-48.jpg', kind: 'Climb', name: 'Rope Climb' },
  { img: 'obstacles/ob-49.jpg', kind: 'Hang', name: 'Multi-Rig' },
  { img: 'obstacles/ob-50.jpg', kind: 'Hang', name: 'Twister' },
  { img: 'obstacles/ob-51.jpg', kind: 'Carry', name: 'Bucket Carry' },
  { img: 'obstacles/ob-52.jpg', kind: 'Pull', name: 'Herc Hoist' },
  { img: 'obstacles/ob-53.jpg', kind: 'Throw', name: 'Spear Throw' },
  { img: 'obstacles/ob-54.jpg', kind: 'Climb', name: '8ft Wall' },
  { img: 'obstacles/ob-55.jpg', kind: 'Pull', name: 'Plate Drag' },
]

export const EARN = [
  { img: 'earn/sprint-medal.png', name: 'Sprint Medal' },
  { img: 'earn/finisher-tee.png', name: 'Finisher Tee' },
  { img: 'earn/trifecta-hex.png', name: 'Trifecta Hex' },
  { img: 'earn/bragging-rights.png', name: 'Bragging Rights' },
]

export const RACE_DAY_INFO = [
  'Arrival & Heat Times',
  'Volunteer & Race For Free',
  'Where to stay?',
  'Race Day Program & Documents',
  'What Finishers Earn',
]

export const TESTIMONIALS = [
  { name: 'Ernesto Ramos Iii', stars: 4, body: 'Great distance. Flat terrain made the course a bit easier.' },
  { name: 'William Saprito', stars: 4, body: "Fun course, but definitely longer than 5k and the slip wall was dry. Didn't even need rope to climb up it." },
  { name: 'Travis Wessler', stars: 4, body: "the spear throw was very disorganized. It wasn't clear which stations were operational. It wasn't clear how many tries you had to hit the target. There were long lines at the start and the volunteers were stretched thin.", more: true },
  { name: 'Noraliz Maysonet Ortiz', stars: 5, body: "Thank you, Jeeeesus!! To all who helped me through - may God bless you abundantly. This medal is dedicated to you. I can't stop crying and praising Him for the strength to finish.", more: true },
  { name: 'EDUARDO Orozco', stars: 5, avatar: 'spartan', body: 'Beautiful community of extraordinary human beings from the competitors all the way to the volunteers. Thanks for the memories' },
  { name: 'Rhonda Borbiliac', stars: 5, body: 'Loved every minute of it!' },
]

export const NEARBY = [
  { img: 'nearby/austin-tough-mudder.jpg', date: ['Feb', '27', '2027'], title: '2027 Austin Tough Mudder Event Weekend', meta: 'Infinity • 5K • 15K', city: 'Burnet, TX' },
  { img: 'nearby/austin-trail.jpg', date: ['May', '16', '2027'], title: '2027 Austin Trail Experience', meta: 'Trail 10K • Spectators', city: 'Burnet, TX' },
  { img: 'nearby/austin-spartan.jpg', date: ['May', '15', '2027'], title: '2027 Austin Spartan Event Weekend', meta: 'Sprint • Super • Kids Race • HH12HR • Spectators', city: 'Burnet, TX' },
]

export const SPONSOR_ROWS = [
  [
    { src: 'logos/s-athletic.png', w: 196 },
    { src: 'logos/s-bodyglide.png', w: 64 },
    { src: 'logos/s-craft.png', w: 222 },
    { src: 'logos/s-essentia.png', w: 222 },
    { src: 'logos/s-flex.png', w: 66 },
  ],
  [
    { src: 'logos/s-givestar.png', w: 222 },
    { src: 'logos/s-govx.png', w: 172 },
    { src: 'logos/s-gmf.png', w: 92 },
    { src: 'logos/s-hotelplanner.png', w: 174 },
    { src: 'logos/s-maptrition.png', w: 164 },
  ],
  [
    { src: 'logos/s-navy.png', w: 150 },
    { src: 'logos/s-pressio.png', w: 52 },
    { src: 'logos/s-puck.png', w: 120 },
    { src: 'logos/s-qagency.svg', w: 104 },
    { src: 'logos/s-tempo.png', w: 150 },
    { src: 'logos/s-ticketsocket.png', w: 174 },
  ],
  [
    { src: 'logos/s-borderpatrol.png', w: 150 },
    { src: 'logos/s-zenni.png', w: 96 },
  ],
]

export const FOOTER_COLS = [
  { groups: [{ head: 'Spartan Races', links: ['Trail Races', 'Endurance Races', 'Kids Races', 'Volunteers', 'Results & Photos', 'Trifecta Leaderboards', 'Race for a Cause'] }, { head: 'DEKA', links: [] }] },
  { groups: [{ head: 'Train', links: ['Training Center', 'Fitness Professionals', 'Train For DEKA', 'Spartan Run Club', 'The Spartan App'] }], apps: true },
  { groups: [{ head: 'Shop', links: ["Men's", "Women's", "Kids'", 'Equipment', 'Nutrition', 'Accessories', 'Events', 'Sale', 'SGX Coaches'] }] },
  { groups: [{ head: 'Unbreakable', links: ['Race Stories', 'Training', 'Focus', 'Nutrition', 'Community'] }, { head: 'Find a Spartan Race', links: [] }, { head: 'Find a DEKA', links: [] }] },
  { groups: [{ head: 'About', links: ['The Spartan Story', 'Our Collective', 'Spartan Kids Foundation', 'Media', 'Careers', 'Partnerships', 'Virtual Swag'] }, { head: 'Help', links: ['Contact Us', 'FAQ', 'Manage Cookies', 'Shipping & Returns', 'Service Member Discounts', 'Promotional Terms'] }] },
]

// ── Checkout ──
export const WAVES = {
  sat: [
    { id: 'w10', label: '10:00AM - 10:59AM', spots: 1 },
    { id: 'w11', label: '11:00AM-11:59AM', spots: 573 },
    { id: 'w12', label: '12:00PM-12:59PM', spots: 917 },
  ],
  sun: [
    { id: 'w11', label: '11:00AM-11:59AM', spots: 402 },
    { id: 'w12', label: '12:00PM-12:59PM', spots: 655 },
  ],
}

export const CHECKOUT_ADDONS = [
  { id: 'spectator', name: 'Saturday Spectator Pass', price: 20, img: 'img/addon-spectator.jpg' },
  { id: 'foundation', name: 'Spartan Foundation', price: 3, img: 'img/addon-foundation.jpg', help: true },
  { id: 'photo', name: 'Photo Package', price: 29.99, img: 'img/addon-photo.jpg', help: true },
]

export const CHARITIES = [
  'No Thanks',
  'Spartan Kids Foundation',
  'Wounded Warrior Project',
  'American Heart Association',
  'St. Jude Children’s Research Hospital',
  'Feeding America',
]

export const REFUND_COVERS = [
  'Accident & Illness',
  'Family or home emergency',
  'Stolen documents',
  'Severe weather',
  'Transport disruptions',
]

// Shown in the Stripe Link block on the payment step (as captured in the reference).
export const LINK_ACCOUNT = { email: 'hello@girardjustin.com', card: 'Apple Card', last4: '9480' }

export const LOCATIONS = [
  { region: 'Africa', countries: [['Mauritius', ['Français', 'English']], ['South Africa', ['English']]] },
  {
    region: 'Americas',
    countries: [
      ['Brazil', ['Português', 'English']], ['Canada', ['Français', 'English']], ['Chile', ['Español', 'English']],
      ['Costa Rica', ['Español', 'English']], ['Mexico', ['Español', 'English']], ['Peru', ['Español', 'English']],
      ['United States', ['English']],
    ],
  },
  {
    region: 'Asia Pacific',
    countries: [
      ['Australia', ['English']], ['China', ['Chinese - 中文', 'English']], ['Hong Kong', ['Chinese - 中文', 'English']],
      ['India', ['English']], ['Indonesia', ['English']], ['Japan', ['Japanese - 日本語', 'English']],
      ['Malaysia', ['English']], ['New Zealand', ['English']], ['Philippines', ['English']],
      ['Singapore', ['Chinese - 中文', 'English']], ['South Korea', ['Korean - 한국어', 'English']],
      ['Taiwan', ['Chinese - 中文', 'English']], ['Thailand', ['Thai - ภาษาไทย', 'English']],
      ['Vietnam', ['Vietnamese - Tiếng Việt', 'English']],
    ],
  },
  {
    region: 'Europe',
    countries: [
      ['Andorra', ['Español', 'English']], ['Austria', ['Deutsch', 'English']], ['Belgium', ['Dutch', 'English']],
      ['Croatia', ['English', 'Hrvatski']], ['Czech Republic', ['Čeština', 'English']], ['Denmark', ['Dansk', 'English']],
      ['Finland', ['English']], ['France', ['Français', 'English']], ['Germany', ['Deutsch', 'English']],
      ['Greece', ['Greek - Ελληνικά', 'English']], ['Hungary', ['Hungarian', 'English']], ['Ireland', ['English']],
      ['Italy', ['Italiano', 'English']], ['Liechtenstein', ['Français', 'English']], ['Malta', ['Italiano', 'English']],
      ['Netherlands', ['Dutch', 'English']], ['Norway', ['Norsk', 'English']], ['Poland', ['Polski', 'English']],
      ['Portugal', ['Português', 'English']], ['Romania', ['Română', 'English']], ['Slovakia', ['Slovenčina', 'English']],
      ['Slovenia', ['Slovenščina', 'English']], ['Spain', ['Español', 'English']], ['Sweden', ['Svenska', 'English']],
      ['Switzerland', ['Deutsch', 'Français', 'English']], ['United Kingdom', ['English']],
    ],
  },
  {
    region: 'Middle East',
    countries: [['Israel', ['English']], ['Saudi Arabia', ['English']], ['United Arab Emirates', ['English']]],
  },
]
