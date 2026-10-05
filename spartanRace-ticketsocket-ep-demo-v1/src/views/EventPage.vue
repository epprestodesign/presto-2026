<script setup>
import { ref, computed } from 'vue'
import {
  EVENT, ABOUT, DISTANCE_TABS, OBSTACLES, EARN, RACE_DAY_INFO, TESTIMONIALS, NEARBY, asset,
} from '../data.js'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import TicketWidget from '../components/TicketWidget.vue'

// gallery — 1 large + 4 thumbs, arrows page through the set
const active = ref(0)
const start = ref(0)
const thumbs = computed(() => [0, 1, 2, 3].map((i) => (start.value + i) % EVENT.gallery.length))
const stepGallery = (d) => {
  const n = EVENT.gallery.length
  active.value = (active.value + d + n) % n
  if (!thumbs.value.includes(active.value)) start.value = d > 0 ? (active.value - 3 + n) % n : active.value
}

const tab = ref('Sprint')
const openInfo = ref(null)
const showAllReviews = ref(false)
const expanded = ref({})
const reviews = computed(() => (showAllReviews.value ? TESTIMONIALS : TESTIMONIALS.slice(0, 6)))

const obstacleRail = ref(null)
const earnRail = ref(null)
</script>

<template>
  <div class="ep">
    <SiteHeader variant="event" />

    <main>
      <!-- ── hero: info + ticket widget | gallery ── -->
      <section class="hero wrap">
        <div class="hero__left">
          <p class="hero__date">{{ EVENT.dates }}</p>
          <h1 class="hero__title">{{ EVENT.title }}</h1>
          <a class="hero__addr" href="#where">{{ EVENT.address }}</a>
          <a class="rating" href="#reviews">
            <span class="rating__pill">
              <svg viewBox="0 0 15 15" width="15" height="15" aria-hidden="true"><path d="M7.5.5 9.2 5.7h5.4l-4.4 3.2 1.7 5.2-4.4-3.2-4.4 3.2 1.7-5.2L.4 5.7h5.4Z" fill="#fff" /></svg>
              {{ EVENT.rating }}
            </span>
            <span class="rating__text">· {{ EVENT.testimonials }} Racer Testimonials</span>
          </a>
          <ul class="feats">
            <li v-for="f in EVENT.features" :key="f.title" class="feat">
              <img :src="asset(f.icon)" alt="" />
              <div>
                <p class="feat__title">{{ f.title }}</p>
                <p class="feat__body">{{ f.body }}</p>
              </div>
            </li>
          </ul>
          <hr class="hero__rule" />
          <TicketWidget />
        </div>

        <div class="hero__right">
          <div class="gal">
            <img class="gal__main" :src="asset(EVENT.gallery[active])" alt="Spartan racer climbing the slip wall" />
            <div class="gal__thumbs">
              <button
                v-for="i in thumbs"
                :key="i"
                class="gal__thumb"
                :class="{ 'is-active': i === active }"
                :aria-label="`Show photo ${i + 1}`"
                @click="active = i"
              >
                <img :src="asset(EVENT.gallery[i])" alt="" />
              </button>
              <button class="gal__arrow gal__arrow--l" aria-label="Previous photo" @click="stepGallery(-1)">
                <svg viewBox="0 0 24 24" width="20" height="20"><path d="M15 5l-7 7 7 7" fill="none" stroke="#000" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </button>
              <button class="gal__arrow gal__arrow--r" aria-label="Next photo" @click="stepGallery(1)">
                <svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 5l7 7-7 7" fill="none" stroke="#000" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ── about ── -->
      <section class="about wrap">
        <h2 class="h2">About The Event</h2>
        <p class="about__p">{{ ABOUT }}</p>
        <div class="about__logos">
          <img :src="asset('logos/spartan-sa-govx.png')" alt="Spartan San Antonio presented by GovX" class="about__sa" />
          <img :src="asset('logos/honor-tour.png')" alt="Spartan 2026 Honor Tour" class="about__honor" />
        </div>
      </section>

      <!-- ── race distances ── -->
      <section class="dist wrap">
        <h2 class="h2">Race Distances</h2>
        <div class="tabs" role="tablist">
          <button
            v-for="t in DISTANCE_TABS"
            :key="t"
            role="tab"
            class="tabs__tab"
            :class="{ 'is-active': tab === t }"
            :aria-selected="tab === t"
            @click="tab = t"
          >{{ t }}</button>
        </div>
        <div class="dist__head">
          <h3 class="dist__name t-cond">The {{ tab === 'Kids Race' ? 'Kids Race' : tab }}</h3>
          <dl class="stats">
            <div><dt>Distance</dt><dd>5<small>km</small></dd></div>
            <div><dt>Obstacles</dt><dd>20</dd></div>
            <div><dt>Avg duration</dt><dd>1<small>h</small> 32<small>m</small> 12<small>s</small></dd></div>
          </dl>
        </div>
      </section>
      <div ref="obstacleRail" class="rail">
        <article v-for="o in OBSTACLES" :key="o.img" class="tile">
          <img :src="asset(o.img)" alt="" />
          <div v-if="o.hero" class="tile__hero">
            <span class="t-wide tile__5k">5K</span>
            <span class="t-cond tile__count">20 Obstacles</span>
          </div>
          <div v-else class="tile__label">
            <span class="tile__kind">{{ o.kind }}</span>
            <span class="t-cond tile__name">{{ o.name }}</span>
          </div>
          <button class="plus" :aria-label="o.hero ? 'About the Sprint' : `About ${o.name}`">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 5v14M5 12h14" stroke="#000" stroke-width="2.6" stroke-linecap="round" /></svg>
          </button>
        </article>
      </div>

      <!-- ── what you earn ── -->
      <section class="earn">
        <h2 class="h2 earn__h">What You Earn</h2>
        <div ref="earnRail" class="rail rail--earn">
          <article v-for="e in EARN" :key="e.name" class="tile tile--sq">
            <img :src="asset(e.img)" alt="" />
            <div class="tile__label tile__label--earn">
              <span class="t-cond tile__name">{{ e.name }}</span>
            </div>
            <button class="plus" :aria-label="`About the ${e.name}`">
              <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 5v14M5 12h14" stroke="#000" stroke-width="2.6" stroke-linecap="round" /></svg>
            </button>
          </article>
        </div>
      </section>

      <!-- ── race day info ── -->
      <section class="info wrap">
        <h2 class="h2">Race Day Info</h2>
        <ul class="acc">
          <li v-for="(q, i) in RACE_DAY_INFO" :key="q" class="acc__item">
            <button class="acc__btn" :aria-expanded="openInfo === i" @click="openInfo = openInfo === i ? null : i">
              {{ q }}
              <svg viewBox="0 0 20 20" width="19" height="19" aria-hidden="true">
                <path d="M10 1v18" stroke="#555" stroke-width="1.6" :style="{ opacity: openInfo === i ? 0 : 1 }" />
                <path d="M1 10h18" stroke="#555" stroke-width="1.6" />
              </svg>
            </button>
            <p v-if="openInfo === i" class="acc__body">
              Details for “{{ q }}” are published in the race-day program closer to the event. Check back the week of the race for heat times, parking and packet pickup.
            </p>
          </li>
        </ul>
      </section>

      <!-- ── where you'll race ── -->
      <section id="where" class="where wrap">
        <h2 class="h2">Where You'll Race</h2>
        <div class="where__row">
          <a class="where__addr" href="#" @click.prevent>{{ EVENT.address }}</a>
          <a class="pill pill--black where__map" href="#" @click.prevent>
            <svg viewBox="0 0 18 18" width="17" height="17" aria-hidden="true"><path fill="#fff" d="M17.0596 2.92353L12.9821 0.964844L9 2.74145L5.16802 0.964844L0.375 3.17638L0.375 17.0354L5.16667 14.8164L9.00135 16.4898L12.8333 14.8164C14.4139 15.5253 17.625 16.8879 17.625 16.8879V3.17638L17.0596 2.92353ZM6.125 3.55603L8.04167 4.40895V13.9923L6.125 13.1394V3.55603ZM15.7083 14.0019L13.7917 13.1489V3.56561L15.7083 4.41853V14.0019Z" /></svg>View map
          </a>
        </div>
        <img class="where__img" :src="asset('img/course-map.jpg')" alt="Sandy Oaks Ranch course map" />
        <p class="where__cap">Course maps are subject to change depending on conditions.</p>
      </section>

      <!-- ── testimonials ── -->
      <section id="reviews" class="reviews wrap">
        <h2 class="reviews__h">
          <svg viewBox="0 0 15 15" width="30" height="30" aria-hidden="true"><path d="M7.5.5 9.2 5.7h5.4l-4.4 3.2 1.7 5.2-4.4-3.2-4.4 3.2 1.7-5.2L.4 5.7h5.4Z" fill="var(--green-rating)" /></svg>
          <span class="reviews__score">{{ EVENT.rating }}</span>
          <span>• {{ EVENT.testimonials }} Racer Testimonials</span>
        </h2>
        <div class="reviews__grid">
          <article v-for="(r, i) in reviews" :key="r.name" class="rev">
            <div class="rev__head">
              <span class="rev__avatar" :class="{ 'rev__avatar--spartan': r.avatar }">
                <span v-if="r.avatar" class="rev__logo" :style="{ '--logo': `url(${asset('icons/spartan-logo.svg')})` }" />
              </span>
              <div>
                <p class="rev__name">{{ r.name }}</p>
                <p class="rev__meta">
                  Participated In 2025
                  <span class="rev__stars" :aria-label="`${r.stars} of 5 stars`">
                    <span v-for="n in 5" :key="n" :class="{ off: n > r.stars }">★</span>
                  </span>
                </p>
              </div>
            </div>
            <p class="rev__body" :class="{ 'rev__body--clamp': r.more && !expanded[i] }">{{ r.body }}</p>
            <button v-if="r.more && !expanded[i]" class="rev__more" @click="expanded[i] = true">More</button>
          </article>
        </div>
        <button class="pill pill--outline reviews__more" @click="showAllReviews = !showAllReviews">Show more</button>
      </section>

      <!-- ── events nearby ── -->
      <section class="nearby wrap">
        <div class="nearby__head">
          <h2 class="t-wide nearby__h">Events Nearby</h2>
          <a class="pill pill--outline nearby__see" href="#" @click.prevent>See more</a>
        </div>
        <div class="nearby__grid">
          <article v-for="n in NEARBY" :key="n.title" class="ev">
            <div class="ev__img">
              <img :src="asset(n.img)" alt="" />
              <p class="ev__date"><span v-for="d in n.date" :key="d">{{ d }}</span></p>
            </div>
            <div class="ev__body">
              <h3 class="ev__title">{{ n.title }}</h3>
              <div class="ev__row">
                <div>
                  <p class="ev__meta">{{ n.meta }}</p>
                  <p class="ev__city"><img :src="asset('icons/pin.svg')" alt="" />{{ n.city }}</p>
                </div>
                <a class="pill pill--red ev__cta" href="#" @click.prevent>Sign up</a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- ── teams / apparel / discounts / partners ── -->
      <section class="promos wrap">
        <div class="promo-b">
          <h3>Run as a Team</h3>
          <p>Racing as a team is the ONLY way to lock in the same start time as your friends, plus you'll unlock major savings. Purchase your tickets together, or use your personalized referral link after purchasing your ticket.</p>
          <a class="pill pill--red" href="#" @click.prevent>Learn more</a>
        </div>
        <div class="promo-b">
          <h3>Design Custom Team Apparel</h3>
          <p>Unleash your inner Spartan with Pressio and design custom, high-performance team gear built to conquer our toughest courses. Forge your team's identity and dominate the course in apparel as resilient as you are.</p>
          <a class="pill pill--red" href="#" @click.prevent>Shop now</a>
        </div>
        <div class="promo-b">
          <h3>Service Member Discount</h3>
          <p>We are proud to offer up to 25% off to US Military, US Law Enforcement, US Firefighters &amp; First responders (EMT, EMS, Paramedics, Nurses, Hospital Doctors) &amp; US government employees. Verify your affiliation via GOVX to receive discount.</p>
          <a class="pill pill--black" href="#" @click.prevent>Verify ID with GovX</a>
        </div>
        <div class="promo-b">
          <h3>Supporting Partners</h3>
          <div class="partners">
            <img :src="asset('logos/maptrition-black.png')" alt="MAPtrition" class="partners__map" />
            <img :src="asset('logos/mio.png')" alt="mio" class="partners__mio" />
            <img :src="asset('logos/flex-blue.png')" alt="Flex" class="partners__flex" />
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
.wrap { padding: 0 40px; }

