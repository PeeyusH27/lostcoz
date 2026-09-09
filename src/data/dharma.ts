/**
 * Order of Dharma — game content. Rules text is transcribed from
 * "01 Rules & Know your cards V1.7" (design-source/). Edit here, not in components.
 */
export type Img = { src: string; w: number; h: number };

export const backs = {
  clan: { src: "/cards/backs/clan-back.jpg", w: 1080, h: 1680, small: "/cards/backs/clan-back-540.jpg", title: "Clan card back", blurb: "Sun and moon on emerald — Surya and Chandra share one back so nobody can tell the Clans apart." },
  ability: { src: "/cards/backs/ability-back.jpg", w: 1080, h: 1680, small: "/cards/backs/ability-back-540.jpg", title: "Ability card back", blurb: "Sword and shield on crimson. Thirty-three of these are shuffled every round." },
  eliminated: { src: "/cards/backs/eliminated-back.jpg", w: 1080, h: 1680, small: "/cards/backs/eliminated-back-540.jpg", title: "Eliminated", blurb: "The back of your Phases card. Three claw marks — flip to this side when you've been killed." },
  phases: { src: "/cards/backs/phases-face.jpg", w: 1080, h: 1680, small: "/cards/backs/phases-face-540.jpg", title: "Phases card", blurb: "Face-up in front of every player: the six phases in play order." },
} as const;

export const facts = [
  { label: "Players", value: "4–11" },
  { label: "Cards", value: "55" },
  { label: "Clans", value: "2 + 1" },
  { label: "Phases", value: "6" },
  { label: "To win", value: "Stage 5" },
];

export type Phase = { id: string; num: number; name: string; tagline: string; summary: string; cards: string; color: string; pos: { x: number; y: number } };
export const phases: Phase[] = [
  { id: "drishti", num: 1, name: "Drishti", tagline: "See beyond perception", summary: "Peek. Saadhak lets you look at another player's Clan card; Tapasvi shows you their Clan card and one Ability card.", cards: "8 cards · Saadhak 1–4 · Tapasvi 5–8", color: "var(--color-dharma-phase-drishti)", pos: { x: 50, y: 36.5 } },
  { id: "dyut", num: 2, name: "Dyut", tagline: "Embrace the flow", summary: "Gamble on a guess. Name a player's Clan: an opponent guessed right loses their rank in Nirnay; a higher-ranked ally guessed right shares theirs with you.", cards: "4 cards · ranks 1–4", color: "var(--color-dharma-phase-dyut)", pos: { x: 23.4, y: 44.6 } },
  { id: "tantra", num: 3, name: "Tantra", tagline: "Enter the cosmic web", summary: "Six rituals of manipulation — swap Clans with Bhram, purge a hand with Mantra, expose with Chhal, resurrect an ability with Yagya, impede with Vighna, or burn with Bhasm.", cards: "6 cards · ranks 1–6", color: "var(--color-dharma-phase-tantra)", pos: { x: 75.6, y: 44.9 } },
  { id: "vadh", num: 4, name: "Vadh", tagline: "Silence the chaos", summary: "The blind strike. Kill one player without seeing their Clan card.", cards: "6 cards · ranks 1–6", color: "var(--color-dharma-phase-vadh)", pos: { x: 24.4, y: 63.8 } },
  { id: "yudh", num: 5, name: "Yudh", tagline: "Strike with precision", summary: "Look at one player's Clan card — then decide whether they live.", cards: "6 cards · ranks 1–6", color: "var(--color-dharma-phase-yudh)", pos: { x: 75.3, y: 63.8 } },
  { id: "nirnay", num: 6, name: "Nirnay", tagline: "Decide, shape destiny", summary: "Survivors reveal their Clan cards. The Clan with the highest-ranked survivor wins the round and every member moves up the Game Tracker.", cards: "The reveal · no cards played", color: "var(--color-dharma-phase-nirnay)", pos: { x: 50, y: 73.5 } },
];

export type RuleBlock = { type: "p"; text: string } | { type: "ol" | "ul"; items: string[] } | { type: "note"; text: string };
export type RuleSection = { id: string; title: string; blocks: RuleBlock[] };

