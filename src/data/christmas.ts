/**
 * Christmas Chaos — event copy shared by the promo popup and /christmas-chaos.
 * Date, city and the six activities come from the promo video. Only the city is
 * set for the venue so far; add the exact place to `venue` when it is confirmed.
 */
export const CHRISTMAS = {
  /** Stored on every registration; the Sheet script maps it to the "Christmas Chaos" tab. */
  slug: "christmas-chaos-2026",
  href: "/christmas-chaos",
  title: "Christmas Chaos",
  tagline: "A hosted house party of games, music, food and unexpected moments.",
  /** Per-person entry, in rupees. */
  price: 2500,
  /** Per-person entry when exactly two register together (a couple), in rupees. */
  couplePrice: 1999,
  windowLabel: "6 PM onwards",
  dateLabel: "25 Dec" as string | null,
  venue: "Gurgaon" as string | null, // TODO: add the exact venue once confirmed
  seats: 30,
} as const;

/** The six things happening on the night. Taglines are from the promo video. */
export const activities = [
  { key: "deduction", image: "/photos/lostcoz-team.jpg", name: "Social", accent: "Deduction", tagline: "Lie. Bluff. Trust no one.", text: "Christmas Mafia with one dedicated moderator: secret roles, night and day rounds, and a Christmas story to build the suspense." },
  { key: "tabletop", image: "/photos/lostcoz-gamenight.jpg", name: "Tabletop", accent: "Games", tagline: "Every move is being watched.", text: "Board and card games stay open all night. Jump in casually, find a table, or take a break." },
  { key: "food", image: "/photos/community-phones.jpg", name: "Food", accent: "", tagline: "The only thing you can trust.", text: "An open food spread with BYOB and mixers. Eat, mingle and keep the games running." },
  { key: "challenges", image: "/photos/community-learn.jpg", name: "Mini", accent: "Challenges", tagline: "The clock is already ticking.", text: "Quick-fire rounds: 5 Seconds, Guess the Character, Guess the Object, Don’t Laugh and Finish the Lyrics." },
  { key: "group", image: "/photos/pillar-events-team.jpg", name: "Group", accent: "Activity", tagline: "Everyone’s in. No one’s safe.", text: "Team Pictionary with festive prompts, plus Operation Santa: secret missions you complete and reveal." },
  { key: "jam", image: "/photos/christmas-santa.jpg", name: "Jamming", accent: "Session", tagline: "Survive the night. Then sing.", text: "Karaoke, song roulette, duets and open mic, then the LostCoz Awards to close the night." },
] as const;

export const dressCode =
  "Christmas colours, ugly Christmas sweaters, Santa hats, reindeer accessories or any festive outfit. Keep it easy and fun rather than making it a strict costume requirement.";

export const touches = [
  { name: "Christmas Pass", text: "a small personalised pass or name tag with the guest’s name and a secret mission." },
  { name: "Operation Santa", text: "a hidden mission running quietly throughout the evening." },
  { name: "LostCoz Awards", text: "funny titles at the end, not just awards for winning games." },
  { name: "Memory Wall", text: "guests leave one funny observation, confession or favourite moment." },
];

export const registerCopy = {
  payTitle: `₹${CHRISTMAS.price.toLocaleString("en-IN")} per person · ₹${CHRISTMAS.couplePrice.toLocaleString("en-IN")} each for couples`,
  formTitle: "Reserve your spot",
  formLead: "One registration per WhatsApp number. Bringing friends? Set the number of people and pay for everyone.",
};
