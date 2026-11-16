/** Flat illustrations for the six activity cards, in the colours of the promo video. All decorative. */

const C = { orange: "#f9a825", pink: "#e91e63", cream: "#f6e9d4", blue: "#29a8e0", purple: "#8e4fc9", ink: "#1a1020", red: "#d6283e" };

type P = { className?: string };
const svg = (children: React.ReactNode, className?: string) => (
  <svg viewBox="0 0 160 140" className={className} aria-hidden="true" focusable="false">{children}</svg>
);

/** Little Santa hat sized for a head at (cx, cy). */
const Hat = ({ cx, cy, s = 1 }: { cx: number; cy: number; s?: number }) => (
  <g transform={`translate(${cx} ${cy}) scale(${s})`}>
    <path d="M-11 0 C-9 -11 2 -15 11 -9 C14 -7 14 -4 12 -2 L12 0 Z" fill={C.red} />
    <rect x="-13" y="-1" width="26" height="6" rx="3" fill="#fff6e6" />
    <circle cx="13" cy="-7" r="3.4" fill="#fff6e6" />
  </g>
);

export function DeductionIcon({ className }: P) {
  return svg(
    <>
      <g transform="rotate(-12 45 80)"><rect x="18" y="42" width="54" height="72" rx="9" fill={C.cream} /><text x="45" y="92" textAnchor="middle" fontSize="40" fontWeight="800" fill={C.pink}>?</text></g>
      <g transform="rotate(12 115 80)"><rect x="88" y="42" width="54" height="72" rx="9" fill={C.cream} /><text x="115" y="92" textAnchor="middle" fontSize="40" fontWeight="800" fill={C.blue}>?</text></g>
      <rect x="52" y="30" width="56" height="84" rx="10" fill="#241a2e" stroke={C.orange} strokeWidth="4" />
      <path d="M62 66c6-8 14-4 18-4s12-4 18 4c-2 10-10 12-14 8-2-2-6-2-8 0-4 4-12 2-14-8z" fill={C.orange} />
      <ellipse cx="68" cy="68" rx="4" ry="3" fill="#241a2e" /><ellipse cx="92" cy="68" rx="4" ry="3" fill="#241a2e" />
      <Hat cx={62} cy={34} s={1.1} />
      <rect x="92" y="6" width="58" height="26" rx="13" fill={C.pink} />
      <path d="M100 32l-4 9 12-9z" fill={C.pink} />
      <text x="121" y="24" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff">LIAR!</text>
    </>, className);
}

export function TabletopIcon({ className }: P) {
  return svg(
    <>
      <g transform="rotate(-14 40 50)"><rect x="14" y="14" width="50" height="68" rx="9" fill={C.orange} /><path d="M39 32c2 10 6 14 14 16-8 2-12 6-14 16-2-10-6-14-14-16 8-2 12-6 14-16z" fill="#fff6e6" /></g>
      <g transform="translate(96 8)"><circle cx="24" cy="12" r="12" fill={C.blue} /><path d="M2 54c0-20 10-26 22-26s22 6 22 26z" fill={C.blue} /><path d="M10 40l-8 10M38 40l8 10" stroke={C.blue} strokeWidth="9" strokeLinecap="round" /></g>
      <rect x="18" y="82" width="52" height="52" rx="10" fill={C.cream} />
      {[[32, 96], [56, 96], [44, 108], [32, 120], [56, 120]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="5" fill={C.ink} />)}
      <g transform="rotate(14 112 100)"><rect x="86" y="74" width="52" height="52" rx="10" fill={C.pink} />{[[100, 88], [112, 100], [124, 112]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="5" fill="#fff" />)}</g>
      <path d="M78 66l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill={C.orange} />
    </>, className);
}

export function FoodIcon({ className }: P) {
  return svg(
    <>
      <g><rect x="22" y="48" width="66" height="70" rx="14" fill={C.pink} /><path d="M88 62h12a14 14 0 0 1 0 30H88" fill="none" stroke={C.pink} strokeWidth="9" /><path d="M42 82l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="#fff6e6" /></g>
      <g><path d="M34 52c-2-16 4-24 12-24" fill="none" stroke="#fff6e6" strokeWidth="9" strokeLinecap="round" /><path d="M34 52c-2-16 4-24 12-24" fill="none" stroke={C.red} strokeWidth="9" strokeLinecap="round" strokeDasharray="6 7" /></g>
      <circle cx="58" cy="50" r="6" fill="#fff6e6" opacity=".9" /><circle cx="72" cy="46" r="5" fill="#fff6e6" opacity=".9" />
      <g transform="rotate(8 118 70)"><path d="M92 20h56c4 0 4 6 0 8L126 120c-2 4-6 4-8 0L96 28c-4-2-4-8-4-8z" fill={C.orange} /><path d="M98 34h44l-6 14h-32z" fill="#f2c15a" /><circle cx="118" cy="62" r="9" fill={C.red} /><circle cx="128" cy="86" r="7" fill={C.red} /><circle cx="108" cy="82" r="3" fill={C.blue} /></g>
    </>, className);
}