export const rules: RuleSection[] = [
  {
    id: "overview", title: "Overview",
    blocks: [
      { type: "p", text: "The Order of Dharma is a battle between two CLANS to establish their DHARMA (spiritual path). You must outwit the other Clan members and eliminate them." },
      { type: "p", text: "The catch is, you don't know your ally or your enemies." },
    ],
  },
  {
    id: "setup", title: "Setup",
    blocks: [
      { type: "p", text: "Based on the number of players present, set aside an equal number of CLAN Cards, i.e., SURYA and CHANDRA Clan cards, and Phases cards." },
      { type: "p", text: "Choose the cards starting with 1 and 2 rank cards and additional cards (in order). For a game with ODD number of players, include the MAAYAVI card. For example, if there are 4 players playing, you use rank 1 and 2 of Surya and Chandra Clan cards and if you are playing with 7 players, you use rank 1, 2, and 3 of Surya and Chandra Clan cards and the Maayavi card." },
      { type: "p", text: "Shuffle the ABILITY Cards deck and place it in the centre alongside the GAME TRACKER board." },
      { type: "p", text: "Each player should sit facing each other with cards in the centre and you are ready to play." },
    ],
  },
  {
    id: "gameplay", title: "Game Play",
    blocks: [
      { type: "p", text: "Each round, players attempt to identify and eliminate rival CLAN members." },
      { type: "p", text: "At the end of each round, all members of the CLAN with the highest ranked survivor go ahead in the GAME TRACKER." },
      { type: "p", text: "The first player to reach the 5th stage in the GAME TRACKER wins the game! Each round includes the CLAN Card drafting, the ABILITY Cards distribution, the PHASES, and the CLAN Reveal." },
      { type: "p", text: "To play: each player present will receive the PHASES Card which will be placed FACE-UP in front of them. You may begin with the CLAN drafting only after that." },
    ],
  },
  {
    id: "drafting", title: "Clan Card Drafting",
    blocks: [
      { type: "p", text: "First, shuffle the CLAN Cards deck and deal ONE face down to EACH player. You may look at your own CLAN Card but may not reveal it to other players." },
    ],
  },
  {
    id: "distribution", title: "Ability Card Distribution",
    blocks: [
      { type: "p", text: "Once CLAN Cards are distributed..." },
      { type: "ol", items: [
        "Deal THREE random ABILITY Cards to EACH player from the shuffled deck.",
        "EACH player chooses ONE ABILITY Card out of three and passes the remaining TWO to the player on their right.",
        "Each player chooses TWO out of Three ABILITY Cards in their hands and then discards the last card in the centre of the table.",
        "Set aside any ABILITY Card that were not dealt this round and keep the discarded ABILITY Cards faced down separately, then move to the PHASES.",
      ] },
    ],
  },
  {
    id: "phases", title: "Phases",
    blocks: [
      { type: "p", text: "During the Phases, players play their Ability cards in different phases." },
      { type: "p", text: "The Ability phase is broken down into six phases: 1. Drishti 2. Dyut 3. Tantra 4. Vadh 5. Yudh 6. Nirnay. Table discussion is encouraged in every step of the Ability phase!" },
      { type: "p", text: "During each phase of the Ability phase, you may choose to play any Ability cards you have corresponding to that phase." },
      { type: "p", text: "To play an Ability card, place it face-up on the table. The number (or rank) on each card determines when it is resolved. Resolve all cards in that phase sequentially, following their respective rank order (e.g., 1-4 or 1-8, depending on the card set)." },
      { type: "p", text: "If no player reveals a card, move on to the next phase." },
      { type: "p", text: "A player may choose not to play an Ability card – they may want to bluff that it's something else – but if an Ability card is skipped, it can't be played later in the round." },
      { type: "p", text: "If at some point of the game, you are killed (eliminated) by any player, you must flip your Phases card to reveal that you are eliminated." },
    ],
  },
  {
    id: "reveal", title: "Clan Reveal",
    blocks: [
      { type: "p", text: "After the FIFTH phase (YUDH) of PHASES, if you're still alive, reveal your CLAN Card in the NIRNAY phase! The CLAN with the highest ranked surviving player wins the round. 1 is the highest rank, followed by 2, then 3, and so on. Ties are broken by the next highest surviving player of the CLAN. When a CLAN wins, every member of the winning CLAN goes ahead in the GAME TRACKER (even if they were eliminated)." },
      { type: "p", text: "If MAAYAVI is alive before the NIRNAY phase, they may choose to join hands with either CLAN, and if they join the CLAN who wins in the NIRNAY phase, they also go ahead in the GAME TRACKER." },
    ],
  },
  {
    id: "winning", title: "Winning the Game",
    blocks: [
      { type: "p", text: "While you play each round as a team, you're all competing to be the ultimate WINNER!" },
      { type: "p", text: "At the end of any round, if you have reached the 5th stage of the GAME TRACKER, you will claim the VICTORY!" },
      { type: "p", text: "If multiple players reach the 5th stage together, those players share the victory." },
      { type: "note", text: "A game of ORDER OF DHARMA can end quickly, so be ready to shuffle and play again!" },
    ],
  },
];

