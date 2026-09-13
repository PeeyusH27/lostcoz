/**
 * Every outbound destination on the site, in one place.
 *
 * Anything marked TODO is still a placeholder — swap the value here and it updates
 * everywhere it is used. Nothing else in the codebase should hard-code a URL.
 */

/** Public inbox and phone — used by the events / private-booking CTAs. */
export const contact = {
  email: "lostcozgames@gmail.com",
  phoneDisplay: "+91 99877 62539",
  /** E.164, for tel: and wa.me links. */
  phone: "919987762539",
} as const;

/** Pre-filled mailto: for a given subject line. */
export const mailTo = (subject: string, body?: string) =>
  `mailto:${contact.email}?subject=${encodeURIComponent(subject)}` +
  (body ? `&body=${encodeURIComponent(body)}` : "");

export const links = {
  /** WhatsApp community invite — every "join / game night" CTA points here. */
  whatsappCommunity: "https://chat.whatsapp.com/EOBqX2BWmhgEgxXY0LXkcr?mode=gi_t",

  /** Direct chat with the organisers (private events, corporate enquiries). */
  whatsappDirect: `https://wa.me/${contact.phone}`,

  instagram: "https://instagram.com/lostcoz", // TODO: confirm the real handle
  youtube: "https://www.youtube.com/@lostcoz", // TODO: confirm the real channel URL

  /** Storefront for buying a deck. */
  shiprocket: "https://lostcoz.shiprocket.co", // TODO: real Shiprocket checkout URL

  /** Latest video — shown in the "Latest video" section on the home page. */
  latestVideo: {
    id: "_DI90ASy5uI",
    url: "https://youtu.be/_DI90ASy5uI",
    title: "Game night at Lostcoz", // TODO: use the real video title
  },

  /**
   * How-to-play video for Order of Dharma. Until it is published this is null and
   * the card art falls back to the "explore the cards" destination instead.
   */
  oodHowToVideo: null as string | null, // TODO: set to the YouTube URL when it is live

  tel: `tel:+${contact.phone}`,
  email: mailTo("Hello Lostcoz"),
} as const;

/** youtube.com/watch opens the native app on mobile when it is installed. */
export const youtubeWatch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
