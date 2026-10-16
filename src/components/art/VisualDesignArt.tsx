import React from 'react';

// illustration, not client work
export const VisualDesignArt: React.FC = () => {
  return (
    <svg
      viewBox="0 0 360 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* 16:9 LED-wall panel, rounded 12px */}
      <rect
        x="20"
        y="12"
        width="320"
        height="180"
        rx="12"
        fill="var(--art-paper)"
        stroke="var(--art-line)"
        strokeWidth="1.5"
      />

      {/* Internal screen bezel guide */}
      <rect
        x="28"
        y="20"
        width="304"
        height="164"
        rx="8"
        fill="var(--art-ink)"
        fillOpacity="0.04"
      />

      {/* Flat equalizer vertical rounded bars */}
      {/* 13 bars across width: center tallest bar in --art-accent */}
      <g transform="translate(38, 36)">
        {/* bar 1 */}
        <rect x="0" y="90" width="12" height="42" rx="4" fill="var(--art-ink)" />
        {/* bar 2 */}
        <rect x="22" y="70" width="12" height="62" rx="4" fill="var(--art-ink)" />
        {/* bar 3 */}
        <rect x="44" y="52" width="12" height="80" rx="4" fill="var(--art-ink)" />
        {/* bar 4 */}
        <rect x="66" y="80" width="12" height="52" rx="4" fill="var(--art-ink)" />
        {/* bar 5 */}
        <rect x="88" y="38" width="12" height="94" rx="4" fill="var(--art-ink)" />
        {/* bar 6 */}
        <rect x="110" y="24" width="12" height="108" rx="4" fill="var(--art-ink)" />
        {/* bar 7 (tallest bar in --art-accent) */}
        <rect x="132" y="8" width="12" height="124" rx="4" fill="var(--art-accent)" />
        {/* bar 8 */}
        <rect x="154" y="28" width="12" height="104" rx="4" fill="var(--art-ink)" />
        {/* bar 9 */}
        <rect x="176" y="48" width="12" height="84" rx="4" fill="var(--art-ink)" />
        {/* bar 10 */}
        <rect x="198" y="32" width="12" height="100" rx="4" fill="var(--art-ink)" />
        {/* bar 11 */}
        <rect x="220" y="64" width="12" height="68" rx="4" fill="var(--art-ink)" />
        {/* bar 12 */}
        <rect x="242" y="46" width="12" height="86" rx="4" fill="var(--art-ink)" />
        {/* bar 13 */}
        <rect x="264" y="86" width="12" height="46" rx="4" fill="var(--art-ink)" />
      </g>

      {/* Thin stage truss line under panel */}
      <line x1="16" y1="204" x2="344" y2="204" stroke="var(--art-line)" strokeWidth="2" />
      <line x1="16" y1="214" x2="344" y2="214" stroke="var(--art-line)" strokeWidth="1.5" />
      {/* Truss cross-bracing segments */}
      <path
        d="M20 204 L30 214 M40 204 L30 214 M40 204 L50 214 M60 204 L50 214 M60 204 L70 214 M80 204 L70 214 M80 204 L90 214 M100 204 L90 214 M100 204 L110 214 M120 204 L110 214 M120 204 L130 214 M140 204 L130 214 M140 204 L150 214 M160 204 L150 214 M160 204 L170 214 M180 204 L170 214 M180 204 L190 214 M200 204 L190 214 M200 204 L210 214 M220 204 L210 214 M220 204 L230 214 M240 204 L230 214 M240 204 L250 214 M260 204 L250 214 M260 204 L270 214 M280 204 L270 214 M280 204 L290 214 M300 204 L290 214 M300 204 L310 214 M320 204 L310 214 M320 204 L330 214 M340 204 L330 214"
        stroke="var(--art-line)"
        strokeWidth="1"
      />

      {/* Row of small square floor panels cropped by bottom edge */}
      <g transform="translate(24, 224)">
        <rect x="0" y="0" width="24" height="22" rx="3" fill="var(--art-paper)" stroke="var(--art-line)" strokeWidth="1" />
        <rect x="32" y="0" width="24" height="22" rx="3" fill="var(--art-paper)" stroke="var(--art-line)" strokeWidth="1" />
        <rect x="64" y="0" width="24" height="22" rx="3" fill="var(--art-paper)" stroke="var(--art-line)" strokeWidth="1" />
        <rect x="96" y="0" width="24" height="22" rx="3" fill="var(--art-paper)" stroke="var(--art-line)" strokeWidth="1" />
        <rect x="128" y="0" width="24" height="22" rx="3" fill="var(--art-paper)" stroke="var(--art-line)" strokeWidth="1" />
        <rect x="160" y="0" width="24" height="22" rx="3" fill="var(--art-paper)" stroke="var(--art-line)" strokeWidth="1" />
        <rect x="192" y="0" width="24" height="22" rx="3" fill="var(--art-paper)" stroke="var(--art-line)" strokeWidth="1" />
        <rect x="224" y="0" width="24" height="22" rx="3" fill="var(--art-paper)" stroke="var(--art-line)" strokeWidth="1" />
        <rect x="256" y="0" width="24" height="22" rx="3" fill="var(--art-paper)" stroke="var(--art-line)" strokeWidth="1" />
        <rect x="288" y="0" width="24" height="22" rx="3" fill="var(--art-paper)" stroke="var(--art-line)" strokeWidth="1" />
      </g>
    </svg>
  );
};
