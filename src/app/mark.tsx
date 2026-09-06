/**
 * The fan — the splash's deck mid-deal, front card carrying the D and a
 * joker-green diamond. Same geometry as src/app/icon.svg, kept as JSX so the
 * OG image and the Apple icon can render it through next/og's ImageResponse.
 */
export function FanMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-18 30 36)">
        <rect
          x="15" y="8" width="31" height="46" rx="6"
          fill="#150d22" stroke="#7c00ff" strokeWidth="2.5" opacity="0.85"
        />
      </g>
      <g transform="rotate(7 34 32)">
        <rect
          x="19" y="9" width="31" height="46" rx="6"
          fill="#0d0a14" stroke="#a35cff" strokeWidth="3"
        />
        <path
          d="M22.5 15 h3.5 a5.5 5.5 0 0 1 0 11 h-3.5 Z"
          stroke="#f2eefa" strokeWidth="2.6" fill="none" strokeLinejoin="round"
        />
        <rect
          x="30" y="31" width="9" height="9"
          transform="rotate(45 34.5 35.5)" fill="#09ff00"
        />
      </g>
    </svg>
  );
}
