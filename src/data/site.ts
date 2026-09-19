/**
 * All Lostcoz marketing copy lives here so it can be edited without touching components.
 * Every URL comes from `@/data/links` — do not hard-code destinations in this file.
 */
import { links, contact, mailTo } from "@/data/links";

export const site = {
  name: "Lostcoz",
  tagline: "Card games & community nights for grown-ups.",
  description:
    "Lostcoz makes original card games and runs the nights to play them, for humans who'd rather bluff, laugh and argue across a table than scroll alone.",
  url: "https://lostcoz.com", // TODO: final domain
  email: contact.email,
  phone: contact.phoneDisplay,
  socials: [
    { label: "Instagram", href: links.instagram },
    { label: "YouTube", href: links.youtube },
    { label: "WhatsApp", href: links.whatsappCommunity },
    // Hidden for now — re-enable to show E-mail in the footer and the mobile menu.
    // { label: "E-mail", href: mailTo("Hello Lostcoz") },
  ],
  nav: [
    { label: "Order of Dharma", href: "/order-of-dharma" },
    { label: "Events", href: "/#events" },
    { label: "Community", href: "/#community" },
    { label: "About", href: "/#about" },
  ],
  cta: { label: "Join a game night", href: links.whatsappCommunity },

  hero: {
    eyebrow: "Lostcoz · card games & community nights",
    line1: "Get lost.",
    line2: "Find your people.",
    lead:
      "We make original card games and throw the nights to play them. Pull up a chair. No experience, no plus-one, no problem.",
    primary: { label: "Explore Order of Dharma", href: "/order-of-dharma" },
    secondary: { label: "Next game night", href: links.whatsappCommunity },
  },

  marquee: ["Card games", "Game nights", "Tournaments", "Private tables", "Come solo"],

  about: {
    eyebrow: "What we do",
    statement: "We make card games you can't play alone, and we throw the nights to play them.",
    pillars: [
      {
        title: "Original card games",
        body: "Designed and illustrated in-house. Learn in five minutes, argue about for weeks.",
        hue: "var(--color-brand-purple)",
        image: "/photos/pillar-games.jpg",
        href: "/order-of-dharma",
        cta: "Explore Order of Dharma",
      },
      {
        title: "Community game nights",
        body: "Open tables, hosted by us. Come alone or bring a crew. We seat you with people you'll like.",
        hue: "var(--color-brand-orange)",
        image: "/photos/lostcoz-gamenight.jpg",
        href: links.whatsappCommunity,
        cta: "Join on WhatsApp",
      },
      {
        title: "Events for teams & parties",
        body: "Private game nights, tournaments and launch parties, run end-to-end so you just play.",
        hue: "var(--color-brand-magenta)",
        image: "/photos/pillar-events.jpg",
        href: mailTo("Team / party event enquiry"),
        cta: "lostcozgames@gmail.com",
        secondary: { label: contact.phoneDisplay, href: links.tel },
      },
    ],
  },

  featured: {
    eyebrow: "Our first creation",
    title: "Order of Dharma",
    body:
      "A battle between two Clans to establish their Dharma. Outwit and eliminate the rival Clan. The catch is, you don't know your allies from your enemies.",
    facts: ["4–11 players", "55 cards", "Six phases per round", "Bluffing · deduction · betrayal"],
    cta: { label: "Explore the game", href: "/order-of-dharma" },
    buy: { label: "Buy the game", href: links.prebook },
  },

  events: {
    eyebrow: "Events",
    title: "Nights worth leaving the house for.",
    note: "Dates drop on Instagram first, so follow to get a seat before they fill.",
    cta: { label: "Join on WhatsApp", href: links.whatsappCommunity },
    contact: { label: "Email us", href: mailTo("Lostcoz events") }, // TODO: link to a calendar / booking page
    formats: [
      {
        num: "01",
        title: "Community Game Night",
        tag: "Weekly · open tables",
        body: "Our regular. Rotating tables, a host at each one, new faces every week. Turn up alone; leave with a group chat.",
        hue: "var(--color-brand-orange)",
        cta: { label: "Join on WhatsApp", href: links.whatsappCommunity },
      },
      {
        num: "02",
        title: "Tournament Night",
        tag: "Monthly · bracket play",
        body: "Our games, played competitively. Rounds are quick, alliances are not. Bragging rights and prizes for whoever is left standing.",
        hue: "var(--color-brand-magenta)",
        cta: { label: "Join on WhatsApp", href: links.whatsappCommunity },
      },
      {
        num: "03",
        title: "Private & Corporate",
        tag: "On request · 8 to 80 people",
        body: "Team nights, birthdays, launches. We bring the decks, the hosts and the format. You bring the people.",
        hue: "var(--color-brand-cyan)",
        cta: { label: "Enquire by e-mail", href: mailTo("Private / corporate game night", "Hi Lostcoz,\n\nI'd like to enquire about a private event.\n\nDate:\nHeadcount:\nCity:\n") },
        secondary: { label: contact.phoneDisplay, href: links.tel },
      },
      {
        /* Playtest Lab is invite-only and not bookable yet: rendered as a
           non-interactive "coming soon" panel (see Events.tsx). */
        num: "04",
        title: "Playtest Lab",
        tag: "Coming soon · invite only",
        body: "Play what we haven't printed yet. Break the rules, tell us what's boring, get your name in the rulebook.",
        hue: "var(--color-brand-purple)",
        comingSoon: true,
      },
    ],
  },

  how: {
    eyebrow: "How a night goes · four steps",
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
    body: "Lostcoz is for humans who want to socialise without the small talk. The cards do the icebreaking; you do the rest.",
    tiles: [
      { label: "Solo-friendly", hue: "var(--color-brand-cyan)", image: "/photos/community-solo.jpg" },
      { label: "Zero experience needed", hue: "var(--color-brand-orange)", image: "/photos/community-learn.jpg" },
      { label: "Hosted, always", hue: "var(--color-brand-purple)", image: "/photos/lostcoz-team.jpg" },
      { label: "New decks first", hue: "var(--color-brand-orange)", image: "/photos/community-decks.jpg" },
      { label: "Phones face down", hue: "var(--color-brand-cyan)", image: "/photos/community-phones.jpg" },
    ],
  },

  join: {
    title: "Ready to get lost?",
    body: "Reserve a seat at the next game night, or bring Lostcoz to your own table.",
    primary: { label: "Join the community", href: links.whatsappCommunity },
    secondary: { label: "Follow on Instagram", href: links.instagram },
  },

  footer: {
    explore: [
      { label: "Order of Dharma", href: "/order-of-dharma" },
      { label: "Events", href: "/#events" },
      { label: "Community", href: "/#community" },
    ],
    line: "Play responsibly. Bluff generously.",
  },
} as const;
