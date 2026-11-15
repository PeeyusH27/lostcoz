/** Inline SVG illustrations for the Christmas Chaos promo + page. Decorative only (aria-hidden). */

const star = (cx: number, cy: number, R: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 ? r : R;
    return `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

const baubles = [
  { x: 150, y: 128, r: 9, c: "#e51a6f" }, { x: 178, y: 104, r: 7, c: "#f6c96b" },
  { x: 118, y: 196, r: 10, c: "#f6c96b" }, { x: 196, y: 188, r: 9, c: "#01a2e1" },
  { x: 160, y: 232, r: 8, c: "#e51a6f" }, { x: 92, y: 288, r: 11, c: "#e51a6f" },
  { x: 150, y: 290, r: 9, c: "#01a2e1" }, { x: 214, y: 282, r: 11, c: "#f6c96b" },
  { x: 250, y: 306, r: 8, c: "#e51a6f" }, { x: 66, y: 308, r: 8, c: "#f6c96b" },
];
const lights = [
  [138, 92], [172, 150], [110, 150], [210, 232], [90, 230], [132, 262], [180, 262],
  [60, 270], [262, 270], [118, 318], [200, 316], [160, 190], [126, 240], [232, 252],
];

export function ChristmasTree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 420" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="xt-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f9a63" /><stop offset="1" stopColor="#0f5a3a" />
        </linearGradient>
        <radialGradient id="xt-glow" cx="0.5" cy="0.45" r="0.55">
          <stop offset="0" stopColor="#f6c96b" stopOpacity="0.45" /><stop offset="1" stopColor="#f6c96b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="215" rx="160" ry="200" fill="url(#xt-glow)" />
      <rect x="138" y="330" width="44" height="42" rx="6" fill="#6b3a1f" />
      {["160,48 98,148 222,148", "160,100 74,232 246,232", "160,168 48,334 272,334"].map((pts) => (
        <polygon key={pts} points={pts} fill="url(#xt-g)" stroke="#2f9a63" strokeWidth="16" strokeLinejoin="round" />
      ))}
      <g fill="none" stroke="#f6c96b" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="1 8">
        <path d="M118 120 Q160 150 204 120" />
        <path d="M92 204 Q160 246 228 204" />
        <path d="M66 290 Q160 344 254 290" />
      </g>
      {lights.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.6" fill="#fff6e6" className="xmas-twinkle" style={{ animationDelay: `${(i * 0.37) % 2.4}s` }} />
      ))}
      {baubles.map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r={b.r} fill={b.c} />
          <circle cx={b.x - b.r * 0.3} cy={b.y - b.r * 0.35} r={b.r * 0.28} fill="#fff" opacity="0.7" />
        </g>
      ))}
      <g className="xmas-star-glow">
        <polygon points={star(160, 40, 26, 11)} fill="#ffd978" stroke="#fff6e6" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <g>
        <rect x="52" y="352" width="58" height="48" rx="5" fill="#e51a6f" />
        <rect x="76" y="352" width="10" height="48" fill="#f6c96b" />
        <rect x="52" y="371" width="58" height="9" fill="#f6c96b" />
        <path d="M81 352 q-16 -16 -20 -4 q4 10 20 4 q16 6 20 -4 q-4 -12 -20 4z" fill="#f6c96b" />
        <rect x="204" y="364" width="64" height="36" rx="5" fill="#01a2e1" />
        <rect x="231" y="364" width="10" height="36" fill="#fff6e6" />
        <rect x="204" y="378" width="64" height="8" fill="#fff6e6" />
        <rect x="116" y="378" width="76" height="22" rx="5" fill="#f6c96b" />
        <rect x="148" y="378" width="10" height="22" fill="#8e2536" />
      </g>
    </svg>
  );
}

export function SantaHat({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 130 110" className={className} style={style} aria-hidden="true" focusable="false">
      <path d="M16 80 C24 30 64 6 98 24 C116 33 114 48 108 56 L108 80 Z" fill="#d6283e" />
      <path d="M16 80 C24 30 64 6 98 24 C70 24 44 44 40 80 Z" fill="#ef4a5d" opacity="0.55" />
      <circle cx="110" cy="52" r="14" fill="#fff6e6" />
      <rect x="6" y="72" width="112" height="28" rx="14" fill="#fff6e6" />
      <rect x="6" y="90" width="112" height="10" rx="5" fill="#ecd9b8" opacity="0.6" />
    </svg>
  );
}

export function CandyCane({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 140" className={className} aria-hidden="true" focusable="false">
      <path d="M18 136 V50 a22 22 0 0 1 44 0" fill="none" stroke="#fff6e6" strokeWidth="14" strokeLinecap="round" />
      <path d="M18 136 V50 a22 22 0 0 1 44 0" fill="none" stroke="#d6283e" strokeWidth="14" strokeLinecap="round" strokeDasharray="10 12" />
    </svg>
  );
}

/** Bunting strung across the top edge. */
export function Garland({ className }: { className?: string }) {
  const colors = ["#d6283e", "#f6c96b", "#2f9a63", "#fff6e6"];
  const swags = 6, w = 200;
  const ts = [0.14, 0.32, 0.5, 0.68, 0.86];
  const flags = Array.from({ length: swags }, (_, s) =>
    ts.map((t, j) => {
      const y = (1 - t) ** 2 * 6 + 2 * (1 - t) * t * 74 + t * t * 6;
      const slope = 2 * (1 - t) * 68 + 2 * t * -68;
      return { x: s * w + w * t, y, c: colors[(s * ts.length + j) % colors.length], rot: -Math.atan(slope / (2 * w)) * (180 / Math.PI) };
    }),
  ).flat();
  const d = "M0 6 " + Array.from({ length: swags }, (_, s) => `Q${s * w + 100} 74 ${(s + 1) * w} 6`).join(" ");
  return (
    <svg viewBox={`0 0 ${swags * w} 100`} preserveAspectRatio="xMidYMin slice" className={className} aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke="#f6e9d4" strokeOpacity="0.7" strokeWidth="2" />
      {flags.map((f, i) => (
        <polygon key={i} points="-11,0 11,0 0,28" transform={`translate(${f.x} ${f.y}) rotate(${f.rot})`} fill={f.c} />
      ))}
    </svg>
  );
}

const confettiColors = ["#f6c96b", "#e51a6f", "#01a2e1", "#fff6e6", "#2f9a63"];
const pieces = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 53) % 100, w: 6 + ((i * 3) % 6), h: 10 + ((i * 7) % 8), round: i % 3 === 0,
  c: confettiColors[i % confettiColors.length], dur: 11 + ((i * 5) % 9), delay: -((i * 9) % 16),
  drift: (i % 2 ? 1 : -1) * (20 + ((i * 13) % 40)), rot: 180 + ((i * 47) % 360),
}));

export function Confetti() {
  return (
    <div aria-hidden="true" className="xmas-snow pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="xmas-confetti"
          style={{
            left: `${p.left}%`, width: p.w, height: p.round ? p.w : p.h, background: p.c,
            borderRadius: p.round ? "50%" : 2, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`,
            ["--drift" as string]: `${p.drift}px`, ["--rot" as string]: `${p.rot}deg`,
          }}
        />
      ))}
    </div>
  );
}