export function ChallengesIcon({ className }: P) {
  return svg(
    <>
      <path d="M28 6l-20 40h16l-8 34 28-48H29l12-26z" fill={C.orange} transform="translate(0 4)" />
      <rect x="64" y="4" width="22" height="14" rx="4" fill={C.orange} />
      <circle cx="75" cy="80" r="50" fill={C.orange} />
      <circle cx="75" cy="80" r="40" fill="#fff6e6" />
      <path d="M75 80V40a40 40 0 0 1 34 20z" fill="#f8bbd0" transform="rotate(10 75 80)" />
      {[0, 90, 180, 270].map((a) => <rect key={a} x="73" y="44" width="4" height="9" rx="2" fill={C.ink} transform={`rotate(${a} 75 80)`} />)}
      <path d="M75 80l-12 28" stroke={C.pink} strokeWidth="5" strokeLinecap="round" />
      <circle cx="75" cy="80" r="6" fill={C.ink} />
      <g transform="translate(112 74)"><path d="M-12 24l-6 22 18-8 18 8-6-22z" fill={C.pink} /><circle cx="0" cy="8" r="22" fill={C.orange} stroke="#c97a00" strokeWidth="3" /><text x="0" y="16" textAnchor="middle" fontSize="24" fontWeight="800" fill={C.ink}>1</text></g>
    </>, className);
}

export function GroupIcon({ className }: P) {
  const people = [
    { x: 30, c: C.purple, y: 58, s: 0.9 }, { x: 130, c: C.blue, y: 58, s: 0.9 },
    { x: 56, c: C.orange, y: 50, s: 1 }, { x: 104, c: C.pink, y: 50, s: 1 }, { x: 80, c: C.cream, y: 42, s: 1.15 },
  ];
  return svg(
    <>
      <path d="M6 30c30 16 50 16 74 4s52-16 74 0" fill="none" stroke="#f6e9d4" strokeOpacity=".6" strokeWidth="1.5" />
      {[[26, 36, C.orange], [60, 42, C.pink], [100, 40, C.blue], [136, 34, C.orange]].map(([x, y, c], i) => <circle key={i} cx={x as number} cy={y as number} r="5" fill={c as string} />)}
      {people.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
          <path d="M-22 78c0-30 8-36 22-36s22 6 22 36z" fill={p.c} />
          <circle cx="0" cy="26" r="15" fill={p.c} />
          <Hat cx={0} cy={14} s={1.5} />
        </g>
      ))}
    </>, className);
}

export function JamIcon({ className }: P) {
  return svg(
    <>
      <g transform="rotate(32 80 76)">
        <rect x="74" y="-6" width="12" height="62" rx="3" fill="#7a4a1a" />
        <rect x="70" y="-14" width="20" height="16" rx="4" fill="#7a4a1a" />
        <path d="M80 50c-26 0-30 18-22 28-10 8-10 34 22 36s32-28 22-36c8-10 4-28-22-28z" fill="#e8b25a" stroke="#a9731f" strokeWidth="4" />
        <circle cx="80" cy="82" r="11" fill={C.ink} />
        <rect x="66" y="102" width="28" height="6" rx="2" fill="#7a4a1a" />
        <path d="M78 0v100M82 0v100" stroke="#fff6e6" strokeWidth="1.2" />
      </g>
      <g fill={C.orange}><circle cx="24" cy="40" r="7" /><path d="M30 40V16l14 5" fill="none" stroke={C.orange} strokeWidth="4" /></g>
      <g fill="#fff6e6"><circle cx="38" cy="14" r="5" /><path d="M42 14V0" stroke="#fff6e6" strokeWidth="3" /></g>
      <g fill={C.pink}><circle cx="14" cy="80" r="5" /><path d="M18 80V62" stroke={C.pink} strokeWidth="3" /></g>
      <g fill={C.blue}><circle cx="132" cy="96" r="6" /><path d="M138 96V74" stroke={C.blue} strokeWidth="3.5" /></g>
    </>, className);
}

export const activityIcons = {
  deduction: DeductionIcon, tabletop: TabletopIcon, food: FoodIcon,
  challenges: ChallengesIcon, group: GroupIcon, jam: JamIcon,
} as const;
