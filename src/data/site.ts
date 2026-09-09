/**
 * All Lostcoz marketing copy lives here so it can be edited without touching components.
 * TODO markers flag placeholders (links, e-mail, dates) to replace before launch.
 */
export const site = {
  name: "Lostcoz",
  tagline: "Card games & community nights for grown-ups.",
  description:
    "Lostcoz makes original card games and runs the nights to play them — for adults who'd rather bluff, laugh and argue across a table than scroll alone.",
  url: "https://lostcoz.com", // TODO: final domain
  email: "hello@lostcoz.com", // TODO: real inbox
  socials: [
    { label: "Instagram", href: "https://instagram.com/lostcoz" }, // TODO
    { label: "WhatsApp", href: "https://wa.me/910000000000" }, // TODO
    { label: "E-mail", href: "mailto:hello@lostcoz.com" }, // TODO
  ],
  nav: [
    { label: "Order of Dharma", href: "/order-of-dharma" },
    { label: "Events", href: "/#events" },
    { label: "Community", href: "/#community" },
    { label: "About", href: "/#about" },
  ],
  cta: { label: "Book a seat", href: "/#join" },

  hero: {
    eyebrow: "Lostcoz · card games & community nights",
    line1: "Get lost.",
    line2: "Find your people.",
    lead:
      "We make original card games and throw the nights to play them. Pull up a chair — no experience, no plus-one, no problem.",
    primary: { label: "Explore Order of Dharma", href: "/order-of-dharma" },
    secondary: { label: "Next game night", href: "/#events" },
  },

  marquee: ["Card games", "Game nights", "Tournaments", "Private tables", "Playtests", "Adults only", "Come solo"],

  about: {
    eyebrow: "What we do",
    statement: "We make card games you can't play alone — and we throw the nights to play them.",
    pillars: [
      {
        title: "Original card games",
        body: "Designed and illustrated in-house. Learn in five minutes, argue about for weeks.",
        hue: "var(--color-brand-purple)",
      },
      {
        title: "Community game nights",
        body: "Open tables, hosted by us. Come alone or bring a crew — we seat you with people you'll like.",
        hue: "var(--color-brand-orange)",
      },
      {
        title: "Events for teams & parties",
        body: "Private game nights, tournaments and launch parties, run end-to-end so you just play.",
        hue: "var(--color-brand-magenta)",
      },
    ],
  },

  featured: {
    eyebrow: "Our first title",
    title: "Order of Dharma",
    body:
      "A battle between two Clans to establish their Dharma. Outwit and eliminate the rival Clan — the catch is, you don't know your allies from your enemies.",
    facts: ["4–11 players", "55 cards", "Six phases per round", "Bluffing · deduction · betrayal"],
    cta: { label: "Explore the game", href: "/order-of-dharma" },
  },

  events: {
    eyebrow: "Events",
    title: "Nights worth leaving the house for.",
    note: "Dates drop on Instagram first — follow to get a seat before they fill.", // TODO: link to a calendar / booking page
    formats: [
      {
        num: "01",
        title: "Community Game Night",
        tag: "Weekly · open tables",
        body: "Our regular. Rotating tables, a host at each one, new faces every week. Turn up alone; leave with a group chat.",
        hue: "var(--color-brand-orange)",
      },
      {
        num: "02",
        title: "Tournament Night",
        tag: "Monthly · bracket play",
        body: "Order of Dharma, competitive. Rounds are quick, alliances are not. Bragging rights and prizes for the last Clan standing.",
        hue: "var(--color-brand-magenta)",
      },
      {
        num: "03",
        title: "Private & Corporate",
        tag: "On request · 8 to 80 people",
        body: "Team nights, birthdays, launches. We bring the decks, the hosts and the format — you bring the people.",
        hue: "var(--color-brand-cyan)",
      },
      {
        num: "04",
        title: "Playtest Lab",
        tag: "Invite · unreleased decks",
        body: "Play what we haven't printed yet. Break the rules, tell us what's boring, get your name in the rulebook.",
        hue: "var(--color-brand-purple)",
      },
    ],
  },

  how: {
    eyebrow: "How a night goes",
    steps: [
      { title: "Show up", body: "No experience needed. Grab a drink, get a seat." },
      { title: "Learn in five", body: "A host teaches the table. The first round is practice." },
      { title: "Play for keeps", body: "Rounds are quick. Alliances aren't." },
      { title: "Stay for the after-table", body: "The game ends. The night doesn't." },
    ],
  },

  community: {
    eyebrow: "Community",
    title: "Real people. Real tables.",
    body: "Lostcoz is for adults who want to socialise without the small talk. The cards do the icebreaking; you do the rest.",
    tiles: [
      { label: "18+ only", hue: "var(--color-brand-magenta)" },
      { label: "Solo-friendly", hue: "var(--color-brand-cyan)" },
      { label: "Zero experience needed", hue: "var(--color-brand-orange)" },
      { label: "Hosted, always", hue: "var(--color-brand-purple)" },
      { label: "New decks first", hue: "var(--color-brand-orange)" },
      { label: "Phones face down", hue: "var(--color-brand-cyan)" },
    ],
  },

  join: {
    title: "Ready to get lost?",
    body: "Reserve a seat at the next game night, or bring Lostcoz to your own table.",
    primary: { label: "Book a seat", href: "mailto:hello@lostcoz.com?subject=Book%20a%20seat" }, // TODO: booking link
    secondary: { label: "Follow on Instagram", href: "https://instagram.com/lostcoz" }, // TODO
  },

  footer: {
    explore: [
      { label: "Order of Dharma", href: "/order-of-dharma" },
      { label: "Events", href: "/#events" },
      { label: "Community", href: "/#community" },
      { label: "Brand & tokens", href: "/brand" },
    ],
    line: "Adults only. Play responsibly. Bluff generously.",
  },
} as const;
