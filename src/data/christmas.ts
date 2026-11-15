/**
 * Christmas Chaos — event copy shared by the promo popup and /christmas-chaos.
 * Date and venue are not final yet: fill `dateLabel` / `venue` and they appear
 * automatically in the popup and on the page.
 */
export const CHRISTMAS = {
  /** Stored on every registration; the Sheet script maps it to the "Christmas Chaos" tab. */
  slug: "christmas-chaos-2026",
  href: "/christmas-chaos",
  title: "Christmas Chaos",
  tagline: "A hosted house party of games, music, food and unexpected moments.",
  /** Per-person entry, in rupees. */
  price: 2500,
  windowLabel: "7:30 PM – 1:00 AM",
  dateLabel: null as string | null, // TODO: e.g. "Sat, 20 Dec 2025"
  venue: null as string | null, // TODO: venue + area
} as const;

export const idea = {
  lead: "Christmas Chaos is a festive, hosted house party built around games, friendly competition, music, food and unexpected moments. Guests can move between tabletop games and social spaces, while a few anchor activities bring everyone together at key points in the evening.",
  note: "The experience should feel curated, not over-scheduled. Hosts guide the room, but guests should always have room to mingle, play casually or take a break.",
};

export const pillars = [
  { name: "The Welcome", text: "Arrival, festive welcome, name tags and secret missions." },
  { name: "The Gameshow", text: "Quick-fire challenges, team games and Pictionary." },
  { name: "The Suspicion", text: "Christmas Mafia and hidden missions." },
  { name: "The Feast", text: "Food, BYOB, conversations and open play." },
  { name: "After Hours", text: "Karaoke, jamming, awards and music." },
];

export const dressCode =
  "Christmas colours, ugly Christmas sweaters, Santa hats, reindeer accessories or any festive outfit. Keep it easy and fun rather than making it a strict costume requirement.";

export const touches = [
  { name: "Christmas Pass", text: "a small personalised pass or name tag with the guest’s name and a secret mission." },
  { name: "Operation Santa", text: "a hidden mission running quietly throughout the evening." },
  { name: "LostCoz Awards", text: "funny titles at the end, not just awards for winning games." },
  { name: "Memory Wall", text: "guests leave one funny observation, confession or favourite moment." },
];

export const itineraryIntro =
  "Main event window: 7:30 PM–1:00 AM. Tabletop games stay open throughout, except where the space is needed for a full-group activity.";

export const itinerary = [
  { time: "7:30–8:00 PM", title: "Doors open & welcome", note: "Welcome guests, hand out name tags and Christmas Passes, explain BYOB setup, distribute secret missions. Background Christmas playlist; tabletop games open." },
  { time: "8:00–8:40 PM", title: "Mini Challenge Hour", note: "Run 4–5 short challenges: 5 Seconds, Guess the Character, Guess the Object, Don’t Laugh and Finish the Lyrics. Keep rounds quick and award points." },
  { time: "8:40–9:15 PM", title: "Full-group Pictionary", note: "Split into 2–4 teams. Play timed rounds followed by one final round. Use festive and pop-culture prompts." },
  { time: "9:15–9:50 PM", title: "Food & social break", note: "Open food spread. BYOB and mixers available. Keep tabletop games running and let guests mingle." },
  { time: "9:50–10:35 PM", title: "Christmas Mafia", note: "One dedicated moderator. Explain roles, run the night/day rounds and build suspense with a Christmas story." },
  { time: "10:35–11:10 PM", title: "Operation Santa reveal", note: "Guests complete or attempt their secret missions. Reveal missions, let people guess who had which mission and award the best agent." },
  { time: "11:10 PM–12:00 AM", title: "Karaoke & jamming", note: "Bollywood vs Hollywood, random song roulette, duets and open mic. Keep it welcoming, not a serious singing contest." },
  { time: "12:00–12:40 AM", title: "Christmas After Hours", note: "Music, dancing, casual games, gift exchange if included, photos and relaxed social time." },
  { time: "12:40–1:00 AM", title: "Grand finale", note: "LostCoz awards, final prize distribution, group photo and closing announcement." },
];

export const registerCopy = {
  payTitle: `₹${CHRISTMAS.price.toLocaleString("en-IN")} per person`,
  formTitle: "Reserve your spot",
  formLead: "One registration per WhatsApp number. Bringing friends? Set the number of people and pay for everyone.",
};