/* ── hero ── */
.hero { display: flex; gap: 48px; padding-top: 48px; }
.hero__left { width: 632px; flex: none; }
.hero__right { flex: 1; }
.hero__date { font-size: 15.3px; font-weight: 500; line-height: 19px; color: var(--ink); }
.hero__title {
  margin-top: 14px;
  font-size: 35.4px;
  font-weight: 700;
  line-height: 36px;
  color: var(--ink);
}
.hero__addr {
  display: inline-block;
  margin-top: 18px;
  font-size: 15.4px;
  font-weight: 500;
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.rating { display: flex; align-items: center; gap: 4px; margin-top: 26px; text-decoration: none; }
.rating__pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 7px 0 6px;
  border-radius: 11px;
  background: var(--green-rating);
  color: #fff;
  font-size: 13.8px;
  font-weight: 500;
}
.rating__pill svg { width: 13px; height: 13px; }
.rating__text { font-size: 13.8px; font-weight: 500; color: #000; }

.feats { margin-top: 34px; }
.feat { display: flex; gap: 8px; }
.feat + .feat { margin-top: 23px; }
.feat img { width: 24px; height: 24px; margin-top: -2px; flex: none; }
.feat__title { font-size: 15.9px; font-weight: 700; line-height: 20px; color: var(--ink); }
.feat__body { margin-top: 2px; font-size: 14px; font-weight: 400; line-height: 20.2px; color: var(--ink); }

.hero__rule { margin: 40px 0 0; border: 0; border-top: 1.5px solid var(--grey-200); }

/* gallery */
.gal__main { width: 100%; height: 380px; object-fit: cover; border-radius: 4px; }
.gal__thumbs { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px; }
.gal__thumb { position: relative; height: 99px; line-height: 0; overflow: hidden; border-radius: 3px; }
.gal__thumb img { width: 100%; height: 100%; object-fit: cover; }
.gal__thumb::after { content: ''; position: absolute; inset: 0; background: rgba(255, 255, 255, 0.38); transition: background 0.15s; }
.gal__thumb.is-active::after, .gal__thumb:hover::after { background: transparent; }
.gal__arrow {
  position: absolute;
  top: 33px;
  width: 33px;
  height: 33px;
  border-radius: 50%;
  background: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
}
.gal__arrow--l { left: 11px; }
.gal__arrow--r { right: 11px; }

/* ── shared headings ── */
.h2 { font-size: 35.9px; font-weight: 700; line-height: 43px; color: #000; }

/* ── about ── */
.about { margin-top: 87px; }
.about__p { margin-top: 14px; max-width: 562px; font-size: 16px; font-weight: 500; line-height: 21.8px; color: #000; }
.about__logos { display: flex; align-items: flex-start; gap: 27px; margin-top: 55px; }
.about__sa { width: 266px; }
.about__honor { width: 261px; margin-top: 3px; }

/* ── distances ── */
.dist { margin-top: 111.5px; }
.tabs { display: flex; gap: 40px; margin-top: 24.5px; border-bottom: 1px solid #c8c8c8; }
.tabs__tab {
  position: relative;
  padding-bottom: 17px;
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  text-transform: uppercase;
  color: var(--grey-600);
}
.tabs__tab.is-active { color: #000; }
.tabs__tab.is-active::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 4px; background: #000; }
.dist__head { display: flex; align-items: flex-end; justify-content: space-between; margin-top: 31.5px; }
.dist__name { font-size: 135.5px; line-height: 150px; color: #000; transform: scaleX(0.86); }
.stats { display: flex; margin: 0 0 20px; }
.stats > div { padding: 0 49px; border-left: 1px solid #c8c8c8; }
.stats > div:first-child { border-left: 0; padding-left: 0; }
.stats > div:last-child { padding-right: 2px; }
.stats dt { font-size: 23.7px; font-weight: 600; line-height: 28px; color: var(--grey-600); text-transform: uppercase; white-space: nowrap; }
.stats dd { margin: 6px 0 0; font-size: 36px; font-weight: 700; line-height: 38px; color: #000; white-space: nowrap; }
.stats small { margin-left: 3px; font-size: 18px; text-transform: uppercase; }

/* ── rails ── */
.rail {
  display: flex;
  gap: 20px;
  margin: 0 40px 0 0;
  padding: 0 0 0 80px;
  overflow-x: auto;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 80px;
}
.rail::-webkit-scrollbar { display: none; }
.dist + .rail { margin-top: 32.5px; }
.tile {
  position: relative;
  flex: none;
  width: 440px;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  scroll-snap-align: start;
  background: #222;
}
.tile--sq { width: 400px; }
.tile > img { width: 100%; height: 100%; object-fit: cover; }
.tile::before {
  content: '';
  position: absolute;
  inset: 45% 0 0;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.45));
  pointer-events: none;
}
.tile:first-child::before { display: none; }
.tile__hero { position: absolute; left: 27px; bottom: 25px; color: #fff; }
.tile__5k { display: block; font-size: 95px; line-height: 0.8; letter-spacing: -0.02em; }
.tile__count { display: block; margin-top: 18px; font-size: 53.5px; line-height: 0.9; }
.tile__label { position: absolute; left: 24px; bottom: 26px; color: #fff; }
.tile__kind { display: block; font-size: 20px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; }
.tile__name { display: block; margin-top: 6px; font-size: 53.5px; line-height: 0.9; transform: scaleX(0.83); }
.tile__label--earn { left: 24px; bottom: 30px; }
.plus {
  position: absolute;
  right: 25px;
  bottom: 24px;
  width: 43px;
  height: 43px;
  border-radius: 50%;
  background: #fff;
  display: grid;
  place-items: center;
}

/* ── earn ── */
.earn { margin-top: 62.5px; }
.earn__h { padding-left: 80px; }
.rail--earn { margin-top: 30px; }

/* ── race day info ── */
.info { margin-top: 95px; }
.acc { width: 680px; margin-top: 13px; }
.acc__item { border-bottom: 1.5px solid #d0d0d0; }
.acc__btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 73px;
  font-size: 16px;
  font-weight: 500;
  color: #000;
  text-align: left;
}
.acc__body { padding: 0 40px 22px 0; font-size: 15px; line-height: 1.5; color: #444; }

/* ── where ── */
.where { margin-top: 63px; }
.where__row { display: flex; align-items: center; justify-content: space-between; margin-top: 11px; }
.where__addr { font-size: 15.4px; font-weight: 500; color: #000; text-decoration: underline; text-underline-offset: 2px; }
.where__map { gap: 10px; height: 43px; padding: 0 24px 0 22px; font-size: 14.5px; letter-spacing: 0.16em; }

.where__img { width: 100%; height: 541px; margin-top: 43px; object-fit: cover; border-radius: 8px; }
.where__cap { margin-top: 9px; font-size: 11.9px; font-style: italic; font-weight: 500; color: #000; }

/* ── reviews ── */
.reviews { margin-top: 105px; }
.reviews::before { content: ''; display: block; height: 1px; margin-bottom: 52px; background: var(--grey-200); }
.reviews__h { display: flex; align-items: center; gap: 8px; font-size: 24.1px; font-weight: 700; color: #000; }
.reviews__score { color: var(--green-rating); margin-left: 2px; }
.reviews__grid { display: grid; grid-template-columns: 1fr 1fr; row-gap: 25px; margin-top: 47px; }
.rev:nth-child(odd) { padding-right: 38px; }
.rev:nth-child(even) { padding-left: 38px; }
.rev__head { display: flex; align-items: center; gap: 8px; }
.rev__avatar { width: 40px; height: 40px; flex: none; border-radius: 50%; border: 1px solid #e6e6e6; background: #fafafa; overflow: hidden; }
.rev__avatar--spartan { border: 0; background: #fff; }
.rev__logo { display: block; width: 40px; height: 40px; background: var(--red-badge); -webkit-mask: var(--logo) center / contain no-repeat; mask: var(--logo) center / contain no-repeat; }
.rev__name { font-size: 16px; font-weight: 700; line-height: 20px; color: #222; }
.rev__meta { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 500; color: #222; }
.rev__stars { color: var(--green-rating); font-size: 12px; letter-spacing: 0.5px; }
.rev__stars .off { color: #b8b8b8; }
.rev__body { margin-top: 14px; font-size: 16px; font-weight: 500; line-height: 24px; color: #222; }
.rev__body--clamp { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rev__more { margin-top: 2px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #000; }
.reviews__more { margin-top: 22px; width: 147px; height: 46px; font-size: 14px; letter-spacing: 0.02em; border-width: 1.5px; }

/* ── nearby ── */
.nearby { margin-top: 56px; }
.nearby__head { display: flex; align-items: center; justify-content: space-between; }
.nearby__h { font-size: 31.2px; color: #000; }
.nearby__see { width: 119px; height: 40px; font-size: 12.5px; letter-spacing: 0.04em; }
.nearby__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 25px; }
.ev { background: var(--grey-100); }
.ev__img { position: relative; height: 243px; }
.ev__img img { width: 100%; height: 100%; object-fit: cover; }
.ev__date {
  position: absolute;
  top: 0;
  left: 0;
  width: 90px;
  height: 90px;
  padding: 19px 0 0 20px;
  background: #000;
  color: #fff;
  font-size: 14.5px;
  font-weight: 700;
  line-height: 17px;
  text-transform: uppercase;
}
.ev__date span { display: block; }
.ev__body { height: 216px; padding: 24px 24px 0 24px; }
.ev__title { font-size: 26px; font-weight: 700; line-height: 29.5px; color: #000; }
.ev__row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 16px; }
.ev__meta { font-size: 12px; font-weight: 700; line-height: 15px; text-transform: uppercase; color: #000; max-width: 190px; }
.ev__city { display: flex; align-items: center; gap: 6px; margin-top: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #000; }
.ev__city img { width: 9px; height: 13px; }
.ev__cta { width: 105px; height: 40px; flex: none; font-size: 13px; letter-spacing: 0.04em; }

/* ── promos ── */
.promos { display: grid; grid-template-columns: 1fr 1fr; column-gap: 24px; margin-top: 109px; padding-bottom: 162px; }
.promo-b { border-top: 1.5px solid #c8c8c8; padding-top: 18px; }
.promo-b:nth-child(n + 3) { margin-top: 68px; }
.promo-b h3 { font-size: 21.9px; font-weight: 700; line-height: 26px; color: #000; }
.promo-b p { margin-top: 38.5px; font-size: 16px; font-weight: 500; line-height: 22px; color: #000; }
.promo-b:nth-child(n + 3) p { margin-top: 37px; }
.promo-b .pill { margin-top: 22px; height: 40px; padding: 0 24px; font-size: 12.6px; letter-spacing: 0.04em; }
.partners { display: flex; align-items: center; justify-content: space-between; padding: 40px 10px 0 18px; }
.partners__map { width: 185px; }
.partners__mio { width: 187px; }
.partners__flex { width: 189px; margin-top: 10px; }
</style>
