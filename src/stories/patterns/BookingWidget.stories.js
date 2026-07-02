// BROWSE HOTELS / Booking Widget — interactive tournament booking search.
// Default is the tabs-less layout (used on the listings/results page).
// Alternate mode-selector layouts (tabs, radio) live under Explorations.
import BookingWidget from '../../components/BookingWidget.vue'

export default {
  title: 'Browse Hotels/Booking Widget',
  component: BookingWidget,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'inline-radio', options: ['reservations', 'group'] },
    tabs: { control: 'boolean' },
    modeDropdown: { control: 'boolean' },
    modeRadio: { control: 'boolean' },
  },
  parameters: { docs: { description: { component: `
## Overview
The tournament **Booking Widget** — a search bar with two flows: **Book
Reservations** (single team + dates + travelers) and **Hold Rooms for Group or
Team** (multiple teams + travelers).

The **default** is the tabs-less layout for the listings / results page. See
**Explorations** for alternate mode-selector layouts (tabs, radio buttons, and
the far-left dropdown).

**Interactive:** team search popover with **live filter** · **add-a-team modal**
with duplicate-name error · **dual-month** date range + flexible-date pills ·
travelers steppers. Flat elevation, DS tokens (Navy/PT Sans), Quasar core.
` } } },
}

/** Default — tabs-less layout (listings / results page): team + dates + travelers. */
export const Default = {
  name: 'Default (No Tabs)',
  render: () => ({ components: { BookingWidget }, template: `<div style="max-width:1000px"><booking-widget mode="reservations" :tabs="false" /></div>` }),
}

/** Dropdown selector — the flow moves into a far-left dropdown inside the field
 *  row, replacing the tabs. */
export const DropdownSelector = {
  name: 'Dropdown Selector (No Tabs)',
  render: () => ({ components: { BookingWidget }, template: `<div style="max-width:1040px"><booking-widget mode="reservations" :tabs="false" :mode-dropdown="true" /></div>` }),
}
