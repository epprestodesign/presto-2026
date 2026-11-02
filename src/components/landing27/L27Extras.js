// Small shared pieces for the concepts, kept in one module so each page can
// import what it needs: add-to-calendar links and smooth-scroll helper.
import { event } from './imex.js'

const ics = () => {
  const body = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//EventPipe//Presto concept//EN', 'BEGIN:VEVENT',
    'UID:imex-america-2027@presto-concept', 'DTSTART;VALUE=DATE:20270927', 'DTEND;VALUE=DATE:20271001',
    'SUMMARY:IMEX America 2027', `LOCATION:${event.venue}`, 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(body)
}

export const calendarLinks = [
  { label: 'Google Calendar', href: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=IMEX+America+2027&dates=20270927/20271001&location=Mandalay+Bay,+Las+Vegas' },
  { label: 'Outlook', href: 'https://outlook.live.com/calendar/0/deeplink/compose?subject=IMEX%20America%202027&startdt=2027-09-27&enddt=2027-10-01&allday=true&location=Mandalay%20Bay%2C%20Las%20Vegas' },
  { label: 'Apple / .ics', href: ics(), download: 'imex-america-2027.ics' },
]

export function scrollToId (id) {
  const el = typeof document !== 'undefined' && document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