export type CardGroup = "Phases" | "Clan" | "Drishti" | "Dyut" | "Tantra" | "Vadh" | "Yudh" | "Special";
export type GameCardData = {
  slug: string; name: string; group: CardGroup; count: number; ranks?: string; epithet?: string;
  effect: string; notes?: string[]; image: Img; back: keyof typeof backs; color: string;
};

const P = (src: string, w: number, h: number): Img => ({ src, w, h });

export const cards: GameCardData[] = [
  { slug: "phases", name: "Phases", group: "Phases", count: 11, effect: "Shows all the game PHASES in order of when the abilities will be played in the round. If you are killed in any phase, you must flip this card to reveal that you have been eliminated for the round.", image: P("/cards/backs/phases-face.jpg", 1080, 1680), back: "eliminated", color: "var(--color-dharma-gold-500)" },
  { slug: "surya", name: "Surya Clan", group: "Clan", count: 5, ranks: "Ranks 1–5", epithet: "The sun", effect: "Your Clan for the round. Keep it secret; reveal only in Nirnay. 1 is the highest rank.", image: P("/cards/faces/clan-surya.png", 236, 368), back: "clan", color: "var(--color-dharma-clan-surya)" },
  { slug: "chandra", name: "Chandra Clan", group: "Clan", count: 5, ranks: "Ranks 1–5", epithet: "The moon", effect: "Your Clan for the round. Keep it secret; reveal only in Nirnay. 1 is the highest rank.", image: P("/cards/faces/clan-chandra.png", 236, 368), back: "clan", color: "var(--color-dharma-clan-chandra)" },
  { slug: "maayavi", name: "Maayavi", group: "Clan", count: 1, epithet: "The wildcard", effect: "Added for an odd number of players. If alive before the Nirnay phase, Maayavi may join hands with either Clan — and advances with them if that Clan wins.", notes: ["Dyut played by Maayavi has no effect.", "If Maayavi holds Dharma and stays unaligned, only Maayavi wins the round."], image: P("/cards/faces/clan-maayavi.jpg", 209, 325), back: "clan", color: "var(--color-dharma-clan-maayavi)" },
  { slug: "saadhak", name: "Saadhak", group: "Drishti", count: 4, ranks: "Ranks 1–4", epithet: "Devoted seeker of truth", effect: "Look at any ONE player's CLAN card.", image: P("/cards/faces/saadhak-b.png", 244, 381), back: "ability", color: "var(--color-dharma-phase-drishti)" },
  { slug: "tapasvi", name: "Tapasvi", group: "Drishti", count: 4, ranks: "Ranks 5–8", epithet: "Master of spiritual discipline", effect: "Look at any ONE player's CLAN card and ONE ABILITY card (you can choose without looking if they have 2 Ability cards).", image: P("/cards/faces/tapasvi-a.png", 244, 381), back: "ability", color: "var(--color-dharma-phase-drishti)" },
  { slug: "dyut", name: "Dyut", group: "Dyut", count: 4, ranks: "Ranks 1–4", epithet: "Royal game of risk", effect: "Guess any ONE player's Clan. Offense: guess an opponent right and their rank becomes ineffective in Nirnay (they still play). Defense: a lower rank guessing a higher-ranked teammate right shares that rank.", notes: ["A higher-ranked player playing Dyut on a lower-ranked player of the same clan: no effect.", "If Dyut is played on you, you don't need to reveal the result until Nirnay.", "You cannot use Dyut on a player you have already used a Drishti card on."], image: P("/cards/faces/dyut-b.png", 232, 363), back: "ability", color: "var(--color-dharma-phase-dyut)" },
  { slug: "bhram", name: "Bhram", group: "Tantra", count: 1, ranks: "Rank 1", epithet: "Illusion beyond reality", effect: "Look at two players' Clan cards, and you may swap them. They can't look at their Clan cards after the swap for the rest of the round.", notes: ["AAYNA does not work on Bhram."], image: P("/cards/faces/bhram.jpg", 209, 325), back: "ability", color: "var(--color-dharma-phase-tantra)" },
  { slug: "mantra", name: "Mantra", group: "Tantra", count: 1, ranks: "Rank 2", epithet: "Sacred words of power", effect: "Choose one player. That player discards all their Ability cards.", image: P("/cards/faces/mantra.jpg", 209, 325), back: "ability", color: "var(--color-dharma-phase-tantra)" },
  { slug: "chhal", name: "Chhal", group: "Tantra", count: 1, ranks: "Rank 3", epithet: "Deception hidden in shadows", effect: "Look at one player's Clan card and you may choose to reveal it.", image: P("/cards/faces/chhal.jpg", 209, 325), back: "ability", color: "var(--color-dharma-phase-tantra)" },
  { slug: "yagya", name: "Yagya", group: "Tantra", count: 1, ranks: "Rank 4", epithet: "Fire ritual of invocation", effect: "Randomly pick 3 cards from the discarded pile of Ability cards and keep one. Play it instantly if its phase has already passed, otherwise keep it for its dedicated phase.", image: P("/cards/faces/yagya.jpg", 209, 325), back: "ability", color: "var(--color-dharma-phase-tantra)" },
  { slug: "vighna", name: "Vighna", group: "Tantra", count: 1, ranks: "Rank 5", epithet: "Obstacle upon the path", effect: "Impede the progress tracker of one player by one progress, or silence any player for the rest of the round.", image: P("/cards/faces/vighna.jpg", 209, 325), back: "ability", color: "var(--color-dharma-phase-tantra)" },
  { slug: "bhasm", name: "Bhasm", group: "Tantra", count: 1, ranks: "Rank 6", epithet: "Reduced to sacred ash", effect: "Reveal your Clan card and kill any one player.", notes: ["AAYNA and KAVACH do not work on Bhasm."], image: P("/cards/faces/bhasm.jpg", 209, 325), back: "ability", color: "var(--color-dharma-phase-tantra)" },
  { slug: "vadh", name: "Vadh", group: "Vadh", count: 6, ranks: "Ranks 1–6", epithet: "Silent strike of desolation", effect: "Play this card and kill one player without seeing their Clan card.", image: P("/cards/faces/vadh-1.png", 233, 362), back: "ability", color: "var(--color-dharma-phase-vadh)" },
  { slug: "yudh", name: "Yudh", group: "Yudh", count: 6, ranks: "Ranks 1–6", epithet: "Battle of power and survival", effect: "Play this card and look at one player's Clan card — you may choose to kill them.", image: P("/cards/faces/yudh-1.png", 230, 359), back: "ability", color: "var(--color-dharma-phase-yudh)" },
  { slug: "aayna", name: "Aayna", group: "Special", count: 1, epithet: "Mirror of shared consequence", effect: "The effects are duplicated on the person who used their Ability card on you. Can be played in any phase — one-time use.", notes: ["Does not work on Bhasm and Bhram."], image: P("/cards/faces/aayna.jpg", 209, 325), back: "ability", color: "var(--color-dharma-gold-400)" },
  { slug: "kavach", name: "Kavach", group: "Special", count: 1, epithet: "Armor of divine protection", effect: "Protects the user from any ability used upon them. Can be played in any phase — one-time use.", notes: ["Does not work on Bhasm."], image: P("/cards/faces/kavach.png", 232, 363), back: "ability", color: "var(--color-dharma-gold-400)" },
  { slug: "dharma", name: "Dharma", group: "Special", count: 1, epithet: "The path of righteousness", effect: "If the player who holds this card survives until the Nirnay phase, they win the round for their team irrespective of highest ranking.", notes: ["If Maayavi holds it and stays unaligned before Nirnay, only Maayavi wins the round."], image: P("/cards/faces/dharma.png", 232, 362), back: "ability", color: "var(--color-dharma-gold-400)" },
];

export const cardGroups: { id: CardGroup | "All"; label: string; count: number }[] = [
  { id: "All", label: "All", count: 55 },
  { id: "Phases", label: "Phases", count: 11 },
  { id: "Clan", label: "Clan", count: 11 },
  { id: "Drishti", label: "Drishti", count: 8 },
  { id: "Dyut", label: "Dyut", count: 4 },
  { id: "Tantra", label: "Tantra", count: 6 },
  { id: "Vadh", label: "Vadh", count: 6 },
  { id: "Yudh", label: "Yudh", count: 6 },
  { id: "Special", label: "Special", count: 3 },
];

export const rulebookPdf = "/downloads/order-of-dharma-rulebook.pdf";
